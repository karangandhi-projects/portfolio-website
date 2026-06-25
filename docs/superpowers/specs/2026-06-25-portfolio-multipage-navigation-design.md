# Portfolio Multi-Page Navigation Restructure — Design

**Date:** 2026-06-25
**Status:** Approved design, pending implementation plan
**Project:** `portfolio-website` (Astro static site)
**Branch:** `skim-restructure` (continues from the skim-layer work already committed there)

## Problem

A reviewer found the site hard to navigate. Two concrete pain points on the current
(skim-home + single deep `/about`) structure:

1. **No persistent, intuitive navigation.** Jumping to a section (e.g. "experience")
   scrolls you deep into a long page; getting back to home means hunting for the
   `karan@embedded` logo or the `cd ~/` link, neither of which reads as a "Home" button.
   On mobile the header section links disappear entirely.
2. **The BLE case study reads as one long, undifferentiated sheet.** The top `##` index is
   liked, but the headings ("At a glance", etc.) are plain bold text that doesn't match the
   terminal aesthetic, and there is no always-visible way to jump between sections.

**Goal:** Make the portfolio cleaner and sharper so a reader finds any piece of information
without much scrolling, with navigation that is always visible and obvious on both mobile
and desktop. Preserve the terminal aesthetic, colors, chrome, and cursor exactly.

## Chosen approach — Multi-page routing with a terminal-native persistent nav

Selected over (A) keeping the two-page structure with only an improved sticky nav, and
(B) tab/accordion toggling on one page. Multi-page most directly delivers "everything
findable in one click without scrolling," gives each section a shareable URL, and maps
naturally onto the terminal metaphor: each section is a directory you `cd` into, and a
persistent breadcrumb is both "you are here" and the way home.

**Tradeoff accepted by Karan:** this partly reverses the single `/about` deep page built
earlier the same day. The skim home and the components (ProofStrip, QualcommCard, proof
footers, reframed AI copy, BLE case-study summary box + narrative, typography) are all kept;
only the deep-page composition and intra-page anchor navigation change.

## Information architecture

### Routes

| Route | Content | Source components |
|-------|---------|-------------------|
| `/` | Skim home (unchanged in spirit) | Hero, ProofStrip, QualcommCard, 4 featured Projects, BLE case-study teaser, short contact block |
| `/experience` | Both `experiences[]` entries in full | Experience |
| `/projects` | All 8 projects | Projects (full list) |
| `/skills` | Skills + Engineering Style | Skills, EngineeringStyle |
| `/ai` | Engineering-first AI | AiEngineering |
| `/about` | Bio + Education + Now | About, Education, Now |
| `/projects/[slug]` | Case studies (existing) | CaseStudyLayout |

Home stays the pure skim layer. Case studies stay where they are.

### Persistent global navigation (every page, every viewport)

**Top bar (`SiteNav.astro`, sticky `top:0`):**
- **Left — breadcrumb**, terminal-styled, every segment clickable:
  - Home: `karan@embedded:~$`
  - Section: `karan@embedded:~/experience$` (`karan@embedded` → `/`, `~/experience` → current)
  - Case study: `karan@embedded:~/projects/ble-environmental-sensor-node$`
    (`~/projects` → `/projects`)
- **Right — section tabs**: `home · experience · projects · skills · ai · about`, the
  active one highlighted (accent color). Tabs are real `<a href>` links (work without JS).
- **Mobile (`max-width:640px`)**: the tabs become a single horizontally-scrollable strip
  (`overflow-x:auto`) instead of disappearing. No hamburger/JS menu — keeps it terminal-simple.
- `SiteNav` takes a `current` prop (one of `home|experience|projects|skills|ai|about`) to
  set the active tab, and a breadcrumb spec (segments) for the path.

**Footer (`Footer.astro`, every page):** extended to be the persistent contact surface:
```
$ contact --options
email · github · linkedin · résumé
Open to roles — based in Canada (Canadian PR) and India
karan@embedded:~$ echo "thanks for visiting"      © <year> Karan Gandhi
```
Contact links reuse `links.ts`. The existing footer line is kept. Home also keeps a short
contact block above the footer (the existing `Contact.astro` section) so the home CTA is not
lost.

### Shared page layout

Introduce `PageLayout.astro` wrapping `BaseLayout` (html/head) with `SiteNav` + `<slot/>` +
`Footer`. Props: `title`, `description`, `current` (active tab), `crumbs` (breadcrumb
segments). Every route page renders through `PageLayout` so nav + footer are identical
everywhere and defined once (DRY). `CaseStudyLayout` is updated to use the same `SiteNav` +
`Footer` (breadcrumb `~/projects/[slug]`, no active top tab or `projects` active).

### Terminal command input (the `$ type a command` box)

Stays on the home Hero. `nav.ts` targets re-point to routes; `resolveCommand` returns route
paths and `CommandNav` navigates to them:

| cmd | target |
|-----|--------|
| `about` | `/about` |
| `experience` | `/experience` |
| `projects` | `/projects` |
| `skills` | `/skills` |
| `ai` | `/ai` |
| `education` | `/about#education` |
| `now` | `/about#now` |
| `contact` | `/#contact` |
| `resume` | `/resume.pdf` |

`commands.test.ts` updates accordingly (e.g. `resolveCommand('experience') === '/experience'`).

### Home "see more" CTA

