import type { Track, TrackId } from '../app/content';

/** The 11 achievements the app tracks — 7 track-completions plus 4 milestones
 * built on top of them. Also the id space for one-certificate-per-achievement
 * (see src/lib/achievement-certificates.ts and the achievement_certificates
 * table) — every id here has a matching certificate design. */
export type AchievementId = TrackId | 'general-realm' | 'technical-realm' | 'certified' | 'dungeon-master';

export const ACHIEVEMENT_IDS: AchievementId[] = [
  'general-beginner',
  'general-intermediate',
  'general-advanced',
  'technical-beginner',
  'technical-intermediate',
  'technical-advanced',
  'productivity',
  'general-realm',
  'technical-realm',
  'certified',
  'dungeon-master',
];

export function isAchievementId(value: string): value is AchievementId {
  return (ACHIEVEMENT_IDS as string[]).includes(value);
}

type GroupKey = 'general' | 'technical';
function groupOf(id: TrackId): GroupKey | null {
  if (id.startsWith('general-')) return 'general';
  if (id.startsWith('technical-')) return 'technical';
  return null;
}

export interface AchievementResult {
  id: AchievementId;
  label: string;
  earned: boolean;
}

/**
 * Single source of truth for which achievements are earned — used by the
 * dashboard/dungeon UI (display) and by recordModuleResult (server-side
 * certificate awarding), so the two can never drift apart.
 */
export function computeEarnedAchievements(
  tracks: Track[],
  completedIds: ReadonlySet<string>,
  certificateEarned: boolean,
): AchievementResult[] {
  function trackDone(t: Track): boolean {
    return t.modules.length > 0 && t.modules.every(m => completedIds.has(m.id));
  }
  function groupDone(group: GroupKey): boolean {
    const groupTracks = tracks.filter(t => groupOf(t.id) === group);
    return groupTracks.length > 0 && groupTracks.every(trackDone);
  }
  const allDone = tracks.length > 0 && tracks.every(trackDone);

  return [
    ...tracks.map(t => ({ id: t.id, label: `${t.eyebrow} Cleared`, earned: trackDone(t) })),
    { id: 'general-realm' as const, label: 'General Realm Conquered', earned: groupDone('general') },
    { id: 'technical-realm' as const, label: 'Technical Realm Conquered', earned: groupDone('technical') },
    { id: 'certified' as const, label: 'Certified', earned: certificateEarned },
    { id: 'dungeon-master' as const, label: 'Dungeon Master (100%)', earned: allDone },
  ];
}
