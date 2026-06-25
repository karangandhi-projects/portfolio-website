# Portfolio Multi-Page Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio from a skim-home + single deep `/about` page into a multi-page site (`/experience`, `/projects`, `/skills`, `/ai`, `/about`) with a persistent terminal-style breadcrumb + tab nav, a persistent contact footer, and a polished BLE case study (themed headings + sticky always-visible TOC).

**Architecture:** A shared `PageLayout` (BaseLayout + `SiteNav` + slot + `Footer`) wraps every route so navigation is defined once. Section components are unchanged and re-composed into thin route pages. The nav model (tab list + breadcrumb derivation) is a pure, unit-tested data module. The case study gets a two-column sticky-TOC layout with an IntersectionObserver scrollspy (progressive enhancement).

**Tech Stack:** Astro 4 (static), TypeScript, Vitest, plain CSS tokens in `global.css`, `@astrojs/sitemap@3.2.1`.

**Spec:** `docs/superpowers/specs/2026-06-25-portfolio-multipage-navigation-design.md`

---

## Resuming this work (read first if starting cold)

This plan spans many files; it is built to restart from any point.

1. **Branch:** `skim-restructure` (continues the earlier skim work — do NOT branch again). Confirm: `git -C portfolio-website branch --show-current`.
2. **Find where you are:** `git -C portfolio-website log --oneline -20`. Each task below ends in exactly one commit whose message matches the task; the last such commit tells you the last completed task. Continue at the first task whose commit is absent.
3. **Confirm a clean baseline before continuing:**
   ```bash
   cd portfolio-website
   npm run test        # expect all green
   npx astro check     # expect 0 errors
   npm run build        # expect success
   ```
   If any fail, fix the in-progress task before starting a new one.
4. **All commands run from** `/home/karan-gandhi/Downloads/karan_portfolio_website_sdd_package/portfolio-website`.
5. **Theme constraint (every task):** do not change colors, fonts, terminal chrome, or the cursor. Only the specific nav/footer/heading styles in this plan are new; CSS edits are append-only except the explicit removals in Task 8.

---

## File structure

**New files:**
- `src/data/sections.ts` — pure nav model: the 6 tab definitions + `crumbsFor(current)`.
- `src/data/sections.test.ts` — unit tests for the nav model.
- `src/components/SiteNav.astro` — persistent breadcrumb + section tabs.
- `src/layouts/PageLayout.astro` — BaseLayout + SiteNav + `<main><slot/></main>` + Footer.
- `src/pages/experience.astro`, `src/pages/skills.astro`, `src/pages/ai.astro`,
  `src/pages/projects/index.astro` — thin route pages.

**Modified files:**
- `src/data/nav.ts` — command targets → routes.
- `src/lib/commands.test.ts` — expected targets.
- `src/components/CommandNav.astro` — only open new tab for external (`http`) targets.
- `src/components/Footer.astro` — persistent contact block.
- `src/pages/index.astro` — use `PageLayout`; CTA row instead of single see-more button.
- `src/pages/about.astro` — re-scoped to bio + education + now.
- `src/layouts/CaseStudyLayout.astro` — SiteNav + Footer, two-column sticky TOC, scrollspy, themed-heading class, `/projects` back-links, `slug` prop.
- `src/pages/projects/[slug].astro` — pass `slug` to the layout.
- `src/styles/global.css` — SiteNav, footer contact, case-study grid/sticky TOC/active/themed headings, `see-more-row`; remove dead `.site-header`/`.nav-links`/`.subnav`/`.about-page`/`.header-icons` rules (Task 8).

**Deleted files:**
- `src/components/Header.astro` (replaced by `SiteNav`, Task 8).

---

## Task 1: Nav model + command targets (TDD)

**Files:**
- Create: `src/data/sections.ts`
- Test: `src/data/sections.test.ts`
- Modify: `src/data/nav.ts`, `src/lib/commands.test.ts`, `src/components/CommandNav.astro`

- [ ] **Step 1: Write the failing nav-model test**

