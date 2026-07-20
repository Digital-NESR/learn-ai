'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Cpu, FlaskConical, Layers, Network, Rocket, Wand2 } from 'lucide-react';
import type { Track, TrackId } from './content';
import type { ProgressMap } from './actions/progress';
import type { CertificateStatus } from '@/lib/certificate';
import AiLearningHeader from './components/AiLearningHeader';
import DungeonGate from './components/dungeon/DungeonGate';
import RegionCard from './components/dungeon/RegionCard';
import IslandNode from './components/dungeon/IslandNode';
import AchievementsMenu, { type Achievement } from './components/dungeon/AchievementsMenu';

const TRACK_ICON: Record<TrackId, typeof BookOpen> = {
  'general-beginner': BookOpen,
  'general-intermediate': Layers,
  'general-advanced': Rocket,
  'technical-beginner': Cpu,
  'technical-intermediate': Network,
  'technical-advanced': FlaskConical,
  productivity: Wand2,
};

/** "general-*" / "technical-*" tracks share a combined achievement; productivity stands alone. */
type GroupKey = 'general' | 'technical';
function groupOf(id: TrackId): GroupKey | null {
  if (id.startsWith('general-')) return 'general';
  if (id.startsWith('technical-')) return 'technical';
  return null;
}

type View = { kind: 'gate' } | { kind: 'regions' } | { kind: 'path'; trackId: TrackId };

export default function AiLearningHomeClient({
  tracks,
  totalModules,
  initialProgress,
  certificate,
  certificateStatus,
}: {
  tracks: Track[];
  totalModules: number;
  initialProgress: ProgressMap;
  certificate: { recipientName: string; issuedAt: string } | null;
  certificateStatus: CertificateStatus;
}) {
  const router = useRouter();
  const [progress] = useState<ProgressMap>(initialProgress);
  const [view, setView] = useState<View>({ kind: 'gate' });

  function open(href: string) {
    router.push(href);
  }

  const completedCount = tracks.reduce((n, t) => n + t.modules.filter(m => progress[m.id]).length, 0);

  function trackDone(t: Track) {
    return t.modules.length > 0 && t.modules.every(m => progress[m.id]);
  }
  function groupDone(group: GroupKey) {
    const groupTracks = tracks.filter(t => groupOf(t.id) === group);
    return groupTracks.length > 0 && groupTracks.every(trackDone);
  }
  const allDone = tracks.length > 0 && tracks.every(trackDone);

  const achievements: Achievement[] = [
    ...tracks.map(t => ({ id: t.id, label: `${t.eyebrow} Cleared`, earned: trackDone(t) })),
    { id: 'general-realm', label: 'General Realm Conquered', earned: groupDone('general') },
    { id: 'technical-realm', label: 'Technical Realm Conquered', earned: groupDone('technical') },
    {
      id: 'certified',
      label: 'Certified',
      earned: certificateStatus.earned,
      href: certificate ? '/certificate' : undefined,
    },
    { id: 'dungeon-master', label: 'Dungeon Master (100%)', earned: allDone },
  ];

  const selectedTrack = view.kind === 'path' ? (tracks.find(t => t.id === view.trackId) ?? null) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <AiLearningHeader rightExtra={view.kind !== 'gate' && <AchievementsMenu achievements={achievements} />} />

      {view.kind === 'gate' && (
        <DungeonGate
          totalModules={totalModules}
          completedCount={completedCount}
          onEnter={() => setView({ kind: 'regions' })}
        />
      )}

      {view.kind === 'regions' && (
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
            <div className="mb-8 flex flex-col gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                The Dungeon Map
              </p>
              <h1 className="text-2xl font-bold leading-tight text-[var(--text)]">Choose a realm</h1>
              <p className="text-sm text-[var(--muted)]">
                {completedCount} of {totalModules} islands cleared across all realms.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {tracks.map(track => (
                <RegionCard
                  key={track.id}
                  track={track}
                  icon={TRACK_ICON[track.id]}
                  completed={track.modules.filter(m => progress[m.id]).length}
                  onSelect={() => setView({ kind: 'path', trackId: track.id })}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      {view.kind === 'path' && selectedTrack && (
        <main className="flex-1">
          <div className="mx-auto max-w-lg px-6 py-10">
            <button
              onClick={() => setView({ kind: 'regions' })}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the map
            </button>

            <p
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: selectedTrack.accent }}
            >
              {selectedTrack.eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-[var(--text)]">{selectedTrack.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{selectedTrack.subtitle}</p>

            <div className="relative mt-10 flex flex-col gap-8 pb-4">
              <div
                aria-hidden
                className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, ${selectedTrack.accent}55 0 10px, transparent 10px 22px)`,
                }}
              />
              {selectedTrack.modules.map((m, i) => (
                <div key={m.id} className="relative z-10">
                  <IslandNode module={m} index={i} accent={selectedTrack.accent} done={!!progress[m.id]} onOpen={open} />
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
