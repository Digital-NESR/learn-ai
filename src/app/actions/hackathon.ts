'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import aiversePool from '@/lib/db-aiverse';
import employeeDirectoryPool from '@/lib/db-employee-directory';

export interface DirectoryPerson {
  email: string;
  displayName: string;
  department: string | null;
  jobTitle: string | null;
}

export interface TeamMember extends DirectoryPerson {
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  createdByEmail: string;
  members: TeamMember[];
}

export async function requireSessionEmail() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name;
  if (!email || !name) throw new Error('Not signed in');
  await aiversePool.query(
    `insert into users (email, name) values ($1, $2)
     on conflict (email) do update set name = excluded.name, last_seen_at = now()`,
    [email, name],
  );
  return { email, name };
}

/** Read-only directory search by name or email — never writes to this database. */
export async function searchEmployees(query: string): Promise<DirectoryPerson[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const { rows } = await employeeDirectoryPool.query(
    `select mail, display_name, department, job_title
     from azure_ad_users_staging
     where mail ilike $1 or display_name ilike $1
     order by display_name
     limit 8`,
    [`%${q}%`],
  );
  return rows.map(r => ({
    email: (r.mail as string).toLowerCase(),
    displayName: r.display_name,
    department: r.department,
    jobTitle: r.job_title,
  }));
}

async function loadTeamById(teamId: string): Promise<Team | null> {
  const { rows: teamRows } = await aiversePool.query(
    `select id, name, created_by_email from hackathon_teams where id = $1`,
    [teamId],
  );
  if (!teamRows.length) return null;
  const { rows: memberRows } = await aiversePool.query(
    `select email, display_name, department, job_title, joined_at
     from hackathon_team_members where team_id = $1 order by joined_at`,
    [teamId],
  );
  return {
    id: teamRows[0].id,
    name: teamRows[0].name,
    createdByEmail: teamRows[0].created_by_email,
    members: memberRows.map(r => ({
      email: r.email,
      displayName: r.display_name,
      department: r.department,
      jobTitle: r.job_title,
      joinedAt: r.joined_at.toISOString(),
    })),
  };
}

export async function getMyTeam(): Promise<Team | null> {
  const { email } = await requireSessionEmail();
  const { rows } = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (!rows.length) return null;
  return loadTeamById(rows[0].team_id);
}

export interface PublicHackathonSettings {
  status: 'draft' | 'open' | 'closed';
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  eventStartAt: string | null;
  submissionDeadlineAt: string | null;
  presentationAt: string | null;
  venue: string | null;
  meetingLink: string | null;
  minTeamSize: number;
  maxTeamSize: number;
  contactEmail: string | null;
  eligibility: string | null;
  announcement: string | null;
}

/** Read-only settings for the public hackathon page — no admin gate. */
export async function getPublicHackathonSettings(): Promise<PublicHackathonSettings> {
  const { rows } = await aiversePool.query(`select * from hackathon_settings where id = 1`);
  const r = rows[0];
  return {
    status: r.status,
    registrationOpensAt: r.registration_opens_at?.toISOString() ?? null,
    registrationClosesAt: r.registration_closes_at?.toISOString() ?? null,
    eventStartAt: r.event_start_at?.toISOString() ?? null,
    submissionDeadlineAt: r.submission_deadline_at?.toISOString() ?? null,
    presentationAt: r.presentation_at?.toISOString() ?? null,
    venue: r.venue,
    meetingLink: r.meeting_link,
    minTeamSize: r.min_team_size,
    maxTeamSize: r.max_team_size,
    contactEmail: r.contact_email,
    eligibility: r.eligibility,
    announcement: r.announcement,
  };
}

async function requireOpenRegistration(): Promise<void> {
  const { rows } = await aiversePool.query(
    `select status, registration_opens_at, registration_closes_at from hackathon_settings where id = 1`,
  );
  const s = rows[0];
  if (!s || s.status !== 'open') throw new Error('Registration is not open yet');
  const now = new Date();
  if (s.registration_opens_at && now < new Date(s.registration_opens_at)) {
    throw new Error('Registration has not opened yet');
  }
  if (s.registration_closes_at && now > new Date(s.registration_closes_at)) {
    throw new Error('Registration has closed');
  }
}

