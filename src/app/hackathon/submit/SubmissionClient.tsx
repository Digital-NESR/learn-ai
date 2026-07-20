'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Download, Home, X, Video, ExternalLink, Save, Send, Lock } from 'lucide-react';
import { submitProject, submitFinalProject, removeSubmissionFile, type SubmissionMeta } from '../../actions/hackathon-submission';
import { DELIVERABLE_QUESTIONS, DELIVERABLE_QUESTION_IDS } from '../../hackathon-deliverables';

const INPUT_CLS =
  'w-full px-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)] disabled:opacity-60 disabled:cursor-not-allowed';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'pptx'];

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function SubmissionClient({
  initialSubmission,
  accent,
}: {
  initialSubmission: SubmissionMeta | null;
  accent: string;
}) {
  const [submission, setSubmission] = useState<SubmissionMeta | null>(initialSubmission);
  const [title, setTitle] = useState(initialSubmission?.title ?? '');
  const [videoLink, setVideoLink] = useState(initialSubmission?.videoLink ?? '');
  const [answers, setAnswers] = useState<Record<string, string>>(initialSubmission?.answers ?? {});
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLocked = submission?.isFinal ?? false;
  const hasArtifact = pendingFiles.length > 0 || (submission?.files.length ?? 0) > 0 || videoLink.trim().length > 0;
  const allAnswered = DELIVERABLE_QUESTION_IDS.every(id => (answers[id] ?? '').trim().length > 0);
  const readyToSubmit = allAnswered && hasArtifact;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setError(null);
    if (!selected.length) return;

    for (const f of selected) {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`"${f.name}" isn't a .pdf or .pptx file`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        setError(`"${f.name}" is over the 10MB limit`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
    setPendingFiles(prev => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removePendingFile(index: number) {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleRemoveExisting(fileId: string) {
    setError(null);
    setStatus(null);
    setRemovingId(fileId);
    try {
      const result = await removeSubmissionFile(fileId);
      setSubmission(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove file');
    } finally {
      setRemovingId(null);
    }
  }

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (videoLink.trim() && !/^https?:\/\//i.test(videoLink.trim())) {
      setError('Video link must be a valid URL starting with http:// or https://');
      return;
    }
    setError(null);
    setStatus(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.set('title', title.trim());
    formData.set('videoLink', videoLink.trim());
    formData.set('answers', JSON.stringify(answers));
    pendingFiles.forEach(f => formData.append('files', f));

    try {
      const result = await submitProject(formData);
      setSubmission(result);
      setAnswers(result.answers);
      setPendingFiles([]);
      setStatus('Saved!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFinalSubmit() {
    setError(null);
    setStatus(null);
    setFinalizing(true);

    const formData = new FormData();
    formData.set('title', title.trim());
    formData.set('videoLink', videoLink.trim());
    formData.set('answers', JSON.stringify(answers));
    pendingFiles.forEach(f => formData.append('files', f));

    try {
      const result = await submitFinalProject(formData);
      setSubmission(result);
      setAnswers(result.answers);
      setPendingFiles([]);
      setStatus('Submitted! Your project is locked in — contact an admin if you need to make changes.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit');
    } finally {
      setFinalizing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {submission?.isFinal && (
        <div className="rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--success)]" />
            <p className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
              Submitted — {submission.files.length} file{submission.files.length === 1 ? '' : 's'}
              {submission.videoLink ? ' + video link' : ''}
              {submission.isLate && (
                <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]">
                  Late
                </span>
              )}
            </p>
          </div>
          <p className="text-xs text-[var(--muted)] mb-2 ml-7">
            Last submitted by {submission.submittedByEmail} · {fmtDate(submission.updatedAt)}
          </p>
          <ul className="flex flex-col gap-1.5 ml-7">
            {submission.files.map(f => (
              <li key={f.id} className="flex items-center gap-2 rounded-lg bg-[var(--card)] border border-[var(--border)] px-3 py-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                <span className="text-sm text-[var(--text)] flex-1 min-w-0 truncate">
                  {f.fileName} <span className="text-[var(--muted)]">({fmtBytes(f.fileSize)})</span>
                </span>
                <a
                  href={`/api/hackathon/submissions/file/${f.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
                  style={{ color: accent }}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(f.id)}
                    disabled={removingId === f.id}
                    className="shrink-0 text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors"
                    aria-label={`Remove ${f.fileName}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
            {submission.videoLink && (
              <li className="flex items-center gap-2 rounded-lg bg-[var(--card)] border border-[var(--border)] px-3 py-1.5">
                <Video className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                <span className="text-sm text-[var(--text)] flex-1 min-w-0 truncate">Video link (OneDrive)</span>
                <a
                  href={submission.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
                  style={{ color: accent }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSaveDraft} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-4">
        {isLocked && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-2)] px-3 py-2.5 flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0 text-[var(--muted)]" />
            <p className="text-sm text-[var(--text)]">
              This submission is locked. Ask an admin to reopen it if you need to make changes.
            </p>
          </div>
        )}

        <fieldset disabled={isLocked} className="flex flex-col gap-4 border-0 p-0 m-0 min-w-0">
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Project title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Smart Maintenance Copilot"
              required
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Video link (OneDrive) — for mp4 submissions
            </label>
            <input
              type="url"
              value={videoLink}
              onChange={e => setVideoLink(e.target.value)}
              placeholder="https://onedrive.live.com/..."
              className={INPUT_CLS}
            />
          </div>

          <div className="pt-2 border-t border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text)] mb-0.5">Deliverables</p>
            <p className="text-xs text-[var(--muted)] mb-3">
              Answer what you can now and save — you can keep editing this up until the submission deadline.
              Answer all 8 and add a file or video link to unlock the Submit button.
            </p>
            <div className="flex flex-col gap-4">
              {DELIVERABLE_QUESTIONS.map(q => (
                <div key={q.id}>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">{q.label}</label>
                  <textarea
                    value={answers[q.id] ?? ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    rows={3}
                    placeholder={q.prompt}
                    maxLength={5000}
                    className={INPUT_CLS}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Add files (.pdf or .pptx, up to 10MB each)
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileChange}
                className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--card-2)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--text)] hover:file:bg-[var(--border)]"
              />
            </div>
            {pendingFiles.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {pendingFiles.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg bg-[var(--card-2)] border border-[var(--border)] px-3 py-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    <span className="text-sm text-[var(--text)] flex-1 min-w-0 truncate">
                      {f.name} <span className="text-[var(--muted)]">({fmtBytes(f.size)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removePendingFile(i)}
                      className="shrink-0 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        {error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {status && (
          <p className="text-sm text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] rounded-lg px-3 py-2">
            {status}
          </p>
        )}

        {!isLocked && (
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || finalizing}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-2)] disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Saving…' : 'Save draft'}
            </button>
            {readyToSubmit && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || finalizing}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                style={{ background: accent }}
              >
                <Send className="h-4 w-4" />
                {finalizing ? 'Submitting…' : 'Submit'}
              </button>
            )}
          </div>
        )}
        {!isLocked && (
          <p className="text-xs text-center text-[var(--muted)] -mt-2">
            {readyToSubmit
              ? 'Ready to submit — Submit locks your project in as final.'
              : 'You can save a draft and keep editing anytime before the submission deadline.'}
          </p>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-2)] transition-colors"
        >
          <Home className="h-4 w-4" />
          Go back to homepage
        </Link>
      </form>
    </div>
  );
}
