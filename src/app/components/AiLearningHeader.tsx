'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';

function NavTab({
  href,
  label,
  active,
  soon,
}: {
  href: string;
  label: string;
  active: boolean;
  soon?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-[#f0f9f4] text-[#307c4c]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      {label}
      {soon && (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
          Soon
        </span>
      )}
    </Link>
  );
}

export default function AiLearningHeader() {
  const pathname = usePathname();
  const onHackathon = pathname?.startsWith('/hackathon') ?? false;

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/nesr-logo-circle.png" alt="NESR" width={36} height={36} className="rounded-full" />
          <span className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-slate-600 transition-colors">
            NESR UpskillAI
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavTab href="/" label="Courses" active={!onHackathon} />
          <NavTab href="/hackathon" label="Hackathon" active={onHackathon} soon />
        </nav>
      </div>

      <SignOutButton />
    </header>
  );
}
