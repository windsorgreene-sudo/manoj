"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BFS_CODE,
  BS_CODE,
  BST_CODE,
  DFS_CODE,
  DIJKSTRA_CODE,
  GRAPH,
  LL_CODE,
  SORT_CODE,
  SQ_CODE,
  bfsFrames,
  binarySearchFrames,
  bstFrames,
  dfsFrames,
  dijkstraFrames,
  linkedListFrames,
  sortFrames,
  stackQueueFrames,
  type BsState,
  type BstState,
  type Frame,
  type GraphState,
  type LlState,
  type SortAlgo,
  type SortState,
  type SqState,
  type VisualizerSlug,
} from "@/lib/visualizers/algorithms";
import { cn } from "@/lib/utils";

function randomArray(n = 12) {
  return Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 95));
}

// ───────── Player ─────────
function usePlayer(total: number) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setI((x) => {
        if (x >= total - 1) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, 700 / speed);
    return () => window.clearInterval(t);
  }, [playing, speed, total]);
  return { i: Math.min(i, total - 1), setI, playing, setPlaying, speed, setSpeed };
}

function Controls({ p, total }: { p: ReturnType<typeof usePlayer>; total: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="icon-sm" variant="outline" aria-label="Reset" onClick={() => { p.setPlaying(false); p.setI(0); }}>
        <RotateCcw />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Step back" onClick={() => p.setI(Math.max(0, p.i - 1))} disabled={p.i === 0}>
        <SkipBack />
      </Button>
      <Button size="sm" className="w-24 rounded-xl" onClick={() => { if (p.i >= total - 1) p.setI(0); p.setPlaying(!p.playing); }}>
        {p.playing ? <Pause /> : <Play />} {p.playing ? "Pause" : "Play"}
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Step forward" onClick={() => p.setI(Math.min(total - 1, p.i + 1))} disabled={p.i >= total - 1}>
        <SkipForward />
      </Button>
      <div className="flex items-center gap-2 pl-2">
        <span className="text-xs text-muted-foreground" id="speed-label">Speed {p.speed}×</span>
        <Slider aria-labelledby="speed-label" className="w-28" min={0.25} max={4} step={0.25} value={[p.speed]} onValueChange={(v) => p.setSpeed(v[0])} />
      </div>
      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
        Step {p.i + 1} / {total}
      </span>
    </div>
  );
}

function Pseudocode({ lines, active }: { lines: string[]; active: number }) {
  return (
    <ol className="rounded-2xl bg-black/30 p-3 font-mono text-xs leading-6" aria-label="Pseudocode">
      {lines.map((l, idx) => (
        <li key={idx} aria-current={idx === active ? "step" : undefined} className={cn("rounded-md px-2 whitespace-pre transition-colors", idx === active ? "bg-brand/30 text-foreground" : "text-muted-foreground")}>
          <span className="mr-3 select-none opacity-50">{idx + 1}</span>
          {l}
        </li>
      ))}
    </ol>
  );
}