The home "See full work & background →" button is replaced by a small CTA row linking to the
two highest-value pages: `→ experience` (`/experience`) and `→ all projects` (`/projects`).
All other sections remain reachable via the persistent top nav.

## BLE case study polish (`/projects/[slug]`)

Three changes; the narrative stays a single readable page (a case study is a story —
pagination would break flow and "send someone the whole study"). "Cleaner/no scrolling to
find" is delivered by an always-visible TOC, not by splitting pages.

1. **Themed headings.** Restyle `.cs-body h2` / `.cs-body h3` to match the terminal
   section-header aesthetic instead of plain bold: a green mono prompt marker rendered via
   CSS `::before` (e.g. `.cs-body h2::before { content: "$ "; color: var(--accent);
   font-family: var(--font-mono); }`) plus existing sizing. h3 already uses accent/mono;
   align h2 to the same family. Pure CSS — applies to every heading automatically, no
   markdown edits.
2. **Sticky, always-visible TOC.**
   - **Desktop (`min-width:900px`)**: the existing terminal "contents" index becomes a
     left sticky sidebar (`position:sticky; top:<navheight+gap>`) next to the article in a
     two-column layout. Always on screen; click any entry to jump.
   - **Mobile**: keep the current collapsible "contents" terminal window at the top.
   - **Active-section highlight (scrollspy)**: a small client script using
     `IntersectionObserver` adds an `.active` class to the TOC entry for the section in view.
     Progressive enhancement — links work fully without JS; JS only adds the highlight.
     Respects the existing `prefers-reduced-motion` reset (no animation, just class toggling).
3. **Prev/next section links** at the bottom of the article: "← previous section" /
   "next section →" derived from the ordered `##` headings, so a reader can step through
   without returning to the TOC.

`scroll-padding-top` / `scroll-margin-top` are set so anchored headings clear the sticky
`SiteNav`.

## Components affected (existing-codebase notes)

**New:**
- `src/components/SiteNav.astro` — persistent breadcrumb + section tabs (replaces `Header.astro` usage).
- `src/layouts/PageLayout.astro` — `BaseLayout` + `SiteNav` + slot + `Footer`.
- `src/pages/experience.astro`, `src/pages/projects/index.astro`, `src/pages/skills.astro`,
  `src/pages/ai.astro`, `src/pages/about.astro` (re-scoped) — thin route pages composing
  existing section components through `PageLayout`.

**Modified:**
- `src/pages/index.astro` — use `PageLayout`; replace the single see-more button with the CTA row; drop the old deep imports.
- `src/pages/about.astro` — re-scoped to bio + education + now (was the full deep dump); drops the sticky sub-nav (now global) and the full project list.
- `src/components/Footer.astro` — add the persistent contact block (email/github/linkedin/résumé + open-to-roles line) using `links.ts`.
- `src/data/nav.ts` — re-point targets to routes.
- `src/lib/commands.test.ts` — update expected targets.
- `src/components/Header.astro` — removed/retired in favor of `SiteNav` (delete once unused).
- `src/layouts/CaseStudyLayout.astro` — use `SiteNav` + `Footer`; two-column sticky-TOC layout; prev/next; themed-heading classes.
- `src/styles/global.css` — `SiteNav` (breadcrumb, tabs, active state, mobile scroll strip), footer contact block, case-study two-column + sticky TOC + `.active`, themed `.cs-body h2`, prev/next. **Append new rules; only modify an existing rule when explicitly required (e.g. retiring `.site-header`/`.subnav` styles that are no longer used).**
- `src/components/CommandNav.astro` — no logic change; verify it navigates to the new route targets (it already does for non-`#` targets).

**Retired:** the `.subnav` sticky sub-nav added for the old single `/about` page (replaced by the global `SiteNav`).

## Crawlability / SEO

- Each route sets its own `<title>` and `description` via `PageLayout` props.
- `@astrojs/sitemap` (already integrated, pinned `3.2.1` for Astro 4) auto-includes the new
  routes — verify all appear in `dist/sitemap-0.xml`.
- Static HTML, no content gating; the scrollspy is enhancement-only.

## Resumability (work survives a session limit)

Because this spans many files, the work must be restartable from a cold session:

1. **Per-task commits on `skim-restructure`.** The implementation plan is a checklist of
   small tasks; each ends in a commit. Progress = git history.
2. **A "Resuming this work" header in the plan** documenting the exact restart procedure:
   - `git -C portfolio-website log --oneline` on `skim-restructure` shows completed tasks.
   - Open the plan; the first unchecked `- [ ]` task (cross-referenced to the last commit
     message) is where to continue.
   - Re-run `npm run test`, `npx astro check`, `npm run build` to confirm a clean baseline
     before continuing.
3. **A project memory** pointing to this spec, the plan path, and the branch, so a new
   session recalls where the work lives.

## Out of scope (YAGNI)

- No redesign of colors / terminal chrome / cursor / fonts (only the explicitly-listed
  heading/nav styling).
- No new content or fabricated metrics; copy is reused from existing components/data.
- No case-study pagination (narrative stays one page).
- No hamburger/drawer menu (mobile uses a scrollable command strip).
- No client-side router/SPA — plain Astro multi-page static output.

## Open items for Karan's review

- Confirm the route set and groupings above (Granular; Skills+EngineeringStyle on `/skills`;
  Education+Now on `/about`).
- Confirm the persistent-footer contact wording, including the Canadian-PR / relocation line.
- Confirm prev/next section links on the case study are wanted (vs. TOC-only).
