---
inclusion: always
---

# Kodshala: Product

## 1. Product
"Kodshala" is a premium, production-ready learning platform (GeeksforGeeks + LeetCode + Coursera combined) where students LEARN from tutorials, PRACTICE by writing and running code in the browser, COMPETE in contests and TRACK their progress. It must feel like a top-tier 2026 product: immersive 3D, cinematic scroll animations, smooth micro-interactions and a clean, professional UI.
Roles: STUDENT, CONTRIBUTOR (writes articles), ADMIN.

## 5. Public Pages
- Landing: 3D hero, features, popular courses, learning paths, testimonials, stats, "everything is free" section, FAQ, newsletter footer
- Course catalog: filters (topic, level, language), sorting, search
- Course detail: syllabus accordion, free preview lessons, ratings & reviews, enroll button
- Tutorial / Article page (GeeksforGeeks style):
  - 3 columns: collapsible topic tree | MDX article | table of contents with scroll-spy
  - Code blocks with language tabs (C++ / Java / Python / JS), copy button and a "Try it Yourself" button that opens a lazy-loaded live editor with that code
  - Reading progress bar, reading time, difficulty tag, author, last updated date
  - Highlight text to save it as a note; bookmark, like, share, "Improve this article"
  - Inline quiz at the end, related articles, previous/next navigation, comments with replies and upvotes
- Problems list (LeetCode style): difficulty, topic & company tags, acceptance %, solved/attempted status, filters, "Pick Random"
- Problem workspace (resizable split panes):
  - Left tabs: Description | Hints (unlock one by one) | Editorial (unlocked after solving) | Submissions | Discussion
  - Right: Monaco editor (language switch, theme, font size, reset, auto-save) + console with custom input
  - Run (sample tests) and Submit (hidden tests) → verdict (Accepted / Wrong Answer / TLE / Runtime Error / Compilation Error), per-test results, runtime and memory
- Playground: multi-language online compiler with stdin; save and share snippets via link
- Visualizers: sorting, binary search, linked list, stack/queue, BST, BFS/DFS, Dijkstra, play / pause / step / speed controls with pseudocode line highlighting
- DSA Sheets: curated topic-wise and company-wise problem sheets with progress tracking
- Roadmaps: interactive node-graph roadmaps (DSA, Web Dev, AI/ML); every node links to content
- Quizzes & mock tests: timer, optional negative marking, detailed result analysis
- Contests: upcoming / live / past, registration, realtime leaderboard, rating changes
- Doubts forum: questions with tags, upvotes and accepted answers
- Write for Us (apply as contributor), Blog, About, Contact, Privacy, Terms, custom 404 and 500 pages
- Auth: animated split-screen login/signup, forgot password, email verification

## 6. Student Panel (/dashboard)
- Overview: greeting with avatar, level + XP bar, daily streak flame (with streak freeze), Problem of the Day with countdown, Continue Learning card with progress ring, upcoming contests
- Stats: solved by difficulty (donut), topic strength (radar), languages used, weekly study time, GitHub-style activity heatmap
- My Courses, My Sheets, Bookmarks, Notes & Highlights (searchable, markdown, export to PDF)
- Submission history with code viewer and diff between attempts
- Smart Revision: flashcards generated from bookmarked topics, scheduled with spaced repetition
- Achievements & badges; leaderboards (global / college / friends)
- Certificates: auto-generated PDF on course completion with a public QR verification page
- AI Tutor (side panel on every learning page): explains concepts in English or Hindi, gives progressive hints (never the full solution unless asked), reviews code (complexity, edge cases, style), creates a quiz from any article
- Gamification: +5 XP per article read, +10 / +20 / +40 XP per Easy / Medium / Hard problem, streak bonuses, levels and badges
- Notifications center; settings (profile, avatar, password, theme, language, notification preferences)
- Public profile /u/[username]: stats, badges, heatmap, contest rating, follow button

## 7. Admin Panel (/admin)
- Protected by middleware AND server-side role checks on every action and API route
- Layout: collapsible sidebar; top bar with global search, notifications and profile menu
- Overview: KPI cards (total users, daily active users, new signups, submissions today, revenue), animated charts, recent activity feed
- Content CMS:
  - Courses → modules → lessons with drag-and-drop ordering
  - Articles: MDX editor with live preview; draft / in review / scheduled / published; version history with restore; SEO fields (title, description, slug, OG image); categories & tags
  - Problems: statement, constraints, difficulty, topic & company tags, starter code per language, sample + hidden test cases (bulk upload), time/memory limits, hints, editorial
  - Quizzes (question bank with explanations), DSA Sheets, Roadmaps
  - Contests: schedule, attach problems, live standings, freeze leaderboard
- Contributor review queue: approve / request changes with comments / reject
- Users: searchable, sortable, paginated table; profile & activity view; change role; ban/suspend; export CSV
- Moderation: reported content, comments and doubts queue
- Media library: upload, search, delete
- Analytics: most-read articles, hardest problems, course drop-off funnel, retention cohorts, device & country breakdown
- Announcements: site-wide banner, in-app and email notifications
- Settings: branding, feature flags, maintenance mode
- Audit log of every admin action

## Business model
- Kodshala is 100% free. Never add paid plans, "Pro" badges, paywalls, prices, checkout or "Upgrade" CTAs.
