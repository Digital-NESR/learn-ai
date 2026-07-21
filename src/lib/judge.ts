import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import aiversePool from '@/lib/db-aiverse';

function getJudgeEmails(): string[] {
  return (process.env.JUDGE_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isJudgeEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getJudgeEmails().includes(email.trim().toLowerCase());
}

/** Session + judge-email check shared by every judge-gated server action. Throws if not a judge.
 * Also upserts the `users` row for this judge - hackathon_scores.judge_email has an FK into
 * users(email), but a judge might reach /judge without ever calling requireSessionEmail()
 * elsewhere first. */
export async function requireJudge(): Promise<string> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name;
  if (!email || !name || !isJudgeEmail(email)) throw new Error('Judges only');
  await aiversePool.query(
    `insert into users (email, name) values ($1, $2)
     on conflict (email) do update set name = excluded.name, last_seen_at = now()`,
    [email, name],
  );
  return email;
}
