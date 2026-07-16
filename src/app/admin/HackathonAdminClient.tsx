'use client';

import { Fragment, useState, useTransition } from 'react';
import {
  Users,
  Search,
  UserPlus,
  UserMinus,
  Crown,
  Ban,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Download,
  Save,
  Building2,
  Rocket,
  Megaphone,
  FileText,
} from 'lucide-react';
import {
  getHackathonOverview,
  listTeamsForAdmin,
  getTeamDetailForAdmin,
  renameTeamAdmin,
  addTeamMemberAdmin,
  removeTeamMemberAdmin,
  transferOwnershipAdmin,
  moveTeamMemberAdmin,
  deleteTeamAdmin,
  setTeamStatusAdmin,
  saveHackathonSettings,
  listSubmissionsForAdmin,
  type HackathonOverview,
  type AdminTeamSummary,
  type AdminTeamDetail,
  type HackathonSettings,
  type AdminSubmissionSummary,
} from '../actions/admin-hackathon';
import { searchEmployees, type DirectoryPerson } from '../actions/hackathon';

type SubTab = 'overview' | 'teams' | 'settings' | 'submissions';

const STATUS_STYLES: Record<string, string> = {
  Ready: 'text-[var(--success)] bg-[var(--success-soft)] border-[var(--success-border)]',
  Incomplete: 'text-[var(--warning)] bg-[var(--warning-soft)] border-[var(--warning-border)]',
  Oversized: 'text-[var(--warning)] bg-[var(--warning-soft)] border-[var(--warning-border)]',
  Disqualified: 'text-[var(--danger)] bg-[var(--danger-soft)] border-[var(--danger-border)]',
};

const INPUT_CLS =
  'w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}

