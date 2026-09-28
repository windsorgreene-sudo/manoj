"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Network, Play, Plus, RotateCcw, Shuffle, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SceneGate } from "@/components/three/scene-gate";
import type { LabEdge, LabNode } from "@/components/three/ds-lab";
import { cn } from "@/lib/utils";

const DsLabScene = dynamic(() => import("@/components/three/ds-lab"), { ssr: false, loading: () => <div className="shimmer h-full w-full" /> });

type Bst = { key: number; left: number | null; right: number | null }[];

function bstInsert(tree: Bst, key: number): Bst {
  const t = tree.map((n) => ({ ...n }));
  if (!t.length) return [{ key, left: null, right: null }];
  let cur = 0;
  for (;;) {
    const n = t[cur];
    if (key === n.key) return t;
    const side = key < n.key ? "left" : "right";
    const next = n[side];
    if (next === null) {
      t.push({ key, left: null, right: null });
      n[side] = t.length - 1;
      return t;
    }
    cur = next;
  }
}

function bstToScene(t: Bst): { nodes: LabNode[]; edges: LabEdge[] } {
  const nodes: LabNode[] = [];
  const edges: LabEdge[] = [];
  const depthOf = new Map<number, number>();
  let order = 0;
  const walk = (id: number | null, depth: number) => {
    if (id === null) return;
    walk(t[id].left, depth + 1);
    depthOf.set(id, depth);
    const x = order++;
    nodes.push({ id, label: String(t[id].key), pos: [0, 0, 0], info: "" });
    (nodes[nodes.length - 1] as LabNode & { _x?: number })._x = x;
    walk(t[id].right, depth + 1);
  };
  walk(t.length ? 0 : null, 0);
  const mid = (order - 1) / 2;
  const height = (t.length ? Math.max(...depthOf.values()) : 0) + 1;
  for (const n of nodes as (LabNode & { _x?: number })[]) {
    const d = depthOf.get(n.id) ?? 0;
    n.pos = [((n._x ?? 0) - mid) * 1.3, 4 - d * 1.8, Math.sin((n._x ?? 0) * 1.3) * 1.2];
    const node = t[n.id];
    n.info = `Key ${node.key} · depth ${d} · ${node.left === null && node.right === null ? "leaf" : `children: ${[node.left, node.right].filter((c) => c !== null).map((c) => t[c as number].key).join(", ")}`} · tree height ${height}`;
    if (node.left !== null) edges.push([n.id, node.left]);
    if (node.right !== null) edges.push([n.id, node.right]);
  }
  return { nodes, edges };
}

function randomGraph(n = 14): { nodes: LabNode[]; edges: LabEdge[] } {
  const nodes: LabNode[] = [];
  const edges: LabEdge[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    nodes.push({ id: i, label: String(i), pos: [Math.cos(th) * r * 5, y * 5, Math.sin(th) * r * 5], info: "" });
  }
  const seen = new Set<string>();
  const add = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || seen.has(k)) return;
    seen.add(k);
    edges.push([a, b]);
  };
  for (let i = 1; i < n; i++) add(i, Math.floor(Math.random() * i));
  for (let k = 0; k < n; k++) add(Math.floor(Math.random() * n), Math.floor(Math.random() * n));
  nodes.forEach((nd) => {
    const deg = edges.filter(([a, b]) => a === nd.id || b === nd.id).length;
    nd.info = `Vertex ${nd.id} · degree ${deg} · neighbours: ${edges.filter(([a, b]) => a === nd.id || b === nd.id).map(([a, b]) => (a === nd.id ? b : a)).join(", ")}`;
  });
  return { nodes, edges };
}

function Fallback() {
  return <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">3D is disabled on this device (no WebGL, low-end hardware or reduced motion). Try the 2D visualizers instead.</div>;
}

