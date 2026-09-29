---
inclusion: always
---

# CodeVerse — Structure & Naming

## Folder structure (from section 9)
```
app/
  (marketing)/   landing, catalog, about, contact, blog, legal, write-for-us
  (learn)/       courses/[slug], tutorials/[...slug], problems, playground, visualizers, sheets, roadmaps, lab, quizzes, contests, doubts
  (auth)/        login, signup, forgot-password, reset-password, verify-email
  dashboard/     student panel (protected)
  admin/         admin panel (protected, ADMIN role)
  api/           route handlers (auth, run, submit, ai, search, uploads, webhooks…)
components/
  ui/            shadcn/ui primitives + design-system components
  three/         every react-three-fiber scene (lazy-loaded only)
  motion/        Motion / GSAP / Lenis helpers, page transitions, micro-interactions
  editor/        Monaco wrappers, code console, "Try it Yourself"
  dashboard/     student panel widgets
  admin/         admin panel widgets
lib/             db, auth, judge0, search, rbac, rate-limit, validators (zod), utils, xp
content/         MDX articles & course content
prisma/          schema.prisma, seed.ts, seed data
docs/            progress.md
```

## Naming conventions
- Files & folders: kebab-case (`problem-workspace.tsx`, `rate-limit.ts`); Next.js special files keep their names (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`).
- React components: PascalCase exports; one primary component per file.
- Hooks: `use-*.ts` files exporting `useSomething`.
- Zustand stores: `lib/stores/*-store.ts` exporting `useXStore`.
- Zod schemas: `lib/validators/*.ts`, named `xSchema`, types via `z.infer` named `XInput`.
- Server actions: `actions.ts` next to the route or `lib/actions/*.ts`, every action starts with an auth/role check + Zod parse.
- Prisma models PascalCase singular; fields camelCase; enums UPPER_SNAKE values.
- CSS variables: `--cv-*` design tokens mapped to Tailwind theme.
- 3D components live only in `components/three/` and are imported via `next/dynamic` with `ssr: false`.
- No `any`; prefer `unknown` + narrowing.
