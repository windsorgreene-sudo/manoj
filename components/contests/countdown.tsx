"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86_400), h: Math.floor((s % 86_400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live countdown to `target`. Refreshes the route when it hits zero so the phase flips server-side. */
export function Countdown({ target, label, compact = false }: { target: string; label: string; compact?: boolean }) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = requestAnimationFrame(tick);
    const iv = window.setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(iv);
    };
  }, []);
  const left = now === null ? null : new Date(target).getTime() - now;
  useEffect(() => {
    if (left !== null && left <= 0 && left > -1500) router.refresh();
  }, [left, router]);
  if (left === null) return <span className="shimmer inline-block h-6 w-40 rounded" aria-hidden />;
  const p = parts(left);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (compact)
    return (
      <span className="font-mono tabular-nums" aria-label={`${label} ${p.d} days ${p.h} hours ${p.m} minutes`}>
        {p.d ? `${p.d}d ` : ""}
        {pad(p.h)}:{pad(p.m)}:{pad(p.s)}
      </span>
    );
  return (
    <div role="timer" aria-live="off" aria-label={`${label}: ${p.d} days ${p.h} hours ${p.m} minutes ${p.s} seconds`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex gap-2 font-mono text-2xl font-bold tabular-nums">
        {[
          { v: p.d, u: "d" },
          { v: p.h, u: "h" },
          { v: p.m, u: "m" },
          { v: p.s, u: "s" },
        ].map((x) => (
          <span key={x.u} className="glass rounded-xl px-3 py-1.5">
            {pad(x.v)}
            <span className="ml-0.5 text-xs text-muted-foreground">{x.u}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
