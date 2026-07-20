'use server';

import { requireAdmin } from '@/lib/admin';
import aiversePool from '@/lib/db-aiverse';
import employeeDirectoryPool from '@/lib/db-employee-directory';
import { agentPostJson } from '@/lib/n8n-agent';
import type { TeamMember } from './hackathon';

export interface HackathonSettings {
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

export type HackathonSettingsInput = HackathonSettings;

interface SettingsRow {
  status: string;
  registration_opens_at: Date | null;
  registration_closes_at: Date | null;
  event_start_at: Date | null;
  submission_deadline_at: Date | null;
  presentation_at: Date | null;
  venue: string | null;
  meeting_link: string | null;
  min_team_size: number;
  max_team_size: number;
  contact_email: string | null;
  eligibility: string | null;
  announcement: string | null;
}

function rowToSettings(r: SettingsRow): HackathonSettings {
  return {
    status: r.status as HackathonSettings['status'],
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

export async function getHackathonSettings(): Promise<HackathonSettings> {
  await requireAdmin();
  const { rows } = await aiversePool.query(`select * from hackathon_settings where id = 1`);
  return rowToSettings(rows[0]);
}

export async function saveHackathonSettings(data: HackathonSettingsInput): Promise<void> {
  await requireAdmin();
  if (!['draft', 'open', 'closed'].includes(data.status)) throw new Error('Invalid status');
  if (data.minTeamSize < 1) throw new Error('Minimum team size must be at least 1');
  if (data.maxTeamSize < data.minTeamSize) throw new Error('Maximum team size must be at least the minimum');

  await aiversePool.query(
    `update hackathon_settings set
       status = $1, registration_opens_at = $2, registration_closes_at = $3,
       event_start_at = $4, submission_deadline_at = $5, presentation_at = $6,
       venue = $7, meeting_link = $8, min_team_size = $9, max_team_size = $10,
       contact_email = $11, eligibility = $12, announcement = $13, updated_at = now()
     where id = 1`,
    [
      data.status,
      data.registrationOpensAt,
      data.registrationClosesAt,
      data.eventStartAt,
      data.submissionDeadlineAt,
      data.presentationAt,
      data.venue,
      data.meetingLink,
      data.minTeamSize,
      data.maxTeamSize,
      data.contactEmail,
      data.eligibility,
      data.announcement,
    ],
  );
}

export interface HackathonOverview {
  registrationStatus: 'draft' | 'open' | 'closed';
  totalTeams: number;
  totalParticipants: number;
  employeesWithoutTeams: number;
  avgTeamSize: number;
  departmentsRepresented: number;
  totalSubmissions: number;
  recentRegistrations: { teamId: string; teamName: string; createdAt: string; memberCount: number }[];
}

export async function getHackathonOverview(): Promise<HackathonOverview> {
  await requireAdmin();

  const { rows: settingsRows } = await aiversePool.query(`select status from hackathon_settings where id = 1`);
  const registrationStatus = (settingsRows[0]?.status ?? 'draft') as HackathonOverview['registrationStatus'];

  const { rows: teamCountRows } = await aiversePool.query(`select count(*)::int as count from hackathon_teams`);
  const totalTeams = teamCountRows[0].count;

  const { rows: memberAgg } = await aiversePool.query(
    `select count(*)::int as total_participants, count(distinct department)::int as departments
     from hackathon_team_members`,
  );
  const totalParticipants = memberAgg[0].total_participants;
  const departmentsRepresented = memberAgg[0].departments;

  const { rows: dirRows } = await employeeDirectoryPool.query(
    `select count(*)::int as count from azure_ad_users_staging`,
  );
  const employeesWithoutTeams = Math.max(0, dirRows[0].count - totalParticipants);

  const avgTeamSize = totalTeams > 0 ? Math.round((totalParticipants / totalTeams) * 10) / 10 : 0;

  const { rows: submissionCountRows } = await aiversePool.query(
    `select count(*)::int as count from hackathon_submissions`,
  );
  const totalSubmissions = submissionCountRows[0].count;

  const { rows: recentRows } = await aiversePool.query(
    `select t.id, t.name, t.created_at, count(m.email)::int as member_count
     from hackathon_teams t
     left join hackathon_team_members m on m.team_id = t.id
     group by t.id, t.name, t.created_at
     order by t.created_at desc
     limit 5`,
  );

  return {
    registrationStatus,
    totalTeams,
    totalParticipants,
    employeesWithoutTeams,
    avgTeamSize,
    departmentsRepresented,
    totalSubmissions,
    recentRegistrations: recentRows.map(r => ({
      teamId: r.id,
      teamName: r.name,
      createdAt: r.created_at.toISOString(),
      memberCount: r.member_count,
    })),
  };
}

export type TeamStatusLabel = 'Ready' | 'Incomplete' | 'Oversized' | 'Disqualified';

export interface AdminTeamSummary {
  id: string;
  name: string;
  createdByEmail: string;
  createdByName: string | null;
  memberCount: number;
  departments: string[];
  createdAt: string;
  rawStatus: 'active' | 'disqualified';
  statusLabel: TeamStatusLabel;
}

export interface AdminTeamDetail extends AdminTeamSummary {
  members: TeamMember[];
}

function deriveStatusLabel(
  rawStatus: string,
  memberCount: number,
  minTeamSize: number,
  maxTeamSize: number,
): TeamStatusLabel {
  if (rawStatus === 'disqualified') return 'Disqualified';
  if (memberCount < minTeamSize) return 'Incomplete';
  if (memberCount > maxTeamSize) return 'Oversized';
  return 'Ready';
}

async function getTeamSizeLimits(): Promise<{ minTeamSize: number; maxTeamSize: number }> {
  const { rows } = await aiversePool.query(`select min_team_size, max_team_size from hackathon_settings where id = 1`);
  return {
    minTeamSize: rows[0]?.min_team_size ?? 1,
    maxTeamSize: rows[0]?.max_team_size ?? Number.MAX_SAFE_INTEGER,
  };
}

export async function listTeamsForAdmin(search?: string): Promise<AdminTeamSummary[]> {
  await requireAdmin();
  const { minTeamSize, maxTeamSize } = await getTeamSizeLimits();

  const q = search?.trim();
  const like = q ? `%${q}%` : null;

  const { rows } = await aiversePool.query(
    `select
       t.id, t.name, t.created_by_email, t.status, t.created_at,
       count(m.email)::int as member_count,
       array_remove(array_agg(distinct m.department), null) as departments,
       max(case when m.email = t.created_by_email then m.display_name end) as creator_name
     from hackathon_teams t
     left join hackathon_team_members m on m.team_id = t.id
     where $1::text is null
        or t.name ilike $1
        or exists (
          select 1 from hackathon_team_members m2
          where m2.team_id = t.id
            and (m2.email ilike $1 or m2.display_name ilike $1 or m2.department ilike $1)
        )
     group by t.id, t.name, t.created_by_email, t.status, t.created_at
     order by t.created_at desc`,
    [like],
  );

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    createdByEmail: r.created_by_email,
    createdByName: r.creator_name,
    memberCount: r.member_count,
    departments: (r.departments as string[]) ?? [],
    createdAt: r.created_at.toISOString(),
    rawStatus: r.status,
    statusLabel: deriveStatusLabel(r.status, r.member_count, minTeamSize, maxTeamSize),
  }));
}

