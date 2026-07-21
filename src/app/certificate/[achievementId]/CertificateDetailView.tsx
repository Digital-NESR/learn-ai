'use client';

import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import type { AchievementId } from '@/lib/achievements';
import AchievementCertificateCard from '../AchievementCertificateCard';

export default function CertificateDetailView({
  achievementId,
  recipientName,
  issuedAt,
}: {
  achievementId: AchievementId;
  recipientName: string;
  issuedAt: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 print:p-0">
      <div className="cert-chrome mb-8 flex w-full max-w-[1040px] items-center justify-between">
        <Link
          href="/certificate"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to your certificates
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-[var(--brand)] hover:bg-[#276041] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>
      <div className="max-w-full overflow-x-auto rounded-2xl shadow-lg print:shadow-none print:rounded-none">
        <AchievementCertificateCard achievementId={achievementId} recipientName={recipientName} issuedAt={issuedAt} />
      </div>
    </div>
  );
}
