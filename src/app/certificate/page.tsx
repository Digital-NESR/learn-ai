import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import { getMyEarnedCertificates, getMyCertificateStatus, type EarnedCertificate } from '../actions/progress';
import { ACHIEVEMENT_CERT_META, TIER_STYLE } from '@/lib/achievement-certificates';

export const metadata: Metadata = { title: 'My Certificates | NESR AI Verse' };
export const dynamic = 'force-dynamic';

function CertificateSummaryCard({ cert }: { cert: EarnedCertificate }) {
  const meta = ACHIEVEMENT_CERT_META[cert.achievementId];
  const style = TIER_STYLE[meta.tier];
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <Link
      href={`/certificate/${cert.achievementId}`}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-14 w-14 shrink-0 rounded-full" style={{ background: style.ringGrad }}>
        <div
          className="absolute inset-[3px] flex items-center justify-center rounded-full"
          style={{ background: style.medalBg }}
        >
          <span className="text-[10px] leading-none" style={{ color: style.accent }}>
            {style.pips}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: style.accent }}>
          {meta.tierName}
        </p>
        <h3 className="truncate text-sm font-semibold text-[var(--text)]">{meta.heading}</h3>
        <p className="text-xs text-[var(--muted)]">Issued {issuedDate}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default async function CertificateGalleryPage() {
  const [certs, status] = await Promise.all([getMyEarnedCertificates(), getMyCertificateStatus()]);

  if (certs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <AiLearningHeader />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <p className="text-lg font-semibold text-[var(--text)]">No certificates yet</p>
          <p className="text-[var(--muted)] max-w-sm">
            Clear a track, conquer a realm, or meet the certificate requirements below to earn your first one.
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
      <AiLearningHeader />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
          <div className="mb-6 flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">NESR AI Verse</p>
            <h1 className="text-2xl font-bold leading-tight text-[var(--text)]">Your certificates</h1>
            <p className="text-sm text-[var(--muted)]">
              {certs.length} earned so far — click one to view and print it.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {certs.map(c => (
              <CertificateSummaryCard key={c.achievementId} cert={c} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
