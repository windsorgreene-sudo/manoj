/** Pure frame generators for the algorithm visualizers. Each frame = state + pseudocode line + narration. */

export type Frame<S> = { state: S; line: number; note: string };

// ───────── Sorting ─────────
export type SortState = { arr: number[]; compare: number[]; swap: number[]; sorted: number[]; pivot?: number; range?: [number, number] };
export type SortAlgo = "bubble" | "insertion" | "selection" | "merge" | "quick";

export const SORT_CODE: Record<SortAlgo, string[]> = {
  bubble: ["for i in 0 .. n-2:", "  for j in 0 .. n-i-2:", "    if a[j] > a[j+1]:", "      swap(a[j], a[j+1])", "  mark a[n-i-1] as sorted"],
  insertion: ["for i in 1 .. n-1:", "  key = a[i]; j = i - 1", "  while j >= 0 and a[j] > key:", "    a[j+1] = a[j]; j -= 1", "  a[j+1] = key"],
  selection: ["for i in 0 .. n-2:", "  min = i", "  for j in i+1 .. n-1:", "    if a[j] < a[min]: min = j", "  swap(a[i], a[min])"],
  merge: ["mergeSort(l, r):", "  if r - l < 1: return", "  m = (l + r) / 2; sort halves", "  merge: pick smaller head", "  copy merged back into a[l..r]"],
  quick: ["quickSort(l, r):", "  pivot = a[r]; i = l", "  for j in l .. r-1:", "    if a[j] < pivot: swap(a[i], a[j]); i++", "  swap(a[i], a[r]); recurse on both sides"],
};

export function sortFrames(input: number[], algo: SortAlgo): Frame<SortState>[] {
  const a = [...input];
  const n = a.length;
  const frames: Frame<SortState>[] = [];
  const sorted = new Set<number>();
  const push = (line: number, note: string, extra: Partial<SortState> = {}) =>
    frames.push({ state: { arr: [...a], compare: [], swap: [], sorted: [...sorted], ...extra }, line, note });

  push(-1, "Initial array");
  if (algo === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        push(2, `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}`, { compare: [j, j + 1] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          push(3, `Swap → ${a[j]}, ${a[j + 1]}`, { swap: [j, j + 1] });
        }
      }
      sorted.add(n - i - 1);
      push(4, `${a[n - i - 1]} is in its final place`);
    }
    sorted.add(0);
  } else if (algo === "insertion") {
    sorted.add(0);
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      push(1, `Pick key = ${key}`, { compare: [i] });
      while (j >= 0 && a[j] > key) {
        push(2, `${a[j]} > ${key}, shift right`, { compare: [j, j + 1] });
        a[j + 1] = a[j];
        j--;
        push(3, "Shifted", { swap: [j + 1, j + 2] });
      }
      a[j + 1] = key;
      for (let k = 0; k <= i; k++) sorted.add(k);
      push(4, `Insert ${key} at index ${j + 1}`, { swap: [j + 1] });
    }
  } else if (algo === "selection") {
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      push(1, `Assume a[${i}]=${a[i]} is the minimum`, { compare: [i] });
      for (let j = i + 1; j < n; j++) {
        push(3, `Compare a[${j}]=${a[j]} with current min ${a[min]}`, { compare: [j, min] });
        if (a[j] < a[min]) min = j;
      }
      [a[i], a[min]] = [a[min], a[i]];
      sorted.add(i);
      push(4, `Swap minimum ${a[i]} into position ${i}`, { swap: [i, min] });
    }
    sorted.add(n - 1);
  } else if (algo === "merge") {
    const rec = (l: number, r: number) => {
      if (r - l < 1) return;
      const m = Math.floor((l + r) / 2);
      push(2, `Split [${l}..${r}] at ${m}`, { range: [l, r] });
      rec(l, m);
      rec(m + 1, r);
      const merged: number[] = [];
      let i = l,
        j = m + 1;
      while (i <= m && j <= r) {
        push(3, `Compare ${a[i]} and ${a[j]}`, { compare: [i, j], range: [l, r] });
        merged.push(a[i] <= a[j] ? a[i++] : a[j++]);
      }
      while (i <= m) merged.push(a[i++]);
      while (j <= r) merged.push(a[j++]);
      for (let k = 0; k < merged.length; k++) a[l + k] = merged[k];
      if (l === 0 && r === n - 1) for (let k = 0; k < n; k++) sorted.add(k);
      push(4, `Merged [${l}..${r}]`, { swap: Array.from({ length: r - l + 1 }, (_, k) => l + k), range: [l, r] });
    };
    rec(0, n - 1);
  } else {
    const rec = (l: number, r: number) => {
      if (l > r) return;
      if (l === r) {
        sorted.add(l);
        return;
      }
      const pivot = a[r];
      let i = l;
      push(1, `Pivot = ${pivot}`, { pivot: r, range: [l, r] });
      for (let j = l; j < r; j++) {
        push(3, `Is ${a[j]} < ${pivot}?`, { compare: [j, r], pivot: r, range: [l, r] });
        if (a[j] < pivot) {
          [a[i], a[j]] = [a[j], a[i]];
          push(3, `Swap ${a[i]} ↔ ${a[j]}`, { swap: [i, j], pivot: r, range: [l, r] });
          i++;
        }
      }
      [a[i], a[r]] = [a[r], a[i]];
      sorted.add(i);
      push(4, `Pivot ${pivot} placed at index ${i}`, { swap: [i, r], range: [l, r] });
      rec(l, i - 1);
      rec(i + 1, r);
    };
    rec(0, n - 1);
  }
  push(-1, "Sorted! ✅", { sorted: a.map((_, i) => i) });
  return frames;
}

