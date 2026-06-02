# Karan Gandhi — Portfolio Website

Single-page, terminal-themed portfolio for an embedded firmware engineer.
Built with Astro + Tailwind CSS + TypeScript. Static output.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Verify

```bash
npm test         # data + command-resolver unit tests (Vitest)
npm run check    # astro type/diagnostics check
npm run build    # production build to dist/
npm run preview  # serve the built site
```

## Edit content

All content is data-driven — no need to touch components:

- `src/data/projects.ts` — featured projects (name, summary, focus, tags, icon, GitHub url)
- `src/data/skills.ts` — grouped skill categories
- `src/data/experience.ts` — work experience
- `src/data/now.ts` — "Now / Currently exploring" threads + status
- `src/data/links.ts` — GitHub / LinkedIn / email / résumé
- `src/data/nav.ts` — terminal command chips + their targets

Logos are monochrome SVGs from `simple-icons`, mapped in `src/lib/icons.ts`.

## Résumé

Replace `public/resume.pdf` with the real résumé before launch (same filename — no code change).

## Deploy (free)

Static site — deploy to **Vercel** or **Netlify**:

1. Push this repo to GitHub.
2. Import it in Vercel/Netlify → framework auto-detected as Astro.
3. Every push auto-builds and deploys to a free URL (e.g. `karangandhi.vercel.app`) with automatic HTTPS.

### Optional custom domain (`karangandhi.dev`)

1. Buy `karangandhi.dev` (~$12–15/yr) from Cloudflare, Porkbun, or Namecheap.
2. In the host dashboard: "Add domain" → enter `karangandhi.dev`.
3. Add the DNS records the host provides at your registrar; SSL auto-provisions.

`.dev` is HTTPS-only by design — satisfied automatically by the host's free SSL.