Create `src/data/sections.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sections, crumbsFor } from './sections';

describe('sections', () => {
  it('exposes the six top-level tabs in order', () => {
    expect(sections.map((s) => s.key)).toEqual([
      'home', 'experience', 'projects', 'skills', 'ai', 'about',
    ]);
  });
  it('every tab has an absolute href', () => {
    for (const s of sections) expect(s.href.startsWith('/')).toBe(true);
  });
});

describe('crumbsFor', () => {
  it('home is just the ~ root linking home', () => {
    expect(crumbsFor('home')).toEqual([{ label: '~', href: '/' }]);
  });
  it('a section has root + current segment, current has no href', () => {
    expect(crumbsFor('experience')).toEqual([
      { label: '~', href: '/' },
      { label: 'experience' },
    ]);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm run test src/data/sections.test.ts`
Expected: FAIL — cannot find module `./sections`.

- [ ] **Step 3: Implement the nav model**

Create `src/data/sections.ts`:

```ts
export type SectionKey = 'home' | 'experience' | 'projects' | 'skills' | 'ai' | 'about';

export type SectionTab = { key: SectionKey; label: string; href: string };

export const sections: SectionTab[] = [
  { key: 'home', label: 'home', href: '/' },
  { key: 'experience', label: 'experience', href: '/experience' },
  { key: 'projects', label: 'projects', href: '/projects' },
  { key: 'skills', label: 'skills', href: '/skills' },
  { key: 'ai', label: 'ai', href: '/ai' },
  { key: 'about', label: 'about', href: '/about' },
];

export type Crumb = { label: string; href?: string };

/** Breadcrumb path segments for a section page. Home is just the '~' root. */
export function crumbsFor(current: SectionKey): Crumb[] {
  if (current === 'home') return [{ label: '~', href: '/' }];
  const tab = sections.find((s) => s.key === current);
  return [
    { label: '~', href: '/' },
    { label: tab ? tab.label : current }, // current segment: no href
  ];
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npm run test src/data/sections.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Update the command targets test (TDD for nav.ts)**

In `src/lib/commands.test.ts`, replace the `resolves a bare command`, `is case-insensitive`, and `handles ls-style trailing slash` test bodies so they expect the new `/projects` route:

```ts
  it('resolves a bare command', () => {
    expect(resolveCommand('projects')).toBe('/projects');
  });
  it('is case-insensitive', () => {
    expect(resolveCommand('PROJECTS')).toBe('/projects');
  });
  it('handles ls-style trailing slash', () => {
    expect(resolveCommand('ls projects/')).toBe('/projects');
  });
```

Leave the `$ about` (`/about`), `cat now.md` (`/about#now`), `resume` (`/resume.pdf`), and unknown-input (`null`) tests unchanged.

- [ ] **Step 6: Run it to confirm it fails**

Run: `npm run test src/lib/commands.test.ts`
Expected: FAIL — `projects` still resolves to `#projects`.

- [ ] **Step 7: Re-point the command targets**

Replace the `commands` array in `src/data/nav.ts` with:

```ts
export const commands: NavCommand[] = [
  { cmd: 'about', label: 'about', target: '/about' },
  { cmd: 'projects', label: 'projects', target: '/projects' },
  { cmd: 'skills', label: 'skills', target: '/skills' },
  { cmd: 'ai', label: 'ai', target: '/ai' },
  { cmd: 'experience', label: 'experience', target: '/experience' },
  { cmd: 'education', label: 'education', target: '/about#education' },
  { cmd: 'now', label: 'now', target: '/about#now' },
  { cmd: 'contact', label: 'contact', target: '/#contact' },
  { cmd: 'resume', label: 'resume', target: '/resume.pdf' },
];
```

- [ ] **Step 8: Fix CommandNav chips to not new-tab internal links**

In `src/components/CommandNav.astro`, replace the chip `<a>` line (the one inside `{commands.map(...)}`) with a version that only opens a new tab for external `http(s)` targets:

```astro
    {commands.map((c) => (
      <a class="chip" href={c.target} {...(/^https?:/.test(c.target) ? { target: '_blank', rel: 'noopener' } : {})}>{c.label}</a>
    ))}
```

