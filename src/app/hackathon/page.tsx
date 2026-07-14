import type { Metadata } from 'next';
import Link from 'next/link';
import { Rocket, Users, Sparkles, Trophy, ArrowLeft } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import HackathonGuideClient from './HackathonGuideClient';
import { GUIDE_CHAPTERS, HACKATHON_ACCENT, HACKATHON_ACCENT_SOFT } from '../hackathon-guide';

export const metadata: Metadata = { title: 'Hackathon | NESR AIverse' };

const HIGHLIGHTS = [
  {
    icon: Users,
    title: 'Team up',
    body: 'Form cross-functional teams from across NESR and build together.',
  },
  {
    icon: Sparkles,
    title: 'Build with AI',
    body: 'Put what you learned in the courses to work on a real challenge.',
  },
  {
    icon: Trophy,
    title: 'Win recognition',
    body: 'Present to leadership, with prizes for the standout builds.',
  },
];

export default function HackathonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />

      <main className="flex-1 w-full">
        {/* ── Event teaser ── */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-16 pb-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-soft)]">
            <Rocket className="h-8 w-8 text-[var(--brand)]" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            Coming soon
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--text)] leading-tight">
            The NESR AI Hackathon
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
            Finish the courses, then put your new skills to the test. A hands-on AI build
            challenge for NESR teams is on the way — start prepping with the guide below.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
            {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-[var(--text)]">{title}</p>
                <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Prep guide: sidebar tabs + accordion sections ── */}
        <div className="border-t border-[var(--border)] bg-[var(--card)]/40">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14">
            <div className="mb-10 text-center">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                style={{ background: HACKATHON_ACCENT_SOFT, color: HACKATHON_ACCENT }}
              >
                Prep Guide
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text)]">
                Get ready before the event
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                What to build, how it&apos;s judged, and how to get your hands on data. Pick a
                topic on the left, and tap a section to expand it.
              </p>
            </div>

            <HackathonGuideClient
              chapters={GUIDE_CHAPTERS}
              accent={HACKATHON_ACCENT}
              accentSoft={HACKATHON_ACCENT_SOFT}
            />
          </div>
        </div>

        <div className="py-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the courses
          </Link>
        </div>
      </main>
    </div>
  );
}
