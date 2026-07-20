'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export type LaunchPhase = 'idle' | 'igniting' | 'launching' | 'arriving';

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start Microsoft sign-in. Please try again.',
  OAuthCallback: 'Sign-in with Microsoft failed. Please try again.',
  OAuthAccountNotLinked: 'This email is already used with a different sign-in method.',
  AccessDenied: "You don't have access to sign in.",
  default: 'Sign-in failed. Please try again.',
};

/** Reusable authentication/animation state machine for the login page. Drives
 * the cinematic launch sequence after a successful SSO sign-in, then hands
 * off to the real destination - while respecting prefers-reduced-motion. */
export function useLoginLaunch() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();

  const from = params.get('from') || '/';
  const errorCode = params.get('error');

  const [phase, setPhase] = useState<LaunchPhase>('idle');
  const [signingIn, setSigningIn] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const launchedRef = useRef(false);

  const error = errorCode ? ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.default : null;

  const handleSignIn = useCallback(() => {
    setSigningIn(true);
    const callbackUrl = from && from !== '/' ? `/login?from=${encodeURIComponent(from)}` : '/login';
    signIn('azure-ad', { callbackUrl });
  }, [from]);

  // Local dev only - resolves in-page (no redirect away), so the existing
  // "status became authenticated" effect below picks it up and runs the same
  // launch sequence as a real SSO sign-in.
  const handleDevBypass = useCallback(() => {
    setSigningIn(true);
    signIn('dev-bypass', { redirect: false }).finally(() => setSigningIn(false));
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || launchedRef.current) return;
    launchedRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPhase('arriving');
      setOverlayVisible(true);
      const t = setTimeout(() => router.replace(from), 400);
      return () => clearTimeout(t);
    }

    setPhase('igniting');
    const toLaunching = setTimeout(() => {
      setPhase('launching');
      setOverlayVisible(true);
    }, 500);
    const toArriving = setTimeout(() => {
      setPhase('arriving');
      router.replace(from);
    }, 2300);

    return () => {
      clearTimeout(toLaunching);
      clearTimeout(toArriving);
    };
  }, [status, from, router]);

  return {
    phase,
    loading: signingIn || phase !== 'idle',
    error,
    overlayVisible,
    handleSignIn,
    handleDevBypass,
  };
}
