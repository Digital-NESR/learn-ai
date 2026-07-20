'use client';

import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import type { Track } from '../../content';

/** One "region" marker on the dungeon map — one per track. */
export default function RegionCard({
  track,
  icon: Icon,
  completed,
  onSelect,
}: {
  track: Track;
  icon: LucideIcon;
  completed: number;
  onSelect: () => void;
}) {
  const total = track.modules.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cleared = total > 0 && completed >= total;

  return (
    <button
      onClick={onSelect}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        borderColor: `${track.accent}33`,
        background: `linear-gradient(160deg, ${track.accent}14, var(--card) 55%)`,
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl" style={{ background: `${track.accent}22` }} />

      <div className="flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: `${track.accent}20`, color: track.accent }}
        >
          <Icon className="h-6 w-6" />
        </div>
        {cleared && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: `${track.accent}22`, color: track.accent }}
          >
            Cleared
          </span>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: track.accent }}>
          {track.eyebrow}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-tight text-[var(--text)]">{track.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">{track.subtitle}</p>
      </div>

      <div className="mt-auto flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: track.accent }} />
        </div>
        <span className="shrink-0 text-[11px] font-bold text-[var(--muted)]">
          {completed}/{total}
        </span>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  );
}
