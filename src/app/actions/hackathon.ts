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

async function requireSessionEmail() {
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

export async function createTeam(teamName: string): Promise<Team> {
  const { email, name } = await requireSessionEmail();
  const trimmed = teamName.trim();
  if (!trimmed) throw new Error('Team name is required');

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
  await aiversePool.query(
    `delete from hackathon_team_members where team_id = $1 and email = $2`,
    [teamId, email],
  );
}
