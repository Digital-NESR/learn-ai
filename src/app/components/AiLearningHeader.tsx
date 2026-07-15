'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOutButton from './SignOutButton';
import ThemeToggle from './ThemeToggle';
import { getMyProfile } from '../actions/profile';

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
        active
          ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
          : 'text-[var(--muted)] hover:bg-[var(--card-2)] hover:text-[var(--text)]'
      }`}
    >
      {label}
      {soon && (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          Soon
        </span>
      )}
    </Link>
  );
}

export default function AiLearningHeader() {
  const pathname = usePathname();
  const onHackathon = pathname?.startsWith('/hackathon') ?? false;
  const { data: session } = useSession();
  const [jobTitle, setJobTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    getMyProfile().then(profile => setJobTitle(profile?.jobTitle ?? null));
  }, [session?.user?.email]);

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-[var(--border)] bg-[var(--card)]/80 px-6 lg:px-8 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/nesr-logo-circle.png" alt="NESR" width={36} height={36} className="rounded-full" />
          <span className="font-semibold text-[var(--text)] text-sm tracking-tight group-hover:text-[var(--muted)] transition-colors">
            NESR AI Verse
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavTab href="/" label="Courses" active={!onHackathon} />
          <NavTab href="/hackathon" label="Hackathon" active={onHackathon} soon />
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {session?.user?.name && (
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-[var(--text)]">{session.user.name}</span>
            {jobTitle && <span className="text-xs text-[var(--muted)]">{jobTitle}</span>}
          </div>
        )}
        <ThemeToggle />
        <SignOutButton />
      </div>
    </header>
  );
}
