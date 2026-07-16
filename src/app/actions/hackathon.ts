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
  if (team.createdByEmail !== email) throw new Error('Only the team creator can add members');

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
