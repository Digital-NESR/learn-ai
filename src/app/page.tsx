import type { Metadata } from 'next';
import { TRACKS, TOTAL_MODULES } from './content';
import AiLearningHomeClient from './AiLearningHomeClient';
import { getMyProgress, getMyCertificate } from './actions/progress';

export const metadata: Metadata = { title: 'NESR AI Verse' };

// Progress/certificate are per-person DB reads — never statically cache this page.
export const dynamic = 'force-dynamic';

export default async function AiLearningPage() {
  const [initialProgress, certificate] = await Promise.all([getMyProgress(), getMyCertificate()]);
  return (
    <AiLearningHomeClient
      tracks={TRACKS}
      totalModules={TOTAL_MODULES}
      initialProgress={initialProgress}
      certificate={certificate}
    />
  );
}
