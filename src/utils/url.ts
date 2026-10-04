/** Prefixes a site-root path with the deploy base (e.g. `/glossiva-lighting` on GitHub Pages, `/` on Vercel). */
export const withBase = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
