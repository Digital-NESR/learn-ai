'use server';

import { requireAdmin } from '@/lib/admin';
import aiversePool from '@/lib/db-aiverse';
import { getEffectiveTracks, getEffectiveModule } from '@/lib/content-resolver';
import type { ContentBlock, QuizQuestion, Track, TrackId } from '../content';

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RECENT_ACTIONS_KEPT = 20;

type ActionTable = 'module_overrides' | 'track_overrides';

/** Records one undo-able write. `previousRow` is what was in the row before this
 * action ran — null means the row didn't exist, so undo means deleting it. */
async function logAction(
  actorEmail: string,
  tableName: ActionTable,
  rowId: string,
  description: string,
  previousRow: Record<string, unknown> | null,
): Promise<void> {
  await aiversePool.query(
    `insert into admin_actions (actor_email, table_name, row_id, description, previous_row)
     values ($1, $2, $3, $4, $5)`,
    [actorEmail, tableName, rowId, description, previousRow ? JSON.stringify(previousRow) : null],
  );
  await aiversePool.query(
    `delete from admin_actions where actor_email = $1 and id not in (
       select id from admin_actions where actor_email = $1 order by created_at desc limit $2
     )`,
    [actorEmail, RECENT_ACTIONS_KEPT],
  );
}

export interface ModuleFormData {
  id: string;
  trackId: TrackId;
  part: number;
  partLabel: string;
  title: string;
  tagline: string;
  minutes: number;
  sections: ContentBlock[];
  quiz: QuizQuestion[];
}

export async function listTracksForAdmin(): Promise<Track[]> {
  await requireAdmin();
  return getEffectiveTracks();
}

export async function saveModule(data: ModuleFormData): Promise<void> {
  const actorEmail = await requireAdmin();

  const id = data.id.trim().toLowerCase();
  if (!ID_RE.test(id)) {
    throw new Error('Module id must be lowercase letters, numbers, and single dashes only (e.g. business-4)');
  }
  if (!data.title.trim()) throw new Error('Title is required');
  if (!Array.isArray(data.sections)) throw new Error('Sections must be an array');
  if (!Array.isArray(data.quiz)) throw new Error('Quiz must be an array');
  for (const q of data.quiz) {
    if (!q.prompt?.trim()) throw new Error('Every quiz question needs a prompt');
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error('Every quiz question needs at least 2 options');
    }
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error('Every quiz question needs a valid answer index');
    }
  }

  const { rows: prevRows } = await aiversePool.query(`select * from module_overrides where id = $1`, [id]);
  const previousRow = prevRows[0] ?? null;

  await aiversePool.query(
    `insert into module_overrides (id, track_id, part, part_label, title, tagline, minutes, sections, quiz, is_deleted)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
     on conflict (id) do update set
       track_id = excluded.track_id,
       part = excluded.part,
       part_label = excluded.part_label,
       title = excluded.title,
       tagline = excluded.tagline,
       minutes = excluded.minutes,
       sections = excluded.sections,
       quiz = excluded.quiz,
       is_deleted = false,
       updated_at = now()`,
    [
      id,
      data.trackId,
      data.part,
      data.partLabel,
      data.title.trim(),
      data.tagline,
      data.minutes,
      JSON.stringify(data.sections),
      JSON.stringify(data.quiz),
    ],
  );

  await logAction(
    actorEmail,
    'module_overrides',
    id,
    previousRow ? `Edited "${data.title.trim()}"` : `Created "${data.title.trim()}"`,
    previousRow,
  );
}

export async function deleteModule(moduleId: string): Promise<void> {
  const actorEmail = await requireAdmin();
  const existing = await getEffectiveModule(moduleId);
  if (!existing) throw new Error('Module not found');

  const { rows: prevRows } = await aiversePool.query(`select * from module_overrides where id = $1`, [moduleId]);
  const previousRow = prevRows[0] ?? null;

  await aiversePool.query(
    `insert into module_overrides (id, track_id, part, part_label, title, tagline, minutes, sections, quiz, is_deleted)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
     on conflict (id) do update set is_deleted = true, updated_at = now()`,
    [
      moduleId,
      existing.track.id,
      existing.module.part,
      existing.module.partLabel,
      existing.module.title,
      existing.module.tagline,
      existing.module.minutes,
      JSON.stringify(existing.module.sections),
      JSON.stringify(existing.module.quiz),
    ],
  );

  await logAction(actorEmail, 'module_overrides', moduleId, `Deleted "${existing.module.title}"`, previousRow);
}

export async function deleteTrack(trackId: TrackId): Promise<void> {
  const actorEmail = await requireAdmin();
  const tracks = await getEffectiveTracks();
  const track = tracks.find(t => t.id === trackId);
  if (!track) throw new Error('Track not found');

  const { rows: prevRows } = await aiversePool.query(`select id from track_overrides where id = $1`, [trackId]);
  const previousRow = prevRows[0] ?? null;

  await aiversePool.query(`insert into track_overrides (id) values ($1) on conflict (id) do nothing`, [trackId]);

  await logAction(actorEmail, 'track_overrides', trackId, `Deleted track "${track.eyebrow}"`, previousRow);
}

export interface AdminAction {
  id: string;
  description: string;
  createdAt: string;
}

export async function listRecentActions(): Promise<AdminAction[]> {
  const actorEmail = await requireAdmin();
  const { rows } = await aiversePool.query(
    `select id, description, created_at from admin_actions
     where actor_email = $1 order by created_at desc limit 3`,
    [actorEmail],
  );
  return rows.map(r => ({ id: r.id, description: r.description, createdAt: r.created_at.toISOString() }));
}

export async function undoAction(actionId: string): Promise<void> {
  const actorEmail = await requireAdmin();
  const { rows } = await aiversePool.query(
    `select * from admin_actions where id = $1 and actor_email = $2`,
    [actionId, actorEmail],
  );
  if (!rows.length) throw new Error('Action not found');
  const action = rows[0];
  const previousRow = action.previous_row as Record<string, unknown> | null;

  if (action.table_name === 'module_overrides') {
    if (!previousRow) {
      await aiversePool.query(`delete from module_overrides where id = $1`, [action.row_id]);
    } else {
      const p = previousRow;
      await aiversePool.query(
        `insert into module_overrides (id, track_id, part, part_label, title, tagline, minutes, sections, quiz, is_deleted)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         on conflict (id) do update set
           track_id = excluded.track_id, part = excluded.part, part_label = excluded.part_label,
           title = excluded.title, tagline = excluded.tagline, minutes = excluded.minutes,
           sections = excluded.sections, quiz = excluded.quiz, is_deleted = excluded.is_deleted,
           updated_at = now()`,
        [
          p.id, p.track_id, p.part, p.part_label, p.title, p.tagline, p.minutes,
          JSON.stringify(p.sections), JSON.stringify(p.quiz), p.is_deleted,
        ],
      );
    }
  } else if (action.table_name === 'track_overrides') {
    if (!previousRow) {
      await aiversePool.query(`delete from track_overrides where id = $1`, [action.row_id]);
    } else {
      await aiversePool.query(`insert into track_overrides (id) values ($1) on conflict (id) do nothing`, [action.row_id]);
    }
  }

  await aiversePool.query(`delete from admin_actions where id = $1`, [actionId]);
}
