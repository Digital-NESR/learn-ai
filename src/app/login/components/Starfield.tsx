// Deterministic pseudo-random positions (no Math.random()/Date.now() at
// render time) so server and client output match exactly and React never
// warns about a hydration mismatch.
//
// Stars are excluded from a central "safe zone" where the ship + login panel
// sit — a twinkling dot behind the headline/button text reads as a flashing
// artifact and hurts contrast there, so keep the whole starfield in the margins.
const SAFE_ZONE = { xMin: 12, xMax: 88, yMin: 8, yMax: 95 };

function seededStars(count: number) {
  const stars: { x: number; y: number; r: number; delay: number }[] = [];
  let seed = 42;
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  while (stars.length < count) {
    const x = next() * 100;
    const y = next() * 100;
    const r = 0.4 + next() * 1.1;
    const delay = next() * 4;
    if (x >= SAFE_ZONE.xMin && x <= SAFE_ZONE.xMax && y >= SAFE_ZONE.yMin && y <= SAFE_ZONE.yMax) continue;
    stars.push({ x, y, r, delay });
  }
  return stars;
}

const STARS = seededStars(70);

/** Subtle twinkling starfield + soft green glow washes, purely decorative. */
export default function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full bg-[#39ff88]/10 blur-3xl animate-aurora" />
      <div
        className="absolute -right-1/4 bottom-0 h-[55vh] w-[55vh] rounded-full bg-[#22c55e]/10 blur-3xl animate-aurora"
        style={{ animationDuration: '26s' }}
      />
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#8ff0b6"
            className="animate-twinkle"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
