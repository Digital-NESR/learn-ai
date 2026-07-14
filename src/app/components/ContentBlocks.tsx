'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ContentBlock } from '../content';

/**
 * Renders one `ContentBlock` (lead / cards / compare / steps / flow /
 * glossary / list / checklist / video). Shared by course module pages and
 * the Hackathon prep guide, so both read from the same content model and
 * pick up new block kinds (e.g. video) automatically.
 */

export function SectionHeading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-1.5 h-5 rounded-full" style={{ background: accent }} />
      <h3 className="text-lg font-bold text-[var(--text)]">{children}</h3>
    </div>
  );
}

export function Block({ block, accent, accentSoft }: { block: ContentBlock; accent: string; accentSoft: string }) {
  switch (block.kind) {
    case 'lead':
      return (
        <div className="rounded-2xl p-6" style={{ background: accentSoft }}>
          <p className="text-xl font-bold text-[var(--text)] leading-snug" style={{ color: accent }}>
            {block.text}
          </p>
          <p className="text-[15px] text-[var(--text)] mt-3 leading-relaxed">{block.body}</p>
        </div>
      );

    case 'cards':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {block.cards.map(c => (
              <div key={c.title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="font-semibold text-[var(--text)]" style={{ color: accent }}>
                  {c.title}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'compare':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <div className="grid sm:grid-cols-2 gap-4">
            {[block.left, block.right].map((col, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="font-semibold text-[var(--text)] mb-3">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: accent }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case 'steps':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <div className="flex flex-col gap-3">
            {block.steps.map((s, i) => (
              <div
                key={s.title}
                className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: accentSoft, color: accent }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)] text-[15px]">{s.title}</p>
                  {s.body && <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{s.body}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'flow':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          {block.body && <p className="text-[15px] text-[var(--text)] leading-relaxed mb-4">{block.body}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {block.nodes.map((node, i) => (
              <div key={node} className="flex items-center gap-2">
                <span
                  className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium border"
                  style={{ background: accentSoft, color: accent, borderColor: `${accent}33` }}
                >
                  {node}
                </span>
                {i < block.nodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 shrink-0" style={{ color: accent }} />
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'glossary':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <dl className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] overflow-hidden">
            {block.terms.map(t => (
              <div key={t.term} className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 p-4">
                <dt className="font-semibold text-[var(--text)]" style={{ color: accent }}>
                  {t.term}
                </dt>
                <dd className="text-sm text-[var(--muted)] leading-relaxed">{t.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case 'list':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <div className="flex flex-col gap-3">
            {block.items.map(item => (
              <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="font-semibold text-[var(--text)] text-[15px]">{item.title}</p>
                <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'checklist':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          <ul className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] overflow-hidden">
            {block.items.map(item => (
              <li key={item} className="flex items-start gap-3 p-4">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="text-sm text-[var(--text)] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'video':
      return (
        <div>
          {block.heading && <SectionHeading accent={accent}>{block.heading}</SectionHeading>}
          {/* Responsive 16:9 embed — fills the content column on any screen size. */}
          <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-[var(--border)] bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.heading ?? 'Lesson video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          {block.caption && <p className="mt-2 text-sm text-[var(--muted)]">{block.caption}</p>}
        </div>
      );
  }
}
