'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Lock, X } from 'lucide-react';
import type { AchievementId } from '@/lib/achievements';
import type { CertTier } from '@/lib/achievement-certificates';
import { TIER_STYLE } from '@/lib/achievement-certificates';
import AchievementCertificateCard from './AchievementCertificateCard';
import { certificateFontVars } from './fonts';

export interface TrophyTile {
  id: AchievementId;
  group: string;
  title: string;
  tier: CertTier;
  tierName: string;
  /** The certificate's own description — always present, shown on the finale banner. */
  description: string;
  earned: boolean;
  /** The next reachable tier in its chain — highlighted, not earned. */
  next: boolean;
  /** Formatted date string, only set when earned. */
  date?: string;
  /** Raw ISO issued-at, only set when earned — feeds the certificate modal. */
  issuedAt?: string;
  /** Plain-language hint, only set when locked. */
  requirement?: string;
}

const CINZEL = 'var(--font-cinzel), serif';
const CORMORANT = 'var(--font-cormorant-garamond), serif';
const EB_GARAMOND = 'var(--font-eb-garamond), serif';

function Medal({ tile, size }: { tile: TrophyTile; size: number }) {
  const style = TIER_STYLE[tile.tier];
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size, filter: tile.earned ? 'none' : 'grayscale(.85) brightness(.62)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: style.ringGrad, boxShadow: '0 6px 16px -5px rgba(0,0,0,.6)' }}
      />
      <div
        className="absolute flex flex-col items-center justify-center rounded-full"
        style={{
          inset: size * 0.06,
          background: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
          boxShadow: 'inset 0 0 0 2px rgba(234,208,138,.6)',
        }}
      >
        <Image
          src="/certificates/nesr-wings.png"
          alt=""
          width={676}
          height={288}
          style={{ height: size * 0.27, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
        />
        <span style={{ fontSize: size * 0.08, letterSpacing: '.14em', marginTop: size * 0.025, color: style.accent }}>
          {style.pips}
        </span>
      </div>
      {!tile.earned && (
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: size * 0.34,
            height: size * 0.34,
            background: 'rgba(8,26,20,.82)',
            border: '1px solid rgba(201,162,75,.5)',
          }}
        >
          <Lock className="h-4 w-4" style={{ color: '#EAD08A' }} />
        </div>
      )}
    </div>
  );
}

function TrophyTileCard({ tile, onView }: { tile: TrophyTile; onView: () => void }) {
  const style = TIER_STYLE[tile.tier];
  const frame = tile.earned ? 'rgba(234,208,138,.45)' : tile.next ? 'rgba(234,208,138,.35)' : 'rgba(255,255,255,.08)';
  return (
    <div
      className="relative flex flex-col items-center overflow-hidden rounded-2xl px-5 py-6 text-center"
      style={{
        background: 'linear-gradient(180deg,rgba(23,58,45,.9),rgba(12,34,26,.9))',
        border: `1px solid ${frame}`,
        boxShadow: '0 20px 40px -24px rgba(0,0,0,.8)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)' }}
      />
      {tile.next && (
        <span
          className="absolute right-3.5 top-3.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider"
          style={{ background: 'linear-gradient(90deg,#EAD08A,#C9A24B)', color: '#0a241b', letterSpacing: '.14em' }}
        >
          UP NEXT
        </span>
      )}

      <div className="text-[11px] font-semibold tracking-[.2em]" style={{ color: '#7FA593' }}>
        {tile.group}
      </div>

      <div className="mt-4">
        <Medal tile={tile} size={112} />
      </div>

      <div
        className="-mt-3 px-4 py-1.5 text-[10px] font-bold tracking-[.14em]"
        style={{
          background: style.ribbonBg,
          color: style.ribbonText,
          fontFamily: CINZEL,
          opacity: tile.earned ? 1 : 0.5,
          clipPath: 'polygon(7px 0,calc(100% - 7px) 0,100% 50%,calc(100% - 7px) 100%,7px 100%,0 50%)',
        }}
      >
        {tile.tierName}
      </div>

      <div className="mt-3.5 text-[18px] font-semibold leading-tight" style={{ fontFamily: CINZEL, color: '#F4F8F2' }}>
        {tile.title}
      </div>

      {tile.earned ? (
        <>
          <div className="mt-2 flex items-center gap-1.5 text-[13px]" style={{ color: '#5FD1A3' }}>
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
            Earned · {tile.date}
          </div>
          <button
            onClick={onView}
            className="mt-4 rounded-full px-5 py-2 text-[13px] font-semibold transition-[filter] hover:brightness-110"
            style={{ background: 'linear-gradient(90deg,#EAD08A,#C9A24B)', color: '#0a241b' }}
          >
            View certificate
          </button>
        </>
      ) : (
        <>
          <div
            className="mt-2 min-h-[38px] max-w-[210px] text-[14px] leading-snug"
            style={{ fontFamily: EB_GARAMOND, color: '#8FA79A' }}
          >
            {tile.requirement}
          </div>
          <div
            className="mt-3 rounded-full px-5 py-2 text-[13px] font-semibold"
            style={{ color: '#7FA593', border: '1px solid rgba(127,165,147,.35)' }}
          >
            Locked
          </div>
        </>
      )}
    </div>
  );
}