export async function createTeam(teamName: string): Promise<Team> {
  const { email, name } = await requireSessionEmail();
  const trimmed = teamName.trim();
  if (!trimmed) throw new Error('Team name is required');
  await requireOpenRegistration();

  const existing = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (existing.rows.length) throw new Error('You are already on a team');

  const { rows: dirRows } = await employeeDirectoryPool.query(
    `select department, job_title from azure_ad_users_staging where mail ilike $1 limit 1`,
    [email],
  );
  const department = dirRows[0]?.department ?? null;
  const jobTitle = dirRows[0]?.job_title ?? null;

  const client = await aiversePool.connect();
  try {
    await client.query('begin');
    const teamRes = await client.query(
      `insert into hackathon_teams (name, created_by_email) values ($1, $2) returning id`,
      [trimmed, email],
    );
    const teamId = teamRes.rows[0].id;
    await client.query(
      `insert into hackathon_team_members (team_id, email, display_name, department, job_title)
       values ($1, $2, $3, $4, $5)`,
      [teamId, email, name, department, jobTitle],
    );
    await client.query('commit');
    return (await loadTeamById(teamId)) as Team;
  } catch (err) {
    await client.query('rollback');
    if (err instanceof Error && /unique/i.test(err.message)) {
      throw new Error('That team name is already taken');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function addTeamMember(teamId: string, memberEmail: string): Promise<Team> {
  const { email } = await requireSessionEmail();
  const team = await loadTeamById(teamId);
  if (!team) throw new Error('Team not found');
  if (!team.members.some(m => m.email === email)) throw new Error('Only members of this team can add teammates');

  const { rows: settingsRows } = await aiversePool.query(
    `select max_team_size from hackathon_settings where id = 1`,
  );
  const maxTeamSize = settingsRows[0]?.max_team_size ?? Infinity;
  if (team.members.length >= maxTeamSize) {
    throw new Error(`Teams are capped at ${maxTeamSize} members`);
  }

  const target = memberEmail.trim().toLowerCase();
  const { rows: dirRows } = await employeeDirectoryPool.query(
    `select mail, display_name, department, job_title from azure_ad_users_staging where mail ilike $1 limit 1`,
    [target],
  );
  if (!dirRows.length) throw new Error('No employee found with that email');

  try {
    await aiversePool.query(
      `insert into hackathon_team_members (team_id, email, display_name, department, job_title)
       values ($1, $2, $3, $4, $5)`,
      [teamId, target, dirRows[0].display_name, dirRows[0].department, dirRows[0].job_title],
    );
  } catch (err) {
    if (err instanceof Error && /unique/i.test(err.message)) {
      throw new Error('That person is already on a team');
    }
    throw err;
  }

  return (await loadTeamById(teamId)) as Team;
}

export interface JoinableTeam {
  id: string;
  name: string;
  createdByEmail: string;
  members: TeamMember[];
  maxTeamSize: number;
}

/** All active teams with their members, for participants browsing teams to join. */
export async function listTeamsToJoin(): Promise<JoinableTeam[]> {
  await requireSessionEmail();

  const { rows: settingsRows } = await aiversePool.query(`select max_team_size from hackathon_settings where id = 1`);
  const maxTeamSize = settingsRows[0]?.max_team_size ?? Number.MAX_SAFE_INTEGER;

  const { rows: teamRows } = await aiversePool.query(
    `select id, name, created_by_email from hackathon_teams where status = 'active' order by created_at desc`,
  );
  const { rows: memberRows } = await aiversePool.query(
    `select team_id, email, display_name, department, job_title, joined_at from hackathon_team_members order by joined_at`,
  );

  const membersByTeam = new Map<string, TeamMember[]>();
  for (const m of memberRows) {
    const list = membersByTeam.get(m.team_id) ?? [];
    list.push({
      email: m.email,
      displayName: m.display_name,
      department: m.department,
      jobTitle: m.job_title,
      joinedAt: m.joined_at.toISOString(),
    });
    membersByTeam.set(m.team_id, list);
  }

  return teamRows.map(t => ({
    id: t.id,
    name: t.name,
    createdByEmail: t.created_by_email,
    members: membersByTeam.get(t.id) ?? [],
    maxTeamSize,
  }));
}

export interface MyJoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  requestedAt: string;
}

export interface IncomingJoinRequest {
  id: string;
  email: string;
  displayName: string;
  department: string | null;
  jobTitle: string | null;
  requestedAt: string;
}

/** Sends a request to join a team — the team's creator must approve it before it takes effect. */
export async function requestToJoinTeam(teamId: string): Promise<MyJoinRequest> {
  const { email, name } = await requireSessionEmail();
  await requireOpenRegistration();

  const existingTeam = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (existingTeam.rows.length) throw new Error('You are already on a team');

  const existingRequest = await aiversePool.query(
    `select id from hackathon_join_requests where requester_email = $1 and status = 'pending'`,
    [email],
  );
  if (existingRequest.rows.length) throw new Error('You already have a pending request to join a team');

  const { rows: teamRows } = await aiversePool.query(`select name, status from hackathon_teams where id = $1`, [teamId]);
  if (!teamRows.length) throw new Error('Team not found');
  if (teamRows[0].status !== 'active') throw new Error('This team is no longer accepting members');

  const { rows: countRows } = await aiversePool.query(
    `select count(*)::int as count from hackathon_team_members where team_id = $1`,
    [teamId],
  );
  const { rows: settingsRows } = await aiversePool.query(`select max_team_size from hackathon_settings where id = 1`);
  const maxTeamSize = settingsRows[0]?.max_team_size ?? Number.MAX_SAFE_INTEGER;
  if (countRows[0].count >= maxTeamSize) throw new Error('This team is already full');

  const { rows: dirRows } = await employeeDirectoryPool.query(
    `select department, job_title from azure_ad_users_staging where mail ilike $1 limit 1`,
    [email],
  );
  const department = dirRows[0]?.department ?? null;
  const jobTitle = dirRows[0]?.job_title ?? null;

  try {
    const { rows } = await aiversePool.query(
      `insert into hackathon_join_requests (team_id, requester_email, requester_display_name, requester_department, requester_job_title)
       values ($1, $2, $3, $4, $5)
       returning id, requested_at`,
      [teamId, email, name, department, jobTitle],
    );
    return {
      id: rows[0].id,
      teamId,
      teamName: teamRows[0].name,
      requestedAt: rows[0].requested_at.toISOString(),
    };
  } catch (err) {
    if (err instanceof Error && /unique/i.test(err.message)) throw new Error('You already have a pending request to join a team');
    throw err;
  }
}

/** The signed-in user's own outstanding (pending) join request, if any. */
export async function getMyJoinRequest(): Promise<MyJoinRequest | null> {
  const { email } = await requireSessionEmail();
  const { rows } = await aiversePool.query(
    `select r.id, r.team_id, t.name as team_name, r.requested_at
     from hackathon_join_requests r
     join hackathon_teams t on t.id = r.team_id
     where r.requester_email = $1 and r.status = 'pending'`,
    [email],
  );
  if (!rows.length) return null;
  return {
    id: rows[0].id,
    teamId: rows[0].team_id,
    teamName: rows[0].team_name,
    requestedAt: rows[0].requested_at.toISOString(),
  };
}

/** Withdraws the signed-in user's own pending request. */
export async function cancelJoinRequest(requestId: string): Promise<void> {
  const { email } = await requireSessionEmail();
  await aiversePool.query(
    `delete from hackathon_join_requests where id = $1 and requester_email = $2 and status = 'pending'`,
    [requestId, email],
  );
}

/** Pending requests to join the signed-in user's own team — only meaningful if they're the creator. */
export async function listJoinRequestsForMyTeam(): Promise<IncomingJoinRequest[]> {
  const { email } = await requireSessionEmail();
  const { rows: teamRows } = await aiversePool.query(`select id from hackathon_teams where created_by_email = $1`, [email]);
  if (!teamRows.length) return [];

  const { rows } = await aiversePool.query(
    `select id, requester_email, requester_display_name, requester_department, requester_job_title, requested_at
     from hackathon_join_requests where team_id = $1 and status = 'pending' order by requested_at`,
    [teamRows[0].id],
  );
  return rows.map(r => ({
    id: r.id,
    email: r.requester_email,
    displayName: r.requester_display_name,
    department: r.requester_department,
    jobTitle: r.requester_job_title,
    requestedAt: r.requested_at.toISOString(),
  }));
}

/** Approves a pending request — only the team's creator can do this. */
export async function approveJoinRequest(requestId: string): Promise<Team> {
  const { email } = await requireSessionEmail();
  const { rows } = await aiversePool.query(
    `select r.*, t.created_by_email, t.status as team_status
     from hackathon_join_requests r
     join hackathon_teams t on t.id = r.team_id
     where r.id = $1 and r.status = 'pending'`,
    [requestId],
  );
  if (!rows.length) throw new Error('Request not found');
  const req = rows[0];
  if (req.created_by_email !== email) throw new Error('Only the team creator can approve requests');
  if (req.team_status !== 'active') throw new Error('This team is no longer accepting members');

  const { rows: countRows } = await aiversePool.query(
    `select count(*)::int as count from hackathon_team_members where team_id = $1`,
    [req.team_id],
  );
  const { rows: settingsRows } = await aiversePool.query(`select max_team_size from hackathon_settings where id = 1`);
  const maxTeamSize = settingsRows[0]?.max_team_size ?? Number.MAX_SAFE_INTEGER;
  if (countRows[0].count >= maxTeamSize) throw new Error('Team is already full');

  const client = await aiversePool.connect();
  try {
    await client.query('begin');
    await client.query(
      `insert into hackathon_team_members (team_id, email, display_name, department, job_title)
       values ($1, $2, $3, $4, $5)`,
      [req.team_id, req.requester_email, req.requester_display_name, req.requester_department, req.requester_job_title],
    );
    await client.query(`update hackathon_join_requests set status = 'approved', resolved_at = now() where id = $1`, [requestId]);
    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    if (err instanceof Error && /unique/i.test(err.message)) throw new Error('That person already joined a team');
    throw err;
  } finally {
    client.release();
  }

  return (await loadTeamById(req.team_id)) as Team;
}

/** Rejects a pending request — only the team's creator can do this. */
export async function rejectJoinRequest(requestId: string): Promise<void> {
  const { email } = await requireSessionEmail();
  const { rows } = await aiversePool.query(
    `select r.team_id, t.created_by_email
     from hackathon_join_requests r
     join hackathon_teams t on t.id = r.team_id
     where r.id = $1 and r.status = 'pending'`,
    [requestId],
  );
  if (!rows.length) throw new Error('Request not found');
  if (rows[0].created_by_email !== email) throw new Error('Only the team creator can reject requests');
  await aiversePool.query(`update hackathon_join_requests set status = 'rejected', resolved_at = now() where id = $1`, [requestId]);
}

export async function leaveTeam(teamId: string): Promise<void> {
  const { email } = await requireSessionEmail();
  const team = await loadTeamById(teamId);
  if (!team) return;

  const client = await aiversePool.connect();
  try {
    await client.query('begin');
    if (team.createdByEmail === email) {
      const nextOwner = team.members.find(m => m.email !== email);
      if (nextOwner) {
        // hackathon_teams.created_by_email has a FK into users, but addTeamMember never creates
        // one for the person it adds (only requireSessionEmail — an actual sign-in — does), so
        // upsert one first or promoting someone who's never logged in would violate that FK.
        await client.query(
          `insert into users (email, name) values ($1, $2) on conflict (email) do nothing`,
          [nextOwner.email, nextOwner.displayName],
        );
        await client.query(
          `update hackathon_teams set created_by_email = $1 where id = $2`,
          [nextOwner.email, teamId],
        );
      }
    }
    await client.query(
      `delete from hackathon_team_members where team_id = $1 and email = $2`,
      [teamId, email],
    );
    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
}