export function DsLab() {
  const [mode, setMode] = useState<"bst" | "graph">("bst");
  const [tree, setTree] = useState<Bst>(() => [50, 30, 70, 20, 40, 60, 80, 35, 65].reduce<Bst>((t, k) => bstInsert(t, k), []));
  const [graph, setGraph] = useState(() => randomGraph());
  const [keyInput, setKeyInput] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [lit, setLit] = useState<Set<number>>(new Set());
  const [bfsQueue, setBfsQueue] = useState<number[] | null>(null);

  const scene = useMemo(() => (mode === "bst" ? bstToScene(tree) : graph), [mode, tree, graph]);

  // BFS animation from the selected (or first) node
  useEffect(() => {
    if (!bfsQueue) return;
    if (!bfsQueue.length) {
      const id = window.setTimeout(() => setBfsQueue(null), 0);
      return () => window.clearTimeout(id);
    }
    const t = window.setTimeout(() => {
      const [u, ...rest] = bfsQueue;
      const next = new Set(lit);
      next.add(u);
      const nbrs = scene.edges.flatMap(([x, y]) => (x === u ? [y] : y === u ? [x] : [])).filter((v) => !next.has(v) && !rest.includes(v));
      setLit(next);
      setBfsQueue([...rest, ...nbrs]);
    }, 450);
    return () => window.clearTimeout(t);
  }, [bfsQueue, lit, scene.edges]);

  const info = scene.nodes.find((n) => n.id === selected)?.info;
  const startId = selected ?? (mode === "bst" ? 0 : (scene.nodes[0]?.id ?? 0));
  const startLabel = scene.nodes.find((n) => n.id === startId)?.label ?? "root";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <SceneGate className="glass relative h-[65vh] min-h-[420px] overflow-hidden" fallback={<Fallback />}>
        {(visible) => <DsLabScene nodes={scene.nodes} edges={scene.edges} lit={lit} selected={selected} onSelect={setSelected} visible={visible} />}
      </SceneGate>
      <div className="space-y-4">
        <div className="glass grid grid-cols-2 gap-1 p-1" role="radiogroup" aria-label="Structure">
          {(
            [
              ["bst", "BST", TreePine],
              ["graph", "Graph", Network],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m);
                setSelected(null);
                setLit(new Set());
              }}
              className={cn("flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium", mode === m ? "bg-brand text-white" : "text-muted-foreground")}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
        {mode === "bst" ? (
          <form
            className="glass space-y-2 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const k = Number(keyInput);
              if (Number.isFinite(k) && keyInput.trim() && tree.length < 31) setTree(bstInsert(tree, k));
              setKeyInput("");
            }}
          >
            <label htmlFor="lab-key" className="text-sm font-medium">Insert a key</label>
            <div className="flex gap-2">
              <Input id="lab-key" type="number" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} className="rounded-xl" placeholder="e.g. 45" />
              <Button type="submit" size="icon" className="rounded-xl" aria-label="Insert"><Plus /></Button>
            </div>
            <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={() => { setTree([50].reduce<Bst>((t, k) => bstInsert(t, k), [])); setSelected(null); setLit(new Set()); }}>
              <RotateCcw /> Reset tree
            </Button>
          </form>
        ) : (
          <div className="glass p-4">
            <Button variant="outline" className="w-full rounded-xl" onClick={() => { setGraph(randomGraph()); setSelected(null); setLit(new Set()); }}>
              <Shuffle /> New random graph
            </Button>
          </div>
        )}
        <div className="glass space-y-2 p-4">
          <Button className="w-full rounded-xl" disabled={Boolean(bfsQueue)} onClick={() => { setLit(new Set()); setBfsQueue([startId]); }}>
            <Play /> Run BFS from {startLabel}
          </Button>
          <p className="text-xs text-muted-foreground">Visited nodes and edges turn green level by level.</p>
        </div>
        <div className="glass p-4 text-sm" aria-live="polite">
          <p className="mb-1 font-semibold">Inspector</p>
          <p className="text-muted-foreground">{info ?? "Click a node to inspect it."}</p>
          <p className="mt-2 text-xs text-muted-foreground">{scene.nodes.length} nodes · {scene.edges.length} edges</p>
        </div>
      </div>
    </div>
  );
}
