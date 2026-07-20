import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import AiLearningHeader from '../../components/AiLearningHeader';
import TeamRegisterClient from './TeamRegisterClient';
import { HACKATHON_ACCENT } from '../../hackathon-guide';
import { authOptions } from '@/lib/auth';
import { getMyTeam, getPublicHackathonSettings } from '../../actions/hackathon';

export const metadata: Metadata = { title: 'Register your team | NESR AI Verse' };
export const dynamic = 'force-dynamic';

export default async function RegisterTeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const [myTeam, settings] = await Promise.all([getMyTeam().catch(() => null), getPublicHackathonSettings()]);
  if (myTeam) redirect('/hackathon');
  if (settings.status !== 'open') redirect('/hackathon');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 lg:px-8 py-14">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Register your team</h1>
          <p className="mt-2 text-[var(--muted)]">
            Give your team a name and add teammates from the employee directory - everyone needs an
            NESR email on file.
          </p>
        </div>
        <TeamRegisterClient
          currentUserEmail={session.user.email.toLowerCase()}
          currentUserName={session.user.name ?? session.user.email}
          minTeamSize={settings.minTeamSize}
          maxTeamSize={settings.maxTeamSize}
          accent={HACKATHON_ACCENT}
        />
      </main>
    </div>
  );
}
