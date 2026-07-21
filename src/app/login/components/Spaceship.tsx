export type ShipPhase = 'idle' | 'ignition' | 'launch';

/**
 * A sleek, minimalist spaceship - deliberately abstract/geometric rather than
 * cartoonish, matching the enterprise-friendly black/neon-green theme.
 * Purely presentational: the phase prop drives which CSS animation classes
 * apply, all defined in globals.css (and folded into the site's existing
 * prefers-reduced-motion override).
 */
export default function Spaceship({ phase }: { phase: ShipPhase }) {
  const engineClass =
    phase === 'ignition' ? 'animate-engine-flare' : phase === 'launch' ? 'animate-engine-flare' : 'animate-engine-glow';
  const bodyWrapClass = phase === 'launch' ? 'animate-ship-liftoff' : 'animate-ship-idle';

  return (
    <div className={`relative w-full ${bodyWrapClass}`} aria-hidden="true">
      <svg viewBox="0 0 160 320" className="w-full h-auto overflow-visible" role="img">
        <defs>
          <linearGradient id="hull" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0f0d" />
            <stop offset="50%" stopColor="#161f1b" />
            <stop offset="100%" stopColor="#0a0f0d" />
          </linearGradient>
          <radialGradient id="cockpit" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#c6ffe0" />
            <stop offset="55%" stopColor="#39ff88" />
            <stop offset="100%" stopColor="#0a3d24" />
          </radialGradient>
          <radialGradient id="engineGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#c6ffe0" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#2bff85" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2bff85" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39ff88" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#39ff88" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Exhaust trail - only meaningful during launch */}
        {phase === 'launch' && (
          <rect x="62" y="270" width="36" height="140" fill="url(#trail)" className="animate-trail-stretch" style={{ transformOrigin: '80px 270px' }} />
        )}

        {/* Engine glow, behind the hull */}
        <ellipse cx="80" cy="278" rx="30" ry="16" fill="url(#engineGlow)" className={engineClass} style={{ transformOrigin: '80px 278px' }} />

        {/* Hull */}
        <path
          d="M80,8
             C100,60 118,112 112,172
             C110,206 108,232 104,256
             L122,302
             L96,270
             L64,270
             L38,302
             L56,256
             C52,232 50,206 48,172
             C42,112 60,60 80,8
             Z"
          fill="url(#hull)"
          stroke="#39ff88"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />

        {/* Panel detail lines */}
        <path d="M68,60 C60,110 58,160 62,210" fill="none" stroke="#39ff88" strokeOpacity="0.3" strokeWidth="1" />
        <path d="M92,60 C100,110 102,160 98,210" fill="none" stroke="#39ff88" strokeOpacity="0.3" strokeWidth="1" />

        {/* Cockpit */}
        <ellipse cx="80" cy="88" rx="15" ry="21" fill="url(#cockpit)" stroke="#0a3d24" strokeWidth="1" />

        {/* Nozzles */}
        <ellipse cx="66" cy="266" rx="9" ry="6" fill="#05140c" stroke="#39ff88" strokeOpacity="0.4" />
        <ellipse cx="94" cy="266" rx="9" ry="6" fill="#05140c" stroke="#39ff88" strokeOpacity="0.4" />
      </svg>
    </div>
  );
}
