'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Briefcase,
  Blocks,
  Cpu,
  Wand2,
  MessageCircle,
  Award,
} from 'lucide-react';
import type { Track, TrackId } from './content';
import type { ProgressMap } from './actions/progress';
import AiLearningHeader from './components/AiLearningHeader';

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

/* ─── Circular progress ring ─────────────────────────────────────────── */

function ProgressRing({ percent, accent }: { percent: number; accent: string }) {
  const size = 44;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color: accent }}
      >
        {percent}%
      </span>
    </div>
  );
}

/* ─── Icons per tab ──────────────────────────────────────────────────── */

const TRACK_ICON: Record<TrackId, typeof Briefcase> = {
  business: Briefcase,
  'create-ai': Blocks,
  advanced: Cpu,
  'use-ai': Wand2,
};

const ASSISTANT_ACCENT = '#7c3aed';
const ASSISTANT_PROMPTS = ['What is a token?', 'Explain RAG simply', 'Prompting tips'];

/* ─── Module row (inside the active tab panel) ────────────────────────── */

function ModuleRow({
  href,
  part,
  title,
  tagline,
  minutes,
  accent,
  result,
  onOpen,
}: {
  href: string;
  part: number;
  title: string;
  tagline: string;
  minutes: number;
  accent: string;
  result?: { score: number; total: number };
  onOpen: (href: string) => void;
}) {
  const done = !!result;
  // Computed from `accent` (low-alpha hex) so it reads correctly in both themes.
  const pill = `${accent}26`;
  return (
    <button
      onClick={() => onOpen(href)}
      className="group/row flex w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
        style={{ background: pill, color: accent }}
      >
        {part}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[15px] font-semibold text-[var(--text)]">{title}</h4>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-[var(--muted)]">{tagline}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {done ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: pill, color: accent }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {result!.score}/{result!.total}
          </span>
        ) : (
          <span className="hidden items-center gap-1 text-[11px] font-medium text-[var(--muted)] sm:inline-flex">
            <Clock className="h-3.5 w-3.5" />
            {minutes} min
          </span>
        )}
        <ArrowRight
          className="h-4 w-4 text-[var(--muted)] transition-transform group-hover/row:translate-x-0.5"
          style={{ color: done ? accent : undefined }}
        />
      </div>
    </button>
  );
}

/* ─── Track panel (content shown when a course tab is active) ────────── */