(The `<script>` block already does `if (target.startsWith('#')) scrollIntoView else window.location.href = target;` — route targets like `/projects` correctly navigate. No script change needed.)

- [ ] **Step 9: Run the full suite**

Run: `npm run test`
Expected: PASS — sections (4) + commands (7) + data (9) all green.

- [ ] **Step 10: Commit**

```bash
git add src/data/sections.ts src/data/sections.test.ts src/data/nav.ts src/lib/commands.test.ts src/components/CommandNav.astro
git commit -m "feat(nav): route-based nav model, command targets, command-nav internal links"
```

---

## Task 2: SiteNav component + styles

**Files:**
- Create: `src/components/SiteNav.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the SiteNav component**

Create `src/components/SiteNav.astro`:

```astro
---
import { sections, crumbsFor, type SectionKey, type Crumb } from '../data/sections';

interface Props {
  current?: SectionKey;
  crumbs?: Crumb[]; // override (e.g. case studies with a deeper path)
}
const { current = 'home', crumbs } = Astro.props;
const path = crumbs ?? crumbsFor(current);
---
<header class="site-nav">
  <div class="container site-nav-inner">
    <div class="crumb mono">
      <a class="crumb-user" href="/">karan@embedded</a><span class="crumb-sep">:</span>{path.map((c, i) => (
        <Fragment>
          {i > 0 && <span class="crumb-slash">/</span>}
          {c.href
            ? <a class="crumb-seg" href={c.href}>{c.label}</a>
            : <span class="crumb-seg crumb-current">{c.label}</span>}
        </Fragment>
      ))}<span class="crumb-dollar">$</span>
    </div>
    <nav class="nav-tabs mono" aria-label="Sections">
      {sections.map((s) => (
        <a
          class={`nav-tab${s.key === current ? ' active' : ''}`}
          href={s.href}
          aria-current={s.key === current ? 'page' : undefined}
        >{s.label}</a>
      ))}
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Append the SiteNav styles**

In `src/styles/global.css`, at the END of the file, append:

```css
/* persistent site nav */
.site-nav { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(8px); background: rgba(10,10,10,.85); border-bottom: 1px solid var(--border); }
.site-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 56px; }
.crumb { font-size: 13px; white-space: nowrap; }
.crumb-user { color: var(--accent); font-weight: 600; }
.crumb-sep, .crumb-slash, .crumb-dollar { color: var(--muted); }
.crumb-dollar { margin-left: 2px; }
.crumb-seg { color: var(--blue); }
.crumb-current { color: var(--text); }
.nav-tabs { display: flex; gap: 6px; align-items: center; overflow-x: auto; }
.nav-tab { font-size: 13px; padding: 6px 10px; border-radius: 7px; color: var(--muted); border: 1px solid transparent; }
.nav-tab:hover { color: var(--text); text-decoration: none; }
.nav-tab.active { color: var(--accent); border-color: var(--border); background: var(--accent-soft); }
@media (max-width: 640px) {
  .site-nav-inner { height: auto; flex-direction: column; align-items: stretch; gap: 8px; padding-top: 8px; padding-bottom: 8px; }
  .nav-tabs { width: 100%; }
  .crumb { font-size: 12px; overflow-x: auto; }
}
```

- [ ] **Step 3: Align the anchor scroll offset to the nav height**

In `src/styles/global.css`, change the existing rule `html { scroll-behavior: smooth; scroll-padding-top: 80px; }` to use `72px`:

```css
html { scroll-behavior: smooth; scroll-padding-top: 72px; }
```

- [ ] **Step 4: Verify types**

