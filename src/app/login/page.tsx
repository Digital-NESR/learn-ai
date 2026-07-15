import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ssoEnabled, devBypassEnabled } from '@/lib/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Sign in | NESR AI Verse' };

// Rendered per-request so the "Sign in with Microsoft" button reflects the
// live AZURE_AD_* env (otherwise ssoEnabled would be frozen at build time).
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm ssoEnabled={ssoEnabled} devBypassEnabled={devBypassEnabled} />
    </Suspense>
  );
}
