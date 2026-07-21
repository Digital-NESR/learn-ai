'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import aiversePool from '@/lib/db-aiverse';

export interface LeaderboardEntry {
  name: string;
  email: string;
  count: number;
}

export interface Leaderboards {
  mostCompleted: LeaderboardEntry[];
  recentRisers: LeaderboardEntry[];
  mostAccomplished: LeaderboardEntry[];
}

const LIMIT = 10;

function toEntries(rows: { name: string; email: string; cnt: number }[]): LeaderboardEntry[] {
  return rows.map(r => ({ name: r.name, email: r.email, count: r.cnt }));
}

/** Company-wide rankings by name — signed-in users only, top 10 per board. */
export async function getLeaderboards(): Promise<Leaderboards> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { mostCompleted: [], recentRisers: [], mostAccomplished: [] };
  }

  const [mostCompleted, recentRisers, mostAccomplished] = await Promise.all([
    aiversePool.query(
      `select u.name, u.email, count(*)::int as cnt
       from module_progress mp
       join users u on u.email = mp.user_email
       group by u.email, u.name
       order by cnt desc, u.name asc
       limit $1`,
      [LIMIT],
    ),
    // "Risers" = modules whose most recent completion falls in the last 7
    // days. Retaking an old quiz bumps completed_at, so this is a proxy for
    // recent activity rather than a strict first-completion log.
    aiversePool.query(
      `select u.name, u.email, count(*)::int as cnt
       from module_progress mp
       join users u on u.email = mp.user_email
       where mp.completed_at >= now() - interval '7 days'
       group by u.email, u.name
       order by cnt desc, u.name asc
       limit $1`,
      [LIMIT],
    ),
    aiversePool.query(
      `select u.name, u.email, count(*)::int as cnt
       from achievement_certificates ac
       join users u on u.email = ac.user_email
       group by u.email, u.name
       order by cnt desc, u.name asc
       limit $1`,
      [LIMIT],
    ),
  ]);

  return {
    mostCompleted: toEntries(mostCompleted.rows),
    recentRisers: toEntries(recentRisers.rows),
    mostAccomplished: toEntries(mostAccomplished.rows),
  };
}
