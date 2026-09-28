import type { SeedArticle } from "./types";

const fence = "```";

export const webArticles: SeedArticle[] = [
  {
    slug: "semantic-html",
    title: "Semantic HTML and Accessibility",
    category: "web-development",
    difficulty: "EASY",
    excerpt: "Use the right HTML elements for structure, SEO and screen readers — landmarks, headings, forms and alt text.",
    tags: ["html", "accessibility", "seo"],
    content: `## Why semantics matter

Semantic elements describe **meaning**, not appearance. Browsers, search engines and assistive technology all rely on them. A \`<button>\` is focusable and keyboard-operable for free; a \`<div onclick>\` is not.

## Page landmarks

${fence}html
<body>
  <header>
    <nav aria-label="Main">
      <a href="/">Home</a>
      <a href="/courses">Courses</a>
    </nav>
  </header>
  <main>
    <article>
      <h1>Binary Search</h1>
      <p>Published <time datetime="2026-01-15">15 Jan 2026</time></p>
      <section>
        <h2>How it works</h2>
        <p>Halve the search space each step…</p>
      </section>
    </article>
    <aside>Related tutorials</aside>
  </main>
  <footer>© CodeVerse</footer>
</body>
${fence}

## Headings form an outline

Use exactly one \`<h1>\` per page and never skip levels (\`h2\` → \`h4\`). Screen-reader users navigate by headings.

## Accessible forms

${fence}html
<form>
  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="email" required aria-describedby="email-hint" />
  <p id="email-hint">We never share your email.</p>
  <button type="submit">Subscribe</button>
</form>
${fence}

## Images

Every \`<img>\` needs \`alt\`. Describe the content (\`alt="Bar chart of solved problems by difficulty"\`) or use \`alt=""\` for purely decorative images.

<Callout type="tip">Test with only your keyboard: Tab through the page. If you can't see where focus is or can't reach a control, neither can many of your users.</Callout>`,
    quiz: [
      { q: "Which element should wrap the primary content of a page?", options: ["<div id='main'>", "<main>", "<section>", "<body>"], answer: 1, explanation: "<main> is the main landmark." },
      { q: "Alt text for a decorative image should be…", options: ["Omitted", "alt=\"image\"", "alt=\"\"", "The filename"], answer: 2, explanation: "Empty alt tells screen readers to skip it." },
    ],
  },
  {
    slug: "css-flexbox-and-grid",
    title: "CSS Layout: Flexbox and Grid",
    category: "web-development",
    difficulty: "MEDIUM",
    excerpt: "Know when to use one-dimensional Flexbox vs two-dimensional Grid, with responsive layout recipes.",
    tags: ["css", "flexbox", "grid", "responsive"],
    content: `## Flexbox — one dimension

Flexbox lays items out along **one axis** (row or column). Perfect for navbars, toolbars and centring.

${fence}css
.navbar {
  display: flex;
  align-items: center;       /* cross axis */
  justify-content: space-between; /* main axis */
  gap: 16px;
}
.center {
  display: flex;
  place-items: center;
  justify-content: center;
  min-height: 100vh;
}
${fence}

## Grid — two dimensions

Grid controls **rows and columns** at once. Perfect for page layouts and card galleries.

${fence}css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr 220px;
  grid-template-areas: "sidebar content toc";
}
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; grid-template-areas: "content"; }
}
${fence}

\`repeat(auto-fill, minmax(260px, 1fr))\` creates as many 260px+ columns as fit — a responsive gallery with **zero** media queries.

## Choosing

| Need | Use |
|---|---|
| Items in a row that wrap | Flexbox |
| Centre one thing | Flexbox or Grid |
| Full page layout | Grid |
| Aligning items in rows *and* columns | Grid |

<Callout type="tip">Mobile-first: write base styles for small screens, then add \`min-width\` media queries for larger ones.</Callout>`,
    quiz: [
      { q: "Flexbox is primarily…", options: ["Two-dimensional", "One-dimensional", "Only for text", "Deprecated"], answer: 1, explanation: "It lays out along a single axis." },
      { q: "repeat(auto-fill, minmax(260px, 1fr)) creates…", options: ["Exactly 260px columns", "A responsive number of columns", "One column", "Rows"], answer: 1, explanation: "As many columns as fit." },
    ],
  },
  {
    slug: "how-http-works",
    title: "How HTTP Works: Requests, Responses and Status Codes",
    category: "web-development",
    difficulty: "EASY",
    excerpt: "What happens when you type a URL — DNS, TCP/TLS, HTTP methods, headers, status codes and caching.",
    tags: ["http", "networking", "web"],
    content: `## From URL to page

1. **DNS** resolves \`codeverse.dev\` to an IP address.
2. A **TCP** connection (plus a **TLS** handshake for HTTPS) is established.
3. The browser sends an **HTTP request**; the server returns a **response**.
4. The browser parses HTML, fetches CSS/JS/images, and renders.

## Anatomy of a request

${fence}http
GET /api/problems?difficulty=easy HTTP/1.1
Host: codeverse.dev
Accept: application/json
Authorization: Bearer eyJhbGciOi...
${fence}

## Methods

| Method | Purpose | Idempotent |
|---|---|---|
| GET | Read a resource | Yes |
| POST | Create / trigger an action | No |
| PUT | Replace a resource | Yes |
| PATCH | Partially update | No |
| DELETE | Remove | Yes |

## Status codes

- **2xx success** — 200 OK, 201 Created, 204 No Content
- **3xx redirect** — 301 Moved Permanently, 304 Not Modified
- **4xx client error** — 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests
- **5xx server error** — 500 Internal Server Error, 503 Service Unavailable

## Caching headers

\`Cache-Control: public, max-age=31536000, immutable\` lets CDNs and browsers reuse static assets for a year. \`ETag\` + \`If-None-Match\` lets the server answer **304** without resending the body.

<Callout type="info">HTTP/2 multiplexes many requests over one connection; HTTP/3 runs over QUIC (UDP) to avoid head-of-line blocking.</Callout>`,
    quiz: [
      { q: "Which status code means 'Too Many Requests'?", options: ["403", "404", "429", "503"], answer: 2, explanation: "429 is used by rate limiters." },
      { q: "Which method is NOT idempotent?", options: ["GET", "PUT", "DELETE", "POST"], answer: 3, explanation: "Repeating a POST may create duplicates." },
    ],
  },
  {
    slug: "rest-apis-with-fetch",
    title: "Building and Consuming REST APIs",
    category: "web-development",
    difficulty: "MEDIUM",
    excerpt: "Design clean REST endpoints and call them from the browser with fetch, including errors and JSON bodies.",
    tags: ["rest", "api", "fetch", "backend"],
    content: `## REST in one paragraph

REST models your domain as **resources** identified by URLs and manipulated with standard HTTP methods. Responses are usually JSON and the server is **stateless** — every request carries what it needs (e.g. an auth token).

## Good endpoint design

${fence}text
GET    /api/courses              list courses
GET    /api/courses/dsa          one course
POST   /api/courses/dsa/enroll   enroll current user
GET    /api/problems?topic=graph&page=2
PATCH  /api/users/me             update my profile
DELETE /api/bookmarks/123        remove a bookmark
${fence}

Use **nouns** for resources, plural collections, query strings for filtering and pagination, and correct status codes.

## A minimal Express server

${fence}javascript
import express from "express";
const app = express();
app.use(express.json());

const notes = [];
app.get("/api/notes", (req, res) => res.json(notes));
app.post("/api/notes", (req, res) => {
  if (!req.body.text) return res.status(400).json({ error: "text is required" });
  const note = { id: notes.length + 1, text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
});
app.listen(3000);
${fence}

## Calling it with fetch

${fence}javascript
async function createNote(text) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }
  return res.json();
}
${fence}

<Callout type="warning">\`fetch\` only rejects on network failure — a 404 or 500 still resolves. Always check \`res.ok\`.</Callout>`,
    quiz: [
      { q: "The correct status for a successful creation is…", options: ["200", "201", "204", "302"], answer: 1, explanation: "201 Created." },
      { q: "Does fetch reject on HTTP 500?", options: ["Yes", "No — check res.ok", "Only in Node", "Only with await"], answer: 1, explanation: "Only network errors reject." },
    ],
  },
];

