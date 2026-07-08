import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

/**
 * Simple gate for the whole site: every page requires the `learnai_auth`
 * cookie (set by /api/login). Unauthenticated visitors are bounced to /login.
 * The login page and the auth API are always allowed through.
 */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page and the auth endpoints.
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const authed = req.cookies.get(AUTH_COOKIE)?.value === '1';
  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // remember where they were headed so we can send them back after login
    if (pathname !== '/') url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect everything except Next internals and the logo asset.
    '/((?!_next/static|_next/image|favicon.ico|nesr-logo-circle.png).*)',
  ],
};
