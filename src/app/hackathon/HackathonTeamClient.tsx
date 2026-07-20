'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Users, Search, UserPlus, LogOut, Crown, Upload, ListChecks, Clock, X, Check } from 'lucide-react';
import {
  addTeamMember,
  leaveTeam,
  searchEmployees,
  cancelJoinRequest,
  listJoinRequestsForMyTeam,
  approveJoinRequest,
  rejectJoinRequest,
  type Team,
  type DirectoryPerson,
  type MyJoinRequest,
  type IncomingJoinRequest,
} from '../actions/hackathon';

export default function HackathonTeamClient({
  initialTeam,
  currentUserEmail,
  accent,
  registrationOpen,
  submissionsOpen,
  initialMyJoinRequest,
  initialIncomingRequests,
}: {
  initialTeam: Team | null;
  currentUserEmail: string;
  accent: string;
  registrationOpen: boolean;
  submissionsOpen: boolean;
  initialMyJoinRequest: MyJoinRequest | null;
  initialIncomingRequests: IncomingJoinRequest[];
}) {
  const [team, setTeam] = useState<Team | null>(initialTeam);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DirectoryPerson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [myJoinRequest, setMyJoinRequest] = useState<MyJoinRequest | null>(initialMyJoinRequest);
  const [cancelling, setCancelling] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<IncomingJoinRequest[]>(initialIncomingRequests);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const isCreator = team?.createdByEmail === currentUserEmail;

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchEmployees(value);
      setResults(found);
    });
  }

  function handleAdd(email: string) {
    if (!team) return;
    setError(null);
    startTransition(async () => {
      try {
        const t = await addTeamMember(team.id, email);
        setTeam(t);
        setQuery('');
        setResults([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add teammate');
      }
    });
  }

  function handleLeave() {
    if (!team) return;
    setError(null);
    startTransition(async () => {
      await leaveTeam(team.id);
      setTeam(null);
    });
  }

  function handleCancelRequest() {
    if (!myJoinRequest) return;
    setError(null);
    setCancelling(true);
    startTransition(async () => {
      try {
        await cancelJoinRequest(myJoinRequest.id);
        setMyJoinRequest(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not cancel request');
      } finally {
        setCancelling(false);
      }
    });
  }

  function handleApprove(requestId: string) {
    setError(null);
    setResolvingId(requestId);
    startTransition(async () => {
      try {
        const t = await approveJoinRequest(requestId);
        setTeam(t);
        setIncomingRequests(await listJoinRequestsForMyTeam());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not approve request');
      } finally {
        setResolvingId(null);
      }
    });
  }

  function handleReject(requestId: string) {
    setError(null);
    setResolvingId(requestId);
    startTransition(async () => {
      try {
        await rejectJoinRequest(requestId);
        setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not reject request');
      } finally {
        setResolvingId(null);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--brand-soft)] p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <Users className="w-5 h-5" style={{ color: accent }} />
        <h3 className="text-lg font-bold text-[var(--text)]">Hackathon team</h3>
      </div>

      {!team ? (
        <>
          {myJoinRequest ? (
            <div className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-soft)] px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-[var(--warning)]" />
                Request sent to join <span className="font-semibold">{myJoinRequest.teamName}</span> - waiting for
                the team leader to approve.
              </p>
              <button
                onClick={handleCancelRequest}
                disabled={cancelling}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)] mb-4">
                {registrationOpen
                  ? 'No team yet - register one and invite teammates, all pulled from the employee directory.'
                  : 'Team registration isn’t open yet - check back once it is.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {registrationOpen ? (
                  <Link
                    href="/hackathon/register"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                    style={{ background: accent }}
                  >
                    Register your team
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                    style={{ background: accent }}
                  >
                    Register your team
                  </button>
                )}
                {registrationOpen ? (
                  <Link
                    href="/hackathon/join"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-2)] transition-colors"
                  >
                    <ListChecks className="w-4 h-4" />
                    Look up teams to join
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] opacity-50 cursor-not-allowed"
                  >
                    <ListChecks className="w-4 h-4" />
                    Look up teams to join
                  </button>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-[var(--muted)] mb-4">
            <span className="font-semibold text-[var(--text)]">{team.name}</span> ·{' '}
            {team.members.length} member{team.members.length === 1 ? '' : 's'}
          </p>

          <ul className="flex flex-col gap-2 mb-4">
            {team.members.map(m => (
              <li
                key={m.email}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-2)] px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate flex items-center gap-1.5">
                    {m.displayName}
                    {m.email === team.createdByEmail && (
                      <Crown className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} aria-label="Team creator" />
                    )}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {[m.jobTitle, m.department].filter(Boolean).join(' · ') || m.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {isCreator && incomingRequests.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Pending requests to join ({incomingRequests.length})
              </label>
              <ul className="flex flex-col gap-2">
                {incomingRequests.map(r => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--warning-border)] bg-[var(--warning-soft)] px-3 py-2"
                  >
                    <div className="flex-1 min-w-[160px]">
                      <p className="text-sm font-medium text-[var(--text)]">{r.displayName}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {[r.jobTitle, r.department].filter(Boolean).join(' · ') || r.email}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={resolvingId === r.id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)] hover:underline disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      disabled={resolvingId === r.id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--danger)] hover:underline disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Add a teammate (search by name or email)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search the employee directory…"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
              />
            </div>
            {results.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 rounded-lg border border-[var(--border)] overflow-hidden">
                {results.map(p => (
                  <li key={p.email}>
                    <button
                      onClick={() => handleAdd(p.email)}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--card-2)] transition-colors"
                    >
                      <UserPlus className="w-4 h-4 shrink-0 text-[var(--muted)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-[var(--text)] truncate">{p.displayName}</span>
                        <span className="block text-xs text-[var(--muted)] truncate">{p.email}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            {submissionsOpen ? (
              <Link
                href="/hackathon/submit"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: accent }}
              >
                <Upload className="w-4 h-4" />
                Submit project
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Submissions open once the hackathon starts"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                style={{ background: accent }}
              >
                <Upload className="w-4 h-4" />
                Submit project
              </button>
            )}
            <button
              onClick={handleLeave}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Leave team
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
