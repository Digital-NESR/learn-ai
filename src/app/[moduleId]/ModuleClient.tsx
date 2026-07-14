'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  ClipboardCheck,
} from 'lucide-react';
import AiLearningHeader from '../components/AiLearningHeader';
import { Block } from '../components/ContentBlocks';
import type { Module, Track } from '../content';
import { recordModuleResult } from '../actions/progress';

/* ══════════════════════════════════════════════════════════════════════
   Quiz
   ══════════════════════════════════════════════════════════════════════ */

function Quiz({
  module,
  accent,
  onComplete,
}: {
  module: Module;
  accent: string;
  accentSoft?: string;
  onComplete: (score: number, total: number) => void;
}) {
  // Computed from `accent` (low-alpha hex) rather than a static per-theme
  // color, so it reads correctly in both light and dark mode.
  const accentSoft = `${accent}22`;
  const total = module.quiz.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() => module.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every(a => a !== null);
  const score = useMemo(
    () => module.quiz.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0),
    [answers, module.quiz],
  );

  function select(qi: number, oi: number) {
    if (submitted) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function submit() {
    if (!allAnswered) return;
    setSubmitted(true);
    onComplete(score, total);
    // reveal results at the top of the quiz
    if (typeof document !== 'undefined') {
      document.getElementById('quiz-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function retake() {
    setAnswers(module.quiz.map(() => null));
    setSubmitted(false);
    if (typeof document !== 'undefined') {
      document.getElementById('quiz-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const passed = score === total;

  return (
    <section id="quiz-top" className="scroll-mt-20">
      <div className="flex items-center gap-2.5 mb-1">
        <ClipboardCheck className="w-5 h-5" style={{ color: accent }} />
        <h2 className="text-xl font-bold text-[var(--text)]">Quick quiz</h2>
      </div>
      <p className="text-sm text-[var(--muted)] mb-6">
        {total} questions. Answer each, then submit to see how you did.
      </p>

      {submitted && (
        <div
          className="rounded-2xl border p-5 mb-6 flex items-center gap-4"
          style={{
            background: passed ? accentSoft : 'var(--warning-soft)',
            borderColor: passed ? `${accent}44` : 'var(--warning-border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
            style={{ background: passed ? accent : 'var(--warning)' }}
          >
            {score}/{total}
          </div>
          <div>
            <p className="font-bold text-[var(--text)]">
              {passed ? 'Perfect score!' : score >= Math.ceil(total / 2) ? 'Nice work!' : 'Good try!'}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {passed
                ? 'You nailed every question in this part.'
                : 'Review the explanations below, then retake to lock it in.'}
            </p>
          </div>
        </div>
      )}

      <ol className="flex flex-col gap-6">
        {module.quiz.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-semibold text-[var(--text)] flex gap-2">
                <span style={{ color: accent }}>{qi + 1}.</span>
                <span>{q.prompt}</span>
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;

                  // styling states
                  let ring = 'border-[var(--border)] hover:border-[var(--muted)]';
                  let bg = 'bg-[var(--card)]';
                  if (!submitted && isChosen) {
                    ring = '';
                    bg = '';
                  }
                  let markStyle: React.CSSProperties | undefined;
                  if (!submitted && isChosen) {
                    markStyle = { borderColor: accent, background: accentSoft };
                  } else if (submitted && isCorrect) {
                    markStyle = { borderColor: 'var(--success)', background: 'var(--success-soft)' };
                  } else if (submitted && isChosen && !isCorrect) {
                    markStyle = { borderColor: 'var(--danger)', background: 'var(--danger-soft)' };
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => select(qi, oi)}
                      disabled={submitted}
                      className={`flex items-center gap-3 text-left rounded-xl border px-4 py-3 text-sm transition-colors ${ring} ${bg} ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      style={markStyle}
                    >
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                        style={
                          submitted && isCorrect
                            ? { borderColor: 'var(--success)', background: 'var(--success)', color: '#fff' }
                            : submitted && isChosen && !isCorrect
                              ? { borderColor: 'var(--danger)', background: 'var(--danger)', color: '#fff' }
                              : isChosen
                                ? { borderColor: accent, background: accent, color: '#fff' }
                                : { borderColor: 'var(--border)' }
                        }
                      >
                        {submitted && isCorrect && <Check className="w-3.5 h-3.5" />}
                        {submitted && isChosen && !isCorrect && <X className="w-3.5 h-3.5" />}
                        {!submitted && isChosen && <span className="w-2 h-2 rounded-full bg-[var(--card)]" />}
                      </span>
                      <span className={isChosen || (submitted && isCorrect) ? 'text-[var(--text)] font-medium' : 'text-[var(--text)]'}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-[var(--card-2)] border border-[var(--border)] px-3 py-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm disabled:cursor-not-allowed"
            style={{ background: allAnswered ? accent : 'var(--card-2)' }}
          >
            Submit answers
          </button>
        ) : (
          <button
            onClick={retake}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-2)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake quiz
          </button>
        )}
        {!allAnswered && !submitted && (
          <span className="text-sm text-[var(--muted)]">
            {answers.filter(a => a !== null).length}/{total} answered
          </span>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════ */

export default function ModuleClient({
  module,
  track,
  next,
}: {
  module: Module;
  track: Track;
  next: { id: string; title: string; trackTitle: string } | null;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [certificateEarned, setCertificateEarned] = useState(false);

  async function handleComplete(score: number, total: number) {
    setCompleted(true);
    const result = await recordModuleResult(module.id, score, total);
    if (result.certificateEarned) setCertificateEarned(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <AiLearningHeader />

      {/* Module hero */}
      <div className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-8 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All parts
          </Link>

          <div className="mt-5 flex items-center gap-2">
            <span
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: track.accent }}
            >
              {track.eyebrow}
            </span>
            <span className="text-[var(--muted)]">·</span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-[var(--muted)]">
              {module.partLabel}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mt-2 leading-tight">
            {module.title}
          </h1>
          <p className="text-lg text-[var(--muted)] mt-2 leading-relaxed">{module.tagline}</p>
        </div>
      </div>

      {/* Lesson content */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8">
            {module.sections.map((block, i) => (
              <Block key={i} block={block} accent={track.accent} />
            ))}
          </div>

          <hr className="my-10 border-[var(--border)]" />

          <Quiz
            module={module}
            accent={track.accent}
            onComplete={handleComplete}
          />

          {certificateEarned && (
            <div className="mt-8 rounded-2xl border border-amber-300/50 bg-amber-50 dark:bg-amber-400/10 dark:border-amber-400/30 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-[var(--text)]">🎉 You finished all four tracks!</p>
                <p className="text-sm text-[var(--muted)]">Your certificate of completion is ready.</p>
              </div>
              <Link
                href="/certificate"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                View certificate
              </Link>
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all parts
            </Link>

            {next ? (
              <button
                onClick={() => router.push(`/${next.id}`)}
                className="group inline-flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-left transition-all hover:shadow-md"
                style={completed ? { borderColor: track.accent } : undefined}
              >
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                    Next part
                  </span>
                  <span className="block text-sm font-semibold text-[var(--text)]">{next.title}</span>
                </span>
                <ArrowRight
                  className="w-5 h-5 text-[var(--muted)] group-hover:translate-x-0.5 transition-transform"
                  style={completed ? { color: track.accent } : undefined}
                />
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm"
                style={{ background: track.accent }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish — back to series
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
