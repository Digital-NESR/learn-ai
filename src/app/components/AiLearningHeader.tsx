'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import SignOutButton from './SignOutButton';

/**
 * Slim top bar shared by the landing page and module pages.
 * The logo returns to the series home.
 */
export default function AiLearningHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0">
      <Link href="/" className="flex items-center gap-3 group">
        <Image src="/nesr-logo-circle.png" alt="NESR" width={36} height={36} className="rounded-full" />
        <span className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-slate-600 transition-colors">
          NESR AI Learning
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-500">
          <Sparkles className="w-4 h-4 text-[#307c4c]" />
          Learning Series
        </span>
        <SignOutButton />
      </div>
    </header>
  );
}
