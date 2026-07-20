'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Circle, X } from 'lucide-react';

export interface Achievement {
  id: string;
  label: string;
  earned: boolean;
  /** Only followed when earned (e.g. the certificate link). */
  href?: string;
}

/** A right-docked achievements sidebar (not a small dropdown) — trigger stays
 * a header button, but the panel itself is a full-height slide-in drawer. */
export default function AchievementsMenu({ achievements }: { achievements: Achievement[] }) {
  const [open, setOpen] = useState(false);
  const earnedCount = achievements.filter(a => a.earned).length;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

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
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Achievements</h2>
              <p className="text-xs text-[var(--muted)]">{earnedCount} of {achievements.length} earned</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--card-2)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

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
                  <Link href={a.href} onClick={() => setOpen(false)} className={`${rowClasses} hover:bg-[var(--card-2)]`}>
                    {content}
                  </Link>
                ) : (
                  <div className={rowClasses}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
