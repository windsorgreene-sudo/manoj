"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RoadmapNode = { id: string; label: string; x: number; y: number; href: string; kind: "core" | "optional" | "advanced" | "practice" };

const COL = 260;
const ROW = 110;
const W = 200;
const H = 56;
const KIND = {
  core: { stroke: "#7C3AED", label: "Core" },
  optional: { stroke: "#A1A1B8", label: "Optional" },
  advanced: { stroke: "#EF4444", label: "Advanced" },
  practice: { stroke: "#84CC16", label: "Practice" },
} as const;

/** Interactive node-graph roadmap: pan (drag), zoom (wheel / buttons), click a node to open its content, tick nodes as done. */
export function RoadmapGraph({ slug, nodes, edges }: { slug: string; nodes: RoadmapNode[]; edges: [string, string][] }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const key = `cv-roadmap:${slug}`;

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    const id = window.requestAnimationFrame(() => raw && setDone(new Set(JSON.parse(raw) as string[])));
    return () => window.cancelAnimationFrame(id);
  }, [key]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  };

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const width = (maxX - minX) * COL + W + 80;
  const height = maxY * ROW + H + 80;
  const px = (n: RoadmapNode) => (n.x - minX) * COL + 40;
  const py = (n: RoadmapNode) => n.y * ROW + 40;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setView((v) => ({ ...v, x: drag.current!.vx + e.clientX - drag.current!.x, y: drag.current!.vy + e.clientY - drag.current!.y }));
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setView((v) => ({ ...v, k: Math.min(2, Math.max(0.4, v.k - e.deltaY * 0.001)) }));
  };

  const pct = Math.round((done.size / nodes.length) * 100);

  return (
    <div className="mt-8">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Roadmap progress">
            <div className="h-full bg-gradient-to-r from-brand to-success transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {done.size}/{nodes.length} steps done · drag to pan, Ctrl + scroll to zoom
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Zoom out" onClick={() => setView((v) => ({ ...v, k: Math.max(0.4, v.k - 0.15) }))}>
            <Minus />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Zoom in" onClick={() => setView((v) => ({ ...v, k: Math.min(2, v.k + 0.15) }))}>
            <Plus />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Reset view" onClick={() => setView({ x: 0, y: 0, k: 1 })}>
            <RotateCcw />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pb-3 text-xs">
        {Object.entries(KIND).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm border-2" style={{ borderColor: v.stroke }} /> {v.label}
          </span>
        ))}
      </div>
      <div
        className="glass grid-bg relative h-[70vh] cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onWheel={onWheel}
        data-lenis-prevent
      >
        <div className="absolute left-1/2 top-0 origin-top" style={{ width, height, transform: `translate(calc(-50% + ${view.x}px), ${view.y + 16}px) scale(${view.k})` }}>
          <svg width={width} height={height} className="absolute inset-0" aria-hidden>
            {edges.map(([a, b]) => {
              const na = byId.get(a);
              const nb = byId.get(b);
              if (!na || !nb) return null;
              const x1 = px(na) + W / 2,
                y1 = py(na) + H,
                x2 = px(nb) + W / 2,
                y2 = py(nb);
              const lit = done.has(a);
              return <path key={`${a}-${b}`} d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} fill="none" stroke={lit ? "#84CC16" : "#4B4B66"} strokeWidth={2} strokeDasharray={lit ? "0" : "6 6"} />;
            })}
          </svg>
          <ol aria-label="Roadmap steps">
            {nodes
              .slice()
              .sort((a, b) => a.y - b.y || a.x - b.x)
              .map((n, i) => (
                <li key={n.id} className="absolute" style={{ left: px(n), top: py(n), width: W, height: H }}>
                  <div
                    className={cn("flex h-full items-center gap-2 rounded-2xl border-2 bg-surface px-3 shadow-lg transition-transform hover:-translate-y-0.5", done.has(n.id) && "bg-success/10")}
                    style={{ borderColor: KIND[n.kind].stroke }}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(n.id)}
                      aria-pressed={done.has(n.id)}
                      aria-label={`Mark ${n.label} as ${done.has(n.id) ? "not done" : "done"}`}
                      className={cn("grid size-6 shrink-0 place-items-center rounded-full border", done.has(n.id) ? "border-success bg-success text-black" : "border-border")}
                    >
                      {done.has(n.id) ? <Check className="size-3.5" /> : <span className="text-[10px] text-muted-foreground">{i + 1}</span>}
                    </button>
                    <Link href={n.href} className="line-clamp-2 flex-1 text-sm font-medium hover:text-cyan">
                      {n.label}
                    </Link>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
