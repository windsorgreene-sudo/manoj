# Kodshala

**Learn · Practice · Compete · Get hired.** A premium coding-education platform that combines in-depth tutorials (GeeksforGeeks), a browser IDE with a judge (LeetCode) and structured courses (Coursera), with immersive 3D, cinematic scroll animations and a full student + admin panel.

**100% free, no plans, no paywalls.** **Features:** courses & lesson player · MDX tutorials with runnable code · 30 judged DSA problems in 6 languages · playground, visualizers & 3D DS lab · DSA sheets & roadmaps · rated contests (ICPC scoring, live/frozen leaderboard, Elo ratings, 3D podium) · timed quizzes & mock tests with negative marking · doubts forum · verifiable PDF certificates with QR · AI tutor · gamification (XP, levels, streaks, badges) · English + Hinglish content toggle · full admin panel (content CMS, users with XP/badge tools, doubts, certificates, contact inbox and newsletter subscribers, contests with recompute/finalize/disqualify, moderation, analytics, audit log).

Built with Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui · Prisma 7 + PostgreSQL · Better Auth · three.js / R3F · GSAP · Motion · Monaco · Judge0.

---

## Quick start

```bash
# 1. Install (Node 20.9+; also runs `prisma generate`)
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL (Neon) and BETTER_AUTH_SECRET (openssl rand -base64 32)

# 3. Create the schema and load demo content
npx prisma migrate deploy
npm run db:seed

# 4. Run
npm run dev          # http://localhost:3000
```

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@kodshala.com | Admin@123 |
| Student | student@kodshala.com | Student@123 |
| Contributor | contributor@kodshala.com | Contributor@123 |

---

## Getting a free Postgres database (Neon)

1. Sign up at **https://neon.tech** (free tier, no card).
2. **Create project** → pick a region close to you (e.g. *AWS Asia Pacific (Mumbai)*).
3. On the dashboard click **Connect** → choose **Pooled connection** → copy the string that looks like
   `postgresql://neondb_owner:••••@ep-xxx-pooler.ap-south-1.aws.neon.tech/neondb?sslmode=require`.
4. Paste it into `.env` as `DATABASE_URL`.

---

## Environment variables

Only `DATABASE_URL` and `BETTER_AUTH_SECRET` are required. Everything else is optional and has a fallback so the app always runs:

