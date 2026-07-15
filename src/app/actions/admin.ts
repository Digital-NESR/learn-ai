'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import aiversePool from '@/lib/db-aiverse';
import { getEffectiveTracks, getEffectiveModule } from '@/lib/content-resolver';
import type { ContentBlock, QuizQuestion, Track, TrackId } from '../content';

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function requireAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!isAdminEmail(email)) throw new Error('Admins only');
  return email as string;
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
  await requireAdmin();

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
}

export async function deleteModule(moduleId: string): Promise<void> {
  await requireAdmin();
  const existing = await getEffectiveModule(moduleId);
  if (!existing) throw new Error('Module not found');

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
}
