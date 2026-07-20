'use client';

import { useMemo, useState } from 'react';
import {
  Gavel,
  Users,
  Crown,
  FileText,
  Video,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { saveJudgeScore, type JudgeTeamSummary } from '../actions/judge';
import { RUBRIC_CATEGORIES, RUBRIC_TOTAL_MAX } from '../judging-rubric';
import { DELIVERABLE_QUESTIONS } from '../hackathon-deliverables';
import ThemeToggle from '../components/ThemeToggle';

const ACCENT = '#45c07a';

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function teamTotal(team: JudgeTeamSummary): number | null {
  const keys = Object.keys(team.myScores);
  if (keys.length === 0) return null;
  return RUBRIC_CATEGORIES.reduce((sum, c) => sum + (team.myScores[c.id] ?? 0), 0);
}

export default function JudgeClient({ initialTeams }: { initialTeams: JudgeTeamSummary[] }) {
  const [teams, setTeams] = useState(initialTeams);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [index, setIndex] = useState(0);
  const team = teams[index];

  const [scores, setScores] = useState<Record<string, number>>(team?.myScores ?? {});
  const [remarks, setRemarks] = useState(team?.myRemarks ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => RUBRIC_CATEGORIES.reduce((sum, c) => sum + (scores[c.id] ?? 0), 0), [scores]);

  function goTo(newIndex: number) {
    if (newIndex < 0 || newIndex >= teams.length) return;
    setIndex(newIndex);
    setScores(teams[newIndex].myScores ?? {});
    setRemarks(teams[newIndex].myRemarks ?? '');
    setSaved(false);
    setError(null);
  }

  function openTeam(teamIndex: number) {
    goTo(teamIndex);
    setView('detail');
  }

  async function handleSave() {
    if (!team) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await saveJudgeScore(team.id, scores, remarks);
      setTeams(prev => prev.map((t, i) => (i === index ? { ...t, myScores: scores, myRemarks: remarks.trim() } : t)));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save score');
    } finally {
      setSaving(false);
    }
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[var(--muted)]">No teams to judge yet.</p>
        </main>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 lg:px-8 py-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Welcome Judges</h1>
            <p className="mt-2 text-[var(--muted)]">Pick a team to review its submission and marking sheet.</p>
          </div>
          <ul className="flex flex-col gap-2">
            {teams.map((t, i) => {
              const total = teamTotal(t);
              return (
                <li key={t.id}>
                  <button
                    onClick={() => openTeam(i)}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-2)] px-5 py-4 text-left transition-colors"
                  >
                    <span className="font-semibold text-[var(--text)]">{t.name}</span>
                    {total === null ? (
                      <span className="text-sm text-[var(--muted)]">Not marked</span>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: ACCENT }}>
                        {total} / {RUBRIC_TOTAL_MAX}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </main>
      </div>
    );
  }

  const answeredCount = team.submission ? Object.keys(team.submission.answers).length : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <Header />

      <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Team list
          </button>
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
        </div>
        <p className="text-sm font-medium text-[var(--muted)]">
          Team {index + 1} of {teams.length}
        </p>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === teams.length - 1}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        {/* Team + submission */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5" style={{ color: ACCENT }} />
              <h1 className="text-xl font-bold text-[var(--text)]">{team.name}</h1>
            </div>
            <ul className="flex flex-col gap-2">
              {team.members.map(m => (
                <li
                  key={m.email}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-2)] px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate flex items-center gap-1.5">
                      {m.displayName}
                      {m.email === team.createdByEmail && (
                        <Crown className="w-3.5 h-3.5 shrink-0" style={{ color: ACCENT }} aria-label="Team creator" />
                      )}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {[m.jobTitle, m.department].filter(Boolean).join(' · ') || m.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Submission</h2>
            {!team.submission ? (
              <p className="text-sm text-[var(--muted)]">This team has not submitted a project yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-[var(--text)]">{team.submission.title}</p>
                  {!team.submission.isFinal && (
                    <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]">
                      Draft - not yet submitted final
                    </span>
                  )}
                </div>

                {(team.submission.files.length > 0 || team.submission.videoLink) && (
                  <ul className="flex flex-col gap-1.5">
                    {team.submission.files.map(f => (
                      <li
                        key={f.id}
                        className="flex items-center gap-2 rounded-lg bg-[var(--card-2)] border border-[var(--border)] px-3 py-1.5"
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <span className="text-sm text-[var(--text)] flex-1 min-w-0 truncate">
                          {f.fileName} <span className="text-[var(--muted)]">({fmtBytes(f.fileSize)})</span>
                        </span>
                        <a
                          href={`/api/hackathon/submissions/file/${f.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
                          style={{ color: ACCENT }}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </li>
                    ))}
                    {team.submission.videoLink && (
                      <li className="flex items-center gap-2 rounded-lg bg-[var(--card-2)] border border-[var(--border)] px-3 py-1.5">
                        <Video className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                        <span className="text-sm text-[var(--text)] flex-1 min-w-0 truncate">Video link</span>
                        <a
                          href={team.submission.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
                          style={{ color: ACCENT }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </a>
                      </li>
                    )}
                  </ul>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
                    Deliverables ({answeredCount} of {DELIVERABLE_QUESTIONS.length} answered)
                  </p>
                  {answeredCount === 0 ? (
                    <p className="text-sm text-[var(--muted)]">No deliverable questions answered yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {DELIVERABLE_QUESTIONS.filter(q => team.submission!.answers[q.id]).map(q => (
                        <div key={q.id}>
                          <p className="text-xs font-semibold text-[var(--text)]">{q.label}</p>
                          <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">{team.submission!.answers[q.id]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scoring sidebar */}
        <div className="lg:sticky lg:top-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Marking sheet</h2>
            <p className="text-lg font-bold" style={{ color: ACCENT }}>
              {total} / {RUBRIC_TOTAL_MAX}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {RUBRIC_CATEGORIES.map(cat => (
              <div key={cat.id}>
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-sm font-medium text-[var(--text)]">{cat.label}</label>
                  <span className="text-xs text-[var(--muted)]">out of {cat.maxScore}</span>
                </div>
                <p className="text-xs text-[var(--muted)] mb-1.5">{cat.description}</p>
                <input
                  type="number"
                  min={0}
                  max={cat.maxScore}
                  value={scores[cat.id] ?? ''}
                  onChange={e => {
                    const val = e.target.value === '' ? undefined : Number(e.target.value);
                    setScores(prev => {
                      const next = { ...prev };
                      if (val === undefined || Number.isNaN(val)) delete next[cat.id];
                      else next[cat.id] = Math.max(0, Math.min(cat.maxScore, val));
                      return next;
                    });
                    setSaved(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Remarks</label>
            <textarea
              value={remarks}
              onChange={e => {
                setRemarks(e.target.value);
                setSaved(false);
              }}
              rows={4}
              placeholder="Notes for this team…"
              className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {saved && !error && (
            <p className="flex items-center gap-1.5 text-sm text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4" />
              Score saved.
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
            style={{ background: ACCENT }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save score'}
          </button>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Gavel className="w-5 h-5" style={{ color: ACCENT }} />
        <h1 className="text-lg font-bold tracking-tight">NESR AI Verse - Judge</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
