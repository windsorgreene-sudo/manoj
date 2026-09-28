---
inclusion: always
---

# CodeVerse — Quality Bar

## 9. Quality Bar (non-negotiable)
- Performance: Lighthouse 90+ on mobile for article and problem pages — SSG/ISR for articles, dynamic imports, next/image, route-level code splitting
- SEO: metadata API, dynamic OG images, sitemap.xml, robots.txt, JSON-LD (Article, Course, BreadcrumbList)
- Accessibility: WCAG AA, full keyboard navigation, visible focus rings, aria labels
- Security: Zod validation on every input, rate limiting (code runs, auth, AI), sandboxed code execution, sanitized user content, secure cookies, CSRF protection
- Every data view has loading (skeleton), empty (illustration) and error states
- No dead buttons or links, no console errors, no `any`, ESLint clean
- Folder structure: app/(marketing), app/(learn), app/(auth), app/dashboard, app/admin, app/api, components/{ui,three,motion,editor,dashboard,admin}, lib/, content/, prisma/
- .env.example + README (setup, env vars, seeding, Judge0 setup, deploy to Vercel)

## Per-phase gate
After each phase: run lint, type-check and a production build, fix every error, tick the finished items in docs/progress.md, and git commit "Phase N: <name>".
