import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import AiLearningHeader from '../../components/AiLearningHeader';
import SubmissionClient from './SubmissionClient';
import { HACKATHON_ACCENT } from '../../hackathon-guide';
import { authOptions } from '@/lib/auth';
import { getMyTeam, getPublicHackathonSettings } from '../../actions/hackathon';
import { getMySubmission } from '../../actions/hackathon-submission';

export const metadata: Metadata = { title: 'Submit your project | NESR AI Verse' };
export const dynamic = 'force-dynamic';

export default async function SubmitProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const [team, settings] = await Promise.all([
    getMyTeam().catch(() => null),
    getPublicHackathonSettings(),
  ]);
  if (!team) redirect('/hackathon');
  const eventHasStarted = settings.eventStartAt ? new Date(settings.eventStartAt) <= new Date() : false;

  const submission = await getMySubmission().catch(() => null);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 lg:px-8 py-14">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Submit your project</h1>
          <p className="mt-2 text-[var(--muted)]">
            On behalf of <span className="font-semibold text-[var(--text)]">{team.name}</span> - upload a pdf or pptx
            deck. Submitting again replaces the previous file.
          </p>
        </div>
        <SubmissionClient initialSubmission={submission} accent={HACKATHON_ACCENT} eventHasStarted={eventHasStarted} />
      </main>
    </div>
  );
}
