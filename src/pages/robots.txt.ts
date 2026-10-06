import type { APIRoute } from 'astro';
import { site } from '../data/site';

// The GitHub Pages copy (served under a sub-path) is a preview; only the live domain should be crawled.
const isPreviewCopy = import.meta.env.BASE_URL !== '/';

export const GET: APIRoute = () => {
  const body = isPreviewCopy
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
