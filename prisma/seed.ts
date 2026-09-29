import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient, type Difficulty, type Language, type Verdict } from "../lib/generated/prisma/client";
import { dsaArticles } from "./seed/data/articles-dsa";
import { jsArticles, pythonArticles } from "./seed/data/articles-lang";
import { blogArticles, dbmsArticles, osArticles, webArticles } from "./seed/data/articles-cs";
import { badges, courses, roadmaps, students } from "./seed/data/catalog";
import type { SeedArticle, SeedQuizQ } from "./seed/data/types";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }) });

type SeedProblem = {
  number: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  hints: string[];
  editorial: string;
  starterCode: Record<Language, string>;
  solutionPython: string;
  samples: { input: string; expected: string; explanation: string }[];
  hidden: { input: string; expected: string }[];
};

const problems = JSON.parse(readFileSync(join(__dirname, "seed/data/problems.json"), "utf8")) as SeedProblem[];

const DAY = 86_400_000;
const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * DAY);
const dateOnly = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

// Deterministic PRNG so seeds are reproducible
let s = 42;
const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)];

const categories = [
  { slug: "dsa", name: "Data Structures & Algorithms", order: 1 },
  { slug: "python", name: "Python", order: 2 },
  { slug: "javascript", name: "JavaScript", order: 3 },
  { slug: "web-development", name: "Web Development", order: 4 },
  { slug: "dbms", name: "DBMS", order: 5 },
  { slug: "operating-systems", name: "Operating Systems", order: 6 },
  { slug: "blog", name: "Blog", order: 7 },
];

function readingMins(content: string) {
  return Math.max(3, Math.round(content.split(/\s+/).length / 200));
}

async function reset() {
  // Order matters for FK constraints; cascade handles most children.
  await db.$transaction([
    db.auditLog.deleteMany(),
    db.pageView.deleteMany(),
    db.announcement.deleteMany(),
    db.featureFlag.deleteMany(),
    db.media.deleteMany(),
    db.vote.deleteMany(),
    db.report.deleteMany(),
    db.doubt.updateMany({ data: { acceptedAnswerId: null } }),
  ]);
  await db.answer.deleteMany();
  await db.doubt.deleteMany();
  await db.comment.deleteMany();
  await db.contest.deleteMany();
  await db.sheet.deleteMany();
  await db.roadmap.deleteMany();
  await db.lesson.deleteMany();
  await db.module.deleteMany();
  await db.course.deleteMany();
  await db.quiz.deleteMany();
  await db.problem.deleteMany();
  await db.article.deleteMany();
  await db.category.deleteMany();
  await db.tag.deleteMany();
  await db.badge.deleteMany();
  await db.user.deleteMany();
}

async function createUser(opts: { name: string; email: string; password: string; role: "STUDENT" | "CONTRIBUTOR" | "ADMIN"; username: string; createdAt?: Date }) {
  const id = crypto.randomUUID();
  const user = await db.user.create({
    data: {
      id,
      name: opts.name,
      email: opts.email,
      emailVerified: true,
      role: opts.role,
      username: opts.username,
      createdAt: opts.createdAt ?? daysAgo(90),
      lastActiveAt: new Date(),
      accounts: {
        create: { id: crypto.randomUUID(), accountId: id, providerId: "credential", password: await hashPassword(opts.password) },
      },
    },
  });
  return user;
}

