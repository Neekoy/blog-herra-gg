import { defineConfig } from 'astro/config';

// Static output — drop `dist/` straight into Cloudflare Pages.
export default defineConfig({
  site: 'https://blog.herra.gg',
  output: 'static',
  markdown: {
    // Shiki highlights fenced code blocks at build time: zero client JS.
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