Run: `npx astro check`
Expected: 0 errors. (SiteNav isn't rendered anywhere yet — wired up in Task 4+.)

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.astro src/styles/global.css
git commit -m "feat(nav): SiteNav breadcrumb + section tabs component"
```

---

## Task 3: Persistent contact footer

**Files:**
- Modify: `src/components/Footer.astro`, `src/styles/global.css`

- [ ] **Step 1: Rewrite Footer with a persistent contact block**

Replace the entire contents of `src/components/Footer.astro` with:

```astro
---
import Icon from './Icon.astro';
import { links } from '../data/links';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container">
    <div class="footer-contact">
      <div class="footer-contact-cmd mono"><span class="prompt">karan@embedded</span>:<span class="out">~</span><span class="prompt">$</span> contact --options</div>
      <div class="footer-links">
        <a class="btn btn-primary" href={`mailto:${links.email}`}>Email</a>
        <a class="btn btn-ghost" href={links.github} target="_blank" rel="noopener"><Icon name="github" size={16} /> GitHub</a>
        <a class="btn btn-ghost" href={links.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" size={16} /> LinkedIn</a>
        <a class="btn btn-ghost" href={links.resume} target="_blank" rel="noopener">Résumé</a>
      </div>
      <p class="footer-roles muted mono">Open to Firmware / Embedded Software Engineer roles — based in Canada (Canadian PR) and India.</p>
    </div>
    <div class="footer-base">
      <span class="accent">karan@embedded:~$ <span class="comment">echo "thanks for visiting"</span></span>
      <span>© {year} Karan Gandhi</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Append footer styles**

In `src/styles/global.css`, at the END of the file, append:

```css
/* persistent footer contact */
.footer-contact { padding-bottom: 18px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.footer-contact-cmd { font-size: 13px; margin-bottom: 12px; }
.footer-links { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.footer-roles { font-size: 12.5px; }
.footer-base { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
```

- [ ] **Step 3: Verify types**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/styles/global.css
git commit -m "feat(footer): persistent contact block on every page"
```

---

## Task 4: PageLayout wrapper

**Files:**
- Create: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Create PageLayout**

Create `src/layouts/PageLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';
import Footer from '../components/Footer.astro';
import type { SectionKey, Crumb } from '../data/sections';

interface Props {
  title?: string;
  description?: string;
  current?: SectionKey;
  crumbs?: Crumb[];
}
const { title, description, current = 'home', crumbs } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <SiteNav current={current} crumbs={crumbs} />
  <main>
    <slot />
  </main>
  <Footer />
</BaseLayout>
```

(`BaseLayout` applies its default title/description when these are `undefined`, so route pages only set what they need.)

- [ ] **Step 2: Verify types**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/PageLayout.astro
git commit -m "feat(layout): PageLayout (SiteNav + content + Footer)"
```

---

## Task 5: Rewire home + re-scope /about

**Files:**
- Modify: `src/pages/index.astro`, `src/pages/about.astro`, `src/styles/global.css`

- [ ] **Step 1: Rewrite the home page on PageLayout**

Replace the entire contents of `src/pages/index.astro` with:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from '../components/Hero.astro';
import ProofStrip from '../components/ProofStrip.astro';
import QualcommCard from '../components/QualcommCard.astro';
import Projects from '../components/Projects.astro';
import Contact from '../components/Contact.astro';
import { projects, type Project } from '../data/projects';

// Fixed home order for the four featured cards (flagship BLE first).
const featuredOrder = [
  'ble-environmental-sensor-node',
  'mini-ecu-v2',
  'vnet-driver',
  'stm32-smart-sensor-hub',
];
const bySlug = new Map(projects.map((p) => [p.slug, p]));
const featured = featuredOrder
  .map((slug) => bySlug.get(slug))
  .filter((p): p is Project => Boolean(p));
---
<PageLayout current="home">
  <Hero />
  <ProofStrip />
  <QualcommCard />
  <Projects items={featured} cmd="ls projects/ --featured" title="Featured Projects" />
  <section class="section see-more">
    <div class="container">
      <div class="see-more-row">
        <a class="btn btn-ghost" href="/experience">&rarr; experience</a>
        <a class="btn btn-ghost" href="/projects">&rarr; all projects</a>
      </div>
    </div>
  </section>
  <section class="section cs-callout-section">
    <div class="container">
      <a class="card cs-callout" href="/projects/ble-environmental-sensor-node">
        <div class="card-bar">
          <span class="cs-badge">featured case study &rarr;</span>
        </div>
        <div class="card-body">
          <h3 style="font-size:16px; margin-bottom:6px;">BLE Environmental Sensor Node</h3>
          <p class="measure">Spec-driven ESP32-C3 BLE peripheral: custom GATT profile, MITM passkey pairing, on-device TinyML, and an Android companion app — with a full rapid bring-up &amp; I2C debugging narrative.</p>
        </div>
      </a>
    </div>
  </section>
  <Contact />
</PageLayout>
```

- [ ] **Step 2: Append the CTA-row style**

In `src/styles/global.css`, at the END of the file, append:

```css
/* home CTA row */
.see-more-row { display: flex; gap: 10px; flex-wrap: wrap; }
```

- [ ] **Step 3: Re-scope /about to bio + education + now**

Replace the entire contents of `src/pages/about.astro` with:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import About from '../components/About.astro';
import Education from '../components/Education.astro';
import Now from '../components/Now.astro';
---
<PageLayout
  current="about"
  title="Karan Gandhi — About"
  description="Background, education and current focus for Karan Gandhi, embedded firmware engineer (ex-Qualcomm)."
>
  <About />
  <Education />
  <Now />
</PageLayout>
```

- [ ] **Step 4: Verify types and build**

Run: `npx astro check && npm run build`
Expected: 0 errors; build succeeds.

- [ ] **Step 5: Smoke-check home + /about**

Run:
```bash
grep -o 'class="site-nav"' dist/index.html | wc -l
grep -o 'class="footer-contact"' dist/index.html | wc -l
grep -o 'aria-current="page">[a-z]*' dist/index.html
grep -o 'id="education"\|id="now"\|id="about"' dist/about/index.html | sort -u
grep -c 'id="experience"\|id="skills"\|id="projects"' dist/about/index.html
```
Expected: site-nav present (1); footer-contact present (1); the active tab on home is `home` (`aria-current="page">home`); `/about` contains `about`/`education`/`now` anchors; the last grep is `0` (experience/skills/projects no longer on /about).

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/about.astro src/styles/global.css
git commit -m "feat(pages): home + /about on PageLayout, /about re-scoped to bio/education/now"
```

---

## Task 6: New route pages (experience, projects, skills, ai)

**Files:**
- Create: `src/pages/experience.astro`, `src/pages/projects/index.astro`, `src/pages/skills.astro`, `src/pages/ai.astro`

- [ ] **Step 1: Create `src/pages/experience.astro`**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Experience from '../components/Experience.astro';
---
<PageLayout
  current="experience"
  title="Karan Gandhi — Experience"
  description="Professional experience of Karan Gandhi: Qualcomm LTE/5G modem firmware and self-directed embedded projects."
>
  <Experience />
</PageLayout>
```

- [ ] **Step 2: Create `src/pages/projects/index.astro`**

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import Projects from '../../components/Projects.astro';
---
<PageLayout
  current="projects"
  title="Karan Gandhi — Projects"
  description="All embedded firmware, RTOS and Linux driver projects by Karan Gandhi, with status and validation notes."
>
  <Projects cmd="ls projects/ --all" title="All Projects" />
</PageLayout>
```

- [ ] **Step 3: Create `src/pages/skills.astro`**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Skills from '../components/Skills.astro';
import EngineeringStyle from '../components/EngineeringStyle.astro';
---
<PageLayout
  current="skills"
  title="Karan Gandhi — Skills"
  description="Technical skills and engineering approach of Karan Gandhi across embedded firmware, RTOS, Linux drivers and protocols."
>
  <Skills />
  <EngineeringStyle />
</PageLayout>
```

- [ ] **Step 4: Create `src/pages/ai.astro`**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import AiEngineering from '../components/AiEngineering.astro';
---
<PageLayout
  current="ai"
  title="Karan Gandhi — Engineering-First, AI-Assisted"
  description="How Karan Gandhi uses AI as an engineering assistant within spec-driven, validation-first embedded development."
>
  <AiEngineering />
</PageLayout>
```

- [ ] **Step 5: Verify types and build**

Run: `npx astro check && npm run build`
Expected: 0 errors; build emits `dist/experience/index.html`, `dist/projects/index.html`, `dist/skills/index.html`, `dist/ai/index.html`.

- [ ] **Step 6: Smoke-check the new pages**

Run:
```bash
for p in experience projects skills ai; do echo "== $p =="; grep -o 'aria-current="page">[a-z]*' dist/$p/index.html; done
grep -o 'class="card"' dist/projects/index.html | wc -l
```
Expected: each page's active tab matches its name; `/projects` shows the full project set (count ≥ 8 `.card` for the project cards).

- [ ] **Step 7: Commit**

```bash
git add src/pages/experience.astro src/pages/projects/index.astro src/pages/skills.astro src/pages/ai.astro
git commit -m "feat(pages): add /experience, /projects, /skills, /ai routes"
```

---

## Task 7: Case study — themed headings + sticky TOC + scrollspy

**Files:**
- Modify: `src/layouts/CaseStudyLayout.astro`, `src/pages/projects/[slug].astro`, `src/styles/global.css`

- [ ] **Step 1: Pass `slug` from the dynamic route**

In `src/pages/projects/[slug].astro`, add `slug={entry.slug}` to the `<CaseStudyLayout ...>` opening tag (alongside the existing props, e.g. right after `repoUrl={repoUrl}`):

```astro
  slug={entry.slug}
```

- [ ] **Step 2: Rewrite CaseStudyLayout with SiteNav, Footer, sticky-TOC grid, scrollspy**

Replace the entire contents of `src/layouts/CaseStudyLayout.astro` with:

```astro
---
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';
import Icon from '../components/Icon.astro';
import Footer from '../components/Footer.astro';
import type { Crumb } from '../data/sections';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}
interface Props {
  title: string;
  summary: string;
  status: string;
  platform: string;
  stack: string[];
  tags: string[];
  repoUrl: string;
  role?: string;
  coreWork?: string;
  validation?: string;
  slug: string;
  headings?: Heading[];
}
const { title, summary, status, platform, stack, tags, repoUrl, role, coreWork, validation, slug, headings = [] } = Astro.props;
const pageTitle = `${title} — Case Study — Karan Gandhi`;
const toc = headings.filter((h) => h.depth === 2 || h.depth === 3);
const crumbs: Crumb[] = [
  { label: '~', href: '/' },
  { label: 'projects', href: '/projects' },
  { label: slug },
];
---
<BaseLayout title={pageTitle} description={summary}>
  <SiteNav crumbs={crumbs} />
  <main class="container cs cs-grid">
    {toc.length > 0 && (
      <nav class="cs-toc term" aria-label="Contents">
        <div class="term-bar">
          <span class="dot dot-r"></span>
          <span class="dot dot-y"></span>
          <span class="dot dot-g"></span>
          <span class="term-title mono">contents</span>
        </div>
        <div class="term-body">
          <p class="cs-toc-cmd mono">
            <span class="prompt">karan@embedded</span>:<span class="out">~/projects</span><span class="prompt">$</span> grep '^##' case-study.md
          </p>
          <ol class="cs-toc-list mono">
            {toc.map((h) => (
              <li class={`toc-d${h.depth}`}>
                <a href={`#${h.slug}`}><span class="cs-toc-mark">{h.depth === 2 ? '##' : '└─'}</span> {h.text}</a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    )}

    <div class="cs-main">
      <header class="cs-head">
        <div class="cs-meta mono">
          <span class="accent">karan@embedded</span>:<span class="out">~/projects/</span><span class="prompt">cat case-study.md</span>
        </div>
        <h1>{title}</h1>
        <p class="cs-summary">{summary}</p>

        <dl class="cs-facts mono">
          {role && <div><dt>role</dt><dd>{role}</dd></div>}
          <div><dt>platform</dt><dd>{platform}</dd></div>
          {coreWork && <div><dt>core work</dt><dd>{coreWork}</dd></div>}
          {validation && <div><dt>validation</dt><dd>{validation}</dd></div>}
          <div><dt>status</dt><dd>{status}</dd></div>
          <div><dt>stack</dt><dd>{stack.join(' · ')}</dd></div>
        </dl>

        <div class="cs-cta">
          <a class="btn btn-primary" href={repoUrl} target="_blank" rel="noopener">
            <Icon name="github" size={16} /> View on GitHub
          </a>
        </div>

        <div class="cs-tags">
          {tags.map((t) => <span class="tag">{t}</span>)}
        </div>
      </header>

      <article class="cs-body">
        <slot />
      </article>

      <a class="cs-back mono" href="/projects">← back to all projects</a>
    </div>
  </main>
  <Footer />
</BaseLayout>

<script>
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.cs-toc-list a'));
  const byId = new Map(
    tocLinks.map((a) => [a.getAttribute('href')?.slice(1) ?? '', a]),
  );
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('.cs-body h2[id], .cs-body h3[id]'),
  );
  if ('IntersectionObserver' in window && targets.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          tocLinks.forEach((a) => a.classList.remove('active'));
          const link = byId.get((e.target as HTMLElement).id);
          if (link) link.classList.add('active');
        }
      },
      { rootMargin: '-72px 0px -70% 0px' },
    );
    targets.forEach((t) => obs.observe(t));
  }
