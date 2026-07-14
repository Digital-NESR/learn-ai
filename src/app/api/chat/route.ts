import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Rate-limit config (overridable via env). Two layers per user:
//  - a short burst window (anti-spam), and
//  - a daily cap (cost control) so one user can't rack up a huge bill.
const LIMIT = Number(process.env.CHAT_RATE_LIMIT ?? 10);
const WINDOW_MS = Number(process.env.CHAT_RATE_WINDOW_MS ?? 60_000);
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT ?? 100);
const DAY_MS = 86_400_000;

const MAX_MESSAGE_CHARS = 2000;
const MAX_MESSAGES = 30;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip') ?? '';
  return ip || 'anon';
}

export async function POST(req: NextRequest) {
  // 1. Require an authenticated session — the widget only renders in-app.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  // 2. Rate limit, keyed by user (falling back to IP): burst + daily cap.
  const key = (token.email as string | undefined)?.toLowerCase() || clientKey(req);
  const burst = rateLimit(`chat:min:${key}`, LIMIT, WINDOW_MS);
  const daily = rateLimit(`chat:day:${key}`, DAILY_LIMIT, DAY_MS);
  if (!burst.ok || !daily.ok) {
    const rl = !burst.ok ? burst : daily;
    const retry = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    const message = !burst.ok
      ? `You're sending messages too fast — try again in ${retry}s.`
      : "You've reached today's message limit. Please try again tomorrow.";
    return NextResponse.json(message ? { error: message } : {}, {
      status: 429,
      headers: {
        'Retry-After': String(retry),
        'X-RateLimit-Limit': String(rl.limit),
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    });
  }

  // 3. Validate input.
  let body: { messages?: ChatMessage[] } | null = null;
  try {
    body = await req.json();
  } catch {
    /* ignore malformed body */
  }
  const cleaned: ChatMessage[] = (Array.isArray(body?.messages) ? body!.messages! : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  const last = cleaned[cleaned.length - 1];
  if (!last || last.role !== 'user' || !last.content.trim()) {
    return NextResponse.json({ error: 'Empty message.' }, { status: 400 });
  }

  // 4. Forward to the n8n workflow — or return a scaffold reply until it's wired.
  const webhook = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({
      reply:
        "The AIverse assistant isn't connected yet — the n8n workflow is on its way. " +
        "Once it's live, ask me anything about the AI courses and I'll answer right here.",
      scaffold: true,
    });
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_CHAT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.N8N_CHAT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ user: key, messages: cleaned }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error('[chat] n8n webhook returned non-OK status', res.status, bodyText.slice(0, 500));
      return NextResponse.json({ error: 'The assistant is unavailable right now.' }, { status: 502 });
    }

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const reply =
      typeof data.reply === 'string' ? data.reply
      : typeof data.output === 'string' ? data.output
      : typeof data.text === 'string' ? data.text
      : 'I got an empty response — please try again.';

    return NextResponse.json({ reply });
  } catch (err) {
    // Log the real cause (DNS failure, connection refused, TLS error, genuine
    // abort, etc.) — the user-facing message stays generic on purpose.
    console.error('[chat] fetch to n8n webhook failed:', webhook, err);
    return NextResponse.json({ error: 'The assistant timed out. Please try again.' }, { status: 504 });
  }
}
