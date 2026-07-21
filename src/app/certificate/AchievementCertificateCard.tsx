import Image from 'next/image';
import type { AchievementId } from '@/lib/achievements';
import { ACHIEVEMENT_CERT_META, TIER_STYLE } from '@/lib/achievement-certificates';
import { certificateFontVars } from './fonts';

const CINZEL = 'var(--font-cinzel), serif';
const CORMORANT = 'var(--font-cormorant-garamond), serif';
const EB_GARAMOND = 'var(--font-eb-garamond), serif';

/**
 * Reproduces Certificate.dc.html from the "NESR AI Learning Certificates"
 * Claude Design project 1:1 — do not restyle without updating that project.
 * Fixed 1040x735 canvas (A4-landscape-shaped) so print output stays crisp.
 */
export default function AchievementCertificateCard({
  achievementId,
  recipientName,
  issuedAt,
}: {
  achievementId: AchievementId;
  recipientName: string;
  issuedAt: string;
}) {
  const meta = ACHIEVEMENT_CERT_META[achievementId];
  const style = TIER_STYLE[meta.tier];
  const date = new Date(issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className={certificateFontVars}
      style={{
        width: 1040,
        height: 735,
        background: 'radial-gradient(circle at 50% 32%,#ffffff,#F3F0E6)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: EB_GARAMOND,
        color: '#20302a',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(45deg,rgba(11,107,84,.05) 0 2px,transparent 2px 12px)',
        }}
      />
      <div aria-hidden style={{ position: 'absolute', inset: 30, border: '3px double #0B6B54' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 44, border: '1px solid rgba(184,145,46,.55)' }} />
      {style.regal && (
        <div aria-hidden style={{ position: 'absolute', inset: 52, border: '1px solid rgba(184,145,46,.9)' }} />
      )}

      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '50px 80px 72px',
        }}
      >
        <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 31, letterSpacing: '.13em', color: '#08402F' }}>
          Certificate of Achievement
        </div>
        <div style={{ fontFamily: CINZEL, fontSize: 12, letterSpacing: '.4em', color: '#B8912E', marginTop: 7 }}>
          NESR&nbsp;&nbsp;AI&nbsp;&nbsp;VERSE
        </div>

        <div style={{ position: 'relative', marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 156, height: 156 }}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: style.ringGrad,
                boxShadow: '0 8px 20px -6px rgba(0,0,0,.35)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 9,
                borderRadius: '50%',
                background: style.medalBg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 2px rgba(234,208,138,.7)',
              }}
            >
              <Image
                src="/certificates/nesr-wings.png"
                alt=""
                width={676}
                height={288}
                style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
              />
              <span style={{ fontSize: 12, letterSpacing: '.18em', marginTop: 5, color: style.accent }}>
                {style.pips}
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: -15,
              background: style.ribbonBg,
              color: style.ribbonText,
              fontFamily: CINZEL,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '.15em',
              padding: '7px 28px',
              boxShadow: '0 4px 10px -3px rgba(0,0,0,.35)',
              clipPath: 'polygon(9px 0,calc(100% - 9px) 0,100% 50%,calc(100% - 9px) 100%,9px 100%,0 50%)',
            }}
          >
            {meta.tierName}
          </div>
        </div>

        <div style={{ fontStyle: 'italic', fontSize: 18, color: '#5a675f', marginTop: 18 }}>This certifies that</div>
        <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 56, lineHeight: 1, color: '#20302a', marginTop: 4 }}>
          {recipientName}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <span aria-hidden style={{ width: 60, height: 1, background: style.accent }} />
          <span style={{ fontFamily: CINZEL, fontWeight: 600, fontSize: 20, letterSpacing: '.04em', color: '#0B6B54' }}>
            {meta.heading}
          </span>
          <span aria-hidden style={{ width: 60, height: 1, background: style.accent }} />
        </div>

        <div style={{ maxWidth: 660, fontSize: 16, lineHeight: 1.55, color: '#465249', marginTop: 14, textWrap: 'pretty' }}>
          {meta.description}
        </div>

        <div style={{ marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: CORMORANT, fontSize: 24 }}>{date}</div>
            <div aria-hidden style={{ width: 150, height: 1, background: 'rgba(32,48,42,.35)', margin: '5px auto 0' }} />
            <div style={{ fontFamily: CINZEL, fontSize: 11, letterSpacing: '.2em', color: '#8a8578', marginTop: 6 }}>
              DATE AWARDED
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: CORMORANT, fontStyle: 'italic', fontSize: 26 }}>NESR Digital</div>
            <div aria-hidden style={{ width: 150, height: 1, background: 'rgba(32,48,42,.35)', margin: '5px auto 0' }} />
            <div style={{ fontFamily: CINZEL, fontSize: 11, letterSpacing: '.2em', color: '#8a8578', marginTop: 6 }}>
              ISSUED BY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
