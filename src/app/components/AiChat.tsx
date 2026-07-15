'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Send } from 'lucide-react';
import { useChatVisibility } from '../chat-visibility';

type Role = 'user' | 'assistant';
interface Message {
  role: Role;
  content: string;
  error?: boolean;
}

const GREETING: Message = {
  role: 'assistant',
  content: "Hi! I'm the AI Verse assistant. Ask me anything about AI or the courses.",
};

export default function AiChat() {
  const pathname = usePathname();
  const { hidden } = useChatVisibility();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  // Let other parts of the app (e.g. the landing "AI Assistant" card) open the
  // widget — optionally pre-filling a suggested prompt.
  useEffect(() => {
    function onOpen(e: Event) {
      setOpen(true);
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) setInput(prompt);
    }
    window.addEventListener('aiverse:open-chat', onOpen);
    return () => window.removeEventListener('aiverse:open-chat', onOpen);
  }, []);

  // Close the panel (rather than leave it open-but-invisible) whenever a
  // timed quiz session hides the widget.
  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  // The widget is for signed-in, in-app pages only — never on the login
  // screen, and never during a timed quiz (so it can't be used to cheat).
  if (pathname === '/login' || hidden) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history = messages.filter(m => !m.error);
    const next = [...history, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.reply === 'string') {
        setMessages([...next, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...next,
          { role: 'assistant', content: data.error ?? 'Something went wrong. Please try again.', error: true },
        ]);
      }
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Network error — please try again.', error: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating trigger — also opened via the "AI Verse Assistant" card /
          prompt chips (aiverse:open-chat custom event). */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI Verse Assistant"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#276041]"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 bg-[var(--brand)] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">AI Verse Assistant</p>
                <p className="text-[11px] text-white/70">Ask about AI &amp; the courses</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex max-h-[55vh] min-h-[220px] flex-col gap-3 overflow-y-auto bg-[var(--bg)] p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[var(--brand)] text-white'
                      : m.error
                        ? 'border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]'
                        : 'border border-[var(--border)] bg-[var(--card)] text-[var(--text)]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask a question…"
                className="max-h-28 flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card-2)] px-3 py-2 text-sm placeholder-[var(--muted)] focus:border-[#307c4c] focus:outline-none focus:ring-2 focus:ring-[#307c4c]/20"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white transition-colors hover:bg-[#276041] disabled:bg-[var(--card-2)] disabled:text-[var(--muted)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-[var(--muted)]">
              AI can make mistakes. Rate-limited to prevent abuse.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