</script>
```

Notes:
- The old top `cs-back` ("cd ~/projects") link is removed — the persistent SiteNav breadcrumb (`~/projects`) now provides the upward link. The bottom "← back to all projects" now points to `/projects`.
- The summary box (role/platform/core work/validation/status/stack) is unchanged from the current version.

- [ ] **Step 3: Append case-study layout + themed-heading styles**

In `src/styles/global.css`, at the END of the file, append:

```css
/* case study: two-column with sticky TOC on desktop */
@media (min-width: 900px) {
  .cs-grid { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 32px; align-items: start; max-width: 1120px; }
  .cs-grid .cs-toc { position: sticky; top: 72px; margin: 0; max-width: none; }
  .cs-grid .cs-toc-list { columns: 1; }
  .cs-main { min-width: 0; }
}
.cs-toc-list a.active { color: var(--accent); }
.cs-toc-list a.active .cs-toc-mark { color: var(--accent); }
/* themed case-study headings — terminal prompt marker */
.cs-body h2::before { content: "$ "; color: var(--accent); font-family: var(--font-mono); font-weight: 400; }
```

- [ ] **Step 4: Verify types and build**

Run: `npx astro check && npm run build`
Expected: 0 errors; build emits `dist/projects/ble-environmental-sensor-node/index.html`.

- [ ] **Step 5: Smoke-check the case study**

Run:
```bash
grep -o 'class="site-nav"' dist/projects/ble-environmental-sensor-node/index.html | wc -l
grep -o 'cs-grid' dist/projects/ble-environmental-sensor-node/index.html | wc -l
grep -o 'href="/projects"' dist/projects/ble-environmental-sensor-node/index.html | wc -l
grep -o 'IntersectionObserver' dist/projects/ble-environmental-sensor-node/index.html | wc -l
```
Expected: site-nav present; `cs-grid` present; the bottom back-link points to `/projects`; the scrollspy script is in the page.

- [ ] **Step 6: Commit**

```bash
git add "src/pages/projects/[slug].astro" src/layouts/CaseStudyLayout.astro src/styles/global.css
git commit -m "feat(case-study): sticky TOC, scrollspy, themed headings, global nav/footer"
```

---

## Task 8: Retire Header.astro and dead CSS

**Files:**
- Delete: `src/components/Header.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Confirm Header.astro is no longer imported**

