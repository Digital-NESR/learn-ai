'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className={
        className ??
        'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-red-600 transition-colors'
      }
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
