'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Cpu,
  FlaskConical,
  Home,
  Layers,
  Network,
  Rocket,
  Sparkles,
  Swords,
  Wand2,
} from 'lucide-react';
import type { Track, TrackId } from './content';
import type { ProgressMap } from './actions/progress';
import type { CertificateStatus, RequirementBucket } from '@/lib/certificate';
import { computeEarnedAchievements } from '@/lib/achievements';
import AiLearningHeader from './components/AiLearningHeader';
import RegionCard from './components/dungeon/RegionCard';
import IslandNode from './components/dungeon/IslandNode';
import AchievementsMenu, { type Achievement } from './components/dungeon/AchievementsMenu';

/* ─── Animated neural-network hero overlay ───────────────────────────── */

const NODES = [
  [8, 30], [8, 66], [24, 18], [24, 48], [24, 80], [44, 32], [44, 64],
  [62, 22], [62, 52], [62, 82], [80, 38], [80, 70], [94, 30], [94, 60],
] as const;
const EDGES = [
  [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6],
  [5, 7], [5, 8], [6, 8], [6, 9], [7, 10], [8, 10], [8, 11], [9, 11],
  [10, 12], [10, 13], [11, 13],
] as const;

function NeuralNet() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 animate-floaty">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="#5eead4" strokeWidth="0.15" opacity="0.5">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              className="animate-dash-flow"
              style={{ animationDelay: `${(i % 6) * -3}s` }}
            />
          ))}
        </g>
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 0.9 : 0.6}
            fill={i % 4 === 0 ? '#7ee3a8' : '#8ab4ff'}
            className="animate-twinkle"
            style={{ animationDelay: `${(i % 5) * 0.6}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Icons per track ──────────────────────────────────────────────────── */

const TRACK_ICON: Record<TrackId, typeof BookOpen> = {
  'general-beginner': BookOpen,
  'general-intermediate': Layers,
  'general-advanced': Rocket,
  'technical-beginner': Cpu,
  'technical-intermediate': Network,
  'technical-advanced': FlaskConical,
  productivity: Wand2,
};

/* ─── Certificate requirement chip (hero progress readout) ─────────────── */

function RequirementChip({ label, bucket }: { label: string; bucket: RequirementBucket }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
        bucket.met ? 'bg-[#45c07a]/20 text-[#7ee3a8]' : 'bg-white/10 text-white/70'
      }`}
      title={`${label}: ${bucket.done} of ${bucket.total} done, ${bucket.needed} needed for the certificate`}
    >
      {bucket.met ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {label} {bucket.done}/{bucket.needed}
    </span>
  );
}

/* ─── Dungeon view state ─────────────────────────────────────────────────
   The dashboard is just the hero now — its one job is to hand you straight
   into the dungeon (Regions -> Path), which is where every module lives.
   Every dungeon screen can get back to it via the header's Home button. ── */

type View = { kind: 'dashboard' } | { kind: 'regions' } | { kind: 'path'; trackId: TrackId };

/* ─── Page ───────────────────────────────────────────────────────────── */

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
  const [view, setView] = useState<View>({ kind: 'dashboard' });

  function open(href: string) {
    router.push(href);
  }

  const completedCount = tracks.reduce((n, t) => n + t.modules.filter(m => progress[m.id]).length, 0);

  // Single source of truth shared with the server-side awarding logic in
  // recordModuleResult (src/app/actions/progress.ts) — see src/lib/achievements.ts.
  const completedIds = new Set(Object.keys(progress));
  const achievements: Achievement[] = computeEarnedAchievements(tracks, completedIds, certificateStatus.earned).map(
    a => ({ ...a, href: a.earned ? `/certificate/${a.id}` : undefined }),
  );

  const selectedTrack = view.kind === 'path' ? (tracks.find(t => t.id === view.trackId) ?? null) : null;

  const headerRight = (
    <div className="flex items-center gap-2">
      {view.kind !== 'dashboard' && (
        <button
          onClick={() => setView({ kind: 'dashboard' })}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--card-2)]"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </button>
      )}
      {view.kind !== 'dashboard' && view.kind !== 'regions' && <AchievementsMenu achievements={achievements} />}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AiLearningHeader rightExtra={headerRight} />

      {view.kind === 'dashboard' && (
        /* ── Hero (always-dark animated banner) — the whole dashboard now ── */
        <section className="relative flex-1 overflow-hidden bg-[#070b09] text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#307c4c]/40 blur-3xl animate-aurora" />
            <div
              className="absolute -right-16 top-8 h-80 w-80 rounded-full bg-[#2563eb]/25 blur-3xl animate-aurora"
              style={{ animationDuration: '26s' }}
            />
            <div
              className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#45c07a]/25 blur-3xl animate-aurora"
              style={{ animationDuration: '32s' }}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 70% 25%, black, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 70% 25%, black, transparent 75%)',
            }}
          />
          <NeuralNet />

          <div className="relative mx-auto max-w-5xl px-6 lg:px-8 pt-16 pb-20">
            <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#7ee3a8]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#a7f3c6]">NESR AI Verse</span>
            </div>

            <h1
              className="animate-fade-up text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
              style={{ animationDelay: '80ms' }}
            >
              <span className="text-gradient">Learn AI</span> — for business
              <br className="hidden sm:block" /> and for building.
            </h1>

            <p
              className="animate-fade-up mt-4 max-w-2xl text-lg leading-relaxed text-white/70"
              style={{ animationDelay: '160ms' }}
            >
              General, Technical, and Productivity tracks — short videos with a quick, timed quiz
              after every one to check what stuck.
            </p>

            <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-2" style={{ animationDelay: '240ms' }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                <BookOpen className="h-4 w-4" />
                {totalModules} parts · {totalModules} quizzes
              </span>
              {certificate ? (
                <Link
                  href="/certificate"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-sm font-medium text-amber-200 hover:bg-amber-400/30 transition-colors"
                >
                  <Award className="h-4 w-4" />
                  View your certificate
                </Link>
              ) : (
                <>
                  <RequirementChip label="Required" bucket={certificateStatus.required} />
                  <RequirementChip label="Important" bucket={certificateStatus.half} />
                  <RequirementChip label="Specialized" bucket={certificateStatus.optional} />
                </>
              )}
            </div>
            {!certificate && (
              <p className="animate-fade-up mt-3 max-w-2xl text-xs text-white/50" style={{ animationDelay: '280ms' }}>
                Certificate rule: every Required part, at least half of Important, and{' '}
                {certificateStatus.optional.needed} of Specialized — pick whichever ones interest you.
              </p>
            )}

            <button
              onClick={() => setView({ kind: 'regions' })}
              className="animate-fade-up group mt-9 inline-flex items-center gap-2.5 rounded-full bg-[#45c07a] px-7 py-3.5 text-base font-semibold text-[#08160f] shadow-[0_0_30px_rgba(69,192,122,0.4)] transition-transform hover:scale-[1.03] hover:bg-[#5ed492] active:scale-95"
              style={{ animationDelay: '340ms' }}
            >
              <Swords className="h-5 w-5" />
              Enter the Dungeon
            </button>
          </div>
        </section>
      )}

      {view.kind === 'regions' && (
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
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

              {/* Always visible here — this is the dungeon's main/landing page,
                  so progress toward every achievement should be in view without
                  an extra click. */}
              <AchievementsMenu achievements={achievements} variant="pinned" />
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