// ───────── Binary search ─────────
export type BsState = { arr: number[]; lo: number; hi: number; mid: number; found: number };
export const BS_CODE = ["lo = 0, hi = n - 1", "while lo <= hi:", "  mid = (lo + hi) / 2", "  if a[mid] == target: return mid", "  if a[mid] < target: lo = mid + 1", "  else: hi = mid - 1", "return -1"];

export function binarySearchFrames(arr: number[], target: number): Frame<BsState>[] {
  const f: Frame<BsState>[] = [];
  let lo = 0,
    hi = arr.length - 1;
  f.push({ state: { arr, lo, hi, mid: -1, found: -1 }, line: 0, note: `Search for ${target}` });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    f.push({ state: { arr, lo, hi, mid, found: -1 }, line: 2, note: `mid = ${mid}, a[mid] = ${arr[mid]}` });
    if (arr[mid] === target) {
      f.push({ state: { arr, lo, hi, mid, found: mid }, line: 3, note: `Found ${target} at index ${mid} 🎯` });
      return f;
    }
    if (arr[mid] < target) {
      lo = mid + 1;
      f.push({ state: { arr, lo, hi, mid, found: -1 }, line: 4, note: `${arr[mid]} < ${target} → discard left half` });
    } else {
      hi = mid - 1;
      f.push({ state: { arr, lo, hi, mid, found: -1 }, line: 5, note: `${arr[mid]} > ${target} → discard right half` });
    }
  }
  f.push({ state: { arr, lo, hi, mid: -1, found: -1 }, line: 6, note: `${target} is not in the array` });
  return f;
}

// ───────── Linked list ─────────
export type LlState = { nodes: number[]; highlight: number; prev?: number; cur?: number; reversedUpTo?: number };
export const LL_CODE = ["insertHead(x): node.next = head; head = node", "insertTail(x): walk to last; last.next = node", "delete(x): find prev; prev.next = cur.next", "reverse(): prev = null; cur = head", "  while cur: next = cur.next; cur.next = prev", "  prev = cur; cur = next", "head = prev"];

export function linkedListFrames(): Frame<LlState>[] {
  const f: Frame<LlState>[] = [];
  let nodes = [10, 20, 30];
  f.push({ state: { nodes: [...nodes], highlight: -1 }, line: -1, note: "List: 10 → 20 → 30" });
  nodes = [5, ...nodes];
  f.push({ state: { nodes: [...nodes], highlight: 0 }, line: 0, note: "insertHead(5)" });
  for (let i = 0; i < nodes.length; i++) f.push({ state: { nodes: [...nodes], highlight: i }, line: 1, note: `Walk to the tail (at ${nodes[i]})` });
  nodes = [...nodes, 40];
  f.push({ state: { nodes: [...nodes], highlight: nodes.length - 1 }, line: 1, note: "insertTail(40)" });
  f.push({ state: { nodes: [...nodes], highlight: 2 }, line: 2, note: "delete(20): find it" });
  nodes = nodes.filter((x) => x !== 20);
  f.push({ state: { nodes: [...nodes], highlight: 1 }, line: 2, note: "prev.next = cur.next — 20 unlinked" });
  f.push({ state: { nodes: [...nodes], highlight: -1, prev: -1, cur: 0, reversedUpTo: -1 }, line: 3, note: "reverse(): prev = null, cur = head" });
  for (let i = 0; i < nodes.length; i++) {
    f.push({ state: { nodes: [...nodes], highlight: i, prev: i - 1, cur: i, reversedUpTo: i - 1 }, line: 4, note: `Point ${nodes[i]}.next back to ${i ? nodes[i - 1] : "null"}` });
    f.push({ state: { nodes: [...nodes], highlight: i, prev: i, cur: i + 1, reversedUpTo: i }, line: 5, note: "Advance prev and cur" });
  }
  f.push({ state: { nodes: [...nodes].reverse(), highlight: 0 }, line: 6, note: `Reversed: ${[...nodes].reverse().join(" → ")}` });
  return f;
}