export const dbmsArticles: SeedArticle[] = [
  {
    slug: "introduction-to-dbms",
    title: "Introduction to DBMS and the Relational Model",
    category: "dbms",
    difficulty: "EASY",
    excerpt: "Why databases exist, tables/rows/columns, keys, and how relational databases enforce integrity.",
    tags: ["dbms", "sql", "relational"],
    content: `## Why not just files?

Files make it hard to query, share safely between users, recover from crashes and keep data consistent. A **Database Management System** provides a query language, concurrency control, durability and integrity constraints.

## The relational model

Data lives in **relations** (tables). Each **tuple** (row) is a record and each **attribute** (column) has a domain (type).

${fence}sql
CREATE TABLE students (
  id         SERIAL PRIMARY KEY,
  roll_no    VARCHAR(12) UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  branch     TEXT CHECK (branch IN ('CSE', 'ECE', 'ME')),
  joined_on  DATE DEFAULT CURRENT_DATE
);

CREATE TABLE enrollments (
  student_id INT REFERENCES students(id) ON DELETE CASCADE,
  course_id  INT REFERENCES courses(id),
  PRIMARY KEY (student_id, course_id)
);
${fence}

## Keys

- **Super key** — any set of columns that uniquely identifies a row.
- **Candidate key** — a *minimal* super key.
- **Primary key** — the chosen candidate key (unique, not null).
- **Foreign key** — references a primary key in another table, enforcing **referential integrity**.

## Three-level architecture

1. **External** — views for different users.
2. **Conceptual** — the logical schema (tables, relationships).
3. **Internal** — physical storage (files, indexes).

This separation gives **data independence**: you can add an index without changing application queries.

<Callout type="tip">Interview favourite: "What is the difference between a primary key and a unique key?" — a table has one primary key (never null); it can have many unique keys (which may allow null).</Callout>`,
    quiz: [
      { q: "A minimal super key is called a…", options: ["Foreign key", "Candidate key", "Composite key", "Surrogate key"], answer: 1, explanation: "Remove any column and it's no longer unique." },
      { q: "Foreign keys enforce…", options: ["Entity integrity", "Referential integrity", "Normal forms", "Indexing"], answer: 1, explanation: "References must point to existing rows." },
    ],
  },
  {
    slug: "sql-joins",
    title: "SQL Joins Explained with Examples",
    category: "dbms",
    difficulty: "MEDIUM",
    excerpt: "INNER, LEFT, RIGHT, FULL and SELF joins with a real students/courses dataset, plus GROUP BY and HAVING.",
    tags: ["sql", "joins", "queries"],
    content: `## Sample data

${fence}sql
-- students(id, name)          courses(id, title)       enrollments(student_id, course_id, score)
-- 1 Aarav                      10 DSA                   (1, 10, 92)
-- 2 Diya                       20 DBMS                  (1, 20, 81)
-- 3 Kabir                      30 OS                    (2, 10, 77)
${fence}

## INNER JOIN — only matching rows

${fence}sql
SELECT s.name, c.title, e.score
FROM enrollments e
JOIN students s ON s.id = e.student_id
JOIN courses  c ON c.id = e.course_id;
-- Kabir does not appear: he has no enrollments
${fence}

## LEFT JOIN — keep everything from the left

${fence}sql
SELECT s.name, COUNT(e.course_id) AS courses_taken
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
GROUP BY s.name;
-- Aarav 2, Diya 1, Kabir 0
${fence}

## Other joins

| Join | Keeps |
|---|---|
| INNER | Only matching pairs |
| LEFT | All left rows (+ matches or NULL) |
| RIGHT | All right rows (+ matches or NULL) |
| FULL OUTER | All rows from both sides |
| CROSS | Every combination (Cartesian product) |
| SELF | A table joined to itself (e.g. employee → manager) |

## GROUP BY and HAVING

${fence}sql
SELECT c.title, AVG(e.score) AS avg_score
FROM courses c
JOIN enrollments e ON e.course_id = c.id
GROUP BY c.title
HAVING AVG(e.score) > 80;
${fence}

\`WHERE\` filters rows **before** grouping; \`HAVING\` filters groups **after** aggregation.

<Callout type="tip">Find students with no enrollments: \`LEFT JOIN … WHERE e.student_id IS NULL\` — the "anti-join" pattern.</Callout>`,
    quiz: [
      { q: "Which join returns all rows from the left table?", options: ["INNER", "LEFT", "CROSS", "SELF"], answer: 1, explanation: "Unmatched right columns become NULL." },
      { q: "HAVING filters…", options: ["Rows before grouping", "Groups after aggregation", "Columns", "Indexes"], answer: 1, explanation: "WHERE is for rows, HAVING for groups." },
    ],
  },
  {
    slug: "database-normalization",
    title: "Database Normalization: 1NF to BCNF",
    category: "dbms",
    difficulty: "MEDIUM",
    excerpt: "Eliminate redundancy and update anomalies step by step using functional dependencies.",
    tags: ["dbms", "normalization", "design"],
    content: `## The problem: anomalies

Consider \`orders(order_id, customer, customer_city, product, price)\`. If a customer moves city we must update many rows (**update anomaly**); we can't store a customer with no orders (**insertion anomaly**); deleting their last order loses their city (**deletion anomaly**).

## Functional dependencies

\`X → Y\` means the value of X determines the value of Y. Here: \`customer → customer_city\` and \`product → price\`.

## Normal forms

**1NF** — every column holds **atomic** values; no repeating groups (no comma-separated lists in a cell).

**2NF** — 1NF and no **partial dependency**: every non-key attribute depends on the *whole* composite key, not part of it.

**3NF** — 2NF and no **transitive dependency**: non-key attributes depend only on the key (not on other non-key attributes).

**BCNF** — for every dependency \`X → Y\`, X is a super key. A stricter 3NF.

## Decomposing our example

${fence}sql
customers(customer_id PK, name, city)
products(product_id PK, name, price)
orders(order_id PK, customer_id FK, ordered_at)
order_items(order_id FK, product_id FK, quantity, PRIMARY KEY(order_id, product_id))
${fence}

Each fact is now stored **once**.

## When to denormalise

Read-heavy analytics sometimes duplicate data deliberately to avoid expensive joins — but do it consciously, with a plan to keep copies in sync.

<Callout type="info">A decomposition must be **lossless** (joining the parts gives back exactly the original) and ideally **dependency-preserving**.</Callout>`,
    quiz: [
      { q: "A transitive dependency violates…", options: ["1NF", "2NF", "3NF", "None"], answer: 2, explanation: "3NF forbids non-key → non-key dependencies." },
      { q: "Comma-separated values in a single cell violate…", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 0, explanation: "Values must be atomic." },
    ],
  },
  {
    slug: "transactions-and-acid",
    title: "Transactions, ACID and Isolation Levels",
    category: "dbms",
    difficulty: "HARD",
    excerpt: "What makes a transaction reliable, the anomalies concurrent transactions cause, and how isolation levels trade safety for speed.",
    tags: ["dbms", "transactions", "concurrency"],
    content: `## A transaction

A transaction is a sequence of operations treated as **one logical unit**.

${fence}sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;  -- or ROLLBACK on error
${fence}

## ACID

- **Atomicity** — all or nothing (implemented with undo logs).
- **Consistency** — constraints hold before and after.
- **Isolation** — concurrent transactions don't see each other's partial work.
- **Durability** — once committed, it survives crashes (write-ahead logging).

## Concurrency anomalies

| Anomaly | What happens |
|---|---|
| Dirty read | Reading uncommitted data that later rolls back |
| Non-repeatable read | Same row read twice gives different values |
| Phantom read | Same query returns new rows the second time |
| Lost update | Two writers overwrite each other |

## Isolation levels (SQL standard)

| Level | Dirty | Non-repeatable | Phantom |
|---|---|---|---|
| Read Uncommitted | possible | possible | possible |
| Read Committed | — | possible | possible |
| Repeatable Read | — | — | possible |
| Serializable | — | — | — |

PostgreSQL defaults to **Read Committed** and implements isolation with **MVCC** — readers never block writers because each transaction sees a snapshot.

## Preventing lost updates

${fence}sql
-- Pessimistic: lock the row
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;

-- Optimistic: version check
UPDATE accounts SET balance = 900, version = version + 1
WHERE id = 1 AND version = 7;   -- 0 rows updated → retry
${fence}

<Callout type="tip">Two-phase locking (2PL) guarantees conflict-serializability: a transaction acquires all locks before releasing any.</Callout>`,
    quiz: [
      { q: "Which ACID property is ensured by write-ahead logging?", options: ["Isolation", "Durability", "Consistency", "Atomicity only"], answer: 1, explanation: "Committed changes are logged to disk first." },
      { q: "Serializable isolation prevents…", options: ["Only dirty reads", "Dirty and non-repeatable only", "All three anomalies", "Nothing"], answer: 2, explanation: "It's the strictest level." },
    ],
  },
  {
    slug: "database-indexing",
    title: "Database Indexing and B+ Trees",
    category: "dbms",
    difficulty: "HARD",
    excerpt: "How indexes speed up queries, why databases use B+ trees, composite indexes and when an index hurts.",
    tags: ["dbms", "indexing", "performance", "b-tree"],
    content: `## Why indexes?

Without an index, \`WHERE email = 'x'\` scans every row — O(n). An index is a separate sorted structure mapping key → row location, turning lookups into **O(log n)**.

## B+ trees

Databases use **B+ trees** because disks read whole pages (e.g. 8 KB). Each node holds hundreds of keys, so the tree is very **shallow** — a billion rows need only 3–4 levels.

- Internal nodes store keys only, for routing.
- **Leaves** store keys + row pointers and are **linked**, so range scans (\`BETWEEN\`, \`ORDER BY\`) are a sequential walk.

## Creating indexes

${fence}sql
CREATE INDEX idx_submissions_user_created ON submissions (user_id, created_at DESC);

EXPLAIN ANALYZE
SELECT * FROM submissions
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;   -- Index Scan instead of Seq Scan + Sort
${fence}

## Composite indexes and the leftmost prefix rule

An index on \`(a, b, c)\` can serve filters on \`a\`, \`(a, b)\` or \`(a, b, c)\` — but **not** on \`b\` alone. Put the most selective equality columns first and range columns last.

## Costs

- Every INSERT/UPDATE/DELETE must also update each index.
- Indexes consume disk and memory.
- Low-selectivity columns (e.g. a boolean) rarely benefit.

| Index type | Good for |
|---|---|
| B+ tree | Equality and ranges (default) |
| Hash | Equality only |
| GIN | Full-text search, arrays, JSON |
| BRIN | Huge, naturally ordered tables (time series) |

<Callout type="tip">A **covering index** contains every column the query needs, so the database never touches the table ("index-only scan").</Callout>`,
    quiz: [
      { q: "Why are B+ tree leaves linked?", options: ["To save space", "For efficient range scans", "For hashing", "For locking"], answer: 1, explanation: "Ranges become sequential walks." },
      { q: "An index on (a, b) can serve a filter on…", options: ["b only", "a only", "neither", "c"], answer: 1, explanation: "Leftmost-prefix rule." },
    ],
  },
];

