'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Crown, Search, UserPlus, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { createTeam, addTeamMember, searchEmployees, type DirectoryPerson } from '../../actions/hackathon';

const INPUT_CLS =
  'w-full px-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]';

interface SubmitResult {
  teamName: string;
  addedCount: number;
  attemptedCount: number;
  failed: { email: string; reason: string }[];
}

export default function TeamRegisterClient({
  currentUserEmail,
  currentUserName,
  minTeamSize,
  maxTeamSize,
  accent,
}: {
  currentUserEmail: string;
  currentUserName: string;
  minTeamSize: number;
  maxTeamSize: number;
  accent: string;
}) {
  const [leader, setLeader] = useState<DirectoryPerson>({
    email: currentUserEmail,
    displayName: currentUserName,
    department: null,
    jobTitle: null,
  });
  const [teamName, setTeamName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DirectoryPerson[]>([]);
  const [members, setMembers] = useState<DirectoryPerson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    searchEmployees(currentUserEmail).then(found => {
      const match = found.find(p => p.email === currentUserEmail);
      if (match) setLeader(match);
    });
  }, [currentUserEmail]);

  const totalCount = 1 + members.length;
  const atCap = totalCount >= maxTeamSize;
  const belowMin = totalCount < minTeamSize;

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchEmployees(value);
      setResults(found.filter(p => p.email !== leader.email && !members.some(m => m.email === p.email)));
    });
  }

  function handleAddMember(person: DirectoryPerson) {
    if (atCap) return;
    setMembers(prev => [...prev, person]);
    setQuery('');
    setResults([]);
  }

  function handleRemoveMember(email: string) {
    setMembers(prev => prev.filter(m => m.email !== email));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;
    setSubmitting(true);
    setError(null);

    let team;
    try {
      team = await createTeam(teamName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register team');
      setSubmitting(false);
      return;
    }

    const failed: { email: string; reason: string }[] = [];
    for (const m of members) {
      try {
        await addTeamMember(team.id, m.email);
      } catch (err) {
        failed.push({ email: m.email, reason: err instanceof Error ? err.message : 'Could not add teammate' });
      }
    }

    setResult({
      teamName: team.name,
      addedCount: members.length - failed.length,
      attemptedCount: members.length,
      failed,
    });
    setSubmitting(false);
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-soft)]">
          <CheckCircle2 className="h-6 w-6 text-[var(--success)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text)]">
          &ldquo;{result.teamName}&rdquo; is registered!
        </h2>
        {result.attemptedCount > 0 && (
          <p className="mt-1 text-sm text-[var(--muted)]">
            {result.addedCount} of {result.attemptedCount} teammate{result.attemptedCount === 1 ? '' : 's'} added.
          </p>
        )}
        {result.failed.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5 text-left">
            {result.failed.map(f => (
              <li
                key={f.email}
                className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2"
              >
                {f.email}: {f.reason}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/hackathon"
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: accent }}
        >
          Go to your team
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-6">
      <div>
        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Team name</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder="e.g. AI Pioneers"
          required
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Team leader</label>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-2)] px-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate flex items-center gap-1.5">
              {leader.displayName}
              <Crown className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} aria-label="Team leader" />
            </p>
            <p className="text-xs text-[var(--muted)] truncate">
              {[leader.jobTitle, leader.department].filter(Boolean).join(' · ') || leader.email}
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">You</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-[var(--muted)]">Team members</label>
          <span className="text-xs text-[var(--muted)]">
            {totalCount} of {maxTeamSize}
          </span>
        </div>

        {members.length > 0 && (
          <ul className="mb-3 flex flex-col gap-2">
            {members.map(m => (
              <li
                key={m.email}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-2)] px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{m.displayName}</p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {[m.jobTitle, m.department].filter(Boolean).join(' · ') || m.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(m.email)}
                  aria-label={`Remove ${m.displayName}`}
                  className="shrink-0 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {atCap ? (
          <p className="text-sm text-[var(--muted)]">Team is full — remove someone to add another.</p>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search the employee directory…"
              className={`${INPUT_CLS} pl-9`}
            />
          </div>
        )}
        {results.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1 rounded-lg border border-[var(--border)] overflow-hidden">
            {results.map(p => (
              <li key={p.email}>
                <button
                  type="button"
                  onClick={() => handleAddMember(p)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--card-2)] transition-colors"
                >
                  <UserPlus className="w-4 h-4 shrink-0 text-[var(--muted)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-[var(--text)] truncate">{p.displayName}</span>
                    <span className="block text-xs text-[var(--muted)] truncate">
                      {[p.jobTitle, p.department].filter(Boolean).join(' · ') || p.email}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {belowMin && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Teams need at least {minTeamSize} member{minTeamSize === 1 ? '' : 's'} — you can register now and add more later.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !teamName.trim()}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
        style={{ background: accent }}
      >
        {submitting ? 'Registering…' : 'Register team'}
      </button>
    </form>
  );
}