// ───────── Stack & queue ─────────
export type SqState = { stack: number[]; queue: number[]; op: string; active: "stack" | "queue" | null };
export const SQ_CODE = ["stack.push(x)  — add on top", "stack.pop()    — remove from top (LIFO)", "queue.enqueue(x) — add at back", "queue.dequeue()  — remove from front (FIFO)"];

export function stackQueueFrames(): Frame<SqState>[] {
  const f: Frame<SqState>[] = [];
  const s: number[] = [],
    q: number[] = [];
  const ops: [string, number?][] = [["push", 3], ["push", 7], ["enqueue", 3], ["enqueue", 7], ["push", 9], ["enqueue", 9], ["pop"], ["dequeue"], ["pop"], ["dequeue"]];
  f.push({ state: { stack: [], queue: [], op: "Both empty", active: null }, line: -1, note: "Same inputs, different order out" });
  for (const [op, x] of ops) {
    if (op === "push") s.push(x as number);
    if (op === "pop") {
      const v = s.pop();
      f.push({ state: { stack: [...s], queue: [...q], op: `pop() → ${v}`, active: "stack" }, line: 1, note: `Stack pops ${v} — the LAST pushed` });
      continue;
    }
    if (op === "enqueue") q.push(x as number);
    if (op === "dequeue") {
      const v = q.shift();
      f.push({ state: { stack: [...s], queue: [...q], op: `dequeue() → ${v}`, active: "queue" }, line: 3, note: `Queue removes ${v} — the FIRST enqueued` });
      continue;
    }
    f.push({ state: { stack: [...s], queue: [...q], op: `${op}(${x})`, active: op === "push" ? "stack" : "queue" }, line: op === "push" ? 0 : 2, note: `${op}(${x})` });
  }
  return f;
}

// ───────── BST ─────────
export type BstNode = { key: number; left: number | null; right: number | null; x: number; y: number };
export type BstState = { nodes: BstNode[]; path: number[]; found: number | null };
export const BST_CODE = ["insert(node, key):", "  if node is null: create node", "  if key < node.key: go left", "  else: go right", "search(key): same walk, stop when equal"];

function layout(nodes: BstNode[]) {
  let i = 0;
  const walk = (id: number | null, depth: number) => {
    if (id === null) return;
    walk(nodes[id].left, depth + 1);
    nodes[id].x = i++;
    nodes[id].y = depth;
    walk(nodes[id].right, depth + 1);
  };
  if (nodes.length) walk(0, 0);
  return nodes;
}

export function bstFrames(keys: number[], search: number): Frame<BstState>[] {
  const f: Frame<BstState>[] = [];
  const nodes: BstNode[] = [];
  const snap = (path: number[], found: number | null, line: number, note: string) =>
    f.push({ state: { nodes: layout(nodes.map((n) => ({ ...n }))), path, found }, line, note });
  for (const k of keys) {
    if (!nodes.length) {
      nodes.push({ key: k, left: null, right: null, x: 0, y: 0 });
      snap([0], null, 1, `Insert ${k} as root`);
      continue;
    }
    let cur = 0;
    const path = [0];
    for (;;) {
      const n = nodes[cur];
      snap([...path], null, k < n.key ? 2 : 3, `${k} ${k < n.key ? "<" : "≥"} ${n.key} → go ${k < n.key ? "left" : "right"}`);
      const nextId = k < n.key ? n.left : n.right;
      if (nextId === null) {
        nodes.push({ key: k, left: null, right: null, x: 0, y: 0 });
        if (k < n.key) n.left = nodes.length - 1;
        else n.right = nodes.length - 1;
        snap([...path, nodes.length - 1], null, 1, `Insert ${k}`);
        break;
      }
      cur = nextId;
      path.push(cur);
    }
  }
  let cur: number | null = 0;
  const path: number[] = [];
  while (cur !== null) {
    path.push(cur);
    const n: BstNode = nodes[cur];
    if (n.key === search) {
      snap([...path], cur, 4, `Found ${search} after ${path.length} comparisons`);
      return f;
    }
    snap([...path], null, 4, `Search ${search}: ${search < n.key ? "go left" : "go right"} of ${n.key}`);
    cur = search < n.key ? n.left : n.right;
  }
  snap(path, null, 4, `${search} not found`);
  return f;
}

