import aiversePool from './db-aiverse';
import { TRACKS as STATIC_TRACKS, type Track, type Module, type TrackId } from '../app/content';

interface OverrideRow {
  id: string;
  trackId: TrackId;
  part: number;
  partLabel: string;
  title: string;
  tagline: string;
  minutes: number;
  sections: Module['sections'];
  quiz: Module['quiz'];
  isDeleted: boolean;
}

async function loadOverrides(): Promise<OverrideRow[]> {
  const { rows } = await aiversePool.query(
    `select id, track_id, part, part_label, title, tagline, minutes, sections, quiz, is_deleted
     from module_overrides`,
  );
  return rows.map(r => ({
    id: r.id,
    trackId: r.track_id,
    part: r.part,
    partLabel: r.part_label,
    title: r.title,
    tagline: r.tagline,
    minutes: r.minutes,
    sections: r.sections,
    quiz: r.quiz,
    isDeleted: r.is_deleted,
  }));
}

async function loadDeletedTrackIds(): Promise<Set<string>> {
  const { rows } = await aiversePool.query(`select id from track_overrides`);
  return new Set(rows.map(r => r.id as string));
}

function toModule(o: OverrideRow): Module {
  return {
    id: o.id,
    partLabel: o.partLabel,
    part: o.part,
    title: o.title,
    tagline: o.tagline,
    minutes: o.minutes,
    sections: o.sections,
    quiz: o.quiz,
  };
}

/**
 * Merges the static course content (src/app/content.ts) with admin-authored
 * overrides from the database. Vercel's filesystem is read-only in
 * production, so admin edits/creates/deletes live in module_overrides and are
 * applied here at render time rather than touching content.ts.
 */
export async function getEffectiveTracks(): Promise<Track[]> {
  const [overrides, deletedTrackIds] = await Promise.all([loadOverrides(), loadDeletedTrackIds()]);
  const overrideMap = new Map(overrides.map(o => [o.id, o]));
  const staticIds = new Set(STATIC_TRACKS.flatMap(t => t.modules.map(m => m.id)));

  const tracks: Track[] = STATIC_TRACKS.filter(t => !deletedTrackIds.has(t.id)).map(t => ({
    ...t,
    modules: t.modules
      .filter(m => !overrideMap.get(m.id)?.isDeleted)
      .map(m => {
        const o = overrideMap.get(m.id);
        return o ? toModule(o) : m;
      }),
  }));

  for (const o of overrides) {
    if (o.isDeleted || staticIds.has(o.id)) continue;
    const track = tracks.find(t => t.id === o.trackId);
    if (track) track.modules.push(toModule(o));
  }

  for (const t of tracks) t.modules.sort((a, b) => a.part - b.part);
  return tracks;
}

export async function getEffectiveAllModules(): Promise<{ module: Module; track: Track }[]> {
  const tracks = await getEffectiveTracks();
  return tracks.flatMap(track => track.modules.map(module => ({ module, track })));
}

export async function getEffectiveModule(
  moduleId: string,
): Promise<{ module: Module; track: Track } | undefined> {
  const all = await getEffectiveAllModules();
  return all.find(m => m.module.id === moduleId);
}

export async function getEffectiveNextModule(
  moduleId: string,
): Promise<{ module: Module; track: Track } | undefined> {
  const all = await getEffectiveAllModules();
  const idx = all.findIndex(m => m.module.id === moduleId);
  if (idx === -1 || idx + 1 >= all.length) return undefined;
  return all[idx + 1];
}

export async function getEffectiveTotalModules(): Promise<number> {
  const all = await getEffectiveAllModules();
  return all.length;
}
