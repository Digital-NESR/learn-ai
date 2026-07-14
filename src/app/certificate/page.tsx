import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import { getMyCertificate } from '../actions/progress';
import CertificateView from './CertificateView';

export const metadata: Metadata = { title: 'Certificate | NESR AI Verse' };
export const dynamic = 'force-dynamic';

export default async function CertificatePage() {
  const certificate = await getMyCertificate();

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <AiLearningHeader />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <p className="text-lg font-semibold text-[var(--text)]">No certificate yet</p>
          <p className="text-[var(--muted)] max-w-sm">
            Finish every part across all four tracks to unlock your certificate of completion.
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
      <div className="print:hidden">
        <AiLearningHeader />
      </div>
      <main className="flex-1 w-full">
        <CertificateView recipientName={certificate.recipientName} issuedAt={certificate.issuedAt} />
      </main>
    </div>
  );
}