export const osArticles: SeedArticle[] = [
  {
    slug: "processes-and-threads",
    title: "Processes vs Threads",
    category: "operating-systems",
    difficulty: "EASY",
    excerpt: "Understand processes, threads, the PCB, context switching and when to choose multi-threading vs multi-processing.",
    tags: ["os", "processes", "threads", "concurrency"],
    content: `## Process

A **process** is a program in execution. It owns an address space (code, data, heap, stack), open files and other resources. The OS tracks it with a **Process Control Block** (PCB): PID, state, program counter, registers, scheduling info, memory maps.

Process states: **new → ready → running → waiting → terminated**.

## Thread

A **thread** is the unit of CPU scheduling *inside* a process. Threads of the same process **share** code, heap and open files, but each has its own stack, registers and program counter.

| | Process | Thread |
|---|---|---|
| Memory | Separate address space | Shared with siblings |
| Creation cost | High | Low |
| Communication | IPC (pipes, sockets, shared memory) | Shared variables |
| Crash impact | Isolated | Can take down the whole process |

## Creating threads

${fence}python
import threading

counter = 0
lock = threading.Lock()

def work():
    global counter
    for _ in range(100_000):
        with lock:            # without the lock → race condition
            counter += 1

threads = [threading.Thread(target=work) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)  # 400000
${fence}

## Context switching

Switching the CPU from one process to another means saving and restoring the PCB and often flushing the TLB — pure overhead. Thread switches within a process are cheaper because the address space stays the same.

<Callout type="info">In CPython the GIL lets only one thread execute Python bytecode at a time — use \`multiprocessing\` for CPU-bound work and threads/async for I/O-bound work.</Callout>`,
    quiz: [
      { q: "Threads of the same process share…", options: ["Stack", "Registers", "Heap", "Program counter"], answer: 2, explanation: "Each thread has its own stack and registers." },
      { q: "Which data structure stores process metadata?", options: ["TLB", "PCB", "Page table", "Inode"], answer: 1, explanation: "The Process Control Block." },
    ],
  },
  {
    slug: "cpu-scheduling-algorithms",
    title: "CPU Scheduling Algorithms",
    category: "operating-systems",
    difficulty: "MEDIUM",
    excerpt: "FCFS, SJF, SRTF, Priority and Round Robin — with Gantt charts, waiting time and turnaround calculations.",
    tags: ["os", "scheduling"],
    content: `## Metrics

- **Turnaround time** = completion − arrival
- **Waiting time** = turnaround − burst
- **Response time** = first run − arrival

## Example workload

| Process | Arrival | Burst |
|---|---|---|
| P1 | 0 | 8 |
| P2 | 1 | 4 |
| P3 | 2 | 2 |

## FCFS (First Come First Served)

Order P1 → P2 → P3. Completion: 8, 12, 14. Waiting: 0, 7, 10 → **average 5.67**. Simple, but short jobs stuck behind long ones suffer the **convoy effect**.

## SJF (Shortest Job First, non-preemptive)

At t=0 only P1 exists, so it runs to 8. Then P3 (2) → 10, P2 (4) → 14. Waiting: 0, 9, 6 → **average 5.0**. SJF is optimal for average waiting time but needs burst estimates and may **starve** long jobs.

## SRTF (preemptive SJF)

P1 runs 0–1, P2 preempts (4 < 7) and runs 1–2, P3 preempts (2 < 3) and runs 2–4, P2 finishes 4–7, P1 finishes 7–14. Waiting: 6, 2, 0 → **average 2.67**.

## Round Robin

Each process gets a **time quantum** (say 2) in turn. Great response time and fairness; too small a quantum wastes time on context switches, too large degrades to FCFS.

${fence}python
from collections import deque

def round_robin(procs, q):
    """procs: list of (name, burst) all arriving at t=0"""
    t, queue, done = 0, deque(procs), {}
    while queue:
        name, rem = queue.popleft()
        run = min(q, rem)
        t += run
        if rem - run:
            queue.append((name, rem - run))
        else:
            done[name] = t
    return done

print(round_robin([("P1", 8), ("P2", 4), ("P3", 2)], 2))
${fence}

<Callout type="tip">Real OSes use **multilevel feedback queues**: interactive jobs stay in high-priority short-quantum queues, CPU hogs sink to lower ones.</Callout>`,
    quiz: [
      { q: "Which algorithm minimises average waiting time (all jobs known)?", options: ["FCFS", "SJF", "Round Robin", "Priority"], answer: 1, explanation: "Shortest job first is provably optimal." },
      { q: "The convoy effect is associated with…", options: ["FCFS", "SRTF", "Round Robin", "MLFQ"], answer: 0, explanation: "Short jobs wait behind a long one." },
    ],
  },
  {
    slug: "deadlocks",
    title: "Deadlocks: Conditions, Prevention and Banker's Algorithm",
    category: "operating-systems",
    difficulty: "HARD",
    excerpt: "The four Coffman conditions, resource allocation graphs, prevention strategies and deadlock avoidance.",
    tags: ["os", "deadlock", "concurrency"],
    content: `## What is a deadlock?

A set of processes is deadlocked when each waits for a resource held by another process in the set — nobody can proceed.

## The four Coffman conditions (all must hold)

1. **Mutual exclusion** — a resource can be held by only one process.
2. **Hold and wait** — a process holds resources while waiting for others.
3. **No preemption** — resources can't be forcibly taken away.
4. **Circular wait** — a cycle P1 → P2 → … → P1 of waits.

## Handling strategies

- **Prevention** — break a condition. The most practical: impose a **global lock ordering** so circular wait is impossible.
- **Avoidance** — grant a request only if the system stays in a *safe state* (Banker's algorithm).
- **Detection & recovery** — let it happen, find cycles in the wait-for graph, kill or roll back a victim.
- **Ignore it** — the "ostrich algorithm" used by most desktop OSes.

## Lock ordering in code

${fence}python
import threading

a, b = threading.Lock(), threading.Lock()

def transfer_safe(first, second):
    # Always acquire locks in a fixed global order (by id)
    l1, l2 = sorted([first, second], key=id)
    with l1:
        with l2:
            pass  # critical section

threading.Thread(target=transfer_safe, args=(a, b)).start()
threading.Thread(target=transfer_safe, args=(b, a)).start()
print("no deadlock")
${fence}

## Banker's algorithm (idea)

Keep \`Available\`, \`Max\`, \`Allocation\` and \`Need = Max − Allocation\`. A state is **safe** if some order exists where every process can obtain its remaining need from what's available plus what earlier processes release. Before granting a request, pretend to grant it and check safety.

<Callout type="info">Deadlock ≠ starvation. Starvation is a process waiting indefinitely while others progress; deadlock means *no one* in the cycle progresses.</Callout>`,
    quiz: [
      { q: "Which is NOT a Coffman condition?", options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], answer: 2, explanation: "The condition is *no* preemption." },
      { q: "Global lock ordering prevents…", options: ["Mutual exclusion", "Circular wait", "Starvation", "Paging"], answer: 1, explanation: "A cycle can't form if everyone locks in the same order." },
    ],
  },
  {
    slug: "memory-management-paging",
    title: "Memory Management: Paging and Virtual Memory",
    category: "operating-systems",
    difficulty: "MEDIUM",
    excerpt: "Logical vs physical addresses, paging, the TLB, page faults and page replacement algorithms (FIFO, LRU, Optimal).",
    tags: ["os", "memory", "paging", "virtual-memory"],
    content: `## Logical vs physical addresses

Programs use **logical (virtual) addresses**; the **MMU** translates them to **physical** RAM addresses. This isolates processes and lets each believe it owns a large contiguous memory.

## Paging

Virtual memory is split into fixed-size **pages** (commonly 4 KB) and RAM into **frames** of the same size. A **page table** maps page → frame. Paging eliminates *external* fragmentation (a partially used last page causes small *internal* fragmentation).

Address = **page number | offset**. With 4 KB pages, the low 12 bits are the offset.

## TLB

Walking the page table on every access would double memory latency. The **Translation Lookaside Buffer** caches recent translations; hit rates above 99% are typical.

## Page faults and demand paging

Pages load only when first touched. Accessing a page not in RAM triggers a **page fault**: the OS picks a victim frame, writes it out if dirty, loads the page and restarts the instruction.

## Page replacement

${fence}python
def lru_faults(refs, frames):
    cache, faults = [], 0
    for p in refs:
        if p in cache:
            cache.remove(p)
        else:
            faults += 1
            if len(cache) == frames:
                cache.pop(0)          # least recently used
        cache.append(p)
    return faults

refs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
print("LRU faults:", lru_faults(refs, 3))  # 9
${fence}

| Algorithm | Idea | Notes |
|---|---|---|
| FIFO | Evict the oldest | Suffers **Belady's anomaly** |
| LRU | Evict least recently used | Great in practice, costly to track exactly |
| Optimal | Evict the page used farthest in future | Theoretical benchmark |
| Clock | Approximate LRU with a reference bit | Used by real OSes |

<Callout type="warning">**Thrashing** happens when processes don't have enough frames for their working set: the system spends more time paging than executing.</Callout>`,
    quiz: [
      { q: "Which algorithm can suffer Belady's anomaly?", options: ["LRU", "Optimal", "FIFO", "Clock"], answer: 2, explanation: "More frames can mean more faults under FIFO." },
      { q: "The TLB caches…", options: ["Disk blocks", "Page table translations", "Instructions", "Processes"], answer: 1, explanation: "Recent virtual→physical mappings." },
    ],
  },
];

