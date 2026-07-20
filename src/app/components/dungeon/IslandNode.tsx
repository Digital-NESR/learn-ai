'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import type { Module, ModuleRequirement } from '../../content';

const REQUIREMENT_META: Record<ModuleRequirement, { label: string; color: string }> = {
  required: { label: 'Required', color: '#e11d48' },
  half: { label: 'Important', color: '#b45309' },
  optional: { label: 'Specialized', color: '#64748b' },
};

/** A small hand-drawn island platform sitting behind the badge — flat fills
 * only (no gradients/ids), since many of these render on one page and inline
 * SVG <defs> ids aren't reliably scoped per-element across browsers. */
function IslandBase({ grass }: { grass: string }) {
  return (
    <svg viewBox="0 0 64 40" className="absolute -bottom-3 left-1/2 h-9 w-20 -translate-x-1/2" aria-hidden>
      <ellipse cx="32" cy="35" rx="24" ry="3.5" fill="#000" opacity="0.2" />
      <path
        d="M6 22 C4 12 17 4 28 7 C35 0 50 1 55 9 C63 9 60 21 51 24 C45 31 32 32 21 29 C11 28 7 26 6 22 Z"
        fill="#6b4f37"
      />
      <circle cx="16" cy="21" r="1.6" fill="#5a4029" />
      <circle cx="47" cy="20" r="2" fill="#5a4029" />
      <path
        d="M9 18 C10 10 21 5 28 7 C34 2 45 3 50 8 C43 6 36 7 31 11 C24 7 15 11 11 17 C10 17.5 9.5 17.5 9 18 Z"
        fill={grass}
      />
    </svg>
  );
}

/** One stop on a track's island path. Free-roam — always clickable, no lock
 * state — the alternating left/right offset is purely decorative "snake
 * path" flavor around a shared vertical rope rendered by the parent. */
export default function IslandNode({
  module,
  index,
  accent,
  done,
  onOpen,
}: {
  module: Module;
  index: number;
  accent: string;
  done: boolean;
  onOpen: (href: string) => void;
}) {
  const side = index % 2 === 0 ? -1 : 1;
  const req = REQUIREMENT_META[module.requirement];

  return (
    <div className="relative flex" style={{ justifyContent: side < 0 ? 'flex-start' : 'flex-end' }}>
      <button
        onClick={() => onOpen(`/${module.id}`)}
        className="group/island flex w-[min(78vw,320px)] items-center gap-3.5 rounded-2xl border bg-[var(--card)] p-3.5 pt-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        style={{
          borderColor: done ? `${accent}55` : 'var(--border)',
          transform: `translateX(${side * 22}px)`,
        }}
      >
        <div className="relative h-12 w-12 shrink-0">
          <IslandBase grass={done ? accent : '#4b6b4f'} />
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: done ? accent : `${accent}1f`,
              color: done ? '#fff' : accent,
              boxShadow: done ? `0 0 0 4px ${accent}26` : 'none',
            }}
          >
            {done ? <CheckCircle2 className="h-6 w-6" /> : module.part}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate text-[14px] font-semibold text-[var(--text)]">{module.title}</h4>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--muted)]">{module.tagline}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ background: `${req.color}1f`, color: req.color }}
            >
              {req.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--muted)]">
              <Clock className="h-3 w-3" />
              {module.minutes} min
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
