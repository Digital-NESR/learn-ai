'use server';

import aiversePool from '@/lib/db-aiverse';
import { requireJudge } from '@/lib/judge';
import { RUBRIC_CATEGORIES } from '../judging-rubric';
import type { TeamMember } from './hackathon';
import type { SubmissionFile } from './hackathon-submission';

export interface JudgeSubmission {
  title: string;
  videoLink: string | null;
  answers: Record<string, string>;
  isFinal: boolean;
  files: SubmissionFile[];
}

export interface JudgeTeamSummary {
  id: string;
  name: string;
  createdByEmail: string;
  members: TeamMember[];
  submission: JudgeSubmission | null;
  myScores: Record<string, number>;
  myRemarks: string;
}

/** Masks a name for bias-free judging: keeps each word's first letter, stars out the rest
 * (e.g. "Sakina Bagalkot" -> "S***** B********"). Judges score on the work, not who did it. */
function maskName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0] + '*'.repeat(Math.max(word.length - 1, 0)))
    .join(' ');
}

/** Every active team, with its submission (if any) and this judge's own existing
 * scoresheet (if they've already scored it) - other judges' scores are never exposed.
 * Member names are masked (initials only) so scoring stays anonymous. */
export async function listTeamsForJudging(): Promise<JudgeTeamSummary[]> {
  const judgeEmail = await requireJudge();

  const { rows: teamRows } = await aiversePool.query(
    `select id, name, created_by_email from hackathon_teams where status = 'active' order by name`,
  );

  const { rows: memberRows } = await aiversePool.query(
    `select team_id, email, display_name, department, job_title, joined_at
     from hackathon_team_members order by joined_at`,
  );
  const membersByTeam = new Map<string, TeamMember[]>();
  for (const m of memberRows) {
    const list = membersByTeam.get(m.team_id) ?? [];
    list.push({
      email: m.email,
      displayName: maskName(m.display_name),
      department: m.department,
      jobTitle: m.job_title,
      joinedAt: m.joined_at.toISOString(),
    });
    membersByTeam.set(m.team_id, list);
  }

  const { rows: subRows } = await aiversePool.query(
    `select id, team_id, title, video_link, answers, is_final from hackathon_submissions`,
  );
  const subByTeam = new Map(subRows.map(s => [s.team_id, s]));

  const { rows: fileRows } = await aiversePool.query(
    `select submission_id, id, file_name, file_type, file_size, uploaded_at
     from hackathon_submission_files order by uploaded_at`,
  );
  const filesBySubmission = new Map<string, SubmissionFile[]>();
  for (const f of fileRows) {
    const list = filesBySubmission.get(f.submission_id) ?? [];
    list.push({
      id: f.id,
      fileName: f.file_name,
      fileType: f.file_type,
      fileSize: f.file_size,
      uploadedAt: f.uploaded_at.toISOString(),
    });
    filesBySubmission.set(f.submission_id, list);
  }

  const { rows: scoreRows } = await aiversePool.query(
    `select team_id, scores, remarks from hackathon_scores where judge_email = $1`,
    [judgeEmail],
  );
  const scoresByTeam = new Map(scoreRows.map(s => [s.team_id, s]));

  return teamRows.map(t => {
    const sub = subByTeam.get(t.id);
    const mine = scoresByTeam.get(t.id);
    return {
      id: t.id,
      name: t.name,
      createdByEmail: t.created_by_email,
      members: membersByTeam.get(t.id) ?? [],
      submission: sub
        ? {
            title: sub.title,
            videoLink: sub.video_link,
            answers: sub.answers ?? {},
            isFinal: sub.is_final,
            files: filesBySubmission.get(sub.id) ?? [],
          }
        : null,
      myScores: mine?.scores ?? {},
      myRemarks: mine?.remarks ?? '',
    };
  });
}

/** Saves (or updates) the calling judge's own scoresheet for one team. Scores are clamped to
 * each category's max and rounded - never trust the client's arithmetic. */
export async function saveJudgeScore(
  teamId: string,
  scores: Record<string, number>,
  remarks: string,
): Promise<void> {
  const judgeEmail = await requireJudge();

  const cleanScores: Record<string, number> = {};
  for (const category of RUBRIC_CATEGORIES) {
    const raw = scores[category.id];
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      cleanScores[category.id] = Math.max(0, Math.min(category.maxScore, Math.round(raw)));
    }
  }

  await aiversePool.query(
    `insert into hackathon_scores (team_id, judge_email, scores, remarks)
     values ($1, $2, $3, $4)
     on conflict (team_id, judge_email) do update set
       scores = excluded.scores,
       remarks = excluded.remarks,
       updated_at = now()`,
    [teamId, judgeEmail, JSON.stringify(cleanScores), remarks.trim() || null],
  );
}
