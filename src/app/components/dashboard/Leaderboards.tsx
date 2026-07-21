'use client';

import { useSession } from 'next-auth/react';
import { PlayCircle, TrendingUp, Trophy } from 'lucide-react';
import type { Leaderboards as LeaderboardsData, LeaderboardEntry } from '../../actions/leaderboards';

function Board({
  title,
  sub,
  icon: Icon,
  accent,
  entries,
  currentEmail,
}: {
  title: string;
  sub: string;
  icon: typeof Trophy;
  accent: string;
  entries: LeaderboardEntry[];
  currentEmail?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
          <p className="text-[11px] text-[var(--muted)]">{sub}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--muted)]">No one yet — be the first.</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-1">
          {entries.map((e, i) => {
            const isMe = e.email === currentEmail;
            return (
              <li
                key={e.email}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm"
                style={isMe ? { background: `${accent}14` } : undefined}
              >
                <span
                  className="w-5 shrink-0 text-center text-[11px] font-bold"
                  style={{ color: i < 3 ? accent : 'var(--muted)' }}
                >
                  {i + 1}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-[var(--text)] ${isMe ? 'font-semibold' : ''}`}
                >
                  {e.name}
                  {isMe && ' (you)'}
                </span>
                <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>
                  {e.count}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default function Leaderboards({ data }: { data: LeaderboardsData }) {
  const { data: session } = useSession();
  const currentEmail = session?.user?.email?.toLowerCase();

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">Company-wide</p>
        <h2 className="text-xl font-bold leading-tight text-[var(--text)]">Rankings</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Board
          title="Most Completed"
          sub="total parts finished"
          icon={PlayCircle}
          accent="#2563eb"
          entries={data.mostCompleted}
          currentEmail={currentEmail}
        />
        <Board
          title="Recent Risers"
          sub="parts finished this week"
          icon={TrendingUp}
          accent="#45c07a"
          entries={data.recentRisers}
          currentEmail={currentEmail}
        />
        <Board
          title="Most Accomplished"
          sub="certificates earned"
          icon={Trophy}
          accent="#B8912E"
          entries={data.mostAccomplished}
          currentEmail={currentEmail}
        />
      </div>
    </section>
  );
}
