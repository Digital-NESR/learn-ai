'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { FileText, Upload, CheckCircle2, Download, Home, X } from 'lucide-react';
import { submitProject, removeSubmissionFile, type SubmissionMeta } from '../../actions/hackathon-submission';

const INPUT_CLS =
  'w-full px-3 py-2.5 text-sm bg-[var(--card-2)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-colors placeholder-[var(--muted)]';

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
  const [description, setDescription] = useState(initialSubmission?.description ?? '');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!submission && pendingFiles.length === 0) {
      setError('Add at least one .pdf or .pptx file');
      return;
    }
    setError(null);
    setStatus(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.set('title', title.trim());
    formData.set('description', description.trim());
    pendingFiles.forEach(f => formData.append('files', f));

    try {
      const result = await submitProject(formData);
      setSubmission(result);
      setPendingFiles([]);
      setStatus('Saved!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {submission && submission.files.length > 0 && (
        <div className="rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--success)]" />
            <p className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
              {submission.files.length} file{submission.files.length === 1 ? '' : 's'} submitted
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
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(f.id)}
                  disabled={removingId === f.id}
                  className="shrink-0 text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors"
                  aria-label={`Remove ${f.fileName}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-4">
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
          <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Summary (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="What did you build, and what problem does it solve?"
            className={INPUT_CLS}
          />
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

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
          style={{ background: accent }}
        >
          <Upload className="h-4 w-4" />
          {submitting ? 'Submitting…' : submission ? 'Save changes' : 'Submit project'}
        </button>

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