function TeamDetailPanel({
  detail,
  otherTeams,
  busy,
  onRename,
  onAddMember,
  onRemoveMember,
  onTransfer,
  onMove,
  onDelete,
  onSetStatus,
}: {
  detail: AdminTeamDetail;
  otherTeams: AdminTeamSummary[];
  busy: boolean;
  onRename: (name: string) => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
  onTransfer: (email: string) => void;
  onMove: (email: string, toTeamId: string) => void;
  onDelete: () => void;
  onSetStatus: (status: 'active' | 'disqualified') => void;
}) {
  const [renameValue, setRenameValue] = useState(detail.name);
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState<DirectoryPerson[]>([]);
  const [searchPending, startSearchTransition] = useTransition();

  function handleAddSearch(value: string) {
    setAddQuery(value);
    if (value.trim().length < 2) {
      setAddResults([]);
      return;
    }
    startSearchTransition(async () => {
      setAddResults(await searchEmployees(value));
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-2)] p-5 mt-2 mb-3">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <form
          className="flex items-center gap-2"
          onSubmit={e => {
            e.preventDefault();
            if (renameValue.trim() && renameValue.trim() !== detail.name) onRename(renameValue.trim());
          }}
        >
          <input value={renameValue} onChange={e => setRenameValue(e.target.value)} className={`${INPUT_CLS} w-56`} />
          <button
            type="submit"
            disabled={busy || !renameValue.trim() || renameValue.trim() === detail.name}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card)] disabled:opacity-50 transition-colors"
          >
            Rename
          </button>
        </form>

        <div className="flex items-center gap-2">
          {detail.rawStatus === 'active' ? (
            <button
              onClick={() => onSetStatus('disqualified')}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--warning-border)] text-[var(--warning)] hover:bg-[var(--warning-soft)] disabled:opacity-50 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              Disqualify
            </button>
          ) : (
            <button
              onClick={() => onSetStatus('active')}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--success-border)] text-[var(--success)] hover:bg-[var(--success-soft)] disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reinstate
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm(`Delete team "${detail.name}"? This removes all its members and can't be undone.`)) onDelete();
            }}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--danger-border)] text-[var(--danger)] hover:bg-[var(--danger-soft)] disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete team
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2 mb-4">
        {detail.members.map(m => (
          <li
            key={m.email}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
          >
            <div className="flex-1 min-w-[160px]">
              <p className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
                {m.displayName}
                {m.email === detail.createdByEmail && <Crown className="w-3.5 h-3.5 text-amber-500" aria-label="Team creator" />}
              </p>
              <p className="text-xs text-[var(--muted)]">{[m.jobTitle, m.department].filter(Boolean).join(' · ') || m.email}</p>
            </div>

            {m.email !== detail.createdByEmail && (
              <button
                onClick={() => onTransfer(m.email)}
                disabled={busy}
                className="text-xs font-medium text-[var(--brand)] hover:underline disabled:opacity-50"
              >
                Make owner
              </button>
            )}

            {otherTeams.length > 0 && (
              <select
                defaultValue=""
                disabled={busy}
                onChange={e => {
                  if (e.target.value) onMove(m.email, e.target.value);
                  e.target.value = '';
                }}
                className="text-xs px-2 py-1.5 bg-[var(--card-2)] border border-[var(--border)] rounded-lg disabled:opacity-50"
              >
                <option value="">Move to…</option>
                {otherTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => onRemoveMember(m.email)}
              disabled={busy}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
            >
              <UserMinus className="w-3.5 h-3.5" />
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div>
        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Add a member (search directory)</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
          <input
            value={addQuery}
            onChange={e => handleAddSearch(e.target.value)}
            placeholder="Search by name or email…"
            className={`${INPUT_CLS} pl-9`}
          />
        </div>
        {addResults.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1 rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--card)]">
            {addResults.map(p => (
              <li key={p.email}>
                <button
                  onClick={() => {
                    onAddMember(p.email);
                    setAddQuery('');
                    setAddResults([]);
                  }}
                  disabled={busy}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--card-2)] disabled:opacity-50 transition-colors"
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
        {searchPending && <p className="mt-1 text-xs text-[var(--muted)]">Searching…</p>}
      </div>
    </div>
  );
}

export default function HackathonAdminClient({
  initialOverview,
  initialTeams,
  initialSettings,
  initialSubmissions,
}: {
  initialOverview: HackathonOverview;
  initialTeams: AdminTeamSummary[];
  initialSettings: HackathonSettings;
  initialSubmissions: AdminSubmissionSummary[];
}) {
  const [subTab, setSubTab] = useState<SubTab>('overview');
  const [overview, setOverview] = useState(initialOverview);
  const [teams, setTeams] = useState(initialTeams);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminTeamDetail | null>(null);
  const [settingsDraft, setSettingsDraft] = useState(initialSettings);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  function refreshTeams(search: string) {
    startTransition(async () => {
      setTeams(await listTeamsForAdmin(search));
    });
  }

  function refreshOverview() {
    startTransition(async () => {
      setOverview(await getHackathonOverview());
    });
  }

  function refreshSubmissions() {
    startTransition(async () => {
      setSubmissions(await listSubmissionsForAdmin());
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    refreshTeams(value);
  }

  function toggleExpand(teamId: string) {
    if (expandedId === teamId) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(teamId);
    setDetail(null);
    startTransition(async () => {
      setDetail(await getTeamDetailForAdmin(teamId));
    });
  }

  async function withMutation(fn: () => Promise<void>, successMsg: string) {
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await fn();
      refreshTeams(query);
      refreshOverview();
      if (expandedId) setDetail(await getTeamDetailForAdmin(expandedId));
      setStatus(successMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await saveHackathonSettings(settingsDraft);
      setStatus('Settings saved.');
      refreshOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(
          [
            ['overview', 'Overview'],
            ['teams', 'Teams'],
            ['submissions', 'Submissions'],
            ['settings', 'Settings'],
          ] as [SubTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              subTab === key
                ? 'border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-soft)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {status && (
        <p className="mb-4 text-sm text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] rounded-lg px-3 py-2">
          {status}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {subTab === 'overview' && (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <StatCard label="Registration status" value={overview.registrationStatus} />
            <StatCard label="Total teams" value={overview.totalTeams} />
            <StatCard label="Total participants" value={overview.totalParticipants} />
            <StatCard label="Employees without teams" value={overview.employeesWithoutTeams} />
            <StatCard label="Average team size" value={overview.avgTeamSize} />
            <StatCard label="Departments represented" value={overview.departmentsRepresented} />
            <StatCard label="Submissions" value={`${overview.totalSubmissions} of ${overview.totalTeams}`} />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSubTab('teams')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] transition-colors"
            >
              <Users className="w-4 h-4" />
              View teams
            </button>
            <button
              onClick={() => setSubTab('settings')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Edit event settings
            </button>
            <a
              href="/api/admin/hackathon/export"
              download
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg text-white bg-[var(--brand)] hover:opacity-90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export participants (CSV)
            </a>
          </div>

          <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Recent registrations</h3>
          <ul className="flex flex-col gap-2">
            {overview.recentRegistrations.length === 0 && <p className="text-sm text-[var(--muted)]">No teams yet.</p>}
            {overview.recentRegistrations.map(r => (
              <li
                key={r.teamId}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              >
                <span className="font-medium text-[var(--text)]">{r.teamName}</span>
                <span className="text-[var(--muted)]">
                  {r.memberCount} member{r.memberCount === 1 ? '' : 's'} · {fmtDate(r.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {subTab === 'teams' && (
        <div>
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by team, name, email, or department…"
              className={`${INPUT_CLS} pl-9`}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--card-2)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-3 py-2.5 w-6" />
                  <th className="px-3 py-2.5">Team</th>
                  <th className="px-3 py-2.5">Creator</th>
                  <th className="px-3 py-2.5">Members</th>
                  <th className="px-3 py-2.5">Departments</th>
                  <th className="px-3 py-2.5">Created</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-[var(--muted)]">
                      No teams match.
                    </td>
                  </tr>
                )}
                {teams.map(t => (
                  <Fragment key={t.id}>
                    <tr
                      onClick={() => toggleExpand(t.id)}
                      className="border-t border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-2)] cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 text-[var(--muted)]">
                        {expandedId === t.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-[var(--text)]">{t.name}</td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">{t.createdByName ?? t.createdByEmail}</td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">
                        {t.memberCount}/{settingsDraft.maxTeamSize}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">
                        {t.departments.length > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {t.departments.join(', ')}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--muted)]">{fmtDate(t.createdAt)}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[t.statusLabel]}`}
                        >
                          {t.statusLabel}
                        </span>
                      </td>
                    </tr>
                    {expandedId === t.id && (
                      <tr>
                        <td colSpan={7} className="px-3 bg-[var(--card)]">
                          {detail && detail.id === t.id ? (
                            <TeamDetailPanel
                              key={detail.id}
                              detail={detail}
                              otherTeams={teams.filter(o => o.id !== t.id)}
                              busy={saving}
                              onRename={name => withMutation(() => renameTeamAdmin(t.id, name), 'Team renamed.')}
                              onAddMember={email =>
                                withMutation(() => addTeamMemberAdmin(t.id, email), 'Member added.')
                              }
                              onRemoveMember={email =>
                                withMutation(() => removeTeamMemberAdmin(t.id, email), 'Member removed.')
                              }
                              onTransfer={email =>
                                withMutation(() => transferOwnershipAdmin(t.id, email), 'Ownership transferred.')
                              }
                              onMove={(email, toTeamId) =>
                                withMutation(() => moveTeamMemberAdmin(t.id, toTeamId, email), 'Member moved.')
                              }
                              onDelete={() => {
                                withMutation(() => deleteTeamAdmin(t.id), 'Team deleted.');
                                setExpandedId(null);
                                setDetail(null);
                              }}
                              onSetStatus={s => withMutation(() => setTeamStatusAdmin(t.id, s), 'Team status updated.')}
                            />
                          ) : (
                            <p className="py-4 text-sm text-[var(--muted)]">Loading…</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'submissions' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--muted)]">
              {submissions.length} of {teams.length} team{teams.length === 1 ? '' : 's'} submitted
            </p>
            <button
              onClick={refreshSubmissions}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--card-2)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-3 py-2.5">Team</th>
                  <th className="px-3 py-2.5">Title</th>
                  <th className="px-3 py-2.5">Files</th>
                  <th className="px-3 py-2.5">Submitted by</th>
                  <th className="px-3 py-2.5">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-[var(--muted)]">
                      No submissions yet.
                    </td>
                  </tr>
                )}
                {submissions.map(s => (
                  <tr key={s.id} className="border-t border-[var(--border)] bg-[var(--card)]">
                    <td className="px-3 py-2.5 font-medium text-[var(--text)] align-top">{s.teamName}</td>
                    <td className="px-3 py-2.5 text-[var(--text)] align-top">{s.title}</td>
                    <td className="px-3 py-2.5 text-[var(--muted)] align-top">
                      {s.files.length === 0 ? (
                        '—'
                      ) : (
                        <ul className="flex flex-col gap-1">
                          {s.files.map(f => (
                            <li key={f.id} className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {f.fileName} ({fmtBytes(f.fileSize)})
                              </span>
                              <a
                                href={`/api/hackathon/submissions/file/${f.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-[var(--brand)]"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--muted)] align-top">{s.submittedByEmail}</td>
                    <td className="px-3 py-2.5 text-[var(--muted)] align-top">
                      <span className="inline-flex items-center gap-1.5">
                        {fmtDateTime(s.submittedAt)}
                        {s.isLate && (
                          <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]">
                            Late
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Registration status</label>
            <select
              value={settingsDraft.status}
              onChange={e => setSettingsDraft({ ...settingsDraft, status: e.target.value as HackathonSettings['status'] })}
              className={INPUT_CLS}
            >
              <option value="draft">Draft (not visible as open)</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Registration opens</label>
              <input
                type="datetime-local"
                value={toLocalInput(settingsDraft.registrationOpensAt)}
                onChange={e => setSettingsDraft({ ...settingsDraft, registrationOpensAt: fromLocalInput(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Registration closes</label>
              <input
                type="datetime-local"
                value={toLocalInput(settingsDraft.registrationClosesAt)}
                onChange={e => setSettingsDraft({ ...settingsDraft, registrationClosesAt: fromLocalInput(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Hackathon start</label>
              <input
                type="datetime-local"
                value={toLocalInput(settingsDraft.eventStartAt)}
                onChange={e => setSettingsDraft({ ...settingsDraft, eventStartAt: fromLocalInput(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Submission deadline</label>
              <input
                type="datetime-local"
                value={toLocalInput(settingsDraft.submissionDeadlineAt)}
                onChange={e => setSettingsDraft({ ...settingsDraft, submissionDeadlineAt: fromLocalInput(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Presentation date</label>
              <input
                type="datetime-local"
                value={toLocalInput(settingsDraft.presentationAt)}
                onChange={e => setSettingsDraft({ ...settingsDraft, presentationAt: fromLocalInput(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Venue</label>
              <input
                value={settingsDraft.venue ?? ''}
                onChange={e => setSettingsDraft({ ...settingsDraft, venue: e.target.value || null })}
                className={INPUT_CLS}
                placeholder="e.g. HQ Auditorium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Meeting link</label>
              <input
                value={settingsDraft.meetingLink ?? ''}
                onChange={e => setSettingsDraft({ ...settingsDraft, meetingLink: e.target.value || null })}
                className={INPUT_CLS}
                placeholder="https://teams.microsoft.com/…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Minimum team size</label>
              <input
                type="number"
                min={1}
                value={settingsDraft.minTeamSize}
                onChange={e => setSettingsDraft({ ...settingsDraft, minTeamSize: Number(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Maximum team size</label>
              <input
                type="number"
                min={1}
                value={settingsDraft.maxTeamSize}
                onChange={e => setSettingsDraft({ ...settingsDraft, maxTeamSize: Number(e.target.value) })}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Contact email</label>
              <input
                type="email"
                value={settingsDraft.contactEmail ?? ''}
                onChange={e => setSettingsDraft({ ...settingsDraft, contactEmail: e.target.value || null })}
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Eligibility</label>
            <textarea
              value={settingsDraft.eligibility ?? ''}
              onChange={e => setSettingsDraft({ ...settingsDraft, eligibility: e.target.value || null })}
              rows={2}
              className={INPUT_CLS}
              placeholder="Who can participate"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] mb-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              Announcement banner
            </label>
            <textarea
              value={settingsDraft.announcement ?? ''}
              onChange={e => setSettingsDraft({ ...settingsDraft, announcement: e.target.value || null })}
              rows={2}
              className={INPUT_CLS}
              placeholder="Shown at the top of the public hackathon page, if set"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 self-start px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--brand)] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save settings
          </button>
        </form>
      )}
    </div>
  );
}
