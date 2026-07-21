'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { Block } from '../components/ContentBlocks';
import Accordion from '../components/Accordion';
import type { ContentBlock } from '../content';
import type { GuideChapter } from '../hackathon-guide';

/** Only 'lead' blocks have no heading - everything else does. */
function blockHeading(block: ContentBlock): string | undefined {
  return block.kind === 'lead' ? undefined : block.heading;
}

/** Strip the heading so it isn't rendered twice (once by the accordion, once by <Block>). */
function withoutHeading(block: ContentBlock): ContentBlock {
  return block.kind === 'lead' ? block : { ...block, heading: undefined };
}

export default function HackathonGuideClient({
  chapters,
  accent,
}: {
  chapters: GuideChapter[];
  accent: string;
  accentSoft?: string;
}) {
  const [activeId, setActiveId] = useState(chapters[0].id);
  const activeIndex = Math.max(0, chapters.findIndex(c => c.id === activeId));
  const active = chapters[activeIndex];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Chapter tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:overflow-visible lg:pb-0">
        {chapters.map((ch, i) => {
          const isActive = ch.id === activeId;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveId(ch.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors lg:w-full ${
                isActive ? '' : 'text-[var(--muted)] hover:bg-[var(--card-2)]'
              }`}
              style={isActive ? { background: `${accent}26`, color: accent } : undefined}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  background: isActive ? accent : 'var(--card-2)',
                  color: isActive ? '#fff' : 'var(--muted)',
                }}
              >
                {i + 1}
              </span>
              <span className="whitespace-nowrap lg:whitespace-normal">{ch.label}</span>
            </button>
          );
        })}

        <a
          href="/hackathon-slide-deck.pdf"
          download
          className="mt-2 flex shrink-0 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 lg:w-full"
          style={{ background: accent }}
        >
          <Download className="h-4 w-4" />
          Download Slideset
        </a>

        <a
          href="/hackathon-rules-and-tools.pdf"
          download
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 px-3.5 py-2.5 text-sm font-bold shadow-sm transition-opacity hover:opacity-80 lg:w-full"
          style={{ borderColor: accent, color: accent }}
        >
          <ShieldCheck className="h-4 w-4" />
          Rules &amp; Tools
        </a>
      </nav>

      {/* Active chapter */}
      <div key={active.id}>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
          {active.label}
        </p>
        <h3 className="mt-1 text-2xl font-bold leading-tight text-[var(--text)]">{active.title}</h3>
        <p className="mt-1.5 text-[var(--muted)]">{active.tagline}</p>

        <div className="mt-6 flex flex-col gap-3">
          {active.sections.map((block, i) => {
            const heading = blockHeading(block);
            // Blocks without a heading (short intros) render inline, not collapsed.
            if (!heading) {
              return <Block key={i} block={block} accent={accent} />;
            }
            return (
              <Accordion key={i} title={heading} accent={accent} defaultOpen={i === 0}>
                <Block block={withoutHeading(block)} accent={accent} />
              </Accordion>
            );
          })}
        </div>

        {/* Prev / next chapter */}
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            onClick={() => activeIndex > 0 && setActiveId(chapters[activeIndex - 1].id)}
            disabled={activeIndex === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] disabled:opacity-30 disabled:hover:text-[var(--muted)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => activeIndex < chapters.length - 1 && setActiveId(chapters[activeIndex + 1].id)}
            disabled={activeIndex === chapters.length - 1}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity disabled:opacity-30"
            style={{ color: accent }}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
