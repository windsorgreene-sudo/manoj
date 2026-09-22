# CodeVidya

**Learn. Practice. Understand.**

CodeVidya is an educational reference portal for computer science and programming
students, tutorials, notes, assignments, lab programs, MCQs and examination
material, organised into clear subject categories.

It is built as a modern, independent replacement for a Blogger-based content
collection: the information architecture is designed so the existing blog posts
can be migrated into a proper content model with clean, SEO-friendly URLs.

## Tech stack

- **Next.js 16** (App Router), statically generated pages for fast loads and SEO
- **React 19 + TypeScript**
- **Tailwind CSS v4** (CSS-based theme tokens)
- No heavy runtime dependencies; the syntax highlighter and search index are
  built in-house to keep the JavaScript payload small.

## Getting started

```bash
npm install
npm run dev     # development server on http://localhost:3000
npm run build   # production build (fully static)
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                     # App Router routes
    page.tsx               # Homepage
    [category]/            # Category landing page (/python, /java, ...)
      [slug]/              # Article page (/python/map-function)
    type/[type]/           # Content-type listings (/type/assignment, ...)
    tutorials/ programming/ web-development/   # Nav-group landing pages
    resources/             # Study Resources hub
    exam-preparation/      # Exam material
    about/ contact/ privacy/ terms/ disclaimer/
    bookmarks/ login/
    sitemap.ts robots.ts   # SEO infrastructure
  components/              # Header, Footer, SearchDialog, CodeBlock, TOC, etc.
  content/                 # The content layer (see below)
  lib/                     # site config, date formatting, syntax highlighter
```

## Content model

All content lives in `src/content/` and is fully typed (`types.ts`). This mirrors
a real CMS schema so the layer can later be swapped for a database or headless CMS
without touching the rendering components.

- `categories.ts`, categories, subcategories, nav groups, popular topics
- `authors.ts`, author records
- `articles.ts`, articles (each with title, slug, description, body, category,
  subcategory, tags, author, published/updated dates, difficulty, reading time,
  SEO fields, and an optional `legacyUrl`)
- `index.ts`, derived queries: latest, popular, recently updated, related,
  previous/next, and the client search index
- `redirects.ts`, builds 301 redirects from old Blogger permalinks

An article `body` is an array of typed `ContentNode`s (headings, paragraphs,
lists, code blocks, notes, tables). This keeps content structured and portable
rather than raw HTML.

## Blogger migration

The architecture is ready for the full import of the existing blogs:

1. Each article carries an optional `legacyUrl` (the original Blogger permalink).
2. `next.config.ts` reads these and emits **301 redirects** from the old
   `/YYYY/MM/slug.html` paths to the new clean URLs (e.g. `/python/map-function`),
   so existing inbound links and search rankings are preserved.
3. To migrate a post: map its Blogger fields onto the `Article` shape, convert
   the post body into `ContentNode`s, assign a category/subcategory, and add it
   to `articles.ts` (or the future data source). No rendering changes are needed.

## SEO

- Clean, semantic URLs and heading hierarchy (single H1 per page)
- Per-page meta titles/descriptions, Open Graph and Twitter tags, canonical URLs
- JSON-LD structured data: `TechArticle`, `BreadcrumbList`, `CollectionPage`
- `sitemap.xml` and `robots.txt` generated from the content
- Internal linking via related articles, previous/next and category sidebars

## Features

- Site-wide search with suggestions, recent searches, and category/type filters
  (`Ctrl/Cmd + K`)
- Dark mode with system-preference detection and persistence (no flash)
- Documentation-style article pages: table of contents with scroll-spy, code
  blocks with copy button / language label / line numbers, related content
- Bookmarks (stored locally in the browser)
- Fully responsive with a dedicated mobile navigation and search

## Notes

Sample content is representative and spans every subject and content type. It is
intended as a working structure to be replaced by the migrated blog articles.
