# OOJED — Marketing Site (Next.js + Tailwind + GSAP + Framer Motion)

A modern, responsive website built with Next.js (App Router), TailwindCSS, GSAP, and Framer Motion. Includes a small Web Component `<contact-badge>`.

## Getting started

```bash
npm i
npm run dev
# open http://localhost:3000
```

## Production

```bash
npm run build
npm start
```

## Deployment & PageSpeed checklist

Before deploying to production, follow these steps to aim for a high Google PageSpeed score (best-effort; 100 may require CDN and asset work):

1. Install dependencies and build locally

```powershell
npm install; npm run build
```

2. Provide environment variables (see `.env.local.example`) or set secrets in your hosting platform.

3. Serve statically behind a CDN (Vercel, Netlify, Cloudflare Pages, or a CDN in front of a server) — CDNs greatly improve Performance and LCP.

4. Images: ensure hero and product images are optimized (WebP/AVIF), use responsive `srcset` and `next/image` for automatic optimization.

5. Fonts: use preconnect (already added) and prefer `font-display: swap` (Google Fonts URL used in `globals.css`).

6. Audit with Lighthouse (in Chrome) and follow the suggestions — common remaining items:
	- Reduce unused JS/CSS (code-splitting, remove heavy libs, reduce GSAP usage on first paint)
	- Ensure images are optimized and served in next-gen formats
	- Minimize third-party scripts (WATI widget and analytics may affect score)

7. Monitoring: add Sentry (optional) and confirm server logs for `app/api/contact/route.ts`.

Notes:
- PageSpeed 100 requires controlling hosting, CDN, image formats, and third-party scripts. I can help implement these steps.

## Tech
- Next.js App Router
- TailwindCSS
- GSAP (hero + contact reveal)
- Framer Motion (cards on scroll)
- Custom Element (`/public/contact-badge.js`)

## Content
All company content (mission, products, specs, contacts) was populated from the provided company profile PDF.
