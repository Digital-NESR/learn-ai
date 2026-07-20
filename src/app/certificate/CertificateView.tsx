'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';

export default function CertificateView({
  recipientName,
  issuedAt,
}: {
  recipientName: string;
  issuedAt: string;
}) {
  const issuedDate = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 print:p-0 print:max-w-none">
      <div className="print:hidden flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to the courses
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-[var(--brand)] hover:bg-[#276041] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      <div className="rounded-2xl border-2 border-[#307c4c]/30 bg-[var(--card)] px-10 py-14 text-center print:border-black/20 print:rounded-none">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <Image src="/nesr-logo-circle.png" alt="NESR" width={64} height={64} className="rounded-full" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#307c4c]">
          NESR AI Verse
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">
          Certificate of Completion
        </h1>

        <p className="mt-8 text-sm text-[var(--muted)]">This certifies that</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--text)] font-serif">
          {recipientName}
        </p>

        <p className="mt-8 max-w-lg mx-auto text-[var(--muted)] leading-relaxed">
          has successfully completed all four NESR AI Verse tracks - Business AI, Create AI for
          Business, Advanced AI, and Use AI for Business - including every quiz along the way.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-[var(--muted)]">
          <span className="h-px w-16 bg-[var(--border)]" />
          Issued {issuedDate}
          <span className="h-px w-16 bg-[var(--border)]" />
        </div>
      </div>
    </div>
  );
}
