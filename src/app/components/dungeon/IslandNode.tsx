'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import type { Module, ModuleRequirement } from '../../content';

const REQUIREMENT_META: Record<ModuleRequirement, { label: string; color: string }> = {
  required: { label: 'Required', color: '#e11d48' },
  half: { label: 'Important', color: '#b45309' },
  optional: { label: 'Specialized', color: '#64748b' },
};

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
        className="group/island flex w-[min(78vw,320px)] items-center gap-3.5 rounded-2xl border bg-[var(--card)] p-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        style={{
          borderColor: done ? `${accent}55` : 'var(--border)',
          transform: `translateX(${side * 22}px)`,
        }}
      >
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: done ? accent : `${accent}1f`,
            color: done ? '#fff' : accent,
            boxShadow: done ? `0 0 0 4px ${accent}26` : 'none',
          }}
        >
          {done ? <CheckCircle2 className="h-6 w-6" /> : module.part}
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
