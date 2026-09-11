# CLAUDE.md — blog.herra.gg

Instructions for Claude Code working in this repository. Read this fully before making changes.

## What this is

A static cybersecurity/hacking blog for **blog.herra.gg**, authored by Neekoy (Lead DevOps Engineer, 15 years in IT).
Content is long-form technical write-ups: CVE reports, exploit chains, crypto post-mortems, defensive-ops playbooks.

- **Framework:** Astro 5, `output: 'static'`
- **Styling:** Tailwind CSS utilities only
- **Content:** Markdown files in `src/pages/articles/` (file-based routing — no content collections)
- **Highlighting:** Shiki at build time (`github-dark-default`)
- **Hosting:** Cloudflare Pages — build `npm run build`, output `dist/`
- **Client JS:** vanilla only, a few inline `<script>` blocks. No React, Vue, Svelte, or any UI framework.

## Repository layout

| Path | Role |
| --- | --- |
| `astro.config.mjs` | Site URL, static output, Shiki config |
| `src/layouts/BaseLayout.astro` | Document shell: fonts, Tailwind, global keyframes, `.nb-grid`, Shiki overrides |
| `src/layouts/ArticleLayout.astro` | **The reusable article page.** Header, prose, sticky TOC, prev/next |
| `src/components/Navbar.astro` | Sticky nav, System Status badge, mobile disclosure |
| `src/components/Hero.astro` | Home hero + `<Terminal />` |
| `src/components/Terminal.astro` | Typewriter terminal, driven by a `lines` prop |
| `src/components/ArticleCard.astro` | One card — the single source of truth for card markup |
| `src/components/RecentArticles.astro` | Home: newest 3 |
| `src/components/PostFeed.astro` | Home: full archive + category filter tabs |
| `src/components/About.astro` | About me + portrait |
| `src/components/Newsletter.astro` | Subscribe form |
| `src/components/Footer.astro` | Footer |
| `src/lib/categories.js` | Category → neon class map, date/reading-time helpers, `allArticles()` |
| `src/pages/index.astro` | Home page — composes the components above |
| `src/pages/404.astro` | 404 with terminal-styled error and recent posts |
| `src/pages/articles/*.md` | The articles. `sample.md` is the reference example |
| `Cyber Blog.dc.html` | **Design mock, not part of the build.** See "The design mock" below |

## Design system

There is no external design system package. **This file plus the existing components are the system of record.**
Match them exactly; do not introduce new colors, fonts, radii, or shadow treatments.

### Aesthetic: "Cyber-Grid Terminal"

Dark, technical, sharp. Monospace for metadata and system voice, sans for reading. Neon used semantically — never
decoratively. Restraint over spectacle: one glow per screen region, not on every element.

### Color — semantic, not decorative

| Role | Classes | Used for |
| --- | --- | --- |
| Canvas | `bg-slate-950` | Page background |
| Card / panel | `bg-slate-900/50` (`bg-slate-900` for solid chrome) | Cards, tiles, inputs, code blocks |
| Border | `border-slate-800` | Every divider and card edge. Sharp corners — **no `rounded-*`** |
| Body text | `text-slate-400` / `text-slate-300` | Prose and descriptions |
| Headings | `text-slate-50` / `text-slate-100` | Titles |
| Muted / mono meta | `text-slate-500` | Dates, labels, prompts |
| **Neon green** | `text-green-400`, `border-green-500/30`, `bg-green-500/10`, `shadow-green-500/20` | Terminal success output, System Status, "Defensive Ops", active nav, `<strong>` in prose |
| **Neon purple** | `text-purple-400`/`-300`, `bg-purple-600`, `border-purple-500/40`, `shadow-purple-500/30` | Brand, primary buttons, links, "Crypto", section eyebrows, TOC heading |
| **Neon red** | `text-red-400`/`-500`, `border-red-500/30`, `bg-red-500/10` | Alerts, CVSS badges, "Exploits", critical log lines, blockquote rule |

Rules:
- **Never write raw hex in components.** Tailwind utilities only. The only exceptions already in the tree are two
  glow shadows and the `.nb-grid` gradient in `BaseLayout.astro` — extend those rather than adding new ones.
- Never use a neon for something that isn't its semantic meaning. Green is not "a nice accent"; it means healthy,
  successful, or defensive.
- Category colors live in `src/lib/categories.js`. Adding a category there propagates to every badge, card hover
  border, title hover and article eyebrow. **Never hardcode a category color in a component.**

### Typography

- **Sans:** Space Grotesk — headings and prose. `font-sans` (configured in `BaseLayout.astro`)
- **Mono:** JetBrains Mono — `font-mono` for all metadata, labels, badges, nav links, buttons, terminal, dates, tags
- Mono labels are uppercase with wide tracking: `font-mono text-[11px] uppercase tracking-widest` (or
  `tracking-[0.25em]` for section eyebrows)