export default function TrophyHallClient({
  tiles,
  master,
  earnedCount,
  total,
  recipientName,
}: {
  tiles: TrophyTile[];
  master: TrophyTile;
  earnedCount: number;
  total: number;
  recipientName: string;
}) {
  const [selected, setSelected] = useState<TrophyTile | null>(null);
  const pct = total > 0 ? Math.round((earnedCount / total) * 100) : 0;
  const remaining = total - earnedCount;

  return (
    <div
      className={certificateFontVars}
      style={{
        minHeight: '100%',
        background: 'radial-gradient(120% 80% at 50% -10%,#0e3125 0%,#0a241b 45%,#071711 100%)',
        color: '#EAF2EC',
        paddingBottom: 90,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: 'radial-gradient(60% 40% at 50% 0%,rgba(201,162,75,.10),transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center px-6 pt-14 text-center sm:px-10">
        <Image
          src="/certificates/nesr-wings.png"
          alt="NESR"
          width={676}
          height={288}
          style={{ height: 52, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
        />
        <div className="mt-3.5 text-[13px] tracking-[.42em]" style={{ fontFamily: CINZEL, color: '#C9A24B' }}>
          NESR&nbsp;&nbsp;AI&nbsp;&nbsp;VERSE
        </div>
        <h1 className="mt-2 text-[44px] font-bold tracking-wide" style={{ fontFamily: CINZEL, color: '#F4F8F2' }}>
          The Trophy Hall
        </h1>
        <p className="mt-3 max-w-[600px] text-lg leading-relaxed" style={{ fontFamily: EB_GARAMOND, color: '#9DBAAC' }}>
          Every certificate you&apos;ve earned, and every honour still waiting to be claimed across the realms.
        </p>

        <div
          className="mt-8 w-full max-w-[560px] rounded-2xl px-6 py-5"
          style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(201,162,75,.28)' }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] tracking-[.16em]" style={{ fontFamily: CINZEL, color: '#C9A24B' }}>
              CERTIFICATES EARNED
            </span>
            <span className="text-[30px]" style={{ fontFamily: CORMORANT, color: '#F4F8F2' }}>
              <b style={{ color: '#EAD08A' }}>{earnedCount}</b> / {total}
            </span>
          </div>
          <div className="mt-3.5 h-[9px] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.09)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg,#B8912E,#EAD08A)',
                boxShadow: '0 0 12px rgba(234,208,138,.5)',
              }}
            />
          </div>
          <div className="mt-3 text-[13px] tracking-wide" style={{ color: '#8FA79A' }}>
            {remaining === 0
              ? 'All honours claimed — you are a Dungeon Master.'
              : `${remaining} more to reach 100% and unlock Dungeon Master`}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative mx-auto mt-12 max-w-[1180px] px-6 sm:px-10">
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))' }}>
          {tiles.map(tile => (
            <TrophyTileCard key={tile.id} tile={tile} onView={() => setSelected(tile)} />
          ))}
        </div>

        {/* Finale: Dungeon Master */}
        <div
          className="mt-6 flex flex-wrap items-center gap-8 rounded-[20px] p-8"
          style={{
            background: 'linear-gradient(120deg,#111417,#1c2024 60%,#0c2c22)',
            border: `1px solid ${master.earned ? 'rgba(234,208,138,.45)' : 'rgba(255,255,255,.08)'}`,
            boxShadow: '0 24px 50px -26px rgba(0,0,0,.9)',
          }}
        >
          <Medal tile={master} size={132} />
          <div className="min-w-[240px] flex-1">
            <div className="text-[11px] font-semibold tracking-[.22em]" style={{ color: '#C9A24B' }}>
              THE FINAL HONOUR
            </div>
            <div className="mt-1.5 text-[30px] font-bold" style={{ fontFamily: CINZEL, color: '#F4F8F2' }}>
              Dungeon Master · 100%
            </div>
            <p className="mt-2 max-w-[520px] text-base" style={{ fontFamily: EB_GARAMOND, color: '#9DBAAC' }}>
              {master.requirement ?? master.description}
            </p>
          </div>
          {master.earned ? (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-sm" style={{ color: '#5FD1A3' }}>
                <Check className="h-4 w-4" strokeWidth={2.6} />
                Earned · {master.date}
              </div>
              <button
                onClick={() => setSelected(master)}
                className="mt-3 rounded-full px-5 py-2 text-[13px] font-semibold transition-[filter] hover:brightness-110"
                style={{ background: 'linear-gradient(90deg,#EAD08A,#C9A24B)', color: '#0a241b' }}
              >
                View certificate
              </button>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-[34px]" style={{ fontFamily: CORMORANT, color: '#EAD08A' }}>
                <b>{earnedCount}</b> <span style={{ color: '#7FA593' }}>/ {total}</span>
              </div>
              <div className="mt-0.5 text-xs tracking-[.14em]" style={{ color: '#7FA593' }}>
                TO UNLOCK
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-8"
          style={{ background: 'rgba(4,14,10,.82)', backdropFilter: 'blur(6px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="flex flex-col items-center gap-4"
            style={{ transform: 'scale(0.82)', transformOrigin: 'center' }}
          >
            <div className="max-w-full overflow-x-auto rounded-2xl shadow-2xl">
              <AchievementCertificateCard
                achievementId={selected.id}
                recipientName={recipientName}
                issuedAt={selected.issuedAt ?? new Date().toISOString()}
              />
            </div>
          </div>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="fixed right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full text-lg"
            style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(234,208,138,.4)', color: '#EAD08A' }}
          >
            <X className="h-5 w-5" />
          </button>
          <Link
            href={`/certificate/${selected.id}`}
            onClick={e => e.stopPropagation()}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: 'linear-gradient(90deg,#EAD08A,#C9A24B)', color: '#0a241b' }}
          >
            Open full page to print
          </Link>
        </div>
      )}
    </div>
  );
}