export async function getTeamDetailForAdmin(teamId: string): Promise<AdminTeamDetail | null> {
  await requireAdmin();
  const { rows: teamRows } = await aiversePool.query(
    `select id, name, created_by_email, status, created_at from hackathon_teams where id = $1`,
    [teamId],
  );
  if (!teamRows.length) return null;
  const t = teamRows[0];

  const { rows: memberRows } = await aiversePool.query(
    `select email, display_name, department, job_title, joined_at
     from hackathon_team_members where team_id = $1 order by joined_at`,
    [teamId],
  );
  const { minTeamSize, maxTeamSize } = await getTeamSizeLimits();

  const members: TeamMember[] = memberRows.map(r => ({
    email: r.email,
    displayName: r.display_name,
    department: r.department,
    jobTitle: r.job_title,
    joinedAt: r.joined_at.toISOString(),
  }));
  const departments = Array.from(new Set(members.map(m => m.department).filter((d): d is string => !!d)));

  return {
    id: t.id,
    name: t.name,
    createdByEmail: t.created_by_email,
    createdByName: members.find(m => m.email === t.created_by_email)?.displayName ?? null,
    memberCount: members.length,
    departments,
    createdAt: t.created_at.toISOString(),
    rawStatus: t.status,
    statusLabel: deriveStatusLabel(t.status, members.length, minTeamSize, maxTeamSize),
    members,
  };
}