Run: `grep -rn "components/Header" src/ || echo "NO REFERENCES"`
Expected: `NO REFERENCES` (all pages now use PageLayout/SiteNav). If any reference remains, that page was missed — fix it before deleting.

- [ ] **Step 2: Delete Header.astro**

```bash
git rm src/components/Header.astro
```

- [ ] **Step 3: Remove dead CSS rules**

In `src/styles/global.css`, delete the now-unused selectors:

- The `.site-header`, `.site-header .inner`, `.nav-links`, `.nav-links a`, `.nav-links a:hover`, `.header-icons`, `.header-icons a`, `.header-icons a:hover`, and the `@media (max-width: 640px) { .nav-links { display: none; } }` rules (the original sticky-header block).
- The `/about` sub-nav block added earlier: `.subnav`, `.subnav-inner`, `.subnav-home`, `.subnav-link`, `.subnav-link:hover, .subnav-home:hover`, and `.about-page section { scroll-margin-top: 120px; }`.

Keep `.site-footer` (still used).

- [ ] **Step 4: Confirm no remaining references to deleted selectors**

Run:
```bash
grep -rn "site-header\|nav-links\|header-icons\|class=\"subnav\|subnav-\|about-page" src/ || echo "NO REFERENCES"
```
Expected: `NO REFERENCES`.

