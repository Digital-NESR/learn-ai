import type { Metadata } from 'next';
import AiLearningHomeClient from './AiLearningHomeClient';
import { getMyProgress, getMyCertificate } from './actions/progress';
import { getEffectiveTracks, getEffectiveTotalModules } from '@/lib/content-resolver';

export const metadata: Metadata = { title: 'NESR AI Verse' };

// Progress/certificate are per-person DB reads, and course content can be
// edited by admins at any time — never statically cache this page.
export const dynamic = 'force-dynamic';

export default async function AiLearningPage() {
  const [tracks, totalModules, initialProgress, certificate] = await Promise.all([
    getEffectiveTracks(),
    getEffectiveTotalModules(),
    getMyProgress(),
    getMyCertificate(),
  ]);
  return (
    <AiLearningHomeClient
      tracks={tracks}
      totalModules={totalModules}
      initialProgress={initialProgress}
      certificate={certificate}
    />
  );
}
