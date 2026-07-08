import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

// Credentials default to the shared demo login; override in production via env.
const USERNAME = process.env.LEARNAI_USER ?? 'nesrai';
const PASSWORD = process.env.LEARNAI_PASS ?? 'nesr123456';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (username === USERNAME && password === PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  }

  return NextResponse.json(
    { ok: false, error: 'Incorrect username or password.' },
    { status: 401 },
  );
}