- Section eyebrows read as shell commands: `$ ls -la ./articles`, `$ whoami`, `$ cat ~/posts | head -3`
- Body copy never below `text-sm`; prose is `text-base`

### Layout & spacing

- Page container: `mx-auto max-w-7xl px-5 lg:px-8`; prose column `max-w-3xl`
- Section rhythm: `py-16 lg:py-20`, each section closed with `border-b border-slate-800`
- **Use flex/grid with `gap`** for any sibling group. Never space with margins on siblings or source whitespace.
- Cards: `border border-slate-800 bg-slate-900/50 p-5`, `flex flex-col`, `grow` on the description so footers align
- Grids: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`. Always `min-w-0` on grid/flex children holding text.
- Hover on cards changes the **border** to the category neon, and the **title** to the light neon. Nothing else moves.

### Voice

Terse, technical, first-person, no marketing. "Full chain, patch diff and IOCs." Lowercase for terminal and
system strings (`all systems clear`, `tty1`). No emoji. No exclamation marks.

## Writing and wiring articles

Articles are plain Markdown in `src/pages/articles/`. **The filename is the URL:** `my-post.md` → `/articles/my-post`.

Copy `src/pages/articles/sample.md` — it is the annotated reference and exercises every supported feature.

```markdown
---
layout: ../../layouts/ArticleLayout.astro   # required
title: "..."                                 # required
description: "..."                           # required — card text + meta description
pubDate: 2026-09-11                          # required — drives ordering and prev/next
category: "Exploits"                         # required — must exist in src/lib/categories.js
heroImage: "/images/x.jpg"                   # optional
heroImageAlt: "..."                          # optional
author: "Neekoy"                             # optional, defaults to Neekoy
cve: "CVE-2026-41880"                        # optional
cvss: 9.8                                    # optional — renders the red badge
tags: ["http", "kubernetes"]                 # optional
draft: false                                 # optional — true hides it everywhere
---
```

- **Reading time is computed** from the body at ~200 wpm. Never accept or add a `readingTime` frontmatter field.
- `##` and `###` headings build the sticky TOC (shown only when there are ≥2). Deeper levels render but stay out.
- Always tag the language on fenced code blocks — Shiki needs it.
- Adding a file is the whole job: home page, archive, filter tabs, prev/next and the 404 list all read the same
  glob via `allArticles()`.

## Rules for contributions

1. **No frameworks, no hydration.** No React/Vue/Svelte, no `client:*` directives, no state libraries. If something
   needs interactivity, write ~20 lines of vanilla JS in a component `<script>`. Current total: mobile nav, filter
   tabs, terminal typewriter, TOC scrollspy.
2. **No new dependencies** without asking. This ships as static HTML from the edge; every KB is a choice.
3. **Tailwind utilities only.** No CSS modules, no new stylesheets, no `@apply`. The only global CSS lives in
   `BaseLayout.astro` (keyframes, the grid background, Shiki overrides) — add there only when a utility can't do it.
4. **Semantic HTML5.** `<header> <nav> <main> <article> <section> <aside> <footer> <time datetime> <figure>`.
   One `<h1>` per page. Headings descend without skipping.
5. **Accessibility is not optional.** `aria-label` on every landmark that repeats, `aria-current="page"` on active
   nav, `aria-expanded` kept in sync on disclosures, `aria-selected` on tabs, `sr-only` labels on icon-only controls,
   visible `focus-visible:outline` rings. Body text must clear 4.5:1 on `bg-slate-950` — `text-slate-500` is for
   short mono metadata only, never paragraphs.
6. **Don't duplicate card markup.** All card rendering goes through `ArticleCard.astro`.
7. **Don't hardcode post data.** Anything listing posts reads `allArticles()`.
8. **Images:** always `width`, `height`, `alt`, and `loading="lazy"` below the fold. Put files in `public/images/`.
9. **Small, targeted diffs.** Change what was asked. Don't reformat, re-order, or "improve" untouched files.
10. **Verify with `npm run build`**, not just `npm run dev` — Shiki, glob imports and prev/next only fully resolve
    in a production build.

## The design mock

`Cyber Blog.dc.html` at the repo root is a **standalone visual reference** — the full page as one HTML file, used to
review styling. It is not imported, not built, and not deployed. Its cards are hardcoded placeholders.

If you change a visual convention in `src/`, the mock drifts. That's acceptable; treat `src/` as authoritative.
Never wire the mock into the build, and never copy its hardcoded article data into a component.

## Known follow-ups

- **Tailwind is still the CDN script** in `BaseLayout.astro`. For production, install `tailwindcss`,
  `@tailwindcss/vite` and `@tailwindcss/typography`, then delete both CDN `<script>` tags. Nothing else should change.
- `About.astro` expects `public/images/neekoy.jpg`.
- The newsletter form posts to `/api/subscribe`, which does not exist yet.
- No RSS feed, sitemap, or per-category pages yet — all were deferred deliberately.