function Shell<S>({ frames, code, render, toolbar }: { frames: Frame<S>[]; code: string[]; render: (s: S) => React.ReactNode; toolbar?: React.ReactNode }) {
  const p = usePlayer(frames.length);
  const f = frames[p.i];
  return (
    <div className="space-y-4">
      {toolbar ? <div className="glass flex flex-wrap items-center gap-2 p-3">{toolbar}</div> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass flex min-h-[380px] flex-col p-4">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-x-auto">{render(f.state)}</div>
          <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm" aria-live="polite">
            {f.note}
          </p>
        </div>
        <Pseudocode lines={code} active={f.line} />
      </div>
      <div className="glass p-3">
        <Controls p={p} total={frames.length} />
      </div>
    </div>
  );
}

// ───────── Renderers ─────────
function Bars({ s }: { s: SortState }) {
  const max = Math.max(...s.arr);
  return (
    <div className="flex h-64 w-full items-end justify-center gap-1.5" role="img" aria-label={`Array: ${s.arr.join(", ")}`}>
      {s.arr.map((v, i) => {
        const inRange = !s.range || (i >= s.range[0] && i <= s.range[1]);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1" style={{ maxWidth: 44 }}>
            <div
              className={cn(
                "w-full rounded-t-lg transition-all duration-300",
                s.sorted.includes(i) ? "bg-success" : s.swap.includes(i) ? "bg-danger" : s.compare.includes(i) ? "bg-warning" : s.pivot === i ? "bg-cyan" : "bg-brand",
                !inRange && "opacity-30",
              )}
              style={{ height: `${(v / max) * 220}px` }}
            />
            <span className="text-[10px] tabular-nums text-muted-foreground">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

function BsView({ s }: { s: BsState }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {s.arr.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl border font-mono text-sm transition-all",
              i === s.found ? "border-success bg-success text-black" : i === s.mid ? "border-warning bg-warning/20" : i >= s.lo && i <= s.hi ? "border-brand bg-brand/10" : "border-border opacity-30",
            )}
          >
            {v}
          </div>
          <span className="h-4 text-[10px] text-muted-foreground">{i === s.lo ? "lo" : ""}{i === s.mid ? " mid" : ""}{i === s.hi ? " hi" : ""}</span>
        </div>
      ))}
    </div>
  );
}

function LlView({ s }: { s: LlState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="font-mono text-xs text-muted-foreground">head →</span>
      {s.nodes.map((v, i) => (
        <div key={`${v}-${i}`} className="flex items-center gap-2">
          <div className={cn("flex overflow-hidden rounded-xl border-2 font-mono text-sm transition-all", i === s.highlight ? "border-warning scale-110" : s.reversedUpTo !== undefined && i <= s.reversedUpTo ? "border-success" : "border-brand")}>
            <span className="px-3 py-2">{v}</span>
            <span className="border-l border-border bg-surface-2 px-2 py-2 text-xs text-muted-foreground">next</span>
          </div>
          <span className="text-muted-foreground" aria-hidden>{s.reversedUpTo !== undefined && i <= s.reversedUpTo ? "←" : "→"}</span>
        </div>
      ))}
      <span className="font-mono text-xs text-muted-foreground">null</span>
    </div>
  );
}

function SqView({ s }: { s: SqState }) {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className={cn("flex flex-col items-center gap-2 rounded-2xl p-4", s.active === "stack" && "bg-brand/10")}>
        <p className="text-sm font-semibold">Stack (LIFO)</p>
        <div className="flex h-56 w-28 flex-col-reverse justify-start gap-1 rounded-b-xl border-x-2 border-b-2 border-brand p-1">
          {s.stack.map((v, i) => (
            <div key={i} className={cn("rounded-lg bg-brand py-2 text-center font-mono text-sm text-white", i === s.stack.length - 1 && "ring-2 ring-warning")}>{v}</div>
          ))}
        </div>
      </div>
      <div className={cn("flex flex-col items-center gap-2 rounded-2xl p-4", s.active === "queue" && "bg-cyan/10")}>
        <p className="text-sm font-semibold">Queue (FIFO)</p>
        <div className="flex h-14 min-w-56 items-center gap-1 rounded-xl border-y-2 border-cyan px-1">
          <span className="text-[10px] text-muted-foreground">front</span>
          {s.queue.map((v, i) => (
            <div key={i} className={cn("rounded-lg bg-cyan px-3 py-2 font-mono text-sm text-black", i === 0 && "ring-2 ring-warning")}>{v}</div>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground">back</span>
        </div>
        <p className="mt-4 font-mono text-sm text-warning">{s.op}</p>
      </div>
    </div>
  );
}

function BstView({ s }: { s: BstState }) {
  if (!s.nodes.length) return null;
  const maxX = Math.max(...s.nodes.map((n) => n.x));
  const maxY = Math.max(...s.nodes.map((n) => n.y));
  const W = Math.max(300, (maxX + 1) * 56);
  const H = (maxY + 1) * 70 + 20;
  const X = (x: number) => 28 + x * 56;
  const Y = (y: number) => 30 + y * 70;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto max-h-[360px] w-full" role="img" aria-label="Binary search tree">
      {s.nodes.map((n, i) =>
        [n.left, n.right].map((c) => (c === null ? null : <line key={`${i}-${c}`} x1={X(n.x)} y1={Y(n.y)} x2={X(s.nodes[c].x)} y2={Y(s.nodes[c].y)} stroke={s.path.includes(c) && s.path.includes(i) ? "#F59E0B" : "#4B4B66"} strokeWidth={2} />)),
      )}
      {s.nodes.map((n, i) => (
        <g key={i}>
          <circle cx={X(n.x)} cy={Y(n.y)} r={20} fill={s.found === i ? "#84CC16" : s.path.includes(i) ? "#F59E0B" : "#7C3AED"} className="transition-all duration-300" />
          <text x={X(n.x)} y={Y(n.y) + 4} textAnchor="middle" className="fill-white font-mono text-[12px] font-semibold">{n.key}</text>
        </g>
      ))}
    </svg>
  );
}

function GraphView({ s, weighted }: { s: GraphState; weighted?: boolean }) {
  return (
    <svg viewBox="0 0 720 360" className="h-auto w-full max-w-[720px]" role="img" aria-label="Graph">
      {GRAPH.edges.map((e) => {
        const a = GRAPH.nodes[e.u],
          b = GRAPH.nodes[e.v];
        const active = s.edge && ((s.edge[0] === e.u && s.edge[1] === e.v) || (s.edge[0] === e.v && s.edge[1] === e.u));
        return (
          <g key={`${e.u}-${e.v}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? "#F59E0B" : "#4B4B66"} strokeWidth={active ? 4 : 2} className="transition-all" />
            {weighted ? (
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" className="fill-cyan font-mono text-[13px]">{e.w}</text>
            ) : null}
          </g>
        );
      })}
      {GRAPH.nodes.map((n) => {
        const fill = s.current === n.id ? "#F59E0B" : s.visited.includes(n.id) ? "#84CC16" : s.frontier.includes(n.id) ? "#06B6D4" : "#1A1A2B";
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={24} fill={fill} stroke="#7C3AED" strokeWidth={2} className="transition-all duration-300" />
            <text x={n.x} y={n.y + 5} textAnchor="middle" className="fill-white font-mono text-[14px] font-bold">{n.id}</text>
            {s.dist ? (
              <text x={n.x} y={n.y + 44} textAnchor="middle" className="fill-warning font-mono text-[12px]">{s.dist[n.id] === null ? "∞" : s.dist[n.id]}</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {items.map(([c, l]) => (
        <span key={l} className="flex items-center gap-1.5"><span className={cn("size-3 rounded-sm", c)} /> {l}</span>
      ))}
    </div>
  );
}

// ───────── Visualizers ─────────
function SortingViz() {
  const [algo, setAlgo] = useState<SortAlgo>("bubble");
  const [arr, setArr] = useState<number[]>([38, 27, 43, 3, 9, 82, 10, 55, 64, 21, 17, 90]);
  const frames = useMemo(() => sortFrames(arr, algo), [arr, algo]);
  return (
    <Shell
      key={`${algo}-${arr.join()}`}
      frames={frames}
      code={SORT_CODE[algo]}
      render={(s) => <Bars s={s} />}
      toolbar={
        <>
          <Select value={algo} onValueChange={(v) => setAlgo(v as SortAlgo)}>
            <SelectTrigger className="w-44 rounded-xl" aria-label="Algorithm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["bubble", "insertion", "selection", "merge", "quick"] as const).map((a) => (
                <SelectItem key={a} value={a}>{a[0].toUpperCase() + a.slice(1)} sort</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setArr(randomArray())}><Shuffle /> New array</Button>
          <Legend items={[["bg-warning", "Comparing"], ["bg-danger", "Swapping"], ["bg-cyan", "Pivot"], ["bg-success", "Sorted"]]} />
        </>
      }
    />
  );
}

function BinarySearchViz() {
  const arr = useMemo(() => [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], []);
  const [target, setTarget] = useState(23);
  const frames = useMemo(() => binarySearchFrames(arr, target), [arr, target]);
  return (
    <Shell
      key={target}
      frames={frames}
      code={BS_CODE}
      render={(s) => <BsView s={s} />}
      toolbar={
        <>
          <label htmlFor="bs-target" className="text-sm">Target</label>
          <Input id="bs-target" type="number" className="w-24 rounded-xl" value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} />
          <Legend items={[["bg-brand/40", "Search space"], ["bg-warning", "mid"], ["bg-success", "Found"]]} />
        </>
      }
    />
  );
}

function BstViz() {
  const [keysText, setKeysText] = useState("50, 30, 70, 20, 40, 60, 80, 35");
  const [search, setSearch] = useState(35);
  const keys = useMemo(() => keysText.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n)).slice(0, 15), [keysText]);
  const frames = useMemo(() => bstFrames(keys.length ? keys : [50], search), [keys, search]);
  return (
    <Shell
      key={`${keys.join()}-${search}`}
      frames={frames}
      code={BST_CODE}
      render={(s) => <BstView s={s} />}
      toolbar={
        <>
          <label htmlFor="bst-keys" className="text-sm">Insert</label>
          <Input id="bst-keys" className="w-64 rounded-xl" value={keysText} onChange={(e) => setKeysText(e.target.value)} />
          <label htmlFor="bst-search" className="text-sm">Search</label>
          <Input id="bst-search" type="number" className="w-24 rounded-xl" value={search} onChange={(e) => setSearch(Number(e.target.value) || 0)} />
        </>
      }
    />
  );
}

function BfsDfsViz() {
  const [mode, setMode] = useState<"bfs" | "dfs">("bfs");
  const frames = useMemo(() => (mode === "bfs" ? bfsFrames(0) : dfsFrames(0)), [mode]);
  return (
    <Shell
      key={mode}
      frames={frames}
      code={mode === "bfs" ? BFS_CODE : DFS_CODE}
      render={(s) => (
        <div className="w-full">
          <GraphView s={s} />
          <p className="mt-2 text-center font-mono text-xs text-muted-foreground">{mode === "bfs" ? "queue" : "stack"}: [{s.frontier.join(", ")}] · order: {s.order.join(" → ")}</p>
        </div>
      )}
      toolbar={
        <>
          <Select value={mode} onValueChange={(v) => setMode(v as "bfs" | "dfs")}>
            <SelectTrigger className="w-48 rounded-xl" aria-label="Traversal"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">Breadth-first (BFS)</SelectItem>
              <SelectItem value="dfs">Depth-first (DFS)</SelectItem>
            </SelectContent>
          </Select>
          <Legend items={[["bg-warning", "Current"], ["bg-cyan", "In queue/stack"], ["bg-success", "Visited"]]} />
        </>
      }
    />
  );
}

export function Visualizer({ slug }: { slug: VisualizerSlug }) {
  switch (slug) {
    case "sorting":
      return <SortingViz />;
    case "binary-search":
      return <BinarySearchViz />;
    case "linked-list":
      return <Shell frames={linkedListFrames()} code={LL_CODE} render={(s) => <LlView s={s} />} />;
    case "stack-queue":
      return <Shell frames={stackQueueFrames()} code={SQ_CODE} render={(s) => <SqView s={s} />} />;
    case "bst":
      return <BstViz />;
    case "bfs-dfs":
      return <BfsDfsViz />;
    case "dijkstra":
      return (
        <Shell
          frames={dijkstraFrames(0)}
          code={DIJKSTRA_CODE}
          render={(s) => <GraphView s={s} weighted />}
          toolbar={<Legend items={[["bg-warning", "Current"], ["bg-cyan", "In priority queue"], ["bg-success", "Finalised"]]} />}
        />
      );
  }
}