- [ ] **Step 5: Verify build**

Run: `npx astro check && npm run build`
Expected: 0 errors; build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(nav): remove retired Header component and dead nav CSS"
```

---

## Task 9: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npm run test`
Expected: PASS — sections (4) + commands (7) + data (9), all green.

- [ ] **Step 2: Type-check and build**

Run: `npx astro check && npm run build`
Expected: 0 errors; `dist/` contains `index.html`, `experience/index.html`, `projects/index.html`, `skills/index.html`, `ai/index.html`, `about/index.html`, `projects/ble-environmental-sensor-node/index.html`.

- [ ] **Step 3: Sitemap includes all routes**

Run: `grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | sort`
Expected: entries for `/`, `/about/`, `/ai/`, `/experience/`, `/projects/`, `/skills/`, and `/projects/ble-environmental-sensor-node/`.

- [ ] **Step 4: Persistent nav + footer on every page**

Run:
```bash
for p in index experience/index projects/index skills/index ai/index about/index projects/ble-environmental-sensor-node/index; do
  echo "== $p =="; grep -oc 'class="site-nav"' dist/$p.html; grep -oc 'class="footer-contact"' dist/$p.html;
done
```
Expected: every page reports `1` for both site-nav and footer-contact.

- [ ] **Step 5: Active-tab correctness**

