'use client';

import { useMemo, useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Rocket,
  Plus,
  Trash2,
  Save,
  Video,
  ClipboardCheck,
  Undo2,
} from 'lucide-react';
import {
  saveModule,
  deleteModule,
  deleteTrack,
  listTracksForAdmin,
  listRecentActions,
  undoAction,
  type ModuleFormData,
  type AdminAction,
} from '../actions/admin';
import type { ContentBlock, Module, QuizQuestion, Track, TrackId } from '../content';

type Tab = 'courses' | 'hackathon';

interface Draft {
  isNew: boolean;
  id: string;
  trackId: TrackId;
  part: number;
  partLabel: string;
  title: string;
  tagline: string;
  minutes: number;
  sectionsJson: string;
  quiz: QuizQuestion[];
}

function moduleToDraft(trackId: TrackId, m: Module): Draft {
  return {
    isNew: false,
    id: m.id,
    trackId,
    part: m.part,
    partLabel: m.partLabel,
    title: m.title,
    tagline: m.tagline,
    minutes: m.minutes,
    sectionsJson: JSON.stringify(m.sections, null, 2),
    quiz: m.quiz.map(q => ({ ...q, options: [...q.options] })),
  };
}

function blankDraft(trackId: TrackId, nextPart: number): Draft {
  return {
    isNew: true,
    id: '',
    trackId,
    part: nextPart,
    partLabel: `Part ${nextPart}`,
    title: '',
    tagline: '',
    minutes: 5,
    sectionsJson: JSON.stringify([{ kind: 'lead', text: '', body: '' }], null, 2),
    quiz: [],
  };
}

/** Best-effort read of the first video block, for the quick-edit fields. Returns null if the
 * sections JSON is currently invalid or has no video block — the raw textarea is still the
 * source of truth. */
function firstVideoBlock(sectionsJson: string): { youtubeId: string; caption: string } | null {
  try {
    const parsed = JSON.parse(sectionsJson) as ContentBlock[];
    const video = parsed.find(b => b.kind === 'video');
    if (!video || video.kind !== 'video') return null;
    return { youtubeId: video.youtubeId ?? '', caption: video.caption ?? '' };
  } catch {
    return null;
  }
}

function patchVideoBlock(sectionsJson: string, patch: Partial<{ youtubeId: string; caption: string }>): string {
  try {
    const parsed = JSON.parse(sectionsJson) as ContentBlock[];
    const next = parsed.map(b => (b.kind === 'video' ? { ...b, ...patch } : b));
    return JSON.stringify(next, null, 2);
  } catch {
    return sectionsJson;
  }
}

