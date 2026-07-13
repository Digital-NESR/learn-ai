import type { Metadata } from 'next';
import Link from 'next/link';
import { Rocket, Users, Sparkles, Trophy, ArrowLeft } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';

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
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-soft)]">
            <Rocket className="h-8 w-8 text-[var(--brand)]" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-700">
            Coming soon
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--text)] leading-tight">
            The NESR AI Hackathon
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
            Finish the courses, then put your new skills to the test. A hands-on AI build
            challenge for NESR teams is on the way — details dropping soon.
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

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the courses
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