export async function createTeamAdmin(
  name: string,
  creatorEmail: string,
  memberEmails: string[] = [],
): Promise<AdminTeamDetail> {
  await requireAdmin();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error('Team name is required');

  const target = creatorEmail.trim().toLowerCase();
  const extraTargets = Array.from(new Set(memberEmails.map(e => e.trim().toLowerCase()))).filter(e => e !== target);

  const { maxTeamSize } = await getTeamSizeLimits();
  if (1 + extraTargets.length > maxTeamSize) throw new Error(`Teams are capped at ${maxTeamSize} members`);

  const allEmails = [target, ...extraTargets];
  const { rows: dirRows } = await employeeDirectoryPool.query(
    `select mail, display_name, department, job_title from azure_ad_users_staging where mail = any($1)`,
    [allEmails],
  );
  const dirByEmail = new Map(dirRows.map(r => [r.mail.toLowerCase(), r]));
  const missing = allEmails.filter(e => !dirByEmail.has(e));
  if (missing.length) throw new Error(`No employee found for: ${missing.join(', ')}`);

  const client = await aiversePool.connect();
  try {
    await client.query('begin');

    // hackathon_teams.created_by_email has a FK into users, but a directory match alone doesn't
    // guarantee that person has ever signed in (only requireSessionEmail creates a users row) -     // upsert everyone's users row before the team insert, which needs the creator's row to exist.
    for (const email of allEmails) {
      const dir = dirByEmail.get(email)!;
      await client.query(`insert into users (email, name) values ($1, $2) on conflict (email) do nothing`, [
        email,
        dir.display_name,
      ]);
    }

    let teamId: string;
    try {
      const { rows: teamRows } = await client.query(
        `insert into hackathon_teams (name, created_by_email) values ($1, $2) returning id`,
        [trimmedName, target],
      );
      teamId = teamRows[0].id;
    } catch (err) {
      if (err instanceof Error && /unique/i.test(err.message)) throw new Error('That team name is already taken');
      throw err;
    }

    for (const email of allEmails) {
      const dir = dirByEmail.get(email)!;
      try {
        await client.query(
          `insert into hackathon_team_members (team_id, email, display_name, department, job_title)
           values ($1, $2, $3, $4, $5)`,
          [teamId, email, dir.display_name, dir.department, dir.job_title],
        );
      } catch (err) {
        if (err instanceof Error && /unique/i.test(err.message)) throw new Error(`${dir.display_name} is already on a team`);
        throw err;
      }
    }

    await client.query('commit');
    const detail = await getTeamDetailForAdmin(teamId);
    return detail as AdminTeamDetail;
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
}

export async function renameTeamAdmin(teamId: string, newName: string): Promise<void> {
  await requireAdmin();
  const trimmed = newName.trim();
  if (!trimmed) throw new Error('Team name is required');
  try {
    await aiversePool.query(`update hackathon_teams set name = $1 where id = $2`, [trimmed, teamId]);
  } catch (err) {
    if (err instanceof Error && /unique/i.test(err.message)) throw new Error('That team name is already taken');
    throw err;
  }
}

export async function addTeamMemberAdmin(teamId: string, memberEmail: string): Promise<void> {
  await requireAdmin();
  const { rows: countRows } = await aiversePool.query(
    `select count(*)::int as count from hackathon_team_members where team_id = $1`,
    [teamId],
  );
  const { maxTeamSize } = await getTeamSizeLimits();
  if (countRows[0].count >= maxTeamSize) throw new Error(`Teams are capped at ${maxTeamSize} members`);

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
    if (err instanceof Error && /unique/i.test(err.message)) throw new Error('That person is already on a team');
    throw err;
  }
}

/** If `target` is the team's creator and other members remain, promotes the longest-tenured
 * remaining member before the caller deletes `target`'s row. No-op otherwise. Must run inside
 * the caller's transaction. */
