import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isJudgeEmail } from '@/lib/judge';
import { listTeamsForJudging } from '../actions/judge';
import JudgeClient from './JudgeClient';

export const metadata: Metadata = { title: 'Judge | NESR AI Verse' };
// Not linked from anywhere in the nav, reachable only by typing the URL - // same pattern as /admin.
export const dynamic = 'force-dynamic';

export default async function JudgePage() {
  const session = await getServerSession(authOptions);
  if (!isJudgeEmail(session?.user?.email)) notFound();

  const teams = await listTeamsForJudging();

  return <JudgeClient initialTeams={teams} />;
}
