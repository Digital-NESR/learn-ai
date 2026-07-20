'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Circle } from 'lucide-react';

export interface Achievement {
  id: string;
  label: string;
  earned: boolean;
  /** Only followed when earned (e.g. the certificate link). */
  href?: string;
}

export default function AchievementsMenu({ achievements }: { achievements: Achievement[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const earnedCount = achievements.filter(a => a.earned).length;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Achievements"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--card-2)]"
      >
        <Trophy className="h-4 w-4 text-amber-500" />
        {earnedCount}/{achievements.length}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
          <p className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Achievements — {earnedCount} of {achievements.length}
          </p>
          <ul className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto">
            {achievements.map(a => {
              const rowClasses = `flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm ${
                a.earned ? 'text-[var(--text)]' : 'text-[var(--muted)]'
              }`;
              const content = (
                <>
                  {a.earned ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--success)' }} />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  )}
                  <span className={a.earned ? 'font-medium' : ''}>{a.label}</span>
                </>
              );
              return (
                <li key={a.id}>
                  {a.href && a.earned ? (
                    <Link href={a.href} className={`${rowClasses} hover:bg-[var(--card-2)]`}>
                      {content}
                    </Link>
                  ) : (
                    <div className={rowClasses}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
