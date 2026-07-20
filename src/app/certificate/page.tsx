import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import { getMyCertificate, getMyCertificateStatus } from '../actions/progress';
import CertificateView from './CertificateView';

export const metadata: Metadata = { title: 'Certificate | NESR AI Verse' };
export const dynamic = 'force-dynamic';

export default async function CertificatePage() {
  const [certificate, status] = await Promise.all([getMyCertificate(), getMyCertificateStatus()]);

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <AiLearningHeader />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <p className="text-lg font-semibold text-[var(--text)]">No certificate yet</p>
          <p className="text-[var(--muted)] max-w-sm">
            Finish every Required part, at least half of the Important parts, and{' '}
            {status.optional.needed} of the Specialized parts to unlock your certificate.
          </p>
          <div className="flex flex-col gap-1 text-sm text-[var(--muted)]">
            <span>Required: {status.required.done} / {status.required.total}</span>
            <span>Important: {status.half.done} / {status.half.needed} needed (of {status.half.total})</span>
            <span>Specialized: {status.optional.done} / {status.optional.needed} needed (of {status.optional.total})</span>
          </div>
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
