import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Rocket, Users, Sparkles, Trophy, ArrowLeft, Megaphone } from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import HackathonGuideClient from './HackathonGuideClient';
import HackathonTeamClient from './HackathonTeamClient';
import CountdownTimer from './CountdownTimer';
import { GUIDE_CHAPTERS, HACKATHON_ACCENT, HACKATHON_NEON } from '../hackathon-guide';
import { authOptions } from '@/lib/auth';
import { getMyTeam, getPublicHackathonSettings, getMyJoinRequest, listJoinRequestsForMyTeam } from '../actions/hackathon';

export const metadata: Metadata = { title: 'Hackathon | NESR AI Verse' };
export const dynamic = 'force-dynamic';

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

const STATUS_COPY: Record<string, { badge: string; badgeCls: string; blurb: string }> = {
  draft: {
    badge: 'Coming soon',
    badgeCls: 'bg-white/10 text-white/70',
    blurb:
      'Finish the courses, then put your new skills to the test. A hands-on AI build ' +
      'challenge for NESR teams is on the way — start prepping with the guide below.',
  },
  open: {
    badge: 'Registration open',
    badgeCls: 'bg-[#4ade80]/15 text-[#4ade80]',
    blurb: 'Registration is open — form your team below and start prepping with the guide.',
  },
  closed: {
    badge: 'Registration closed',
    badgeCls: 'bg-white/10 text-white/40',
    blurb: 'Registration has closed. Keep prepping with the guide below while the event gets underway.',
  },
};

function fmtDateTime(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default async function HackathonPage() {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email?.toLowerCase() ?? '';
  const [myTeam, settings, myJoinRequest] = await Promise.all([
    getMyTeam().catch(() => null),
    getPublicHackathonSettings(),
    getMyJoinRequest().catch(() => null),
  ]);
  const incomingJoinRequests = myTeam?.createdByEmail === currentUserEmail ? await listJoinRequestsForMyTeam() : [];
  const statusCopy = STATUS_COPY[settings.status] ?? STATUS_COPY.draft;

  const details: { label: string; value: string }[] = [];
  if (settings.venue) details.push({ label: 'Venue', value: settings.venue });
  if (settings.meetingLink) details.push({ label: 'Meeting link', value: settings.meetingLink });
  const eventStart = fmtDateTime(settings.eventStartAt);
  if (eventStart) details.push({ label: 'Hackathon starts', value: eventStart });
  const submissionDeadline = fmtDateTime(settings.submissionDeadlineAt);
  if (submissionDeadline) details.push({ label: 'Submission deadline', value: submissionDeadline });
  const presentation = fmtDateTime(settings.presentationAt);
  if (presentation) details.push({ label: 'Presentations', value: presentation });
  if (settings.eligibility) details.push({ label: 'Who can join', value: settings.eligibility });

  const eventHasStarted = settings.eventStartAt ? new Date(settings.eventStartAt) <= new Date() : false;
  const registrationOpen = settings.status === 'open';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />

      <main className="flex-1 w-full">
        {/* ── Event teaser — same dark hero treatment as the home page ── */}
        <section className="relative overflow-hidden bg-[#070b09] text-white">
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#307c4c]/40 blur-3xl animate-aurora" />
          <div
            className="pointer-events-none absolute -right-16 top-8 h-80 w-80 rounded-full bg-[#2563eb]/25 blur-3xl animate-aurora"
            style={{ animationDuration: '26s' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#45c07a]/25 blur-3xl animate-aurora"
            style={{ animationDuration: '32s' }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 70% 25%, black, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 70% 25%, black, transparent 75%)',
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6 lg:px-8 pt-16 pb-14 text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: `${HACKATHON_ACCENT}26` }}
            >
              <Rocket className="h-8 w-8" style={{ color: HACKATHON_ACCENT }} />
            </div>

            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${statusCopy.badgeCls}`}>
              {statusCopy.badge}
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight leading-tight">
              The NESR <span className="text-gradient">AI Hackathon</span>
            </h1>
            <p className="mt-3 text-lg text-white/70 leading-relaxed max-w-xl mx-auto">{statusCopy.blurb}</p>

            {settings.announcement && (
              <div
                className="animate-glow-pulse relative mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border px-5 py-4 text-center shadow-lg"
                style={{
                  borderColor: `${HACKATHON_ACCENT}66`,
                  background: `linear-gradient(120deg, ${HACKATHON_ACCENT}2e, ${HACKATHON_ACCENT}0d 45%, ${HACKATHON_ACCENT}2e)`,
                  ['--glow-color' as string]: `${HACKATHON_ACCENT}66`,
                  ['--glow-color-transparent' as string]: `${HACKATHON_ACCENT}00`,
                }}
              >
                <span
                  className="animate-shimmer-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3"
                  style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)' }}
                />
                <div className="relative flex flex-col items-center gap-2 text-center">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${HACKATHON_ACCENT}26`, color: HACKATHON_ACCENT }}
                  >
                    <Megaphone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: HACKATHON_ACCENT }}>
                      Announcement
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-white/90">{settings.announcement}</p>
                  </div>
                </div>
              </div>
            )}

            {settings.eventStartAt && !eventHasStarted && (
              <CountdownTimer targetIso={settings.eventStartAt} accent={HACKATHON_NEON} />
            )}

            {details.length > 0 && (
              <dl className="mt-8 grid gap-3 sm:grid-cols-2 max-w-xl mx-auto text-left">
                {details.map(d => (
                  <div key={d.label} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{d.label}</dt>
                    <dd className="text-sm text-white/90 mt-0.5 break-words">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {registrationOpen && !myTeam && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/hackathon/register"
                  className="animate-glow-pulse inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-extrabold uppercase tracking-wide text-[#070b09] shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: HACKATHON_NEON,
                    ['--glow-color' as string]: `${HACKATHON_NEON}99`,
                    ['--glow-color-transparent' as string]: `${HACKATHON_NEON}00`,
                  }}
                >
                  <Rocket className="h-5 w-5" />
                  Register Now
                </Link>
              </div>
            )}

            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
              {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-white/15 bg-white/5 p-5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: `${HACKATHON_ACCENT}26`, color: HACKATHON_ACCENT }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-white/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Prep guide: sidebar tabs + accordion sections ── */}
        <div className="border-t border-[var(--border)] bg-[var(--card)]/40">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14">
            <div className="mb-10 text-center">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                style={{ background: `${HACKATHON_ACCENT}26`, color: HACKATHON_ACCENT }}
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

            <HackathonGuideClient chapters={GUIDE_CHAPTERS} accent={HACKATHON_ACCENT} />
          </div>
        </div>

        {/* ── Team entry ── */}
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-14">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Enter your team</h2>
            <p className="mt-2 text-[var(--muted)]">
              Create a team or wait for a teammate to add you — everyone needs an NESR email on file.
            </p>
          </div>
          <HackathonTeamClient
            initialTeam={myTeam}
            currentUserEmail={currentUserEmail}
            accent={HACKATHON_ACCENT}
            registrationOpen={registrationOpen}
            submissionsOpen={eventHasStarted}
            initialMyJoinRequest={myJoinRequest}
            initialIncomingRequests={incomingJoinRequests}
          />
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