function TrackPanel({
  track,
  progress,
  onOpen,
}: {
  track: Track;
  progress: ProgressMap;
  onOpen: (href: string) => void;
}) {
  const completed = track.modules.filter(m => progress[m.id]).length;
  const total = track.modules.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: track.accent }}>
            {track.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[var(--text)]">{track.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{track.subtitle}</p>
        </div>
        <ProgressRing percent={pct} accent={track.accent} />
      </div>

      <p className="mt-4 text-[11px] font-medium text-[var(--muted)]">
        {completed} of {total} parts complete
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {track.modules.map(m => (
          <ModuleRow
            key={m.id}
            href={`/${m.id}`}
            part={m.part}
            title={m.title}
            tagline={m.tagline}
            minutes={m.minutes}
            accent={track.accent}
            result={progress[m.id]}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Assistant panel ─────────────────────────────────────────────────── */

function AssistantPanel() {
  function openChat(prompt?: string) {
    window.dispatchEvent(new CustomEvent('aiverse:open-chat', { detail: { prompt } }));
  }

  return (
    <div className="animate-fade-up">
      <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: ASSISTANT_ACCENT }}>
        AI Assistant
      </p>
      <h2 className="mt-1 text-2xl font-bold leading-tight text-[var(--text)]">AI Verse Assistant</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Stuck on a concept? Ask anything about AI or the courses and get a clear, plain-English answer — available 24/7.
      </p>

      <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">Try asking</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ASSISTANT_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => openChat(p)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[13px] text-[var(--text)] transition-colors hover:bg-[var(--card-2)]"
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => openChat()}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          style={{ background: ASSISTANT_ACCENT }}
        >
          <Sparkles className="h-4 w-4" />
          Open assistant
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AiLearningHomeClient({
  tracks,
  totalModules,
  initialProgress,
  certificate,
}: {
  tracks: Track[];
  totalModules: number;
  initialProgress: ProgressMap;
  certificate: { recipientName: string; issuedAt: string } | null;
}) {
  const router = useRouter();
  const [progress] = useState<ProgressMap>(initialProgress);
  const [activeId, setActiveId] = useState<TrackId | 'assistant'>(tracks[0].id);

  // Count against the current tracks/modules only, so progress rows left
  // over from a since-deleted module don't inflate this past totalModules.
  const completedCount = tracks.reduce(
    (n, t) => n + t.modules.filter(m => progress[m.id]).length,
    0,
  );

  function open(href: string) {
    router.push(href);
  }

  const activeTrack = activeId === 'assistant' ? null : tracks.find(t => t.id === activeId);
  const activeAccent = activeTrack ? activeTrack.accent : ASSISTANT_ACCENT;
  // Computed from `activeAccent` (low-alpha hex) rather than a static
  // per-theme color, so the panel wash reads correctly in both light and
  // dark mode instead of a fixed pastel that's blinding on a dark background.
  const activeAccentSoft = `${activeAccent}14`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AiLearningHeader />

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

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8 pt-16 pb-16">
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
            Four beginner tracks, three short parts each. Watch the videos, then take a quick quiz
            after every part to check what stuck.
          </p>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              <BookOpen className="h-4 w-4" />
              {totalModules} parts · {totalModules} quizzes
            </span>
            {completedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#45c07a]/20 px-3 py-1 text-sm font-medium text-[#7ee3a8]">
                <CheckCircle2 className="h-4 w-4" />
                {completedCount} of {totalModules} completed
              </span>
            )}
            {certificate && (
              <Link
                href="/certificate"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-sm font-medium text-amber-200 hover:bg-amber-400/30 transition-colors"
              >
                <Award className="h-4 w-4" />
                View your certificate
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Tabs: sidebar + panel ── */}
      <main className="w-full flex-1">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar tabs */}
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:overflow-visible lg:pb-0">
              {tracks.map(track => {
                const Icon = TRACK_ICON[track.id];
                const isActive = activeId === track.id;
                const completed = track.modules.filter(m => progress[m.id]).length;
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveId(track.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors lg:w-full ${
                      isActive ? '' : 'text-[var(--muted)] hover:bg-[var(--card-2)]'
                    }`}
                    style={isActive ? { background: `${track.accent}26`, color: track.accent } : undefined}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isActive ? 'var(--card)' : 'var(--card-2)',
                        color: isActive ? track.accent : 'var(--muted)',
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block whitespace-nowrap lg:whitespace-normal">{track.eyebrow.replace(' Track', '')}</span>
                    </span>
                    <span
                      className="hidden shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold lg:inline-block"
                      style={{
                        background: isActive ? track.accent : 'var(--border)',
                        color: isActive ? '#fff' : 'var(--muted)',
                      }}
                    >
                      {completed}/{track.modules.length}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setActiveId('assistant')}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors lg:w-full ${
                  activeId === 'assistant' ? '' : 'text-[var(--muted)] hover:bg-[var(--card-2)]'
                }`}
                style={activeId === 'assistant' ? { background: `${ASSISTANT_ACCENT}26`, color: ASSISTANT_ACCENT } : undefined}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: activeId === 'assistant' ? 'var(--card)' : 'var(--card-2)',
                    color: activeId === 'assistant' ? ASSISTANT_ACCENT : 'var(--muted)',
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span className="whitespace-nowrap lg:whitespace-normal">AI Assistant</span>
              </button>
            </nav>

            {/* Active panel */}
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', background: `linear-gradient(135deg, ${activeAccentSoft}, var(--card) 60%)` }}
            >
              {activeId === 'assistant' ? (
                <AssistantPanel />
              ) : activeTrack ? (
                <TrackPanel track={activeTrack} progress={progress} onOpen={open} />
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
