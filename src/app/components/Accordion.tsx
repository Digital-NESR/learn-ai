'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  title,
  accent,
  defaultOpen = false,
  children,
}: {
  title: string;
  accent: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="font-semibold text-[var(--text)]">{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-200"
          style={{ color: accent, transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {open && <div className="border-t border-[var(--border)] p-4 pt-4">{children}</div>}
    </div>
  );
}
