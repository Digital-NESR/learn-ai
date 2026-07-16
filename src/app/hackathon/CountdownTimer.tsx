'use client';

import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

function splitRemaining(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Unit({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div
      className="animate-glow-pulse relative flex w-16 flex-col items-center gap-1 rounded-xl border px-2 py-3 sm:w-20 sm:py-4"
      style={{
        borderColor: `${accent}40`,
        background: `linear-gradient(160deg, ${accent}1f, transparent)`,
        // Custom props consumed by the glow-pulse keyframe in globals.css.
        ['--glow-color' as string]: `${accent}59`,
        ['--glow-color-transparent' as string]: `${accent}00`,
      }}
    >
      <span className="text-2xl font-black tabular-nums tracking-tight sm:text-3xl" style={{ color: accent }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ targetIso, accent }: { targetIso: string; accent: string }) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Avoid a server/client mismatch: render nothing until the first client tick lands.
  if (now === null) return null;

  const remaining = target - now;
  if (remaining <= 0) {
    return (
      <div
        className="mx-auto mt-8 inline-flex max-w-xl items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        style={{ borderColor: `${accent}55`, background: `${accent}1a`, color: accent }}
      >
        <Rocket className="h-4 w-4" />
        The hackathon has started!
      </div>
    );
  }

  const { days, hours, minutes, seconds } = splitRemaining(remaining);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
        <Rocket className="h-3.5 w-3.5" />
        Countdown to launch
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <Unit value={days} label="Days" accent={accent} />
        <span className="text-2xl font-black text-[var(--muted)]">:</span>
        <Unit value={hours} label="Hrs" accent={accent} />
        <span className="text-2xl font-black text-[var(--muted)]">:</span>
        <Unit value={minutes} label="Min" accent={accent} />
        <span className="text-2xl font-black text-[var(--muted)]">:</span>
        <Unit value={seconds} label="Sec" accent={accent} />
      </div>
    </div>
  );
}
