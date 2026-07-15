// Deterministic pseudo-random positions (no Math.random()/Date.now() at
// render time) so server and client output match exactly and React never
// warns about a hydration mismatch.
function seededStars(count: number) {
  const stars: { x: number; y: number; r: number; delay: number }[] = [];
  let seed = 42;
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: next() * 100,
      y: next() * 100,
      r: 0.4 + next() * 1.1,
      delay: next() * 4,
    });
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
