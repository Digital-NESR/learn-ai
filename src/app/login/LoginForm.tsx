'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { User, Lock, Mail, IdCard, GraduationCap } from 'lucide-react';

export default function LoginForm({ ssoEnabled }: { ssoEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn('credentials', {
      username,
      password,
      name,
      email,
      redirect: false,
      callbackUrl: from,
    });
    if (res?.ok) {
      router.replace(from);
      router.refresh();
      return;
    }
    setError('Incorrect username or password.');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] font-sans text-[var(--text)] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/nesr-logo-circle.png"
            alt="NESR"
            width={56}
            height={56}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] mt-4">NESR AI Verse</h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] mt-1">
            <GraduationCap className="w-4 h-4 text-[var(--brand)]" />
            Sign in to start the series
          </p>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
          {/* Microsoft SSO — shown once Entra ID is configured */}
          {ssoEnabled && (
            <>
              <button
                type="button"
                onClick={() => signIn('azure-ad', { callbackUrl: from })}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-2)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23" aria-hidden="true">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Sign in with Microsoft
              </button>

              <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                <span className="h-px flex-1 bg-[var(--border)]" />
                or
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>
            </>
          )}

          {/* Username / password (admin break-glass) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              <span className="h-px flex-1 bg-[var(--border)]" />
              optional
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Your name
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Your work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
                  placeholder="jane.doe@nesr.com"
                />
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Fill both in to save your own progress and get a certificate. Leave blank to sign in
                as a shared/admin identity.
              </p>
            </div>

            {error && (
              <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--brand)] hover:bg-[#276041] disabled:bg-[var(--card-2)] disabled:text-[var(--muted)] disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-6">NESR Digital Supply Chain</p>
      </div>
    </div>
  );
}