| Variable(s) | Purpose | Where to get it | Fallback when missing |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL | [neon.tech](https://neon.tech) | **required** |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | Auth + absolute URLs | `openssl rand -base64 32` | **required** (URLs default to localhost) |
| `GOOGLE_CLIENT_ID/SECRET` | Google login | Google Cloud Console → Credentials | Google button hidden |
| `GITHUB_CLIENT_ID/SECRET` | GitHub login | GitHub → Settings → Developer settings → OAuth Apps | GitHub button hidden |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email | [resend.com](https://resend.com) | Emails printed to the server console |
| `JUDGE0_RAPIDAPI_KEY` / `JUDGE0_URL` | Code execution | RapidAPI Judge0 CE / self-hosted | Console shows “add your Judge0 key” |
| `OPENAI_API_KEY`, `AI_MODEL` | AI tutor | [platform.openai.com](https://platform.openai.com/api-keys) | Mocked streaming tutor |
| `MEILISEARCH_HOST/API_KEY` | Search | Meilisearch Cloud / Docker | Postgres full-text search |
| `PUSHER_*`, `NEXT_PUBLIC_PUSHER_*` | Realtime leaderboard & notifications | [pusher.com](https://dashboard.pusher.com) | Polling every few seconds |
| `CLOUDINARY_URL` | Media uploads | [cloudinary.com](https://console.cloudinary.com) | Files saved to `public/uploads` |

OAuth callback URLs: `{APP_URL}/api/auth/callback/google` and `{APP_URL}/api/auth/callback/github`.

---

## Database & seeding

```bash
npm run db:migrate   # create a new migration after editing prisma/schema.prisma
npm run db:deploy    # apply migrations (CI / production)
npm run db:seed      # wipe + load demo content
npm run db:studio    # browse data
```

The seed loads **real content**: 1 admin, 1 contributor, 10 students, 6 courses (DSA, Python, JavaScript, Web Development, DBMS, Operating Systems), 40 articles (37 tutorials + 3 blog posts) with inline quizzes, 30 problems with 200+ test cases, 5 standalone quizzes/mock tests, 3 contests (past / live / upcoming), 15 badges, 3 DSA sheets, 3 roadmaps, plans, coupons, doubts, comments and months of activity for the demo student.

Problem test data is generated from Python reference solutions so every expected output is correct:

```bash
npm run problems:build   # regenerates prisma/seed/data/problems.json
```

---

## Judge0 setup

Kodshala runs code through [Judge0 CE](https://github.com/judge0/judge0) for **C, C++, Java, Python, JavaScript and Go**.

### Development: RapidAPI

1. Subscribe (free tier) to **Judge0 CE** on RapidAPI: https://rapidapi.com/judge0-official/api/judge0-ce
2. Copy your `X-RapidAPI-Key` into `JUDGE0_RAPIDAPI_KEY`.

### Production, self-hosted (Docker)

```bash
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip && cd judge0-v1.13.1
# edit judge0.conf: set REDIS_PASSWORD, POSTGRES_PASSWORD and AUTHN_TOKEN
docker compose up -d db redis && sleep 10 && docker compose up -d
```

Then set `JUDGE0_URL=https://judge0.your-domain.com` and `JUDGE0_AUTH_TOKEN=<AUTHN_TOKEN>`. Run it on a dedicated VM (it needs privileged containers for the `isolate` sandbox) behind HTTPS, and firewall it so only your app can reach it.

---

## Project structure

```
app/(marketing)   landing, catalog, about, contact, blog, legal
app/(learn)       courses, tutorials, problems, playground, visualizers, sheets, roadmaps, lab, quizzes, contests, doubts
app/(auth)        login, signup, forgot/reset password, verify email
app/dashboard     student panel (protected)
app/admin         admin panel (ADMIN only, proxy + server checks)
app/api           route handlers
components/       ui · three · motion · editor · dashboard · admin · layout
lib/              db, auth, session/rbac, judge0, search, email, rate-limit, validators
content/          static MDX content
prisma/           schema, migrations, seed + seed data
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | `tsc --noEmit` |

---

## Deploying to Vercel

1. **Database**, create a Neon project (see above) and copy the **pooled** connection string. Optionally create a Neon branch per Vercel preview.
2. **Import** the GitHub repo at https://vercel.com/new. Preset: **Next.js**; keep the default build command (`npm run build` runs `prisma generate`), install command `npm install`, Node 20+.
3. **Environment variables** (Project → Settings → Environment Variables, Production + Preview):
   - Required: `DATABASE_URL` and `BETTER_AUTH_SECRET`. `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` are optional on Vercel, when unset the app uses Vercel's production domain automatically, and preview deployments are trusted for login. Set them once you add a custom domain.
   - Functions are pinned to `iad1` in `vercel.json` (closest to a Neon `us-east` database). Change it if your database lives elsewhere, e.g. `bom1` for Neon Mumbai.
   - Strongly recommended on Vercel: `CLOUDINARY_URL` (the filesystem is read-only/ephemeral, so the `public/uploads` fallback won't persist) and `RESEND_API_KEY` (console-logged emails aren't visible to users).
   - Optional: Judge0, OpenAI, Pusher, Meilisearch, Google/GitHub OAuth, each feature falls back gracefully when its keys are missing.
4. **Migrate** the production database once (and after every schema change):
   ```bash
   DATABASE_URL="<neon-url>" npx prisma migrate deploy
   DATABASE_URL="<neon-url>" npm run db:seed   # optional demo content, it RESETS data
   ```
5. **Deploy**, then point integrations at the production domain:
   - OAuth callbacks: `{APP_URL}/api/auth/callback/google` and `/github`.
   - Judge0: use a self-hosted instance (`JUDGE0_URL` + `JUDGE0_AUTH_TOKEN`) for real traffic; RapidAPI's free tier is rate-limited.
6. **Custom domain**, add it under Project → Domains, then update `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` and redeploy (the sitemap, OG images and certificate QR codes use `NEXT_PUBLIC_APP_URL`).

Notes:
- Contest ratings are applied lazily the first time anyone opens a contest after it ends; scheduled articles are published when listing pages are visited, no cron required.
- The rate limiter is in-memory per instance; for multi-region traffic swap `lib/rate-limit.ts` for Upstash Redis (same signature).
- Without Pusher, leaderboards poll every 15 s and notifications every 30 s.
