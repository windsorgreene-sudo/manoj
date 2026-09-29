---
inclusion: always
---

# CodeVerse — Tech

## 2. Tech Stack (latest stable versions)
- Next.js (App Router) + React + TypeScript (strict)
- Tailwind CSS + shadcn/ui + lucide-react icons
- 3D: three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- Animation: Motion (formerly Framer Motion), GSAP (ScrollTrigger, SplitText), Lenis smooth scroll, Lottie
- Code editor: Monaco (@monaco-editor/react)
- Code execution: Judge0 CE for C, C++, Java, Python, JavaScript, Go (RapidAPI in development, self-hosted Docker in production)
- Database: PostgreSQL + Prisma
- Auth: Better Auth — email/password, Google, GitHub, email verification, role-based access
- Content: MDX + Shiki syntax highlighting
- Search: Meilisearch (fallback: Postgres full-text) + Ctrl+K command palette (cmdk)
- State & forms: TanStack Query, Zustand, React Hook Form, Zod
- Realtime: Pusher or Ably (contest leaderboard, notifications)
- AI tutor: Vercel AI SDK with streaming responses
- Also: Recharts (charts), Resend (emails), Cloudinary (media), next-intl (English + Hindi)
- Deploy: Vercel + Neon Postgres

## Fallbacks when a key is missing (the app must still run)
- Emails → logged to the console (no RESEND_API_KEY)
- Social login buttons → hidden (no GOOGLE_/GITHUB_ credentials)
- Search → Postgres full-text instead of Meilisearch
- Realtime → polling instead of Pusher
- Uploads → local `public/uploads` instead of Cloudinary
- Code console → clear "add your Judge0 key" message (no JUDGE0 key)
- AI tutor → mocked streaming responses (no AI key)

## 8. Database (Prisma)
Models (plus the tables Better Auth needs): User (role), Profile, Follow, Course, Module, Lesson, Article, ArticleRevision, Category, Tag, Problem, TestCase, Submission, Sheet, SheetItem, Quiz, Question, QuizAttempt, Contest, ContestProblem, ContestParticipant, Enrollment, Progress, Bookmark, Note, Flashcard, Comment, Vote, Doubt, Answer, Badge, UserBadge, XpEvent, Streak, Certificate, Notification, Report, Announcement, FeatureFlag, AuditLog — with proper relations, indexes and cascade rules.

Seed with REAL content (no lorem ipsum): 1 admin, 1 contributor, 10 students, 6 courses (DSA, Python, JavaScript, Web Development, DBMS, Operating Systems), 30+ articles, 30 problems with test cases, 5 quizzes, 3 contests, 15 badges.
Demo logins: admin@codeverse.dev / Admin@123 and student@codeverse.dev / Student@123
