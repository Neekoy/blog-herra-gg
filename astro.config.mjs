import { defineConfig } from 'astro/config';

/**
 * Left alone, Astro derives a Markdown image's `sizes` from the file's intrinsic width,
 * which over-declares the slot: article body images render inside the max-w-3xl (768px)
 * prose column, so a 2560px-wide source advertises itself as needing 2560px and the
 * browser pulls a far larger variant than it can ever display.
 *
 * This runs before Astro's own image pass — the nodes here still hold the raw relative
 * `src` — and pre-seeds `sizes`, which Astro then forwards instead of computing its own.
 * Only local relative sources are touched; remote and public/ images are left as-is.
 * Hand-rolled tree walk, so no unist-util-visit dependency.
 */
function rehypeProseImageSizes() {
  const PROSE_SIZES = '(min-width: 768px) 768px, 100vw';
  const walk = (node) => {
    const src = node.properties?.src;
    if (node.tagName === 'img' && typeof src === 'string' && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      node.properties.sizes ??= PROSE_SIZES;
    }
    node.children?.forEach(walk);
  };
  return (tree) => walk(tree);
}

// Static output — drop `dist/` straight into Cloudflare Pages.
export default defineConfig({
  site: 'https://blog.herra.gg',
  output: 'static',
  image: {
    // Build-time optimization via sharp (ships as an optional dep of astro — not a new package).
    // Applies to any image under src/ reached by an import or a *relative* path in Markdown.
    // Files in public/ are passthrough and never touched, which is why images live in src/assets/.
    layout: 'constrained',    // Markdown images get a width srcset + sizes for free
    responsiveStyles: true,   // and the accompanying object-fit / max-width styles
    // The prose column is max-w-3xl (768px), so a body image is never displayed wider
    // than that. Capping the ladder at 1536 covers 2x displays and stops the browser
    // from ever pulling a 2560px variant into a 768px slot.
    breakpoints: [320, 480, 640, 768, 1024, 1280, 1536],
  },
  markdown: {
    // Shiki highlights fenced code blocks at build time: zero client JS.
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
    rehypePlugins: [rehypeProseImageSizes],
  },
});