async function reassignOwnerIfNeeded(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> },
  teamId: string,
  target: string,
): Promise<void> {
  const { rows: teamRows } = await client.query(`select created_by_email from hackathon_teams where id = $1`, [teamId]);
  if (teamRows[0]?.created_by_email !== target) return;
  const { rows: nextRows } = await client.query(
    `select email, display_name from hackathon_team_members where team_id = $1 and email != $2 order by joined_at limit 1`,
    [teamId, target],
  );
  if (nextRows.length) {
    await promoteToOwner(client, teamId, nextRows[0].email as string, nextRows[0].display_name as string);
  }
}

/** hackathon_teams.created_by_email has a FK into users, but admin-added members never get a
 * users row (only requireSessionEmail - an actual sign-in - creates one). Upsert a row first so
 * promoting someone who's never logged in doesn't violate that constraint. */
async function promoteToOwner(
  client: { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> },
  teamId: string,
  email: string,
  displayName: string,
): Promise<void> {
  await client.query(`insert into users (email, name) values ($1, $2) on conflict (email) do nothing`, [email, displayName]);
  await client.query(`update hackathon_teams set created_by_email = $1 where id = $2`, [email, teamId]);
}

export async function removeTeamMemberAdmin(teamId: string, memberEmail: string): Promise<void> {
  await requireAdmin();
  const target = memberEmail.trim().toLowerCase();

  const client = await aiversePool.connect();
  try {
    await client.query('begin');
    await reassignOwnerIfNeeded(client, teamId, target);
    await client.query(`delete from hackathon_team_members where team_id = $1 and email = $2`, [teamId, target]);
    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
}

export async function transferOwnershipAdmin(teamId: string, newOwnerEmail: string): Promise<void> {
  await requireAdmin();
  const target = newOwnerEmail.trim().toLowerCase();
  const { rows } = await aiversePool.query(
    `select display_name from hackathon_team_members where team_id = $1 and email = $2`,
    [teamId, target],
  );
  if (!rows.length) throw new Error('That person is not a member of this team');
  await promoteToOwner(aiversePool, teamId, target, rows[0].display_name);
}

export async function moveTeamMemberAdmin(fromTeamId: string, toTeamId: string, memberEmail: string): Promise<void> {
  await requireAdmin();
  if (fromTeamId === toTeamId) throw new Error('Pick a different team to move to');
  const target = memberEmail.trim().toLowerCase();

  const client = await aiversePool.connect();
  try {
    await client.query('begin');

    const { rows: memberRows } = await client.query(
      `select display_name, department, job_title from hackathon_team_members where team_id = $1 and email = $2`,
      [fromTeamId, target],
    );
    if (!memberRows.length) throw new Error('That person is not on the source team');

    const { rows: toCountRows } = await client.query(
      `select count(*)::int as count from hackathon_team_members where team_id = $1`,
      [toTeamId],
    );
    const { rows: settingsRows } = await client.query(`select max_team_size from hackathon_settings where id = 1`);
    const maxTeamSize = settingsRows[0]?.max_team_size ?? Number.MAX_SAFE_INTEGER;
    if (toCountRows[0].count >= maxTeamSize) throw new Error(`Target team is already at the ${maxTeamSize}-member cap`);

    await reassignOwnerIfNeeded(client, fromTeamId, target);
    await client.query(`delete from hackathon_team_members where team_id = $1 and email = $2`, [fromTeamId, target]);
    await client.query(
      `insert into hackathon_team_members (team_id, email, display_name, department, job_title)
       values ($1, $2, $3, $4, $5)`,
      [toTeamId, target, memberRows[0].display_name, memberRows[0].department, memberRows[0].job_title],
    );

    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteTeamAdmin(teamId: string): Promise<void> {
  await requireAdmin();
  await aiversePool.query(`delete from hackathon_teams where id = $1`, [teamId]);
}

export async function setTeamStatusAdmin(teamId: string, status: 'active' | 'disqualified'): Promise<void> {
  await requireAdmin();
  if (status !== 'active' && status !== 'disqualified') throw new Error('Invalid status');
  await aiversePool.query(`update hackathon_teams set status = $1 where id = $2`, [status, teamId]);
}

export interface AdminSubmissionFile {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'pptx';
  fileSize: number;
}

export interface AdminSubmissionSummary {
  id: string;
  teamId: string;
  teamName: string;
  title: string;
  videoLink: string | null;
  answers: Record<string, string>;
  submittedByEmail: string;
  submittedAt: string;
  updatedAt: string;
  isLate: boolean;
  isFinal: boolean;
  finalSubmittedAt: string | null;
  files: AdminSubmissionFile[];
}

export async function listSubmissionsForAdmin(): Promise<AdminSubmissionSummary[]> {
  await requireAdmin();
  const { rows } = await aiversePool.query(
    `select s.id, s.team_id, t.name as team_name, s.title, s.video_link, s.answers, s.submitted_by_email,
            s.submitted_at, s.updated_at, s.is_late, s.is_final, s.final_submitted_at
     from hackathon_submissions s
     join hackathon_teams t on t.id = s.team_id
     order by s.submitted_at desc`,
  );

  const { rows: fileRows } = await aiversePool.query(
    `select submission_id, id, file_name, file_type, file_size from hackathon_submission_files order by uploaded_at`,
  );
  const filesBySubmission = new Map<string, AdminSubmissionFile[]>();
  for (const f of fileRows) {
    const list = filesBySubmission.get(f.submission_id) ?? [];
    list.push({ id: f.id, fileName: f.file_name, fileType: f.file_type, fileSize: f.file_size });
    filesBySubmission.set(f.submission_id, list);
  }

  return rows.map(r => ({
    id: r.id,
    teamId: r.team_id,
    teamName: r.team_name,
    title: r.title,
    videoLink: r.video_link,
    answers: r.answers ?? {},
    submittedByEmail: r.submitted_by_email,
    submittedAt: r.submitted_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
    isLate: r.is_late,
    isFinal: r.is_final,
    finalSubmittedAt: r.final_submitted_at ? r.final_submitted_at.toISOString() : null,
    files: filesBySubmission.get(r.id) ?? [],
  }));
}

/** Unlocks a team's final submission so they can go back to editing it. */
export async function reopenSubmissionAdmin(teamId: string): Promise<void> {
  await requireAdmin();
  await aiversePool.query(
    `update hackathon_submissions set is_final = false, final_submitted_at = null where team_id = $1`,
    [teamId],
  );
}

export interface AnnouncementResult {
  sent: number;
}

/** Sends a broadcast email to every registered participant (or just the calling admin,
 * for a test) via the n8n announcement webhook - this app never sends email directly. */
export async function sendHackathonAnnouncement(
  subject: string,
  message: string,
  testOnly: boolean,
): Promise<AnnouncementResult> {
  const adminEmail = await requireAdmin();

  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();
  if (!trimmedSubject) throw new Error('Subject is required');
  if (!trimmedMessage) throw new Error('Message is required');

  const webhookUrl = process.env.N8N_ANNOUNCEMENT_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('The announcement webhook is not configured (N8N_ANNOUNCEMENT_WEBHOOK_URL)');

  let recipients: { email: string; displayName: string }[];
  if (testOnly) {
    recipients = [{ email: adminEmail, displayName: 'Admin (test send)' }];
  } else {
    const { rows } = await aiversePool.query(
      `select email, display_name from hackathon_team_members order by display_name`,
    );
    recipients = rows.map(r => ({ email: r.email, displayName: r.display_name }));
  }
  if (recipients.length === 0) throw new Error('No participants to send to yet');

  let res;
  try {
    res = await agentPostJson(
      webhookUrl,
      JSON.stringify({ subject: trimmedSubject, message: trimmedMessage, recipients }),
      {
        'Content-Type': 'application/json',
        ...(process.env.N8N_ANNOUNCEMENT_WEBHOOK_SECRET
          ? { 'X-Webhook-Secret': process.env.N8N_ANNOUNCEMENT_WEBHOOK_SECRET }
          : {}),
      },
      30_000,
    );
  } catch (err) {
    console.error('[hackathon-announcement] fetch to n8n webhook failed:', webhookUrl, err);
    throw new Error('Could not reach the announcement service - please try again.');
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    console.error('[hackathon-announcement] n8n webhook returned non-OK status', res.status, bodyText.slice(0, 500));
    throw new Error('The announcement service reported an error - nothing may have been sent.');
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const sent = typeof data.sent === 'number' ? data.sent : recipients.length;
  return { sent };
}
