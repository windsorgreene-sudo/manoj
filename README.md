# CodeVerse

**Learn · Practice · Compete · Get hired.** A premium coding-education platform that combines in-depth tutorials (GeeksforGeeks), a browser IDE with a judge (LeetCode) and structured courses (Coursera) — with immersive 3D, cinematic scroll animations and a full student + admin panel.

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
| Admin | admin@codeverse.dev | Admin@123 |
| Student | student@codeverse.dev | Student@123 |
| Contributor | contributor@codeverse.dev | Contributor@123 |

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
| `RAZORPAY_*` | Pro subscriptions | [Razorpay dashboard](https://dashboard.razorpay.com/app/keys) (Test Mode) | Mock checkout |

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

CodeVerse runs code through [Judge0 CE](https://github.com/judge0/judge0) for **C, C++, Java, Python, JavaScript and Go**.

### Development — RapidAPI

1. Subscribe (free tier) to **Judge0 CE** on RapidAPI: https://rapidapi.com/judge0-official/api/judge0-ce
2. Copy your `X-RapidAPI-Key` into `JUDGE0_RAPIDAPI_KEY`.

### Production — self-hosted (Docker)

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
app/(marketing)   landing, catalog, pricing, about, contact, blog, legal
app/(learn)       courses, tutorials, problems, playground, visualizers, sheets, roadmaps, lab, quizzes, contests, doubts
app/(auth)        login, signup, forgot/reset password, verify email
app/dashboard     student panel (protected)
app/admin         admin panel (ADMIN only — proxy + server checks)
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

1. Push the repo to GitHub and **Import** it at https://vercel.com/new.
2. Framework preset: **Next.js** (build command `npm run build`, output auto-detected).
3. Add environment variables (Project → Settings → Environment Variables): at minimum `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` set to your production URL (e.g. `https://codeverse.vercel.app`), plus any optional integrations.
4. Apply migrations against the production database once (locally or in CI):
   ```bash
   DATABASE_URL="<neon-prod-url>" npx prisma migrate deploy
   DATABASE_URL="<neon-prod-url>" npm run db:seed   # optional demo content
   ```
5. Deploy. Update OAuth callback URLs and the Razorpay webhook (`{APP_URL}/api/payments/webhook`) to the production domain.
6. Tip: use Neon's **pooled** connection string on Vercel, and enable Neon branching for preview deployments.
