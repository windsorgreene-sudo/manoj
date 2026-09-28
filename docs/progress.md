# CodeVerse — Build Progress

> Resume rule: "Continue from docs/progress.md" → start at the first unchecked item.

## Setup
- [x] Steering files (.kiro/steering: product, tech, design-system, quality-bar, structure)
- [x] docs/progress.md

## Phase 1 — Foundation
- [x] git init / branch
- [x] Next.js + TypeScript (strict) + Tailwind + shadcn/ui
- [x] Design tokens (CSS variables), fonts (Space Grotesk / Inter / JetBrains Mono), dark/light theme
- [x] Global layout: navbar, footer, theme toggle, Lenis smooth scroll, page transitions
- [x] Full Prisma schema for ALL models (+ Better Auth tables)
- [x] Seed script (admin, contributor, 10 students, 6 courses, 30+ articles, 30 problems, 5 quizzes, 3 contests, 15 badges)
- [x] Better Auth with STUDENT / CONTRIBUTOR / ADMIN roles
- [x] Protected /dashboard and /admin routes (middleware + server checks)
- [x] .env.example and README
- [x] Lint + type-check + build green; commit "Phase 1: Foundation"

## Phase 2 — 3D Landing & Marketing
- [x] 3D "Knowledge Core" hero (crystal planet, orbiting tech logos, particle field, bloom, chromatic aberration)
- [x] SplitText headline + typewriter code snippet
- [x] Scroll storytelling: pinned 4 chapters (Learn → Practice → Compete → Get Hired)
- [x] Count-up stats, 3D tilt course cards, horizontal carousel, logo marquee
- [x] Features, popular courses, learning paths, testimonials, pricing, FAQ, newsletter footer
- [x] Course catalog (filters, sorting, search)
- [x] Pricing, About, Contact, Blog, Privacy, Terms, Write for Us
- [x] 3D 404 (astronaut) and 500 pages
- [x] Lint + type-check + build green; commit "Phase 2: 3D Landing & Marketing"

## Phase 3 — Learn
- [x] Course detail (syllabus accordion, preview lessons, reviews, enroll, progress)
- [x] Tutorial reader: 3 columns, topic tree, MDX + Shiki, TOC scroll-spy
- [x] Code tabs, copy, "Try it Yourself" lazy editor
- [x] Reading progress, time, difficulty, author, updated date
- [x] Highlight → note, bookmark, like, share, improve
- [x] Inline quiz, related, prev/next, comments with replies + upvotes
- [x] Reusable Judge0 service (with no-key message)
- [x] Ctrl+K command palette search (Postgres full-text fallback)
- [x] Lint + type-check + build green; commit "Phase 3: Learn"

## Phase 4 — Practice
- [ ] Problems list (filters, tags, acceptance, status, Pick Random)
- [ ] Problem workspace (split panes, tabs, Monaco, console, Run/Submit, verdicts)
- [ ] Playground (stdin, save & share)
- [ ] DSA sheets with progress
- [ ] Roadmaps (node graphs)
- [ ] Visualizers (sorting, binary search, linked list, stack/queue, BST, BFS/DFS, Dijkstra)
- [ ] 3D Data Structure Lab
- [ ] Lint + type-check + build green; commit "Phase 4: Practice"

## Phase 5 — Student Panel
> Note: AI Tutor side panel + gamification engine (`lib/gamification.ts`) were built early in Phase 3.
- [ ] Overview (greeting, XP/level, streak + freeze, POTD countdown, continue learning, contests)
- [ ] Stats (donut, radar, languages, weekly time, heatmap)
- [ ] My Courses, My Sheets, Bookmarks, Notes & Highlights (search, markdown, PDF export)
- [ ] Submission history with code viewer + diff
- [ ] Smart Revision flashcards (spaced repetition)
- [ ] Achievements (3D badges) + leaderboards (global / college / friends)
- [ ] AI Tutor side panel (streaming; mocked fallback)
- [ ] Gamification (XP rules, streak bonus, levels, badges, confetti, level-up modal)
- [ ] Notifications center + settings
- [ ] Public profile /u/[username] with follow
- [ ] Lint + type-check + build green; commit "Phase 5: Student Panel"

## Phase 6 — Admin Panel
- [ ] Layout (collapsible sidebar, top bar) + server-side role checks everywhere
- [ ] Overview KPIs, charts, activity feed
- [ ] CMS: courses/modules/lessons (DnD), articles (MDX editor, workflow, revisions, SEO), problems, quizzes, sheets, roadmaps
- [ ] Contests admin (schedule, attach problems, standings, freeze)
- [ ] Contributor review queue
- [ ] Users table (search, sort, paginate, role, ban, CSV)
- [ ] Moderation queue
- [ ] Media library
- [ ] Analytics
- [ ] Announcements
- [ ] Settings (branding, feature flags, maintenance)
- [ ] Audit log
- [ ] Lint + type-check + build green; commit "Phase 6: Admin Panel"

## Phase 7 — Contests, Payments & Launch
- [ ] Contests (list, registration, realtime/polling leaderboard, 3D podium, ratings)
- [ ] Quizzes & mock tests (timer, negative marking, analysis)
- [ ] Certificates (PDF + QR verification page)
- [ ] Doubts forum
- [ ] Pro subscriptions (Razorpay / mock checkout) + admin monetization
- [ ] Hindi translation (next-intl)
- [ ] SEO: sitemap, robots, OG images, JSON-LD
- [ ] Final performance + accessibility pass
- [ ] Vercel deployment guide in README
- [ ] Lint + type-check + build green; commit "Phase 7: Contests, Payments & Launch"

## Fallbacks in use (missing keys)
| Missing key | Fallback in use | Where |
|---|---|---|
| `RESEND_API_KEY` | Emails (verification, reset, newsletter) printed to the server console | `lib/email.ts` |
| `GOOGLE_*` / `GITHUB_*` | Social login buttons hidden | `components/auth/social-buttons.tsx` |
| `JUDGE0_*` | `/api/run` returns 503 + the console shows an "Add your Judge0 key" panel | `lib/judge0.ts`, `components/editor/run-output.tsx` |
| `OPENAI_API_KEY` | Mocked streaming AI tutor (explain / 4-level hints / code review / quiz, EN + HI) | `lib/ai-tutor.ts`, `app/api/ai/tutor` |
| `MEILISEARCH_HOST` | Postgres full-text search (`websearch_to_tsquery` + ILIKE boost) | `lib/search.ts` |

Notes:
- Next.js 16 renamed `middleware.ts` → `proxy.ts`; route protection lives in `proxy.ts` + `lib/session.ts` server guards.
- Prisma 7 uses `prisma.config.ts` + `@prisma/adapter-pg`; client generated to `lib/generated/prisma` (git-ignored, `postinstall` regenerates).
- lucide-react v1 dropped brand icons → `components/ui/brand-icons.tsx`.
