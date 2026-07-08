'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function signOut() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className={
        className ??
        'inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors'
      }
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
