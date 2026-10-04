# Glossiva Holiday Lighting & Decor — website

One-page site for Christmas light rental and installation in Kamloops, BC. Built with
[Astro](https://astro.build) and Tailwind CSS, deployed on Vercel. The page is static HTML; only the quote
form endpoint (`/api/quote`) runs as a serverless function.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Vercel build (output in .vercel/output)
DEPLOY_TARGET=github npm run build   # GitHub Pages build (output in dist/)
npm run check      # type-check
```

Without a Resend key, quote requests are printed in the terminal instead of emailed.

## Editing content

Almost everything you'd change lives in `src/data/`:

| File | What's in it |
|---|---|
| `src/data/site.ts` | Price ($7/bulb/ft), insurance ($3M), phone, email, service area, social links, response-time promise |
| `src/data/packages.ts` | The four packages and the pricing footnote |
| `src/data/faq.ts` | FAQ questions and answers |
| `src/data/gallery.ts` | Gallery photos (currently placeholders) |

Empty `phone`, `email` and social values are hidden automatically. Fill them in and they appear in the footer,
FAQ and thank-you message.

**Replacing the placeholder photos:** put your photos in `src/assets/gallery/` (and `src/assets/hero/` for the
hero), update the imports in `src/data/gallery.ts`, and delete each photo's `credit`. The "Placeholder photo
credits" in the footer disappear once no credits are left; for the hero photo, set `heroCredit` to `null` in
`src/data/gallery.ts`. The gallery heading switches from "Looks we love" to
"Homes we've lit up" automatically.

**Logo:** the original is `src/assets/brand/logo.png`. The header uses `logo-mark.png` + `logo-wordmark.png`,
cropped from it; the footer uses `logo-full.png`.

## Quote form → email (Resend)

Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY` from resend.com
- `NOTIFICATION_EMAIL`, where leads should arrive
- `RESEND_FROM` (optional). `onboarding@resend.dev` only delivers to your own Resend account email; verify your
  domain in Resend to send from e.g. `quotes@yourdomain.ca`.

Each lead email includes the ad it came from (UTM tags and Facebook `fbclid`). In production the form shows an
error if the keys are missing, so leads are never silently lost.

## Deploy

There are two builds, picked with the `DEPLOY_TARGET` environment variable.

### GitHub Pages (preview): https://tanjim604.github.io/glossiva-lighting/

Every push to `main` rebuilds and publishes the site through `.github/workflows/deploy-pages.yml`
(`DEPLOY_TARGET=github npm run build`, served under `/glossiva-lighting/`).

GitHub Pages only hosts static files, so **the quote form can't send email there**. Submitting shows a
"not switched on yet" message instead of losing the request silently. Use Vercel (below) before pointing ads
at the site.

### Vercel (live site with working quote form)

1. In Vercel, "Add New Project" and import this GitHub repo (the framework is detected as Astro).
2. Add the environment variables above, then deploy. Vercel builds the default target, which includes the
   `/api/quote` email function.
3. Set the real domain in `astro.config.mjs` (`site`) so share previews and search use the right URL.
