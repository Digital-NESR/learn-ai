import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import AiLearningHeader from '../../components/AiLearningHeader';
import JoinTeamClient from './JoinTeamClient';
import { HACKATHON_ACCENT } from '../../hackathon-guide';
import { authOptions } from '@/lib/auth';
import { getMyTeam, getPublicHackathonSettings, listTeamsToJoin, getMyJoinRequest } from '../../actions/hackathon';

export const metadata: Metadata = { title: 'Find a team | NESR AI Verse' };
export const dynamic = 'force-dynamic';

export default async function JoinTeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const [myTeam, settings] = await Promise.all([getMyTeam().catch(() => null), getPublicHackathonSettings()]);
  if (myTeam) redirect('/hackathon');
  if (settings.status !== 'open') redirect('/hackathon');

  const [teams, myRequest] = await Promise.all([listTeamsToJoin(), getMyJoinRequest()]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 lg:px-8 py-14">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Find a team</h1>
          <p className="mt-2 text-[var(--muted)]">
            Browse registered teams and request to join one - the team&apos;s leader will need to approve you.
          </p>
        </div>
        <JoinTeamClient initialTeams={teams} initialMyRequest={myRequest} accent={HACKATHON_ACCENT} />
      </main>
    </div>
  );
}
