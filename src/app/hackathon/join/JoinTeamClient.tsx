'use client';

import { useState, useTransition } from 'react';
import { Search, Crown, Users, UserPlus, Clock, X } from 'lucide-react';
import { requestToJoinTeam, cancelJoinRequest, type JoinableTeam, type MyJoinRequest } from '../../actions/hackathon';

const INPUT_CLS =
  'w-full px-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]';

export default function JoinTeamClient({
  initialTeams,
  initialMyRequest,
  accent,
}: {
  initialTeams: JoinableTeam[];
  initialMyRequest: MyJoinRequest | null;
  accent: string;
}) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [myRequest, setMyRequest] = useState<MyJoinRequest | null>(initialMyRequest);
  const [cancelling, setCancelling] = useState(false);
  const [, startTransition] = useTransition();

  const q = query.trim().toLowerCase();
  const filtered = q
    ? initialTeams.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.members.some(
            m =>
              m.displayName.toLowerCase().includes(q) ||
              m.email.toLowerCase().includes(q) ||
              (m.department ?? '').toLowerCase().includes(q),
          ),
      )
    : initialTeams;

  function handleRequest(teamId: string) {
    setError(null);
    setRequestingId(teamId);
    startTransition(async () => {
      try {
        const request = await requestToJoinTeam(teamId);
        setMyRequest(request);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not send request');
      } finally {
        setRequestingId(null);
      }
    });
  }

  function handleCancel() {
    if (!myRequest) return;
    setError(null);
    setCancelling(true);
    startTransition(async () => {
      try {
        await cancelJoinRequest(myRequest.id);
        setMyRequest(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not cancel request');
      } finally {
        setCancelling(false);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {myRequest && (
        <div className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-soft)] px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-[var(--warning)]" />
            Request sent to join <span className="font-semibold">{myRequest.teamName}</span> - waiting for the
            team leader to approve.
          </p>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by team, name, or department…"
          className={`${INPUT_CLS} pl-9`}
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)] py-10">
          {initialTeams.length === 0 ? 'No teams have registered yet.' : 'No teams match your search.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map(t => {
          const isFull = t.members.length >= t.maxTeamSize;
          const isThisPending = myRequest?.teamId === t.id;
          const disabled = isFull || !!myRequest || requestingId === t.id;
          return (
            <li key={t.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: accent }} />
                  <h3 className="font-bold text-[var(--text)]">{t.name}</h3>
                  <span className="text-xs text-[var(--muted)]">
                    {t.members.length} of {t.maxTeamSize}
                  </span>
                </div>
                <button
                  onClick={() => handleRequest(t.id)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ background: accent }}
                >
                  <UserPlus className="w-4 h-4" />
                  {isThisPending
                    ? 'Requested'
                    : isFull
                      ? 'Full'
                      : requestingId === t.id
                        ? 'Sending…'
                        : 'Request to join'}
                </button>
              </div>

              <ul className="flex flex-col gap-1.5">
                {t.members.map(m => (
                  <li
                    key={m.email}
                    className="flex items-center gap-2 rounded-lg bg-[var(--card-2)] border border-[var(--border)] px-3 py-1.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate flex items-center gap-1.5">
                        {m.displayName}
                        {m.email === t.createdByEmail && (
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
