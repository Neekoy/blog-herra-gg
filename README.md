# blog.herra.gg

Astro static site for the null//byte cybersecurity blog. Builds to `dist/`, deploy straight to Cloudflare Pages
(build command `npm run build`, output directory `dist`).

## Writing an article

Drop a Markdown file in `src/pages/articles/`. The filename is the URL: `my-post.md` → `/articles/my-post`.

```markdown
---
layout: ../../layouts/ArticleLayout.astro
title: "Unauthenticated RCE in an edge ingress controller"
description: "One line for the card and the meta description."
pubDate: 2026-09-07
category: "Exploits"        # Exploits | Crypto | Defensive Ops
heroImage: "/images/rce.jpg" # optional, full-bleed under the header
cve: "CVE-2026-41880"        # optional
cvss: 9.8                    # optional, renders the red badge
tags: ["http", "kubernetes"] # optional
draft: false                 # optional, true hides it everywhere
---
```

Reading time is computed from the body (~200 wpm) — never set it by hand. Adding the file is all that's needed: the
home page, the archive filter tabs, prev/next nav and the 404 suggestions all read from the same glob.

## Structure

| File | Role |
| --- | --- |
| `src/layouts/BaseLayout.astro` | Document shell: fonts, Tailwind CDN, global keyframes/grid |
| `src/layouts/ArticleLayout.astro` | The reusable article page (header, prose, sticky TOC, prev/next) |
| `src/components/*.astro` | Navbar, Hero, Terminal, ArticleCard, RecentArticles, PostFeed, About, Newsletter, Footer |
| `src/lib/categories.js` | Category → neon class map, date/reading-time helpers, `allArticles()` |
| `src/pages/articles/*.md` | The posts |

## Notes

- **Categories:** add one in `src/lib/categories.js` and every badge, card border and article header follows.
- **Code blocks:** highlighted by Shiki at build time (`github-dark-default`), zero client JS.
- **Client JS:** three small inline scripts only — mobile nav, archive filter tabs, terminal typewriter + TOC scrollspy.
- **Tailwind:** currently the CDN script in `BaseLayout.astro`. For production, install `tailwindcss` +
  `@tailwindcss/vite` and `@tailwindcss/typography`, then delete the two CDN `<script>` tags.
- **Portrait:** `About.astro` expects `public/images/neekoy.jpg` (override with `<About portrait="..." />`).
