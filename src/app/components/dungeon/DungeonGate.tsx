'use client';

import { Flame, Swords } from 'lucide-react';

/** The entry screen - replaces the old plain hero. Always-dark regardless of
 * site theme, same convention as the rest of the app's cinematic banners
 * (see the login page's launch sequence). Green (NESR brand), not orange. */
export default function DungeonGate({
  totalModules,
  completedCount,
  onEnter,
}: {
  totalModules: number;
  completedCount: number;
  onEnter: () => void;
}) {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#0a0f0c] text-white">
      {/* Stone vignette + fog */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(20,58,40,0.55),transparent_65%)]" />
        <div className="animate-fog-drift absolute inset-x-[-10%] top-1/2 h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(110,130,110,0.14),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent_20%,transparent_75%,rgba(0,0,0,0.7))]" />
      </div>

      {/* Torch glows */}
      <div aria-hidden className="pointer-events-none absolute left-[8%] top-1/3 hidden sm:block">
        <Flame className="animate-torch-flicker h-10 w-10 text-[#45c07a] drop-shadow-[0_0_18px_rgba(69,192,122,0.8)]" />
      </div>
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-1/3 hidden sm:block">
        <Flame
          className="animate-torch-flicker h-10 w-10 text-[#45c07a] drop-shadow-[0_0_18px_rgba(69,192,122,0.8)]"
          style={{ animationDelay: '1.1s' }}
        />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-[#45c07a]/25 bg-[#45c07a]/10 px-3 py-1">
          <Flame className="h-3.5 w-3.5 text-[#7ee3a8]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#a7f3c6]">
            NESR AI Verse
          </span>
        </div>

        <h1
          className="animate-fade-up text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          The AI Dungeon
        </h1>

        <p
          className="animate-fade-up mt-4 max-w-md text-lg leading-relaxed text-white/70"
          style={{ animationDelay: '160ms' }}
        >
          Seven realms of AI knowledge. Clear islands, earn achievements, unlock your certificate.
        </p>

        <div
          className="animate-fade-up mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
          style={{ animationDelay: '220ms' }}
        >
          {completedCount} / {totalModules} islands cleared
        </div>

        <button
          onClick={onEnter}
          className="animate-fade-up group mt-9 inline-flex items-center gap-2.5 rounded-full bg-[#45c07a] px-7 py-3.5 text-base font-semibold text-[#08160f] shadow-[0_0_30px_rgba(69,192,122,0.4)] transition-transform hover:scale-[1.03] hover:bg-[#5ed492] active:scale-95"
          style={{ animationDelay: '300ms' }}
        >
          <Swords className="h-5 w-5" />
          Enter the Dungeon
        </button>
      </div>
    </section>
  );
}
