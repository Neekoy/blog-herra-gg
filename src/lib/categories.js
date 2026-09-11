/**
 * Semantic neon colour scheme, one entry per category.
 * Add a category here and every card / badge / article header picks it up.
 */
export const CATEGORIES = {
  Exploits: {
    badge: 'border-red-500/30 bg-red-500/10 text-red-400',
    border: 'hover:border-red-500/40',
    title: 'hover:text-red-300',
    accent: 'text-red-400',
    rule: 'text-red-400',
  },
  Crypto: {
    badge: 'border-purple-500/40 bg-purple-600/15 text-purple-300',
    border: 'hover:border-purple-500/40',
    title: 'hover:text-purple-300',
    accent: 'text-purple-300',
    rule: 'text-purple-400',
  },
  'Defensive Ops': {
    badge: 'border-green-500/30 bg-green-500/10 text-green-400',
    border: 'hover:border-green-500/40',
    title: 'hover:text-green-300',
    accent: 'text-green-400',
    rule: 'text-green-400',
  },
};

const FALLBACK = {
  badge: 'border-slate-700 bg-slate-900 text-slate-300',
  border: 'hover:border-slate-700',
  title: 'hover:text-slate-100',
  accent: 'text-slate-400',
  rule: 'text-slate-400',
};

export const categoryStyle = (name) => CATEGORIES[name] ?? FALLBACK;

/** ISO date -> "Sep 7, 2026" */
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/** ISO date -> "2026-09-07" (mono metadata rows) */
export const stampDate = (d) => new Date(d).toISOString().slice(0, 10);

/** ~200 wpm, floored at 1 minute. */
export const readingTime = (raw = '') =>
  Math.max(1, Math.round(raw.trim().split(/\s+/).filter(Boolean).length / 200));

/** Every article, newest first. Used by the feed, the layout nav and 404. */
export function allArticles() {
  const mods = import.meta.glob('/src/pages/articles/*.md', { eager: true });
  return Object.values(mods)
    .filter((m) => !m.frontmatter.draft)
    .sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate));
}