export const blogArticles: SeedArticle[] = [
  {
    slug: "how-to-prepare-for-coding-interviews-2026",
    title: "How to Prepare for Coding Interviews in 2026",
    category: "blog",
    difficulty: "EASY",
    excerpt: "A 12-week plan covering DSA patterns, system design basics, mock interviews and the AI-era expectations of recruiters.",
    tags: ["career", "interviews"],
    content: `## Weeks 1–4: Foundations

Pick **one language** and get fluent with its standard library. Cover arrays, strings, hashing, two pointers, sliding window and binary search. Solve 3–4 problems daily; for each, write the complexity before coding.

## Weeks 5–8: Core patterns

Linked lists, stacks/queues, trees, graphs (BFS/DFS, Dijkstra, topological sort) and dynamic programming. Use the **CodeVerse DSA Sheet** and aim for understanding over volume — re-solve problems you got wrong after 3 days, then after a week.

## Weeks 9–10: Contests and speed

Join weekly contests. Timed pressure exposes gaps that untimed practice hides. Review editorials for every problem you couldn't solve.

## Weeks 11–12: Mock interviews and projects

Practise **thinking aloud**: clarify the problem, state a brute force, optimise, then code. Prepare two projects you can discuss deeply — trade-offs, failures, metrics.

## What changed in 2026

Interviewers increasingly allow AI tools in take-homes but expect you to **explain and critique** generated code. Knowing complexity, edge cases and testing is more valuable than ever.

<Callout type="tip">Consistency beats intensity: a 60-day streak of one hour a day outperforms weekend cramming.</Callout>`,
  },
  {
    slug: "inside-the-codeverse-judge",
    title: "Inside the CodeVerse Judge: How Your Code Runs Safely",
    category: "blog",
    difficulty: "MEDIUM",
    excerpt: "A look at sandboxed execution with Judge0, per-test verdicts, time and memory limits, and rate limiting.",
    tags: ["engineering", "judge0", "security"],
    content: `## The pipeline

When you press **Submit**, your code is validated, rate-limited and sent to a **Judge0** worker together with each hidden test case. Judge0 compiles and runs the program inside an **isolate** sandbox with strict CPU-time, wall-time and memory limits, no network, and a read-only filesystem.

## Verdicts

- **Accepted** — every test's output matches (ignoring trailing whitespace).
- **Wrong Answer** — output differs on at least one test.
- **Time Limit Exceeded** — the CPU limit was hit.
- **Runtime Error** — non-zero exit, segfault or uncaught exception.
- **Compilation Error** — the compiler rejected the code.

We stop at the first failing hidden test, and report runtime and memory as the maximum across tests.

## Why Run and Submit differ

**Run** uses the visible sample tests (and your custom input) so you can iterate quickly; **Submit** uses hidden tests that include edge cases like empty inputs, maximum sizes and negative numbers.

## Fair use

Code execution is rate-limited per user to keep queues short for everyone during contests.`,
  },
  {
    slug: "why-we-built-codeverse",
    title: "Why We Built CodeVerse",
    category: "blog",
    difficulty: "EASY",
    excerpt: "Learning to code shouldn't require five tabs. Here's the story and philosophy behind one platform for learn, practice and compete.",
    tags: ["company", "product"],
    content: `## Five tabs too many

Most students we met had a tutorial site open in one tab, a problem site in another, a video in a third, an online compiler in a fourth and a spreadsheet tracking progress in a fifth. Context switching was killing momentum.

## Our principles

1. **Learn by doing** — every code block has a *Try it Yourself* button.
2. **Hints, not spoilers** — our AI tutor nudges you toward the answer instead of handing it over.
3. **Progress you can see** — streaks, XP, heatmaps and certificates make consistency visible.
4. **Fast everywhere** — tutorials and problems load quickly even on budget phones and 4G.

## What's next

Company-specific mock interviews, peer code review and more languages. Tell us what you want on the Contact page — we read everything.`,
  },
];
