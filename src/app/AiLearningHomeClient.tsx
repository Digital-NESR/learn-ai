'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Sparkles, Cpu, Briefcase, MessageCircle } from 'lucide-react';
import type { Track } from './content';
import { readProgress, type ProgressMap } from './progress';
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
  const size = 56;
  const stroke = 5;
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
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color: accent }}
      >
        {percent}%
      </span>
    </div>
  );
}

/* ─── Module row ─────────────────────────────────────────────────────── */

function ModuleRow({
  href,
  part,
  title,
  tagline,
  minutes,
  accent,
  accentSoft,
  result,
  onOpen,
}: {
  href: string;
  part: number;
  title: string;
  tagline: string;
  minutes: number;
  accent: string;
  accentSoft: string;
  result?: { score: number; total: number };
  onOpen: (href: string) => void;
}) {
  const done = !!result;
  return (
    <button
      onClick={() => onOpen(href)}
      className="group/row flex w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
        style={{ background: accentSoft, color: accent }}
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
            style={{ background: accentSoft, color: accent }}
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

/* ─── Track card ─────────────────────────────────────────────────────── */

function TrackCard({
  track,
  progress,
  index,
  onOpen,
}: {
  track: Track;
  progress: ProgressMap;
  index: number;
  onOpen: (href: string) => void;
}) {
  const completed = track.modules.filter(m => progress[m.id]).length;
  const total = track.modules.length;
  const pct = Math.round((completed / total) * 100);
  const Icon = track.id === 'technical' ? Cpu : Briefcase;

  return (
    <div className="group relative animate-fade-up" style={{ animationDelay: `${index * 120}ms` }}>
      {/* gradient glow that fades in on hover */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl opacity-0 blur transition duration-300 group-hover:opacity-70"
        style={{ background: `linear-gradient(135deg, ${track.accent}, transparent 65%)` }}
      />

      <section className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-transform duration-300 group-hover:-translate-y-1.5">
        {/* Header */}
        <div
          className="border-b border-[var(--border)] p-6"
          style={{ background: `linear-gradient(135deg, ${track.accent}14, transparent 70%)` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--card)', color: track.accent, border: `1px solid ${track.accent}33` }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: track.accent }}>
                {track.eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold leading-tight text-[var(--text)]">{track.title}</h2>
            </div>
            <ProgressRing percent={pct} accent={track.accent} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{track.subtitle}</p>
          <p className="mt-3 text-[11px] font-medium text-[var(--muted)]">
            {completed} of {total} parts complete
          </p>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-3 p-4">
          {track.modules.map(m => (
            <ModuleRow
              key={m.id}
              href={`/${m.id}`}
              part={m.part}
              title={m.title}
              tagline={m.tagline}
              minutes={m.minutes}
              accent={track.accent}
              accentSoft={track.accentSoft}
              result={progress[m.id]}
              onOpen={onOpen}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── AI Assistant card (opens the chat widget) ──────────────────────── */

function ChatCard({ index }: { index: number }) {
  const accent = '#7c3aed';
  const prompts = ['What is a token?', 'Explain RAG simply', 'Prompting tips'];

  function openChat(prompt?: string) {
    window.dispatchEvent(new CustomEvent('aiverse:open-chat', { detail: { prompt } }));
  }

  return (
    <div className="group relative animate-fade-up" style={{ animationDelay: `${index * 120}ms` }}>
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl opacity-0 blur transition duration-300 group-hover:opacity-70"
        style={{ background: `linear-gradient(135deg, ${accent}, transparent 65%)` }}
      />

      <section className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-transform duration-300 group-hover:-translate-y-1.5">
        <div
          className="border-b border-[var(--border)] p-6"
          style={{ background: `linear-gradient(135deg, ${accent}14, transparent 70%)` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--card)', color: accent, border: `1px solid ${accent}33` }}
            >
              <MessageCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
                AI Assistant
              </p>
              <h2 className="mt-1 text-xl font-bold leading-tight text-[var(--text)]">AIverse Assistant</h2>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: `${accent}1a`, color: accent }}
            >
              24/7
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Stuck on a concept? Ask anything about AI or the courses and get a clear, plain-English answer.
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {prompts.map(p => (
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
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
            style={{ background: accent }}
          >
            <Sparkles className="h-4 w-4" />
            Open assistant
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AiLearningHomeClient({
  tracks,
  totalModules,
}: {
  tracks: Track[];
  totalModules: number;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const completedCount = Object.keys(progress).length;

  function open(href: string) {
    router.push(href);
  }

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
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#a7f3c6]">NESR AIverse</span>
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
            Two beginner tracks, three short parts each. Watch the videos, then take a quick quiz
            after every part to check what stuck.
          </p>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              <BookOpen className="h-4 w-4" />
              {totalModules} parts · 6 quizzes
            </span>
            {completedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#45c07a]/20 px-3 py-1 text-sm font-medium text-[#7ee3a8]">
                <CheckCircle2 className="h-4 w-4" />
                {completedCount} of {totalModules} completed
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <main className="w-full flex-1">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-10">
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} progress={progress} index={i} onOpen={open} />
            ))}
            <ChatCard index={tracks.length} />
          </div>
        </div>
      </main>
    </div>
  );
}
