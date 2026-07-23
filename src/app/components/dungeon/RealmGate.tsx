'use client';

import type { CSSProperties } from 'react';

const FLAME_BASE: CSSProperties = {
  position: 'absolute',
  top: 24,
  zIndex: 4,
  width: 11,
  height: 17,
  borderRadius: '50% 50% 45% 45% / 62% 62% 38% 38%',
  background: 'radial-gradient(circle at 50% 72%, #fff4c8, #ffb347 42%, #ff6a00 76%, transparent)',
  boxShadow: '0 0 15px 4px rgba(255,150,40,.7)',
};

export interface RealmGateProps {
  /** e.g. "GENERAL" / "TECHNICAL" / "PRODUCTIVITY" / "YOUR HONOURS" */
  trackLabel: string;
  title: string;
  /** e.g. "Beginner" / "Every certificate earned" */
  tierLabel: string;
  /** track-family color (arch inner glow + track label) */
  glow: string;
  /** tier color (gem / keystone numeral / cta) */
  accent: string;
  /** "I" / "II" / "III" - omitted for the trophy gate */
  depth?: string;
  /** "done / total" - omitted for the trophy gate */
  progressLabel?: string;
  cta: string;
  isTrophy?: boolean;
  /** Reads "UNDER CONSTRUCTION" / "SOON" instead of progress/CTA - shown to everyone regardless of `locked`. */
  underConstruction?: boolean;
  /** Gate is greyed out and unclickable (non-admins on an under-construction track). */
  locked?: boolean;
  onSelect: () => void;
}

/** One arch on the Dungeon Gates hall - reproduces "Realm Select.dc.html"
 * from the shared Claude Design project 1:1 (do not restyle without
 * updating the design project too). */
export default function RealmGate({
  trackLabel,
  title,
  tierLabel,
  glow,
  accent,
  depth,
  progressLabel,
  cta,
  isTrophy,
  underConstruction,
  locked,
  onSelect,
}: RealmGateProps) {
  const frameTop = isTrophy ? '#6b5f3f' : '#5a5661';
  const frameBot = isTrophy ? '#3a3120' : '#312e38';

  return (
    <button
      onClick={locked ? undefined : onSelect}
      disabled={locked}
      aria-disabled={locked}
      className={`group relative flex w-full flex-col items-center text-left transition-transform duration-200 ${
        locked ? 'cursor-not-allowed grayscale' : 'hover:-translate-y-[7px]'
      }`}
      style={locked ? { opacity: 0.55 } : undefined}
    >
      <span className="animate-torch-flicker-a" style={{ ...FLAME_BASE, left: -16 }} aria-hidden />
      <span className="animate-torch-flicker-b" style={{ ...FLAME_BASE, right: -16 }} aria-hidden />

      <div className="relative h-[170px] w-full">
        {/* frame */}
        <div
          className="absolute inset-0 rounded-t-[64px] rounded-b-[6px]"
          style={{
            background: `linear-gradient(180deg, ${frameTop}, ${frameBot})`,
            boxShadow: '0 10px 26px -8px rgba(0,0,0,.85), inset 0 3px 0 rgba(255,255,255,.09)',
          }}
        />
        {/* inner glow */}
        <div
          className="absolute overflow-hidden rounded-t-[56px] rounded-b-[4px]"
          style={{ inset: 9, background: `radial-gradient(130% 78% at 50% 120%, ${glow}, rgba(8,8,10,.97) 58%)` }}
        >
          {isTrophy ? (
            <div
              className="absolute left-1/2 bottom-[26px] flex h-[58px] w-[58px] -translate-x-1/2 items-center justify-center rounded-full transition-all duration-200 group-hover:brightness-[1.18] group-hover:[box-shadow:0_0_34px_4px_rgba(234,208,138,.85)]"
              style={{
                background: 'conic-gradient(#EAD08A,#B8912E,#8a6a1e,#EAD08A,#B8912E)',
                boxShadow: '0 0 30px 4px rgba(234,208,138,.55)',
              }}
            >
              <div
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full"
                style={{
                  background: 'radial-gradient(circle at 50% 40%, #0e7a5f, #08402F)',
                  boxShadow: 'inset 0 0 0 2px rgba(234,208,138,.65)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed small icon, matches sibling certificate components' plain <img> convention */}
                <img
                  src="/certificates/nesr-wings.png"
                  alt=""
                  style={{ height: 22, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                className="absolute left-1/2 bottom-[26px] h-[38px] w-[38px] -translate-x-1/2 rounded-full transition-all duration-200 group-hover:brightness-[1.18]"
                style={{
                  background: `radial-gradient(circle at 50% 34%, #fff, ${accent} 56%, rgba(0,0,0,.3))`,
                  boxShadow: `0 0 22px ${accent}`,
                }}
              />
              <div
                className="absolute inset-x-0 bottom-2.5 text-center text-[9px] font-bold tracking-[.16em]"
                style={{ color: accent }}
              >
                {underConstruction ? 'UNDER CONSTRUCTION' : progressLabel}
              </div>
            </>
          )}
        </div>

        {/* keystone */}
        {isTrophy ? (
          <div
            className="absolute -top-1 left-1/2 flex h-8 w-11 -translate-x-1/2 items-center justify-center"
            style={{
              clipPath: 'polygon(18% 0,82% 0,100% 100%,0 100%)',
              background: 'linear-gradient(180deg,#EAD08A,#B8912E)',
              boxShadow: '0 3px 10px -3px rgba(0,0,0,.7)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3a2c0c" strokeWidth={2.2}>
              <path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0V4zM6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3" />
            </svg>
          </div>
        ) : (
          <div
            className="absolute -top-1 left-1/2 flex h-[30px] w-10 -translate-x-1/2 items-center justify-center"
            style={{
              clipPath: 'polygon(18% 0,82% 0,100% 100%,0 100%)',
              background: 'linear-gradient(180deg,#615d68,#3b3843)',
              boxShadow: '0 3px 8px -3px rgba(0,0,0,.7)',
            }}
          >
            <span
              className="text-[15px] font-extrabold"
              style={{ color: accent, fontFamily: 'var(--font-cinzel), serif', letterSpacing: '.02em' }}
            >
              {depth}
            </span>
          </div>
        )}
      </div>

      {/* plate */}
      <div className="w-full pt-3 text-center">
        <div className="text-[9px] font-bold tracking-[.18em]" style={{ color: glow }}>
          {trackLabel}
        </div>
        <div
          className="mt-0.5 text-[16px] font-semibold leading-tight text-[#F1EDE4]"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          {title}
        </div>
        <div
          className="mt-0.5 text-[13px] italic text-[#9c968a]"
          style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
        >
          {tierLabel}
        </div>
        {underConstruction && locked ? (
          <div className="mt-2.5 text-[10px] font-bold tracking-[.14em] text-[#9c968a]">SOON</div>
        ) : (
          <div
            className="mt-2.5 translate-y-1.5 text-[10px] font-bold tracking-[.14em] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ color: accent }}
          >
            {cta} →
          </div>
        )}
      </div>
    </button>
  );
}