// ───────── Graphs ─────────
export type GNode = { id: number; x: number; y: number };
export type GEdge = { u: number; v: number; w: number };
export const GRAPH = {
  nodes: [
    { id: 0, x: 80, y: 180 },
    { id: 1, x: 220, y: 70 },
    { id: 2, x: 220, y: 290 },
    { id: 3, x: 380, y: 70 },
    { id: 4, x: 380, y: 290 },
    { id: 5, x: 520, y: 180 },
    { id: 6, x: 640, y: 70 },
    { id: 7, x: 640, y: 290 },
  ] satisfies GNode[],
  edges: [
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 1, w: 1 },
    { u: 2, v: 4, w: 8 },
    { u: 3, v: 5, w: 3 },
    { u: 4, v: 5, w: 2 },
    { u: 3, v: 4, w: 2 },
    { u: 5, v: 6, w: 1 },
    { u: 5, v: 7, w: 6 },
    { u: 6, v: 7, w: 2 },
  ] satisfies GEdge[],
};

export type GraphState = { visited: number[]; frontier: number[]; current: number | null; edge: [number, number] | null; order: number[]; dist?: (number | null)[] };
export const BFS_CODE = ["queue = [s]; visited = {s}", "while queue not empty:", "  u = queue.pop_front()", "  for v in adj[u]:", "    if v not visited: visited.add(v); queue.push(v)"];
export const DFS_CODE = ["stack = [s]", "while stack not empty:", "  u = stack.pop()", "  if u visited: continue; visit(u)", "  for v in adj[u] (reversed): stack.push(v)"];
export const DIJKSTRA_CODE = ["dist[s] = 0; pq = [(0, s)]", "while pq not empty:", "  (d, u) = pq.pop_min(); skip if stale", "  for (v, w) in adj[u]:", "    if d + w < dist[v]: dist[v] = d + w; pq.push(v)"];

const adj = (directedWeights = false) => {
  const a = new Map<number, { v: number; w: number }[]>();
  GRAPH.nodes.forEach((n) => a.set(n.id, []));
  GRAPH.edges.forEach((e) => {
    a.get(e.u)?.push({ v: e.v, w: e.w });
    if (!directedWeights) a.get(e.v)?.push({ v: e.u, w: e.w });
  });
  a.forEach((list) => list.sort((x, y) => x.v - y.v));
  return a;
};

export function bfsFrames(s = 0): Frame<GraphState>[] {
  const a = adj();
  const f: Frame<GraphState>[] = [];
  const visited = new Set([s]);
  const q = [s];
  const order: number[] = [];
  f.push({ state: { visited: [...visited], frontier: [...q], current: null, edge: null, order: [] }, line: 0, note: `Start BFS from ${s}` });
  while (q.length) {
    const u = q.shift() as number;
    order.push(u);
    f.push({ state: { visited: [...visited], frontier: [...q], current: u, edge: null, order: [...order] }, line: 2, note: `Dequeue ${u}` });
    for (const { v } of a.get(u) ?? []) {
      f.push({ state: { visited: [...visited], frontier: [...q], current: u, edge: [u, v], order: [...order] }, line: 3, note: `Look at neighbour ${v}` });
      if (!visited.has(v)) {
        visited.add(v);
        q.push(v);
        f.push({ state: { visited: [...visited], frontier: [...q], current: u, edge: [u, v], order: [...order] }, line: 4, note: `Discover ${v}, enqueue` });
      }
    }
  }
  f.push({ state: { visited: [...visited], frontier: [], current: null, edge: null, order }, line: -1, note: `BFS order: ${order.join(" → ")}` });
  return f;
}

