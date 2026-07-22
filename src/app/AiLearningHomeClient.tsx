'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, BookOpen, CheckCircle2, Circle, Home, Sparkles, Swords } from 'lucide-react';
import type { Track, TrackId } from './content';
import type { ProgressMap } from './actions/progress';
import type { CertificateStatus, RequirementBucket } from '@/lib/certificate';
import type { Leaderboards as LeaderboardsData } from './actions/leaderboards';
import { computeEarnedAchievements } from '@/lib/achievements';
import { ACHIEVEMENT_CERT_META, type CertTier } from '@/lib/achievement-certificates';
import AiLearningHeader from './components/AiLearningHeader';
import RealmGate from './components/dungeon/RealmGate';
import IslandNode from './components/dungeon/IslandNode';
import AchievementsMenu, { type Achievement } from './components/dungeon/AchievementsMenu';
import Leaderboards from './components/dashboard/Leaderboards';
import { certificateFontVars } from './certificate/fonts';

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

/* ─── Dungeon Gates hall (the 'regions' view) ───────────────────────────
   Reproduces "Realm Select.dc.html" from the shared Claude Design project -
   do not restyle without updating the design project too. ── */

const GATE_FAMILY_GLOW: Record<'general' | 'technical' | 'productivity', string> = {
  general: '#34d399',
  technical: '#f0705f',
  productivity: '#5aa2f5',
};
const GATE_TIER_ACCENT: Record<CertTier, string> = {
  bronze: '#E7B673',
  silver: '#CBD2DC',
  gold: '#EAD08A',
  realm: '#EAD08A',
  certified: '#EAD08A',
  master: '#EAD08A',
};
const GATE_TIER_DEPTH: Partial<Record<CertTier, string>> = { bronze: 'I', silver: 'II', gold: 'III' };
const GATE_TIER_LABEL: Partial<Record<TrackId, string>> = { productivity: 'Business Track' };

// Display order: general (I/II/III) + productivity, then technical (I/II/III) - matches the design.
const GATE_ORDER: TrackId[] = [
  'general-beginner',
  'general-intermediate',
  'general-advanced',
  'productivity',
  'technical-beginner',
  'technical-intermediate',
  'technical-advanced',
];

function gateFamily(id: TrackId): 'general' | 'technical' | 'productivity' {
  if (id.startsWith('general-')) return 'general';
  if (id.startsWith('technical-')) return 'technical';
  return 'productivity';
}

function gateTierLabel(t: Track): string {
  return GATE_TIER_LABEL[t.id] ?? t.eyebrow.split('·')[1]?.trim() ?? t.eyebrow;
}

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
  leaderboards,
}: {
  tracks: Track[];
  totalModules: number;
  initialProgress: ProgressMap;
  certificate: { recipientName: string; issuedAt: string } | null;
  certificateStatus: CertificateStatus;
  leaderboards: LeaderboardsData;
}) {
  const router = useRouter();
  const [progress] = useState<ProgressMap>(initialProgress);
  const [view, setView] = useState<View>({ kind: 'dashboard' });

  function open(href: string) {
    router.push(href);
  }

  // Single source of truth shared with the server-side awarding logic in
  // recordModuleResult (src/app/actions/progress.ts) — see src/lib/achievements.ts.
  const completedIds = new Set(Object.keys(progress));
  const achievements: Achievement[] = computeEarnedAchievements(tracks, completedIds, certificateStatus.earned).map(
    a => ({ ...a, href: a.earned ? `/certificate/${a.id}` : undefined }),
  );

  const selectedTrack = view.kind === 'path' ? (tracks.find(t => t.id === view.trackId) ?? null) : null;

  const gateTracks = GATE_ORDER.map(id => tracks.find(t => t.id === id)).filter((t): t is Track => !!t);
  const clearedRealms = gateTracks.filter(t => t.modules.length > 0 && t.modules.every(m => progress[m.id])).length;

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
      {view.kind !== 'dashboard' && <AchievementsMenu achievements={achievements} />}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AiLearningHeader rightExtra={headerRight} />

      {view.kind === 'dashboard' && (
        <>
        {/* ── Hero (always-dark animated banner) ── */}
        <section className="relative overflow-hidden bg-[#070b09] text-white">
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

        <main className="flex-1">
          <Leaderboards data={leaderboards} />
        </main>
        </>
      )}

      {view.kind === 'regions' && (
        <main className="flex-1">
          <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
            <div
              className={`${certificateFontVars} relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10`}
                style={{
                  background:
                    'radial-gradient(125% 85% at 50% -8%, #3a3841 0%, #211f27 42%, #131218 72%, #0b0a0e 100%)',
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 30px,rgba(0,0,0,.22) 30px 32px),repeating-linear-gradient(90deg,transparent 0 72px,rgba(0,0,0,.24) 72px 74px)',
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'radial-gradient(65% 42% at 50% 0%, rgba(234,208,138,.10), transparent 70%)',
                  }}
                />

                <div className="relative flex flex-col items-center text-center">
                  <p
                    className="text-[13px] tracking-[.42em] text-[#C9A24B]"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    NESR AI VERSE
                  </p>
                  <h1
                    className="mt-2 text-3xl font-bold tracking-wide text-[#F4F1EA] sm:text-4xl"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    The Dungeon Gates
                  </h1>
                  <p
                    className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#B4AC9C]"
                    style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
                  >
                    Seven realms of learning stand open, and the Trophy Room lies beyond. Step through whichever
                    gate you please — no set path, no locked doors.
                  </p>

                  <div className="mt-6 flex items-center gap-3.5 rounded-full border border-[#C9A24B4d] bg-white/[0.04] px-5 py-2 backdrop-blur">
                    <span
                      className="text-[11px] tracking-[.18em] text-[#C9A24B]"
                      style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      REALMS CLEARED
                    </span>
                    <span className="h-4 w-px bg-[#C9A24B66]" />
                    <span className="text-lg text-[#F4F1EA]" style={{ fontFamily: 'var(--font-cormorant-garamond), serif' }}>
                      <b className="text-[#EAD08A]">{clearedRealms}</b> / {gateTracks.length}
                    </span>
                  </div>
                </div>

                <div className="relative mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                  {gateTracks.map(track => {
                    const tier = ACHIEVEMENT_CERT_META[track.id].tier;
                    const completed = track.modules.filter(m => progress[m.id]).length;
                    return (
                      <RealmGate
                        key={track.id}
                        trackLabel={gateFamily(track.id).toUpperCase()}
                        title={track.title}
                        tierLabel={gateTierLabel(track)}
                        glow={GATE_FAMILY_GLOW[gateFamily(track.id)]}
                        accent={GATE_TIER_ACCENT[tier]}
                        depth={GATE_TIER_DEPTH[tier]}
                        progressLabel={`${completed} / ${track.modules.length}`}
                        cta="ENTER"
                        onSelect={() => setView({ kind: 'path', trackId: track.id })}
                      />
                    );
                  })}
                  <RealmGate
                    trackLabel="YOUR HONOURS"
                    title="Trophy Room"
                    tierLabel="Every certificate earned"
                    glow="#EAD08A"
                    accent="#EAD08A"
                    cta="OPEN"
                    isTrophy
                    onSelect={() => open('/certificate')}
                  />
                </div>
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
