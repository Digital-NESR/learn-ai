'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Trophy, CheckCircle2, Circle, X } from 'lucide-react';

export interface Achievement {
  id: string;
  label: string;
  earned: boolean;
  /** Only followed when earned (e.g. the certificate link). */
  href?: string;
}

// Detects "are we past hydration, on the client" without a setState-in-effect
// (which react-hooks/set-state-in-effect flags) - the store never changes
// after mount, so subscribe is a no-op; snapshots just differ server vs client.
function subscribeNever() {
  return () => {};
}

/** "X of Y done" plus a filled bar — the at-a-glance progress tracker. */
function AchievementsProgress({ earned, total }: { earned: number; total: number }) {
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-[var(--text)]">Achievements</h2>
        <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
          {earned} of {total} done
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AchievementRows({ achievements, onNavigate }: { achievements: Achievement[]; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {achievements.map(a => {
        const rowClasses = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
          a.earned ? 'text-[var(--text)]' : 'text-[var(--muted)]'
        }`;
        const content = (
          <>
            {a.earned ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: 'var(--success)' }} />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-[var(--muted)]" />
            )}
            <span className={a.earned ? 'font-medium' : ''}>{a.label}</span>
          </>
        );
        return (
          <li key={a.id}>
            {a.href && a.earned ? (
              <Link href={a.href} onClick={onNavigate} className={`${rowClasses} hover:bg-[var(--card-2)]`}>
                {content}
              </Link>
            ) : (
              <div className={rowClasses}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "pinned" - a normal, always-visible in-flow sidebar (used on the dungeon's
 * region-select page, so progress is visible without an extra click).
 * "drawer" (default) - a header trigger that slides in a full-height panel,
 * used on the gate/path pages where screen space is tighter.
 */
export default function AchievementsMenu({
  achievements,
  variant = 'drawer',
}: {
  achievements: Achievement[];
  variant?: 'drawer' | 'pinned';
}) {
  const [open, setOpen] = useState(false);
  // The drawer/backdrop are portaled to <body> (see below) - an ancestor with
  // backdrop-filter/transform (the sticky header's backdrop-blur, in this
  // case) makes `position: fixed` descendants position relative to *it*
  // instead of the viewport, which otherwise squashes the drawer into the
  // header's own 64px strip. Portals need a real DOM node, so only render
  // once mounted client-side (server snapshot false, client snapshot true).
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const earnedCount = achievements.filter(a => a.earned).length;

  useEffect(() => {
    if (variant !== 'drawer' || !open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [variant, open]);

  if (variant === 'pinned') {
    return (
      <aside className="flex h-fit flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <Trophy className="h-5 w-5 shrink-0 text-amber-500" />
          <AchievementsProgress earned={earnedCount} total={achievements.length} />
        </div>
        <AchievementRows achievements={achievements} />
      </aside>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Achievements"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--card-2)]"
      >
        <Trophy className="h-4 w-4 text-amber-500" />
        {earnedCount}/{achievements.length}
      </button>

      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              aria-hidden={!open}
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
                open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            {/* Sidebar */}
            <aside
              role="dialog"
              aria-label="Achievements"
              className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl transition-transform duration-300 ease-out ${
                open ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                <Trophy className="h-5 w-5 shrink-0 text-amber-500" />
                <AchievementsProgress earned={earnedCount} total={achievements.length} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--card-2)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <AchievementRows achievements={achievements} onNavigate={() => setOpen(false)} />
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}