export function dfsFrames(s = 0): Frame<GraphState>[] {
  const a = adj();
  const f: Frame<GraphState>[] = [];
  const visited = new Set<number>();
  const st = [s];
  const order: number[] = [];
  f.push({ state: { visited: [], frontier: [...st], current: null, edge: null, order: [] }, line: 0, note: `Start DFS from ${s}` });
  while (st.length) {
    const u = st.pop() as number;
    f.push({ state: { visited: [...visited], frontier: [...st], current: u, edge: null, order: [...order] }, line: 2, note: `Pop ${u}` });
    if (visited.has(u)) continue;
    visited.add(u);
    order.push(u);
    f.push({ state: { visited: [...visited], frontier: [...st], current: u, edge: null, order: [...order] }, line: 3, note: `Visit ${u}` });
    for (const { v } of [...(a.get(u) ?? [])].reverse()) {
      if (!visited.has(v)) {
        st.push(v);
        f.push({ state: { visited: [...visited], frontier: [...st], current: u, edge: [u, v], order: [...order] }, line: 4, note: `Push ${v}` });
      }
    }
  }
  f.push({ state: { visited: [...visited], frontier: [], current: null, edge: null, order }, line: -1, note: `DFS order: ${order.join(" → ")}` });
  return f;
}

export function dijkstraFrames(s = 0): Frame<GraphState>[] {
  const a = adj();
  const n = GRAPH.nodes.length;
  const dist: (number | null)[] = Array(n).fill(null);
  const done = new Set<number>();
  const f: Frame<GraphState>[] = [];
  dist[s] = 0;
  let pq: [number, number][] = [[0, s]];
  f.push({ state: { visited: [], frontier: [s], current: null, edge: null, order: [], dist: [...dist] }, line: 0, note: `dist[${s}] = 0` });
  while (pq.length) {
    pq.sort((x, y) => x[0] - y[0]);
    const [d, u] = pq.shift() as [number, number];
    if (done.has(u)) {
      f.push({ state: { visited: [...done], frontier: pq.map((p) => p[1]), current: u, edge: null, order: [...done], dist: [...dist] }, line: 2, note: `Skip stale entry for ${u}` });
      continue;
    }
    done.add(u);
    f.push({ state: { visited: [...done], frontier: pq.map((p) => p[1]), current: u, edge: null, order: [...done], dist: [...dist] }, line: 2, note: `Pop ${u} with distance ${d} — now final` });
    for (const { v, w } of a.get(u) ?? []) {
      if (done.has(v)) continue;
      const nd = d + w;
      const better = dist[v] === null || nd < (dist[v] as number);
      if (better) {
        dist[v] = nd;
        pq.push([nd, v]);
      }
      f.push({
        state: { visited: [...done], frontier: pq.map((p) => p[1]), current: u, edge: [u, v], order: [...done], dist: [...dist] },
        line: 4,
        note: better ? `Relax ${u}→${v}: dist[${v}] = ${d} + ${w} = ${nd}` : `${u}→${v}: ${nd} is not better than ${dist[v]}`,
      });
    }
    pq = pq.filter((p) => !done.has(p[1]));
  }
  f.push({ state: { visited: [...done], frontier: [], current: null, edge: null, order: [...done], dist: [...dist] }, line: -1, note: "All shortest distances found ✅" });
  return f;
}

export const VISUALIZERS = [
  { slug: "sorting", title: "Sorting Algorithms", description: "Bubble, insertion, selection, merge and quick sort side by side.", tag: "Arrays" },
  { slug: "binary-search", title: "Binary Search", description: "Watch the search space halve every step.", tag: "Searching" },
  { slug: "linked-list", title: "Linked List", description: "Insert at head/tail, delete and reverse pointer by pointer.", tag: "Lists" },
  { slug: "stack-queue", title: "Stack & Queue", description: "LIFO vs FIFO with the same sequence of operations.", tag: "Linear" },
  { slug: "bst", title: "Binary Search Tree", description: "Insert keys and search — see the path taken.", tag: "Trees" },
  { slug: "bfs-dfs", title: "BFS & DFS", description: "Explore a graph level by level or depth first.", tag: "Graphs" },
  { slug: "dijkstra", title: "Dijkstra's Algorithm", description: "Relax edges and finalise shortest distances.", tag: "Graphs" },
] as const;
export type VisualizerSlug = (typeof VISUALIZERS)[number]["slug"];