Run:
```bash
for p in experience projects skills ai about; do echo "== $p =="; grep -o "nav-tab active\" href=\"/$p\"" dist/$p/index.html; done
```
Expected: each page marks its own tab active.

- [ ] **Step 6: Manual visual review (dev server)**

Start (or reuse) `npm run dev` and confirm at http://localhost:4321/:
- Nav bar is fixed at top on every page; breadcrumb shows the right path; current tab highlighted.
- Clicking a tab navigates to its page; the breadcrumb `karan@embedded` and `home` tab both return home; no page traps you (no scroll-hunting for "back").
- On a narrow window, the tab strip scrolls horizontally instead of disappearing.
- Footer contact appears at the bottom of every page.
- BLE case study: headings show the green `$` marker; on a wide window the TOC is a sticky sidebar that stays visible and highlights the section in view; on a narrow window the contents box sits at the top.
- Terminal aesthetic (colors, chrome, cursor, fonts) is unchanged.

- [ ] **Step 7: Final commit (only if Step 6 required fixups)**

```bash
git add -A
git commit -m "chore: verification fixups for multi-page navigation"
```

---

## Self-review (spec coverage)

- Granular routes `/experience` `/projects` `/skills` `/ai` `/about` + home + case studies — Tasks 5, 6.
- Persistent breadcrumb + section tabs nav, every page/viewport, mobile scroll strip — Tasks 2, 4.
- Breadcrumb root + home tab both return home (fixes "no intuitive back") — Task 2.
- Persistent contact footer (links + Canadian-PR/relocation line) — Task 3.
- Shared `PageLayout` (DRY nav/footer) — Task 4.
- Command-input targets → routes; chips don't new-tab internal links — Task 1.
- Case study: themed headings, sticky always-visible TOC (desktop sidebar / mobile top), scrollspy active highlight, global nav/footer, `/projects` back-link — Task 7.
- Retire old Header + `/about` sub-nav + dead CSS — Task 8.
- Per-page titles/descriptions + sitemap coverage — Tasks 5, 6, 9.
- Resumability (branch, per-task commits, restart procedure) — header section above; reinforced by a project memory at handoff.

**Deferred (spec open item, intentionally NOT built — confirm with Karan):** per-section **prev/next** links on the case study. The sticky TOC + scrollspy already provide jump-anywhere navigation, and a meaningful prev/next over a slotted markdown article adds complexity for marginal value. Add later if Karan wants it.
