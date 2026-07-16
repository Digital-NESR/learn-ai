'use server';

import aiversePool from '@/lib/db-aiverse';
import { requireSessionEmail } from './hackathon';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB per file — generous for a pdf/pptx deck, no video allowed.
const MAX_FILES_PER_SUBMISSION = 10;

const MIME_TO_TYPE: Record<string, 'pdf' | 'pptx'> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};
const EXT_TO_TYPE: Record<string, 'pdf' | 'pptx'> = { pdf: 'pdf', pptx: 'pptx' };

export interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'pptx';
  fileSize: number;
  uploadedAt: string;
}

export interface SubmissionMeta {
  id: string;
  title: string;
  description: string | null;
  submittedByEmail: string;
  submittedAt: string;
  updatedAt: string;
  isLate: boolean;
  files: SubmissionFile[];
}

function detectFileType(file: File): 'pdf' | 'pptx' {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const kind = MIME_TO_TYPE[file.type] ?? EXT_TO_TYPE[ext];
  if (!kind) throw new Error('Only .pdf and .pptx files are accepted');
  return kind;
}

async function loadSubmissionByTeamId(teamId: string): Promise<SubmissionMeta | null> {
  const { rows: subRows } = await aiversePool.query(
    `select * from hackathon_submissions where team_id = $1`,
    [teamId],
  );
  if (!subRows.length) return null;
  const s = subRows[0];

  const { rows: fileRows } = await aiversePool.query(
    `select id, file_name, file_type, file_size, uploaded_at
     from hackathon_submission_files where submission_id = $1 order by uploaded_at`,
    [s.id],
  );

  return {
    id: s.id,
    title: s.title,
    description: s.description,
    submittedByEmail: s.submitted_by_email,
    submittedAt: s.submitted_at.toISOString(),
    updatedAt: s.updated_at.toISOString(),
    isLate: s.is_late,
    files: fileRows.map(f => ({
      id: f.id,
      fileName: f.file_name,
      fileType: f.file_type,
      fileSize: f.file_size,
      uploadedAt: f.uploaded_at.toISOString(),
    })),
  };
}

/** Submission metadata + file list for the signed-in user's team, if any. Never returns file bytes. */
export async function getMySubmission(): Promise<SubmissionMeta | null> {
  const { email } = await requireSessionEmail();
  const { rows: teamRows } = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (!teamRows.length) return null;
  return loadSubmissionByTeamId(teamRows[0].team_id);
}

/** Creates or updates the team's submission (title/description) and appends any files given. */
export async function submitProject(formData: FormData): Promise<SubmissionMeta> {
  const { email } = await requireSessionEmail();

  const { rows: teamRows } = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (!teamRows.length) throw new Error('Join or register a team before submitting');
  const teamId = teamRows[0].team_id;

  const { rows: settingsRows } = await aiversePool.query(
    `select event_start_at, submission_deadline_at from hackathon_settings where id = 1`,
  );
  const eventStartAt = settingsRows[0]?.event_start_at as Date | null;
  const submissionDeadlineAt = settingsRows[0]?.submission_deadline_at as Date | null;
  const now = new Date();
  if (eventStartAt && now < eventStartAt) throw new Error('Submissions open once the hackathon starts');
  const crossedDeadline = Boolean(submissionDeadlineAt && now > submissionDeadlineAt);

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Title is required');
  const descriptionRaw = formData.get('description');
  const description = typeof descriptionRaw === 'string' && descriptionRaw.trim() ? descriptionRaw.trim() : null;

  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) throw new Error(`"${file.name}" is over the 10MB limit`);
    detectFileType(file); // throws if not .pdf/.pptx
  }

  const { rows: existingCountRows } = await aiversePool.query(
    `select count(*)::int as count from hackathon_submission_files f
     join hackathon_submissions s on s.id = f.submission_id
     where s.team_id = $1`,
    [teamId],
  );
  if (existingCountRows[0].count + files.length > MAX_FILES_PER_SUBMISSION) {
    throw new Error(`Submissions are capped at ${MAX_FILES_PER_SUBMISSION} files`);
  }

  const client = await aiversePool.connect();
  try {
    await client.query('begin');

    const { rows } = await client.query(
      `insert into hackathon_submissions (team_id, title, description, submitted_by_email, is_late)
       values ($1,$2,$3,$4,$5)
       on conflict (team_id) do update set
         title = excluded.title,
         description = excluded.description,
         submitted_by_email = excluded.submitted_by_email,
         is_late = hackathon_submissions.is_late or excluded.is_late,
         updated_at = now()
       returning id`,
      [teamId, title, description, email, crossedDeadline],
    );
    const submissionId = rows[0].id;

    for (const file of files) {
      const fileType = detectFileType(file);
      const buffer = Buffer.from(await file.arrayBuffer());
      await client.query(
        `insert into hackathon_submission_files (submission_id, file_name, file_type, file_size, file_data)
         values ($1,$2,$3,$4,$5)`,
        [submissionId, file.name, fileType, file.size, buffer],
      );
    }

    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }

  return (await loadSubmissionByTeamId(teamId)) as SubmissionMeta;
}

/** Removes one file from the signed-in user's team's submission. */
export async function removeSubmissionFile(fileId: string): Promise<SubmissionMeta | null> {
  const { email } = await requireSessionEmail();
  const { rows: teamRows } = await aiversePool.query(
    `select team_id from hackathon_team_members where email = $1`,
    [email],
  );
  if (!teamRows.length) throw new Error('Join or register a team before managing submissions');
  const teamId = teamRows[0].team_id;

  await aiversePool.query(
    `delete from hackathon_submission_files f
     using hackathon_submissions s
     where f.submission_id = s.id and f.id = $1 and s.team_id = $2`,
    [fileId, teamId],
  );

  return loadSubmissionByTeamId(teamId);
}
