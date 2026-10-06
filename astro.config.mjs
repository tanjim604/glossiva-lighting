// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/**
 * Two deploy targets:
 * - Vercel (default): static page + the /api/quote serverless function that emails leads.
 * - GitHub Pages (DEPLOY_TARGET=github): static preview at tanjim604.github.io/glossiva-lighting.
 *   Pages can't run server code, so the quote form isn't connected there unless QUOTE_ENDPOINT is set.
 */
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';

/**
 * Adds the quote endpoint as /api/quote (only on hosts that can run it).
 * @type {import('astro').AstroIntegration}
 */
const quoteApi = {
  name: 'glossiva-quote-api',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/api/quote', entrypoint: './src/server/quote.ts', prerender: false });
    },
  },
};

// Public URL for share previews and canonical links. On Vercel this is the project's production
// domain (the .vercel.app address, or your own domain once one is added in Vercel).
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = isGitHubPages
  ? 'https://tanjim604.github.io'
  : vercelDomain
    ? `https://${vercelDomain}`
    : 'https://glossivalighting.com';

export default defineConfig({
  site: siteUrl,
  base: isGitHubPages ? '/glossiva-lighting' : '/',
  output: 'static',
  devToolbar: { enabled: false },
  // One small page: inlining the CSS saves a render-blocking round trip on mobile.
  build: { inlineStylesheets: 'always' },
  ...(isGitHubPages ? {} : { adapter: vercel(), integrations: [quoteApi] }),

  env: {
    schema: {
      // Where the quote form posts. Empty = not connected (the form says so instead of failing silently).
      QUOTE_ENDPOINT: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: isGitHubPages ? '' : '/api/quote',
      }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTIFICATION_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_FROM: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Glossiva Lighting <onboarding@resend.dev>',
      }),
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2'],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    // Lenis is imported dynamically (desktop only); pre-bundle it so the dev server never serves a stale copy.
    optimizeDeps: { include: ['lenis'] },
  },
});
