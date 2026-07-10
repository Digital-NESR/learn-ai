import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Gate for the whole site: every page requires a NextAuth session.
 * Unauthenticated visitors are bounced to /login. The login page and the
 * NextAuth endpoints are always allowed through.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
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