async function main() {
  console.log("🌱 Resetting database…");
  await reset();

  // ── Users ──────────────────────────────────────────────
  console.log("👤 Users");
  const admin = await createUser({ name: "Priya Verma", email: "admin@codeverse.dev", password: "Admin@123", role: "ADMIN", username: "priya", createdAt: daysAgo(400) });
  const contributor = await createUser({
    name: "Rahul Khanna",
    email: "contributor@codeverse.dev",
    password: "Contributor@123",
    role: "CONTRIBUTOR",
    username: "rahulk",
    createdAt: daysAgo(300),
  });
  await db.profile.create({ data: { userId: admin.id, bio: "Founder & lead instructor at CodeVerse. Ex-Google.", college: "IIT Madras", country: "IN", xp: 12000, level: 25, contestRating: 2150, maxRating: 2210 } });
  await db.profile.create({ data: { userId: contributor.id, bio: "Senior engineer who loves explaining algorithms.", college: "IIT Kanpur", country: "IN", xp: 5400, level: 16, contestRating: 1890, maxRating: 1920 } });
  await db.streak.createMany({ data: [{ userId: admin.id, current: 12, longest: 90 }, { userId: contributor.id, current: 4, longest: 41 }] });

  const studentUsers = [];
  for (const [i, st] of students.entries()) {
    const username = st.email.split("@")[0].replace(".", "");
    const u = await createUser({ name: st.name, email: st.email, password: "Student@123", role: "STUDENT", username: i === 0 ? "aarav" : username, createdAt: daysAgo(10 + i * 17) });
    await db.profile.create({
      data: {
        userId: u.id,
        bio: st.bio,
        college: st.college,
        country: st.country,
        github: `https://github.com/${username}`,
        preferredLang: pick(["PYTHON", "CPP", "JAVA", "JAVASCRIPT"] as const),
      },
    });
    studentUsers.push(u);
  }
  const demo = studentUsers[0];

  // ── Taxonomy ───────────────────────────────────────────
  console.log("🏷️  Categories & tags");
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const created = await db.category.create({ data: { ...c, description: `${c.name} tutorials and guides.` } });
    categoryIds.set(c.slug, created.id);
  }

  // ── Articles (+ inline quizzes + revisions) ────────────
  console.log("📝 Articles");
  const allArticles: SeedArticle[] = [...dsaArticles, ...pythonArticles, ...jsArticles, ...webArticles, ...dbmsArticles, ...osArticles, ...blogArticles];
  const articleIds = new Map<string, string>();
  const tagIds = new Map<string, string>();
  for (const [i, a] of allArticles.entries()) {
    for (const t of a.tags) {
      if (!tagIds.has(t)) tagIds.set(t, (await db.tag.create({ data: { slug: t, name: t.replace(/-/g, " ") } })).id);
    }
    const author = i % 3 === 0 ? admin : contributor;
    const published = daysAgo(120 - i * 3);
    const created = await db.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        difficulty: a.difficulty,
        status: "PUBLISHED",
        isBlog: a.category === "blog",
        order: i,
        readingMins: readingMins(a.content),
        views: 400 + Math.floor(rand() * 9000),
        seoTitle: `${a.title} | CodeVerse`,
        seoDescription: a.excerpt,
        publishedAt: published,
        createdAt: published,
        updatedAt: daysAgo(Math.max(1, 60 - i)),
        authorId: author.id,
        categoryId: categoryIds.get(a.category),
        tags: { connect: a.tags.map((t) => ({ id: tagIds.get(t) as string })) },
        revisions: { create: { authorId: author.id, title: a.title, content: a.content, version: 1, message: "Initial version" } },
      },
    });
    articleIds.set(a.slug, created.id);
    if (a.quiz?.length) {
      await db.quiz.create({
        data: {
          slug: `${a.slug}-quiz`,
          title: `${a.title} — Quick Check`,
          description: `Test your understanding of ${a.title}.`,
          topic: a.category,
          durationMins: 5,
          articleId: created.id,
          questions: {
            create: a.quiz.map((q, order) => ({ prompt: q.q, options: q.options, correct: [q.answer], explanation: q.explanation, order })),
          },
        },
      });
    }
  }
  // A contributor draft awaiting review (for the admin review queue)
  const draft = await db.article.create({
    data: {
      slug: "union-find-disjoint-set",
      title: "Union-Find (Disjoint Set Union)",
      excerpt: "Track connected components with near-constant-time union and find operations.",
      content:
        "## What is DSU?\n\nA Disjoint Set Union maintains a partition of elements into sets, supporting **find(x)** (which set is x in?) and **union(a, b)**.\n\n## Path compression + union by rank\n\nTogether these make each operation run in amortised **O(α(n))** — effectively constant.\n\n```python\nparent = list(range(10))\n\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    parent[find(a)] = find(b)\n\nunion(1, 2); union(2, 3)\nprint(find(1) == find(3))  # True\n```\n\nDSU powers Kruskal's MST, cycle detection in undirected graphs and dynamic connectivity.",
      difficulty: "MEDIUM",
      status: "IN_REVIEW",
      authorId: contributor.id,
      categoryId: categoryIds.get("dsa"),
      readingMins: 4,
      revisions: { create: { authorId: contributor.id, title: "Union-Find (Disjoint Set Union)", content: "Initial draft", version: 1, message: "First draft" } },
    },
  });
  console.log(`   ${allArticles.length} published + 1 in review (${draft.slug})`);

  // ── Problems ───────────────────────────────────────────
  console.log("🧩 Problems");
  const problemIds = new Map<string, { id: string; difficulty: Difficulty }>();
  for (const p of problems) {
    const created = await db.problem.create({
      data: {
        number: p.number,
        slug: p.slug,
        title: p.title,
        statement: p.statement,
        constraints: p.constraints,
        inputFormat: p.inputFormat,
        outputFormat: p.outputFormat,
        difficulty: p.difficulty,
        topics: p.topics,
        companies: p.companies,
        hints: p.hints,
        editorial: p.editorial,
        starterCode: p.starterCode,
        solutionCode: { PYTHON: p.solutionPython },
        timeLimitMs: p.difficulty === "HARD" ? 3000 : 2000,
        testCases: {
          create: [
            ...p.samples.map((t, order) => ({ input: t.input, expected: t.expected, explanation: t.explanation, isSample: true, order })),
            ...p.hidden.map((t, order) => ({ input: t.input, expected: t.expected, isSample: false, order: order + 10 })),
          ],
        },
      },
    });
    problemIds.set(p.slug, { id: created.id, difficulty: p.difficulty });
  }

  // ── Quizzes (5 standalone, built from the article question bank) ──
  console.log("❓ Quizzes");
  const bank = (cats: SeedArticle["category"][]) => allArticles.filter((a) => cats.includes(a.category)).flatMap((a) => a.quiz ?? []);
  const quizDefs: { slug: string; title: string; description: string; topic: string; questions: SeedQuizQ[]; mins: number; negative: boolean; mock: boolean }[] = [
    { slug: "dsa-fundamentals-mock-test", title: "DSA Fundamentals Mock Test", description: "30-question timed test covering complexity, arrays, searching, sorting, trees, graphs and DP. Negative marking applies.", topic: "DSA", questions: bank(["dsa"]), mins: 30, negative: true, mock: true },
    { slug: "python-essentials-quiz", title: "Python Essentials Quiz", description: "Types, collections, functions, OOP and generators.", topic: "Python", questions: bank(["python"]), mins: 10, negative: false, mock: false },
    { slug: "javascript-quiz", title: "JavaScript Deep-Dive Quiz", description: "Scope, closures, async and the event loop.", topic: "JavaScript", questions: bank(["javascript"]), mins: 10, negative: false, mock: false },
    { slug: "dbms-mock-test", title: "DBMS Placement Mock Test", description: "Keys, joins, normalization, transactions and indexing — placement-style with negative marking.", topic: "DBMS", questions: bank(["dbms"]), mins: 15, negative: true, mock: true },
    { slug: "operating-systems-quiz", title: "Operating Systems Quiz", description: "Processes, scheduling, deadlocks and memory management.", topic: "Operating Systems", questions: bank(["operating-systems", "web-development"]).slice(0, 12), mins: 12, negative: false, mock: false },
  ];
  const quizIds = new Map<string, string>();
  for (const q of quizDefs) {
    const created = await db.quiz.create({
      data: {
        slug: q.slug,
        title: q.title,
        description: q.description,
        topic: q.topic,
        durationMins: q.mins,
        negativeMarking: q.negative,
        isMockTest: q.mock,
        questions: { create: q.questions.map((x, order) => ({ prompt: x.q, options: x.options, correct: [x.answer], explanation: x.explanation, order, marks: q.mock ? 2 : 1 })) },
      },
    });
    quizIds.set(q.slug, created.id);
  }

  // ── Courses ────────────────────────────────────────────
  console.log("🎓 Courses");
  const courseIds = new Map<string, string>();
  const lessonIdsByCourse = new Map<string, string[]>();
  for (const c of courses) {
    const course = await db.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        topic: c.topic,
        level: c.level,
        color: c.color,
        featured: c.featured,
        outcomes: c.outcomes,
        status: "PUBLISHED",
        categoryId: categoryIds.get(allArticles.find((a) => a.slug === c.modules[0].lessons[0].article)?.category ?? "dsa"),
        durationMins: c.modules.reduce((t, m) => t + m.lessons.length * 15, 0),
      },
    });
    courseIds.set(c.slug, course.id);
    const lessonIds: string[] = [];
    for (const [mi, m] of c.modules.entries()) {
      const mod = await db.module.create({ data: { courseId: course.id, title: m.title, order: mi } });
      for (const [li, l] of m.lessons.entries()) {
        const lesson = await db.lesson.create({
          data: {
            moduleId: mod.id,
            slug: l.article ?? l.problem ?? l.quiz ?? `lesson-${li}`,
            title: l.title,
            order: li,
            isPreview: Boolean(l.preview),
            type: l.problem ? "PROBLEM" : l.quiz ? "QUIZ" : "ARTICLE",
            durationMins: l.problem ? 25 : l.quiz ? 15 : 12,
            articleId: l.article ? articleIds.get(l.article) : undefined,
            problemId: l.problem ? problemIds.get(l.problem)?.id : undefined,
            quizId: l.quiz ? quizIds.get(l.quiz) : undefined,
          },
        });
        lessonIds.push(lesson.id);
      }
    }
    lessonIdsByCourse.set(c.slug, lessonIds);
  }

  // ── Sheets ─────────────────────────────────────────────
  console.log("📋 Sheets");
  const sheetDefs = [
    {
      slug: "top-interview-30",
      title: "Top Interview 30",
      description: "The 30 problems that cover every pattern asked in product-company interviews.",
      kind: "TOPIC" as const,
      company: null,
      sections: [
        { section: "Arrays & Hashing", slugs: ["two-sum", "majority-element", "move-zeroes", "product-of-array-except-self", "valid-anagram"] },
        { section: "Two Pointers & Windows", slugs: ["reverse-words-in-a-string", "longest-substring-without-repeating-characters", "trapping-rain-water", "sliding-window-maximum"] },
        { section: "Searching & Sorting", slugs: ["binary-search", "kth-largest-element-in-an-array", "merge-intervals", "median-of-two-sorted-arrays", "count-inversions"] },
        { section: "Stacks, Trees & Graphs", slugs: ["valid-parentheses", "binary-tree-level-order-traversal", "number-of-islands", "detect-cycle-in-directed-graph", "shortest-path-dijkstra", "minimum-spanning-tree"] },
        { section: "Dynamic Programming", slugs: ["climbing-stairs", "maximum-subarray", "coin-change", "longest-increasing-subsequence", "longest-common-subsequence", "edit-distance"] },
        { section: "Math & Backtracking", slugs: ["palindrome-number", "fizz-buzz", "gcd-and-lcm", "n-queens-count"] },
      ],
    },
    {
      slug: "amazon-sde-sheet",
      title: "Amazon SDE Sheet",
      description: "Problems frequently reported in Amazon SDE-1 and SDE-2 interviews.",
      kind: "COMPANY" as const,
      company: "Amazon",
      sections: [{ section: "Most Asked", slugs: problems.filter((p) => p.companies.includes("Amazon")).map((p) => p.slug) }],
    },
    {
      slug: "graph-mastery",
      title: "Graph Mastery",
      description: "Go from BFS to MST with this focused graph sheet.",
      kind: "TOPIC" as const,
      company: null,
      sections: [{ section: "Graphs", slugs: ["number-of-islands", "detect-cycle-in-directed-graph", "shortest-path-dijkstra", "minimum-spanning-tree", "binary-tree-level-order-traversal"] }],
    },
  ];
  for (const sh of sheetDefs) {
    let order = 0;
    await db.sheet.create({
      data: {
        slug: sh.slug,
        title: sh.title,
        description: sh.description,
        kind: sh.kind,
        company: sh.company,
        items: { create: sh.sections.flatMap((sec) => sec.slugs.map((slug) => ({ problemId: problemIds.get(slug)?.id as string, section: sec.section, order: order++ }))) },
      },
    });
  }

  // ── Roadmaps ───────────────────────────────────────────
  for (const r of roadmaps) {
    await db.roadmap.create({ data: { slug: r.slug, title: r.title, description: r.description, nodes: r.nodes, edges: r.edges } });
  }

  // ── Badges ─────────────────────────────────────────────
  console.log("🏅 Badges");
  const badgeIds = new Map<string, string>();
  for (const b of badges) badgeIds.set(b.slug, (await db.badge.create({ data: { ...b, criteria: b.criteria } })).id);

  // ── Activity: submissions, XP, streaks, enrollments ────
  console.log("📈 Activity");
  const langs: Language[] = ["PYTHON", "CPP", "JAVA", "JAVASCRIPT", "GO", "C"];
  const xpFor = { EASY: 10, MEDIUM: 20, HARD: 40 } as const;
  const allUsers = [demo, ...studentUsers.slice(1)];
  for (const [ui, u] of allUsers.entries()) {
    const skill = ui === 0 ? 0.85 : 0.35 + rand() * 0.5;
    let xp = 0;
    const solved = new Set<string>();
    const activeDays = ui === 0 ? 120 : 30 + Math.floor(rand() * 60);
    for (let d = activeDays; d >= 0; d--) {
      if (rand() > (ui === 0 ? 0.72 : 0.45)) continue;
      const count = 1 + Math.floor(rand() * 3);
      for (let k = 0; k < count; k++) {
        const p = pick(problems);
        const accepted = rand() < skill;
        const verdict: Verdict = accepted ? "ACCEPTED" : pick(["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "COMPILATION_ERROR"] as const);
        const lang = ui === 0 ? pick(["PYTHON", "PYTHON", "CPP", "JAVASCRIPT"] as const) : pick(langs);
        const createdAt = new Date(daysAgo(d).getTime() + Math.floor(rand() * 12) * 3_600_000);
        const total = p.samples.length + p.hidden.length;
        await db.submission.create({
          data: {
            userId: u.id,
            problemId: problemIds.get(p.slug)?.id,
            language: lang,
            code: lang === "PYTHON" ? p.solutionPython : p.starterCode[lang],
            kind: "SUBMIT",
            verdict,
            passed: accepted ? total : Math.floor(rand() * total),
            total,
            runtimeMs: 20 + Math.floor(rand() * 400),
            memoryKb: 8000 + Math.floor(rand() * 40000),
            createdAt,
          },
        });
        if (accepted && !solved.has(p.slug)) {
          solved.add(p.slug);
          xp += xpFor[p.difficulty];
          await db.xpEvent.create({ data: { userId: u.id, source: "PROBLEM_SOLVED", amount: xpFor[p.difficulty], refId: problemIds.get(p.slug)?.id, createdAt } });
        }
      }
      await db.studySession.upsert({
        where: { userId_date: { userId: u.id, date: dateOnly(daysAgo(d)) } },
        update: {},
        create: { userId: u.id, date: dateOnly(daysAgo(d)), minutes: 15 + Math.floor(rand() * 90) },
      });
    }
    // Articles read
    const readCount = ui === 0 ? 18 : 3 + Math.floor(rand() * 12);
    for (const a of allArticles.slice(0, readCount)) {
      xp += 5;
      await db.xpEvent.create({ data: { userId: u.id, source: "ARTICLE_READ", amount: 5, refId: articleIds.get(a.slug), createdAt: daysAgo(Math.floor(rand() * 60)) } });
    }
    const level = Math.floor(Math.sqrt(xp / 50)) + 1;
    await db.profile.update({
      where: { userId: u.id },
      data: { xp, level, contestRating: 1400 + Math.floor(skill * 600), maxRating: 1450 + Math.floor(skill * 650) },
    });
    const current = ui === 0 ? 14 : Math.floor(rand() * 20);
    await db.streak.create({ data: { userId: u.id, current, longest: current + Math.floor(rand() * 25), freezes: ui === 0 ? 2 : 1, lastActiveDay: dateOnly(new Date()) } });
    // Enrollments
    for (const [ci, c] of courses.entries()) {
      if (ui !== 0 && rand() < 0.5) continue;
      if (ui === 0 && ci > 3) continue;
      const lessonIds = lessonIdsByCourse.get(c.slug) ?? [];
      const doneCount = ui === 0 ? (ci === 1 ? lessonIds.length : Math.floor(lessonIds.length * (0.3 + ci * 0.15))) : Math.floor(rand() * lessonIds.length);
      await db.enrollment.create({
        data: {
          userId: u.id,
          courseId: courseIds.get(c.slug) as string,
          progressPct: Math.round((doneCount / Math.max(1, lessonIds.length)) * 100),
          completedAt: doneCount === lessonIds.length ? daysAgo(3) : null,
          lastLessonId: lessonIds[Math.min(doneCount, lessonIds.length - 1)],
          createdAt: daysAgo(40),
        },
      });
      for (const lid of lessonIds.slice(0, doneCount)) {
        await db.progress.create({ data: { userId: u.id, lessonId: lid, completed: true, completedAt: daysAgo(Math.floor(rand() * 30)) } });
      }
    }
    // Badges
    const earned = ["first-blood", "bookworm", "contestant"];
    if (solved.size >= 10) earned.push("problem-solver-10");
    if (current >= 7) earned.push("streak-7");
    if (ui === 0) earned.push("polyglot", "course-finisher", "quiz-ace", "night-owl");
    for (const slug of earned) await db.userBadge.create({ data: { userId: u.id, badgeId: badgeIds.get(slug) as string, awardedAt: daysAgo(Math.floor(rand() * 50)) } });
  }
  // Certificate for completed course
  await db.certificate.create({ data: { code: "CV-PY-2026-A7F3", userId: demo.id, courseId: courseIds.get("python-programming") as string, issuedAt: daysAgo(3) } });

  // ── Social graph ───────────────────────────────────────
  for (let i = 1; i < studentUsers.length; i++) {
    await db.follow.create({ data: { followerId: demo.id, followingId: studentUsers[i].id } }).catch(() => undefined);
    if (i % 2 === 0) await db.follow.create({ data: { followerId: studentUsers[i].id, followingId: demo.id } }).catch(() => undefined);
  }

  // ── Learning tools for the demo student ────────────────
  const bookmarked = ["dijkstra-shortest-path", "dynamic-programming-introduction", "binary-search-guide", "sliding-window-technique", "transactions-and-acid"];
  for (const slug of bookmarked) await db.bookmark.create({ data: { userId: demo.id, articleId: articleIds.get(slug) } });
  for (const slug of ["trapping-rain-water", "edit-distance", "coin-change"]) await db.bookmark.create({ data: { userId: demo.id, problemId: problemIds.get(slug)?.id } });
  await db.note.createMany({
    data: [
      { userId: demo.id, articleId: articleIds.get("dijkstra-shortest-path"), highlight: "Always expand the unvisited vertex with the smallest tentative distance.", body: "Greedy works **only** because weights are non-negative. Use Bellman-Ford otherwise.", color: "purple" },
      { userId: demo.id, articleId: articleIds.get("sliding-window-technique"), highlight: "Every index enters and leaves the window at most once", body: "That's why the nested while loop is still O(n) overall.", color: "cyan" },
      { userId: demo.id, articleId: articleIds.get("transactions-and-acid"), highlight: "PostgreSQL defaults to Read Committed", body: "MVCC: readers don't block writers. Remember `SELECT … FOR UPDATE` for lost updates.", color: "amber" },
    ],
  });
  await db.flashcard.createMany({
    data: [
      { userId: demo.id, front: "Time complexity of heap-based Dijkstra?", back: "O((V + E) log V)", sourceSlug: "dijkstra-shortest-path", dueAt: daysAgo(0) },
      { userId: demo.id, front: "Two properties that make DP applicable?", back: "Optimal substructure and overlapping subproblems.", sourceSlug: "dynamic-programming-introduction", dueAt: daysAgo(1) },
      { userId: demo.id, front: "lower_bound(x) returns…", back: "The first index i with a[i] ≥ x.", sourceSlug: "binary-search-guide", dueAt: daysAgo(0) },
      { userId: demo.id, front: "Why is the variable sliding window O(n)?", back: "Both pointers only move forward — each index enters and leaves once.", sourceSlug: "sliding-window-technique", dueAt: new Date(now + 2 * DAY), intervalDays: 3, repetitions: 2 },
      { userId: demo.id, front: "Which isolation level prevents phantom reads?", back: "Serializable.", sourceSlug: "transactions-and-acid", dueAt: new Date(now + DAY), intervalDays: 1, repetitions: 1 },
    ],
  });

  // ── Reviews ────────────────────────────────────────────
  const reviewTexts = [
    "The explanations are crisp and the in-browser practice after every lesson made it stick.",
    "Finally a course that connects theory with problems. The DP module is gold.",
    "Loved the visual examples and the 'Try it Yourself' buttons. Worth every minute.",
    "Clear, practical and interview-focused. Helped me clear my internship OA.",
    "Great pacing. I wish there were even more practice problems!",
  ];
  for (const c of courses) {
    for (let i = 0; i < 4; i++) {
      await db.review.create({
        data: { userId: studentUsers[(i + c.slug.length) % studentUsers.length].id, courseId: courseIds.get(c.slug) as string, rating: i === 3 ? 4 : 5, body: reviewTexts[(i + c.title.length) % reviewTexts.length], createdAt: daysAgo(5 + i * 7) },
      }).catch(() => undefined);
    }
  }

  // ── Comments ───────────────────────────────────────────
  const comment = await db.comment.create({
    data: { userId: studentUsers[1].id, target: "ARTICLE", articleId: articleIds.get("dijkstra-shortest-path"), body: "Why do we skip entries where `d > dist[u]`? Wouldn't they be removed anyway?", score: 12, createdAt: daysAgo(6) },
  });
  await db.comment.create({
    data: {
      userId: contributor.id,
      target: "ARTICLE",
      articleId: articleIds.get("dijkstra-shortest-path"),
      parentId: comment.id,
      body: "Great question! Python's heapq has no decrease-key, so we push duplicates. The check discards stale ones in O(1) instead of re-relaxing edges.",
      score: 20,
      createdAt: daysAgo(5),
    },
  });
  await db.comment.create({ data: { userId: studentUsers[3].id, target: "ARTICLE", articleId: articleIds.get("sliding-window-technique"), body: "The fixed-window template saved me in yesterday's OA. Thanks!", score: 7, createdAt: daysAgo(2) } });
  await db.comment.create({ data: { userId: studentUsers[4].id, target: "PROBLEM", problemId: problemIds.get("two-sum")?.id, body: "Tip: store the index BEFORE checking to avoid pairing an element with itself… actually check first, then store!", score: 5, createdAt: daysAgo(4) } });

  // ── Doubts forum ───────────────────────────────────────
  console.log("💬 Doubts");
  const doubtTags = ["dp", "graphs", "python", "javascript", "sql"];
  for (const t of doubtTags) if (!tagIds.has(t)) tagIds.set(t, (await db.tag.create({ data: { slug: t, name: t } })).id);
  const doubts = [
    { title: "How do I identify that a problem needs Dynamic Programming?", body: "I can solve DP problems after seeing the solution, but I never recognise them myself. Any mental checklist?", tags: ["dp"], by: 2, answers: [{ by: -1, body: "Ask: (1) Am I asked for a count/min/max over choices? (2) Does a brute-force recursion recompute the same arguments? If both are yes, memoise that recursion — that's DP. Start from the recursion, not the table.", accepted: true }, { by: 6, body: "Also look at constraints: n ≤ 5000 often hints at O(n²) DP." }] },
    { title: "BFS vs DFS for shortest path in an unweighted grid?", body: "My DFS solution gives wrong answers for shortest path in a maze. Why does BFS work but DFS doesn't?", tags: ["graphs"], by: 4, answers: [{ by: 0, body: "DFS finds *a* path, not the shortest. BFS explores by distance layers, so the first time you reach a cell is via a shortest path.", accepted: true }] },
    { title: "Python TLE on 10^5 input even with O(n log n)", body: "My Python solution times out while the same C++ passes. I'm using input() in a loop.", tags: ["python"], by: 7, answers: [{ by: 1, body: "Read everything once: `data = sys.stdin.buffer.read().split()`. input() per line is very slow for 10^5 lines.", accepted: true }] },
    { title: "Why does [] == false evaluate to true in JavaScript?", body: "This broke my if-condition. Can someone explain the coercion steps?", tags: ["javascript"], by: 9, answers: [{ by: -2, body: "`false` → 0, `[]` → '' → 0, so 0 == 0. Use === to avoid coercion entirely." }] },
    { title: "When should I use a composite index vs two separate indexes?", body: "Queries filter by user_id and sort by created_at. Is one composite index better?", tags: ["sql"], by: 5, answers: [] },
  ];
  for (const [i, d] of doubts.entries()) {
    const doubt = await db.doubt.create({
      data: {
        userId: studentUsers[d.by].id,
        title: d.title,
        body: d.body,
        score: 3 + ((i * 7) % 15),
        views: 50 + i * 37,
        createdAt: daysAgo(10 - i),
        tags: { connect: d.tags.map((t) => ({ id: tagIds.get(t) as string })) },
      },
    });
    for (const a of d.answers) {
      const authorId = a.by === -1 ? contributor.id : a.by === -2 ? admin.id : studentUsers[a.by].id;
      const ans = await db.answer.create({ data: { doubtId: doubt.id, userId: authorId, body: a.body, score: 4 + i, createdAt: daysAgo(9 - i) } });
      if ("accepted" in a && a.accepted) await db.doubt.update({ where: { id: doubt.id }, data: { acceptedAnswerId: ans.id } });
    }
  }

  // ── Contests (past, live, upcoming) ────────────────────
  console.log("🏆 Contests");
  const contestDefs = [
    { slug: "codeverse-weekly-41", title: "CodeVerse Weekly #41", start: now - 7 * DAY, dur: 2, problems: ["two-sum", "merge-intervals", "coin-change", "trapping-rain-water"], ended: true },
    { slug: "codeverse-weekly-42", title: "CodeVerse Weekly #42", start: now - 30 * 60_000, dur: 2, problems: ["valid-anagram", "kth-largest-element-in-an-array", "number-of-islands", "edit-distance"], ended: false },
    { slug: "codeverse-monthly-sept", title: "CodeVerse Monthly Challenge", start: now + 3 * DAY, dur: 3, problems: ["maximum-subarray", "longest-increasing-subsequence", "sliding-window-maximum", "median-of-two-sorted-arrays", "n-queens-count"], ended: false },
  ];
  for (const c of contestDefs) {
    const contest = await db.contest.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: `${c.problems.length} problems · ${c.dur} hours · rated for everyone. ICPC-style scoring: points per problem with a 5-minute penalty per wrong submission.`,
        startsAt: new Date(c.start),
        endsAt: new Date(c.start + c.dur * 3_600_000),
        ratingsApplied: c.ended,
        problems: { create: c.problems.map((slug, order) => ({ problemId: problemIds.get(slug)?.id as string, order, points: [100, 200, 300, 500, 700][order] })) },
      },
    });
    if (c.start > now) {
      for (const u of studentUsers.slice(0, 6)) await db.contestParticipant.create({ data: { contestId: contest.id, userId: u.id } });
      continue;
    }
    const ranked = [...studentUsers].map((u, i) => ({ u, score: Math.floor(rand() * 4) * 100 + (i === 0 ? 400 : 0) + Math.floor(rand() * 200), pen: Math.floor(rand() * 90) }));
    ranked.sort((a, b) => b.score - a.score || a.pen - b.pen);
    for (const [rank, r] of ranked.entries()) {
      const before = 1500 + Math.floor(rand() * 300);
      await db.contestParticipant.create({
        data: {
          contestId: contest.id,
          userId: r.u.id,
          score: r.score,
          penaltyMins: r.pen,
          solved: Math.min(c.problems.length, Math.round(r.score / 200)),
          rank: c.ended ? rank + 1 : null,
          ratingBefore: c.ended ? before : null,
          ratingAfter: c.ended ? before + Math.round((ranked.length / 2 - rank) * 12) : null,
        },
      });
      if (c.ended && rank < 3) await db.userBadge.create({ data: { userId: r.u.id, badgeId: badgeIds.get("podium") as string } }).catch(() => undefined);
    }
  }

  // ── Platform config ────────────────────────────────────
  await db.featureFlag.createMany({
    data: [
      { key: "ai_tutor", enabled: true, description: "Show the AI Tutor side panel on learning pages." },
      { key: "contests", enabled: true, description: "Enable contests and live leaderboards." },
      { key: "maintenance_mode", enabled: false, description: "Show a maintenance page to non-admin visitors." },
      { key: "new_signups", enabled: true, description: "Allow new users to register." },
      { key: "branding", enabled: true, description: "Site branding settings.", value: { siteName: "CodeVerse", tagline: "Learn. Practice. Compete. Get hired.", supportEmail: "support@codeverse.dev" } },
    ],
  });
  await db.announcement.create({
    data: { title: "CodeVerse Weekly #42 is live!", body: "4 problems, 2 hours, rated. Jump in now.", link: "/contests/codeverse-weekly-42", variant: "info", isBanner: true, authorId: admin.id },
  });

  // ── Notifications ──────────────────────────────────────
  await db.notification.createMany({
    data: [
      { userId: demo.id, type: "CONTEST", title: "Weekly #42 has started", body: "The contest is live — good luck!", link: "/contests/codeverse-weekly-42" },
      { userId: demo.id, type: "ACHIEVEMENT", title: "Badge unlocked: Polyglot", body: "You got Accepted in 3 languages.", link: "/dashboard/achievements", read: true },
      { userId: demo.id, type: "COMMENT", title: "Rahul replied to your comment", body: "on Dijkstra's Shortest Path Algorithm", link: "/tutorials/dijkstra-shortest-path" },
      { userId: demo.id, type: "FOLLOW", title: "Ishita Rao followed you", body: "Check out their profile.", link: "/u/ishitarao" },
      { userId: contributor.id, type: "REVIEW", title: "Your article is in review", body: "Union-Find (Disjoint Set Union) was submitted for review.", link: "/dashboard/articles" },
    ],
  });

  // ── Reports / moderation ───────────────────────────────
  await db.report.create({ data: { reporterId: studentUsers[2].id, targetType: "COMMENT", targetId: comment.id, reason: "Off-topic", details: "Seems like a duplicate question." } });

  // ── Analytics sample data ──────────────────────────────
  const paths = ["/", "/courses", "/problems", ...allArticles.slice(0, 12).map((a) => `/tutorials/${a.slug}`), "/contests", "/pricing"];
  const pv = [];
  for (let i = 0; i < 1500; i++) {
    pv.push({ path: pick(paths), device: pick(["mobile", "mobile", "mobile", "desktop", "desktop", "tablet"]), country: pick(["IN", "IN", "IN", "IN", "US", "BD", "NP", "LK", "AE", "GB"]), createdAt: daysAgo(Math.floor(rand() * 30)) });
  }
  await db.pageView.createMany({ data: pv });

  await db.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "contest.create", entity: "Contest", entityId: "codeverse-monthly-sept", createdAt: daysAgo(2) },
      { actorId: admin.id, action: "announcement.create", entity: "Announcement", createdAt: daysAgo(1) },
      { actorId: admin.id, action: "article.publish", entity: "Article", entityId: "dijkstra-shortest-path", createdAt: daysAgo(20) },
    ],
  });

  console.log("✅ Seed complete");
  console.log("   Admin:   admin@codeverse.dev / Admin@123");
  console.log("   Student: student@codeverse.dev / Student@123");
  console.log("   Contributor: contributor@codeverse.dev / Contributor@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