export default function AdminClient({
  initialTracks,
  initialActions,
}: {
  initialTracks: Track[];
  initialActions: AdminAction[];
}) {
  const [tab, setTab] = useState<Tab>('courses');
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [actions, setActions] = useState<AdminAction[]>(initialActions);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const video = useMemo(() => (draft ? firstVideoBlock(draft.sectionsJson) : null), [draft]);
  const sectionsValid = useMemo(() => {
    if (!draft) return true;
    try {
      const parsed = JSON.parse(draft.sectionsJson);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, [draft]);

  async function refresh() {
    const [freshTracks, freshActions] = await Promise.all([listTracksForAdmin(), listRecentActions()]);
    setTracks(freshTracks);
    setActions(freshActions);
  }

  async function handleDeleteTrack(trackId: TrackId, eyebrow: string) {
    if (!window.confirm(`Delete the whole "${eyebrow}" track and everything in it?`)) return;
    setError(null);
    setSaving(true);
    try {
      await deleteTrack(trackId);
      if (draft && draft.trackId === trackId) setDraft(null);
      await refresh();
      setStatus('Track deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete track');
    } finally {
      setSaving(false);
    }
  }

  async function handleUndo(actionId: string) {
    setError(null);
    setSaving(true);
    try {
      await undoAction(actionId);
      setDraft(null);
      await refresh();
      setStatus('Undone.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not undo');
    } finally {
      setSaving(false);
    }
  }

  function selectModule(trackId: TrackId, m: Module) {
    setError(null);
    setStatus(null);
    setDraft(moduleToDraft(trackId, m));
  }

  function startNewModule(trackId: TrackId) {
    setError(null);
    setStatus(null);
    const track = tracks.find(t => t.id === trackId);
    const nextPart = (track?.modules.at(-1)?.part ?? 0) + 1;
    setDraft(blankDraft(trackId, nextPart));
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft(d => (d ? { ...d, ...patch } : d));
  }

  function updateQuestion(i: number, patch: Partial<QuizQuestion>) {
    setDraft(d => {
      if (!d) return d;
      const quiz = d.quiz.map((q, qi) => (qi === i ? { ...q, ...patch } : q));
      return { ...d, quiz };
    });
  }

  function updateOption(qi: number, oi: number, value: string) {
    setDraft(d => {
      if (!d) return d;
      const quiz = d.quiz.map((q, i) => {
        if (i !== qi) return q;
        const options = q.options.map((o, j) => (j === oi ? value : o));
        return { ...q, options };
      });
      return { ...d, quiz };
    });
  }

  function addOption(qi: number) {
    setDraft(d => {
      if (!d) return d;
      const quiz = d.quiz.map((q, i) => (i === qi ? { ...q, options: [...q.options, ''] } : q));
      return { ...d, quiz };
    });
  }

  function removeOption(qi: number, oi: number) {
    setDraft(d => {
      if (!d) return d;
      const quiz = d.quiz.map((q, i) => {
        if (i !== qi) return q;
        const options = q.options.filter((_, j) => j !== oi);
        const answer = q.answer >= options.length ? 0 : q.answer;
        return { ...q, options, answer };
      });
      return { ...d, quiz };
    });
  }

  function addQuestion() {
    setDraft(d =>
      d
        ? {
            ...d,
            quiz: [...d.quiz, { prompt: '', options: ['', ''], answer: 0, explanation: '' }],
          }
        : d,
    );
  }

  function removeQuestion(i: number) {
    setDraft(d => (d ? { ...d, quiz: d.quiz.filter((_, qi) => qi !== i) } : d));
  }

  async function handleSave() {
    if (!draft) return;
    setError(null);
    setStatus(null);
    let sections: ContentBlock[];
    try {
      sections = JSON.parse(draft.sectionsJson);
      if (!Array.isArray(sections)) throw new Error('Sections must be a JSON array');
    } catch {
      setError('Sections is not valid JSON — fix it before saving.');
      return;
    }

    const data: ModuleFormData = {
      id: draft.id,
      trackId: draft.trackId,
      part: draft.part,
      partLabel: draft.partLabel,
      title: draft.title,
      tagline: draft.tagline,
      minutes: draft.minutes,
      sections,
      quiz: draft.quiz,
    };

    setSaving(true);
    try {
      await saveModule(data);
      await refresh();
      setStatus('Saved.');
      setDraft(moduleToDraft(draft.trackId, {
        id: draft.id.trim().toLowerCase(),
        partLabel: draft.partLabel,
        part: draft.part,
        title: draft.title,
        tagline: draft.tagline,
        minutes: draft.minutes,
        sections,
        quiz: draft.quiz,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save module');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!draft || draft.isNew) return;
    if (!window.confirm(`Delete "${draft.title}" (${draft.id})? This can't be undone from here.`)) return;
    setSaving(true);
    setError(null);
    try {
      await deleteModule(draft.id);
      await refresh();
      setDraft(null);
      setStatus('Module deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete module');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 lg:px-8 py-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
        <h1 className="text-lg font-bold tracking-tight">NESR AI Verse — Admin</h1>
      </header>

      <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 lg:px-8">
        <nav className="flex gap-1 -mb-px">
          <button
            onClick={() => setTab('courses')}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'courses'
                ? 'border-[var(--brand)] text-[var(--brand)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </button>
          <button
            onClick={() => setTab('hackathon')}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'hackathon'
                ? 'border-[var(--brand)] text-[var(--brand)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Rocket className="w-4 h-4" />
            Hackathon
          </button>
        </nav>
      </div>

      {actions.length > 0 && (
        <div className="border-b border-[var(--border)] bg-[var(--card)]/60 px-6 lg:px-8 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mr-1">
              Recent
            </span>
            {actions.map(a => (
              <span
                key={a.id}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-2)] pl-3 pr-1.5 py-1 text-xs"
              >
                {a.description}
                <button
                  onClick={() => handleUndo(a.id)}
                  disabled={saving}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[var(--brand)] hover:bg-[var(--brand-soft)] disabled:opacity-50 transition-colors"
                >
                  <Undo2 className="w-3 h-3" />
                  Undo
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'hackathon' ? (
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <Rocket className="w-8 h-8 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-semibold text-[var(--text)]">Hackathon admin — coming soon</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            Team/prep-guide management isn&apos;t built yet. This tab is a placeholder.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-0 lg:gap-6 max-w-6xl mx-auto px-4 lg:px-8 py-6">
          {/* Track/module tree */}
          <aside className="flex flex-col gap-5">
            {tracks.map(track => (
              <div key={track.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: track.accent }}>
                    {track.eyebrow}
                  </p>
                  <button
                    onClick={() => handleDeleteTrack(track.id, track.eyebrow)}
                    disabled={saving}
                    className="text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors"
                    aria-label={`Delete ${track.eyebrow}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="flex flex-col gap-1">
                  {track.modules.map(m => (
                    <li key={m.id}>
                      <button
                        onClick={() => selectModule(track.id, m)}
                        className={`w-full text-left rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                          draft?.id === m.id && !draft.isNew
                            ? 'bg-[var(--card-2)] font-semibold text-[var(--text)]'
                            : 'text-[var(--muted)] hover:bg-[var(--card-2)] hover:text-[var(--text)]'
                        }`}
                      >
                        {m.title}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => startNewModule(track.id)}
                      className="w-full inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--card-2)] hover:text-[var(--text)] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New module
                    </button>
                  </li>
                </ul>
              </div>
            ))}
          </aside>

          {/* Editor */}
          <main className="pb-16">
            {!draft ? (
              <p className="text-[var(--muted)] py-10 text-center">
                Pick a module on the left to edit it, or add a new one.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">Module ID (slug)</label>
                    <input
                      type="text"
                      value={draft.id}
                      disabled={!draft.isNew}
                      onChange={e => updateDraft({ id: e.target.value })}
                      placeholder="business-4"
                      className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">Track</label>
                    <select
                      value={draft.trackId}
                      onChange={e => updateDraft({ trackId: e.target.value as TrackId })}
                      className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                    >
                      {tracks.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.eyebrow}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">Title</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={e => updateDraft({ title: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">Tagline</label>
                    <input
                      type="text"
                      value={draft.tagline}
                      onChange={e => updateDraft({ tagline: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">Part label</label>
                    <input
                      type="text"
                      value={draft.partLabel}
                      onChange={e => updateDraft({ partLabel: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1">Part #</label>
                      <input
                        type="number"
                        value={draft.part}
                        onChange={e => updateDraft({ part: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1">Minutes</label>
                      <input
                        type="number"
                        value={draft.minutes}
                        onChange={e => updateDraft({ minutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Video quick-edit */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-[var(--muted)]" />
                    <p className="text-sm font-semibold">Video</p>
                  </div>
                  {video ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">YouTube ID</label>
                        <input
                          type="text"
                          value={video.youtubeId}
                          onChange={e => updateDraft({ sectionsJson: patchVideoBlock(draft.sectionsJson, { youtubeId: e.target.value }) })}
                          className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">Caption</label>
                        <input
                          type="text"
                          value={video.caption}
                          onChange={e => updateDraft({ sectionsJson: patchVideoBlock(draft.sectionsJson, { caption: e.target.value }) })}
                          className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">No video block found in sections below.</p>
                  )}
                </div>

                {/* Raw sections JSON */}
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                    Sections (raw JSON — lead/cards/compare/steps/flow/glossary/list/checklist/video blocks)
                  </label>
                  <textarea
                    value={draft.sectionsJson}
                    onChange={e => updateDraft({ sectionsJson: e.target.value })}
                    rows={14}
                    spellCheck={false}
                    className={`w-full px-3 py-2 text-xs font-mono bg-[var(--card-2)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 ${
                      sectionsValid ? 'border-[var(--border)] focus:border-[var(--brand)]' : 'border-[var(--danger)]'
                    }`}
                  />
                  {!sectionsValid && (
                    <p className="mt-1 text-xs text-[var(--danger)]">Not valid JSON — this won&apos;t save until fixed.</p>
                  )}
                </div>

                {/* Quiz */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-[var(--muted)]" />
                      <p className="text-sm font-semibold">Quiz questions</p>
                    </div>
                    <button
                      onClick={addQuestion}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand)] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add question
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {draft.quiz.map((q, qi) => (
                      <div key={qi} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-[var(--muted)]">Q{qi + 1}</span>
                          <button
                            onClick={() => removeQuestion(qi)}
                            className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                            aria-label="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={q.prompt}
                          onChange={e => updateQuestion(qi, { prompt: e.target.value })}
                          placeholder="Question prompt"
                          rows={2}
                          className="w-full mb-2 px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                        />
                        <div className="flex flex-col gap-1.5 mb-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`answer-${qi}`}
                                checked={q.answer === oi}
                                onChange={() => updateQuestion(qi, { answer: oi })}
                                className="shrink-0"
                                aria-label={`Mark option ${oi + 1} correct`}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={e => updateOption(qi, oi, e.target.value)}
                                placeholder={`Option ${oi + 1}`}
                                className="flex-1 px-3 py-1.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                              />
                              {q.options.length > 2 && (
                                <button
                                  onClick={() => removeOption(qi, oi)}
                                  className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors shrink-0"
                                  aria-label="Remove option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(qi)}
                            className="self-start text-xs font-medium text-[var(--brand)] hover:underline mt-0.5"
                          >
                            + Add option
                          </button>
                        </div>
                        <textarea
                          value={q.explanation}
                          onChange={e => updateQuestion(qi, { explanation: e.target.value })}
                          placeholder="Explanation shown after answering"
                          rows={2}
                          className="w-full px-3 py-2 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]"
                        />
                      </div>
                    ))}
                    {draft.quiz.length === 0 && (
                      <p className="text-sm text-[var(--muted)]">No questions yet — add at least one.</p>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                {status && !error && (
                  <p className="text-sm text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] rounded-lg px-3 py-2">
                    {status}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || !sectionsValid}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-[var(--brand)] hover:bg-[#276041] disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  {!draft.isNew && (
                    <button
                      onClick={handleDelete}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--danger)] border border-[var(--danger-border)] hover:bg-[var(--danger-soft)] disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete module
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
