import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AiLearningHeader from '../../components/AiLearningHeader';
import { getMyAchievementCertificate } from '../../actions/progress';
import { isAchievementId, type AchievementId } from '@/lib/achievements';
import { ACHIEVEMENT_CERT_META } from '@/lib/achievement-certificates';
import CertificateDetailView from './CertificateDetailView';

// Progress/certificates are per-person DB reads — never statically cache this route.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ achievementId: string }>;
}): Promise<Metadata> {
  const { achievementId } = await params;
  const meta = isAchievementId(achievementId) ? ACHIEVEMENT_CERT_META[achievementId] : null;
  return { title: meta ? `${meta.heading} | NESR AI Verse` : 'Certificate | NESR AI Verse' };
}

export default async function AchievementCertificatePage({
  params,
}: {
  params: Promise<{ achievementId: string }>;
}) {
  const { achievementId: rawId } = await params;
  if (!isAchievementId(rawId)) notFound();
  const achievementId: AchievementId = rawId;

  const cert = await getMyAchievementCertificate(achievementId);
  const meta = ACHIEVEMENT_CERT_META[achievementId];

  if (!cert) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <AiLearningHeader />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <p className="text-lg font-semibold text-[var(--text)]">Not earned yet</p>
          <p className="text-[var(--muted)] max-w-sm">
            You haven&apos;t earned the &quot;{meta.heading}&quot; achievement yet — keep going!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the courses
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      {/* Scoped print rule: clean single A4-landscape page, chrome hidden. */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          .cert-chrome { display: none !important; }
        }
      `}</style>
      <div className="cert-chrome">
        <AiLearningHeader />
      </div>
      <main className="flex-1 w-full">
        <CertificateDetailView achievementId={achievementId} recipientName={cert.recipientName} issuedAt={cert.issuedAt} />
      </main>
    </div>
  );
}
