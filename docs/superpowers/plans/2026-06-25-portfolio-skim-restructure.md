# Portfolio Skim-Layer Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the terminal-themed portfolio into a sharp skim layer on `/` (Hero → proof → Qualcomm → 4 projects → case-study teaser → contact) with all depth moved to a new `/about` page, plus project proof footers, a polished BLE case study, and typography/spacing fixes.

**Architecture:** Astro static site. The single mega-page `index.astro` becomes a short skim home; a new `about.astro` assembles the existing deep section-components behind a sticky sub-nav. Project metadata gains optional `status`/`validation`/`evidence` fields rendered as a dashed footer on `ProjectCard`. The terminal command-nav and site header re-point depth links to `/about#…`. Case-study frontmatter gains optional summary-box fields.

**Tech Stack:** Astro 4, Tailwind (via `@astrojs/tailwind`), TypeScript, Vitest. Content collections for case studies. Plain CSS tokens in `src/styles/global.css`.

**Environment notes:**
- Node `v24.16.0`, npm `11.13.0`, `node_modules` present. Baseline `npm run test` is green (16 tests) as of this plan.
- Verify components with `npx astro check` (type/template check) and `npm run build` (full static build). Verify data/logic with `npm run test`.
- Source of truth for project facts is `src/data/projects.ts`; for experience facts `src/data/experience.ts`. **Do not invent metrics.**

**Open items requiring Karan's confirmation (design §"Open items"):** the non-BLE `status`/`validation`/`evidence` strings (drafted truthfully below from each repo's existing `summary`/`focus`/`highlights` — flag as DRAFT), and the exact Canadian-PR / relocation wording. These are implemented with clearly-marked draft values so work is not blocked; Karan reviews before shipping.

---

## File structure

**New files:**
- `src/pages/about.astro` — deep page; sticky sub-nav over existing section components.
- `src/components/ProofStrip.astro` — home proof pills (`cat proof.txt`).
- `src/components/QualcommCard.astro` — home Qualcomm credibility mini-card.

**Modified files:**
- `src/data/projects.ts` — add `status`/`validation`/`evidence` to `Project`; set `featured` to the four home cards; BLE blurb; distinguishing notes.
- `src/data/data.test.ts` — update featured assertion; add footer-field assertions for featured projects.
- `src/data/nav.ts` — re-point depth commands to `/about#…`.
- `src/lib/commands.test.ts` — update expected targets.
- `src/components/ProjectCard.astro` — render proof footer.
- `src/components/Projects.astro` — accept optional `items` / `cmd` / `title` props (reusable for home featured + `/about` full list).
- `src/pages/index.astro` — recompose to the skim order; drop deep sections.
- `src/components/AiEngineering.astro` — reframed copy.
- `src/components/Header.astro` — re-point links to absolute `/` and `/about#…`.
- `src/content/config.ts` — optional `role` / `coreWork` / `validation` fields.
- `src/content/case-studies/ble-environmental-sensor-node.md` — summary-box frontmatter + new standalone narrative section.
- `src/layouts/CaseStudyLayout.astro` — render the richer summary box.
- `src/styles/global.css` — proof footer, sub-nav, proof-strip, qualcomm-card, typography/spacing tokens.
- `astro.config.mjs` — add sitemap integration.

---

## Task 1: Project data — fields, featured set, footer drafts, blurbs

**Files:**
- Modify: `src/data/projects.ts`
- Test: `src/data/data.test.ts`

- [ ] **Step 1: Update the failing tests first**

In `src/data/data.test.ts`, replace the `has at least 6 featured projects` test (lines 30-32) with the block below, and add a footer-fields test:

```ts
  it('marks exactly the four home-featured projects', () => {
    const featured = projects.filter((p) => p.featured).map((p) => p.slug).sort();
    expect(featured).toEqual(
      [
        'ble-environmental-sensor-node',
        'mini-ecu-v2',
        'stm32-smart-sensor-hub',
        'vnet-driver',
      ].sort(),
    );
  });

  it('every featured project has status, validation and evidence', () => {
    for (const p of projects.filter((x) => x.featured)) {
      expect(p.status, `${p.slug} status`).toBeTruthy();
      expect(p.validation, `${p.slug} validation`).toBeTruthy();
      expect(p.evidence, `${p.slug} evidence`).toBeTruthy();
    }
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `marks exactly the four home-featured projects` fails (currently 7 projects are `featured`), and the footer test fails (fields don't exist yet).

- [ ] **Step 3: Add the three optional fields to the `Project` type**

In `src/data/projects.ts`, extend the type (after `featured?: boolean;`, before the closing `}`):

```ts
  // Proof footer (home featured cards). DRAFT values for non-BLE projects —
  // Karan to confirm/correct against each repo README before shipping.
  status?: string;     // e.g. "v1.0 working prototype", "working driver"
  validation?: string; // how it was proven (tests, tooling, on-target checks)
  evidence?: string;   // what a reviewer can inspect (GitHub, README, docs, case study)
```

- [ ] **Step 4: Set the featured set to the four and add footer values**

Edit each project object so that **only** these four have `featured: true`: `ble-environmental-sensor-node`, `mini-ecu-v2`, `vnet-driver`, `stm32-smart-sensor-hub`. Set `featured: false` on `stm32-virtual-vehicle-ecu`, `Pseudo-Character-Device-Driver`, and `EE-6314-RTOS` (`bluetooth-audio-manager-linux` already `false`).

Add footer fields to the four featured projects:

`vnet-driver`:
```ts
    status: 'working driver',
    validation: 'TX/RX path exercised with ethtool stats and NAPI-style polling; verified across kernel/user-space.',
    evidence: 'GitHub repo · README · driver source',
```

`mini-ecu-v2`:
```ts
    status: 'working prototype',
    validation: 'CAN loopback telemetry, UART CLI and logging exercised on STM32F446RE.',
    evidence: 'GitHub repo · README · architecture notes',
```

`stm32-smart-sensor-hub`:
```ts
    status: 'working prototype',
    validation: 'I2C/SPI sensor backends exercised via UART logging and CLI observability.',
    evidence: 'GitHub repo · README',
```

`ble-environmental-sensor-node` (real numbers per design — these are confirmed, not draft):
```ts
    status: 'v1.0 working prototype',
    validation: '62 Unity tests · 25-case manual matrix · nRF Connect verification',
    evidence: 'Case study · GitHub repo · architecture docs · nRF Connect screenshots',
```

- [ ] **Step 5: Replace the BLE `summary` with Karan's flagship blurb**

On `ble-environmental-sensor-node`, replace the `summary` value with (verbatim from design):

```ts
    summary:
      'Learned BLE from scratch and built a working ESP32-C3 BLE environmental sensor node within two weeks. Extended the project from simulated data to a real I2C temperature sensor, systematically isolated a non-responsive sensor using address scanning, multimeter checks, address-line testing, and replacement comparison, then demonstrated live temperature readings over BLE. Independently captured I2C bus transactions using an unfamiliar logic analyzer.',
```

- [ ] **Step 6: Add distinguishing notes to non-duplicate projects**

On `stm32-virtual-vehicle-ecu`, replace `focus` with:

```ts
    focus:
      'Distinct from mini-ecu-v2: this one centers on vehicle-behavior simulation. Clean separation between drivers, RTOS tasks, application logic, and a simple simulated vehicle model.',
```

On `bluetooth-audio-manager-linux`, replace `summary` with:

```ts
    summary:
      'Linux utility / automation: fixes and toggles Bluetooth audio profiles on PipeWire systems.',
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS — all data tests green, including the two new featured/footer tests.

- [ ] **Step 8: Commit**

```bash
git add src/data/projects.ts src/data/data.test.ts
git commit -m "feat(data): add project proof fields, set 4-featured home set, BLE blurb"
```

---

## Task 2: Re-point terminal command-nav to /about

**Files:**
- Modify: `src/data/nav.ts`
- Test: `src/lib/commands.test.ts`

- [ ] **Step 1: Update the failing tests first**

In `src/lib/commands.test.ts`, update the two affected expectations:

Replace the `ignores a leading $ prompt` test body:
```ts
  it('ignores a leading $ prompt', () => {
    expect(resolveCommand('$ about')).toBe('/about');
  });
```

Replace the `handles cat now.md` test body:
```ts
  it('handles cat now.md', () => {
    expect(resolveCommand('cat now.md')).toBe('/about#now');
  });
```

Leave `projects` (`#projects`) and `resume` (`/resume.pdf`) tests unchanged.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test src/lib/commands.test.ts`
Expected: FAIL — `about` still resolves to `#about`, `now` to `#now`.

- [ ] **Step 3: Re-point the depth commands**

Replace the `commands` array in `src/data/nav.ts` with:

```ts
export const commands: NavCommand[] = [
  { cmd: 'about', label: 'about', target: '/about' },
  { cmd: 'projects', label: 'projects', target: '#projects' },
  { cmd: 'skills', label: 'skills', target: '/about#skills' },
  { cmd: 'ai', label: 'ai', target: '/about#ai' },
  { cmd: 'experience', label: 'experience', target: '/about#experience' },
  { cmd: 'education', label: 'education', target: '/about#education' },
  { cmd: 'now', label: 'now', target: '/about#now' },
  { cmd: 'contact', label: 'contact', target: '#contact' },
  { cmd: 'resume', label: 'resume', target: '/resume.pdf' },
];
```

(No change needed to `CommandNav.astro` — its script already navigates for non-`#` targets and the chip renderer only opens a new tab for non-`#` external targets; `/about#…` correctly does a same-window navigation. Note: the chip `target="_blank"` branch triggers for `/about#…` too, opening `/about` in a new tab — acceptable, but if same-tab is preferred, that is Task 7 polish.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test src/lib/commands.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/nav.ts src/lib/commands.test.ts
git commit -m "feat(nav): re-point depth commands to /about sections"
```

---

## Task 3: ProjectCard proof footer + CSS

**Files:**
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Render the proof footer**

In `src/components/ProjectCard.astro`, inside `.card-body`, after the tags `<div>` (after line 32, before the closing `</div>` of `.card-body`), add:

```astro
    {(project.status || project.validation || project.evidence) && (
      <div class="proof">
        {project.status && (
          <div class="proof-row"><span class="proof-k">status</span><span>{project.status}</span></div>
        )}
        {project.validation && (
          <div class="proof-row"><span class="proof-k">validation</span><span>{project.validation}</span></div>
        )}
        {project.evidence && (
          <div class="proof-row"><span class="proof-k">evidence</span><span>{project.evidence}</span></div>
        )}
      </div>
    )}
```

- [ ] **Step 2: Add the dashed-footer styles**

In `src/styles/global.css`, after the `.why` rule (line 87), add:

```css
/* project proof footer */
.proof { margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border); font-family: var(--font-mono); font-size: 12px; display: flex; flex-direction: column; gap: 6px; }
.proof-row { display: flex; gap: 8px; color: #b6bfca; }
.proof-k { color: var(--accent); min-width: 78px; }
```

- [ ] **Step 3: Verify the build and types**

Run: `npx astro check`
Expected: 0 errors (the footer fields are optional on `Project`, so non-featured cards render without the footer).

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/styles/global.css
git commit -m "feat(project-card): dashed status/validation/evidence footer"
```

---

## Task 4: ProofStrip component

**Files:**
- Create: `src/components/ProofStrip.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the component**

Create `src/components/ProofStrip.astro`:

```astro
---
import Prompt from './Prompt.astro';

// Facts only — derived from src/data/experience.ts. No unverified metrics.
const pills = [
  '3 yrs Qualcomm firmware',
  'LTE / 5G modem',
  'RTOS · drivers · power',
  '~30% faster crash-log debug',
  'STM32 · BLE · Linux driver projects',
  'validation-first',
  'open to roles',
];
---
<section class="section proof-strip-section">
  <div class="container">
    <div class="proof-strip-head mono"><Prompt cmd="cat proof.txt" /></div>
    <div class="proof-strip">
      {pills.map((p) => <span class="proof-pill mono">{p}</span>)}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the pill styles**

In `src/styles/global.css`, after the `.proof-k` rule added in Task 3, add:

```css
/* home proof strip */
.proof-strip-section { padding: 24px 0 0; }
.proof-strip-head { font-size: 14px; margin-bottom: 12px; }
.proof-strip { display: flex; flex-wrap: wrap; gap: 8px; }
.proof-pill { font-size: 12px; padding: 6px 12px; border-radius: 7px; background: var(--surface-2); border: 1px solid var(--border); color: #7ee787; }
```

- [ ] **Step 3: Verify**

Run: `npx astro check`
Expected: 0 errors. (Component is wired into the page in Task 7.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ProofStrip.astro src/styles/global.css
git commit -m "feat(home): add ProofStrip pills component"
```

---

## Task 5: QualcommCard component

**Files:**
- Create: `src/components/QualcommCard.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the component**

Create `src/components/QualcommCard.astro`. It pulls the Qualcomm entry from `experience.ts` (single source of truth) and links depth to `/about`:

```astro
---
import Icon from './Icon.astro';
import { experiences } from '../data/experience';

const qc = experiences.find((e) => e.company.startsWith('Qualcomm')) ?? experiences[0];
---
<section class="section qc-section">
  <div class="container">
    <div class="card qc-card">
      <div class="card-bar">
        {qc.icon && (
          <span class="ico" style="color:#c9d1d9; display:inline-flex;"><Icon name={qc.icon} size={18} /></span>
        )}
        <span class="path">Production firmware experience</span>
        <span class="gh mono" style="margin-left:auto; font-size:12px;">{qc.dates}</span>
      </div>
      <div class="card-body">
        <h3 style="font-size:16px; margin-bottom:6px;">{qc.company} — {qc.role}</h3>
        <p class="measure">{qc.summary}</p>
        <p style="margin-top:12px;"><a href="/about#experience">See full experience &rarr;</a></p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add minimal section spacing style**

In `src/styles/global.css`, after the proof-strip rules from Task 4, add:

```css
/* home qualcomm credibility card */
.qc-section { padding: 28px 0; }
```

- [ ] **Step 3: Verify**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/QualcommCard.astro src/styles/global.css
git commit -m "feat(home): add Qualcomm credibility card"
```

---

## Task 6: Make Projects.astro reusable

**Files:**
- Modify: `src/components/Projects.astro`

Make the component accept an optional pre-ordered `items` list plus `cmd`/`title` overrides, so the home page can render the 4 featured (in a fixed order) and `/about` can render the full list (existing sort).

- [ ] **Step 1: Replace the component frontmatter and header**

Replace the frontmatter (lines 1-15) of `src/components/Projects.astro` with:

```astro
---
import SectionHeader from './SectionHeader.astro';
import ProjectCard from './ProjectCard.astro';
import { projects, type Project } from '../data/projects';
import { getCollection } from 'astro:content';

interface Props {
  items?: Project[];   // pre-ordered list; when omitted, render all projects
  cmd?: string;
  title?: string;
}
const { items, cmd = 'ls projects/ --featured', title = 'Featured Projects' } = Astro.props;

const caseStudies = await getCollection('case-studies');
const caseStudySlugs: Set<string> = new Set(caseStudies.map((c) => c.slug));

// Default ordering (full list): case-study projects first, then by date desc.
const byDateDesc = (a: Project, b: Project) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
const withCaseStudy = projects.filter((p) => caseStudySlugs.has(p.slug)).sort(byDateDesc);
const withoutCaseStudy = projects.filter((p) => !caseStudySlugs.has(p.slug)).sort(byDateDesc);
const ordered = items ?? [...withCaseStudy, ...withoutCaseStudy];
---
```

- [ ] **Step 2: Use the prop-driven header**

Replace the `<SectionHeader … />` line (was line 19) with:

```astro
    <SectionHeader cmd={cmd} title={title} />
```

(The `{ordered.map(...)}` grid below already uses `ordered` and stays unchanged.)

- [ ] **Step 3: Verify**

Run: `npx astro check`
Expected: 0 errors. The home page still imports `Projects` with no props — still valid (defaults). It is rewired in Task 7.

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.astro
git commit -m "refactor(projects): accept optional items/cmd/title props"
```

---

## Task 7: Recompose the skim home (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

Home order (design IA): Hero → Proof strip → (10-seconds lives in Hero) → Qualcomm card → 4 featured projects → link to `/about` → BLE case-study callout → Contact.

- [ ] **Step 1: Replace `src/pages/index.astro` entirely**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import ProofStrip from '../components/ProofStrip.astro';
import QualcommCard from '../components/QualcommCard.astro';
import Projects from '../components/Projects.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
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
<BaseLayout>
  <Header />
  <main>
    <Hero />
    <ProofStrip />
    <QualcommCard />
    <Projects items={featured} cmd="ls projects/ --featured" title="Featured Projects" />
    <section class="section see-more">
      <div class="container">
        <a class="btn btn-ghost" href="/about">See full work &amp; background &rarr;</a>
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
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Add the small layout styles**

In `src/styles/global.css`, after the qualcomm-card rule from Task 5, add:

```css
/* home see-more + case-study callout */
.see-more { padding: 8px 0 0; }
.cs-callout-section { padding: 28px 0; }
.cs-callout .card-bar { justify-content: flex-end; }
```

- [ ] **Step 3: Tighten the "In 10 seconds" copy in Hero**

In `src/components/Hero.astro`, replace the quicklook `<p>` (lines 36-40) with a tightened version and add the `measure` class:

```astro
      <p class="measure">
        3+ years at Qualcomm building production firmware for ARM-based LTE / 5G modem
        platforms. Now I design and build complete embedded systems on STM32 and Linux —
        RTOS, drivers, bootloaders, CAN and BLE — each with architecture, debugging notes,
        and a validation plan.
      </p>
```

- [ ] **Step 4: Verify build + types**

Run: `npx astro check && npm run build`
Expected: 0 type errors; build succeeds and emits `dist/index.html`.

- [ ] **Step 5: Smoke-check the rendered home**

Run: `grep -c "proof-pill" dist/index.html && grep -c "Production firmware experience" dist/index.html && grep -c "ProjectCard\|proof-row" dist/index.html`
Expected: proof pills present (7), Qualcomm card present (1), proof-row footers present (the 4 featured cards each render rows). Confirm deep sections are gone: `grep -c "skills --grouped\|cat now.md\|engineering-style" dist/index.html` should be `0`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/components/Hero.astro src/styles/global.css
git commit -m "feat(home): recompose to skim layer (proof, qualcomm, 4 projects, case-study teaser)"
```

---

## Task 8: Reframe the AI section copy

**Files:**
- Modify: `src/components/AiEngineering.astro`

Reframe from "AI-assisted engineering" toward engineering-first maturity (rendered on `/about`).

- [ ] **Step 1: Update the heading title**

In `src/components/AiEngineering.astro`, change the `SectionHeader` title (line 26):

```astro
    <SectionHeader cmd="cat ai-native-workflow.md" title="Engineering-First, AI-Assisted" />
```

- [ ] **Step 2: Replace the intro paragraph**

Replace the first `<p>` in the intro card (lines 29-34) with:

```astro
      <p class="measure" style="margin-bottom:14px;">
        Spec-driven, documented, validation-first embedded development — with AI used as an
        engineering assistant for planning, review, documentation, and workflow acceleration.
        I'm an embedded engineer first: AI improves engineering discipline, it does not
        replace understanding of timing, memory, hardware constraints, RTOS behavior, and
        failure modes.
      </p>
```

- [ ] **Step 3: Verify**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AiEngineering.astro
git commit -m "feat(ai): reframe AI section as engineering-first"
```

---

## Task 9: New /about page + sticky sub-nav

**Files:**
- Create: `src/pages/about.astro`
- Modify: `src/styles/global.css`

`/about` assembles the deep sections behind a sticky sub-nav and sets its own `<title>`/`description` (crawlability hardening). Section components already carry the anchors `#experience`, `#projects`, `#skills`, `#ai`, `#education`, `#now`. The About intro card leads the page (unanchored).

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Skills from '../components/Skills.astro';
import EngineeringStyle from '../components/EngineeringStyle.astro';
import AiEngineering from '../components/AiEngineering.astro';
import Education from '../components/Education.astro';
import Now from '../components/Now.astro';
import Footer from '../components/Footer.astro';

const subnav = [
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'projects' },
  { href: '#skills', label: 'skills' },
  { href: '#ai', label: 'ai' },
  { href: '#education', label: 'education' },
];
---
<BaseLayout
  title="Karan Gandhi — Full Work & Background"
  description="Full experience, projects, skills, engineering style and AI-assisted workflow for Karan Gandhi, embedded firmware engineer (ex-Qualcomm)."
>
  <Header />
  <nav class="subnav" aria-label="On this page">
    <div class="container subnav-inner mono">
      <a class="subnav-home" href="/">cd ~/</a>
      {subnav.map((s) => <a class="subnav-link" href={s.href}>{s.label}</a>)}
    </div>
  </nav>
  <main class="about-page">
    <About />
    <Experience />
    <Projects cmd="ls projects/ --all" title="All Projects" />
    <Skills />
    <EngineeringStyle />
    <AiEngineering />
    <Education />
    <Now />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Add sub-nav styles + scroll offset**

In `src/styles/global.css`, after the home callout rules from Task 7, add:

```css
/* /about sticky sub-nav */
.subnav { position: sticky; top: 60px; z-index: 40; background: rgba(10,10,10,.85); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
.subnav-inner { display: flex; gap: 16px; align-items: center; height: 46px; font-size: 13px; overflow-x: auto; }
.subnav-home { color: var(--accent); }
.subnav-link { color: var(--muted); }
.subnav-link:hover, .subnav-home:hover { color: var(--text); text-decoration: none; }
.about-page section { scroll-margin-top: 120px; }
```

(The global `scroll-padding-top: 80px` covers the 60px header; `.about-page section { scroll-margin-top: 120px }` additionally clears the 46px sub-nav.)

- [ ] **Step 3: Verify build + types and that /about renders**

Run: `npx astro check && npm run build`
Expected: 0 errors; build emits `dist/about/index.html`.

- [ ] **Step 4: Smoke-check /about**

Run: `grep -c "subnav-link" dist/about/index.html && grep -c "All Projects\|ls projects/ --all" dist/about/index.html && grep -c "id=\"experience\"\|id=\"skills\"\|id=\"ai\"" dist/about/index.html`
Expected: sub-nav links present (5), full project list header present, deep-section anchors present. Confirm all 8 projects render: `grep -o "~/[a-z0-9-]*" dist/about/index.html | sort -u | wc -l` is ≥ 8.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/styles/global.css
git commit -m "feat(about): new depth page with sticky sub-nav"
```

---

## Task 10: Re-point the site header links

**Files:**
- Modify: `src/components/Header.astro`

The header renders on both pages; links must be root-absolute so they work from `/` and `/about`.

- [ ] **Step 1: Replace the logo + nav links**

In `src/components/Header.astro`, replace the logo `<a>` (line 7) and the `nav-links` block (lines 8-14) with:

```astro
    <a href="/" class="mono accent" style="font-weight:600;">karan@embedded</a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/about">about</a>
      <a href="/#projects">projects</a>
      <a href="/about#skills">skills</a>
      <a href="/about#experience">experience</a>
      <a href="/#contact">contact</a>
    </nav>
```

- [ ] **Step 2: Verify**

Run: `npx astro check && npm run build`
Expected: 0 errors; build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(header): use absolute links across home and /about"
```

---

## Task 11: BLE case study — summary box + standalone narrative

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/layouts/CaseStudyLayout.astro`
- Modify: `src/content/case-studies/ble-environmental-sensor-node.md`

- [ ] **Step 1: Add optional summary-box fields to the schema**

In `src/content/config.ts`, add three optional fields to the `caseStudies` schema (after `status: z.string(),`):

```ts
    role: z.string().optional(),
    coreWork: z.string().optional(),
    validation: z.string().optional(),
```

- [ ] **Step 2: Render the richer summary box in the layout**

In `src/layouts/CaseStudyLayout.astro`, extend the `Props` interface (after `status: string;`):

```ts
  role?: string;
  coreWork?: string;
  validation?: string;
```

Update the destructure (line 21):

```ts
const { title, summary, status, platform, stack, tags, repoUrl, role, coreWork, validation, headings = [] } = Astro.props;
```

Replace the `<dl class="cs-facts mono">` block (lines 37-41) with:

```astro
      <dl class="cs-facts mono">
        {role && <div><dt>role</dt><dd>{role}</dd></div>}
        <div><dt>platform</dt><dd>{platform}</dd></div>
        {coreWork && <div><dt>core work</dt><dd>{coreWork}</dd></div>}
        {validation && <div><dt>validation</dt><dd>{validation}</dd></div>}
        <div><dt>status</dt><dd>{status}</dd></div>
        <div><dt>stack</dt><dd>{stack.join(' · ')}</dd></div>
      </dl>
```

- [ ] **Step 3: Pass the new fields through the dynamic route**

In `src/pages/projects/[slug].astro`, update the destructure (line 15) and the `<CaseStudyLayout>` props:

```astro
const { title, summary, status, platform, stack, tags, repoUrl, role, coreWork, validation } = entry.data;
```

Add to the `<CaseStudyLayout … >` open tag (after `repoUrl={repoUrl}`):

```astro
  role={role}
  coreWork={coreWork}
  validation={validation}
```

- [ ] **Step 4: Add the summary-box frontmatter to the BLE case study**

In `src/content/case-studies/ble-environmental-sensor-node.md`, add to the frontmatter (after the `status:` line):

```yaml
role: 'Firmware + Android companion app + documentation + validation'
coreWork: 'Custom GATT profile, notifications, MITM passkey pairing, sensor override, TinyML classification'
validation: '62 Unity tests, 25-case manual matrix, nRF Connect verification'
```

- [ ] **Step 5: Add the standalone narrative section as the lead debugging section**

In the same markdown file, insert the new section **immediately before** `## Debugging challenges` (line 121). Use the design's verbatim narrative, formatted into paragraphs:

```markdown
## Rapid BLE Bring-Up and I2C Sensor Validation

This project began as a focused two-week BLE learning sprint. I learned BLE fundamentals, implemented a custom GATT-based environmental sensor node on ESP32-C3 using ESP-IDF and NimBLE, documented the architecture, and prepared a working demo with OLED display feedback.

During a live hardware integration exercise, I extended the project from simulated temperature values to a real I2C temperature sensor. The firmware integration path was correct, but the first sensor did not respond during I2C address discovery.

I debugged the issue systematically instead of assuming a code problem. I verified the wiring and electrical connections with a multimeter, scanned the full valid I2C address range, and tested the address-select line in multiple configurations: pulled high, floating, and connected to ground. The sensor still did not acknowledge on the bus.

After receiving a replacement sensor, I configured the address-select line to 3.3V, repeated the integration, and the new sensor responded correctly. I completed the firmware integration and demonstrated live temperature readings flowing from the I2C sensor into the BLE data path.

I also independently configured an unfamiliar logic analyzer, installed the required software, connected the probes, captured I2C transactions, and identified where the temperature data was transferred on the bus.

This exercise validated my ability to learn quickly, integrate real hardware under pressure, debug firmware-versus-hardware issues systematically, and use unfamiliar lab tools independently.

```

(Do **not** add an "18 failed pairing attempts" home/summary callout — the existing Phase 8 debugging detail stays where it is. Keep all existing detailed sections.)

- [ ] **Step 6: Verify build + types**

Run: `npx astro check && npm run build`
Expected: 0 errors; build emits `dist/projects/ble-environmental-sensor-node/index.html`.

- [ ] **Step 7: Smoke-check the case study**

Run: `grep -c "core work\|Rapid BLE Bring-Up" dist/projects/ble-environmental-sensor-node/index.html`
Expected: ≥ 2 — the summary-box "core work" row and the new narrative heading both render.

- [ ] **Step 8: Commit**

```bash
git add src/content/config.ts src/layouts/CaseStudyLayout.astro src/pages/projects/\[slug\].astro src/content/case-studies/ble-environmental-sensor-node.md
git commit -m "feat(case-study): BLE summary box + rapid bring-up narrative"
```

---

## Task 12: Typography & spacing

**Files:**
- Modify: `src/styles/global.css`

Apply the design's typography/spacing edits, preserving the terminal aesthetic.

- [ ] **Step 1: Add the `measure` helper and bump paragraph sizes**

In `src/styles/global.css`, after the `.muted`/`.accent` helpers (line 33), add:

```css
.measure { max-width: 70ch; }
```

Change `.card-body p` (line 86) font-size `14px` → `15px`:

```css
.card-body p { font-size: 15px; color: #b6bfca; }
```

Change `.quicklook p` (line 121) font-size `14px` → `15px` and constrain measure:

```css
.quicklook p { font-size: 15px; color: #b6bfca; max-width: 70ch; }
```

- [ ] **Step 2: Bump section heading + section padding**

Change `.sec-head h2` (line 47) font-size `22px` → `26px`:

```css
.sec-head h2 { font-family: var(--font-sans); font-size: 26px; letter-spacing: -0.01em; font-weight: 700; }
```

> Note: `.sec-head h2` is `sr-only` (visually hidden); the visible label is the mono prompt. This change satisfies the design literally and helps assistive tech. The visible mono heading size is `.sec-head { font-size: 15px }` — leave as-is unless Karan asks for a larger visible label.

Change `.section` padding (line 41) `64px` → `80px` (keep the mobile reduction on line 42 unchanged):

```css
.section { padding: 80px 0; }
```

- [ ] **Step 3: Increase case-study prose line-height**

Change `.cs-body p` (line 170) to add line-height and a readable measure:

```css
.cs-body p { color: #c2cad4; margin: 12px 0; line-height: 1.75; max-width: 70ch; }
```

> Note: `.cs-body` already has `max-width: 820px`; the `70ch` measure on `<p>` tightens prose specifically while diagrams/images (`.cs-body img`) keep their own widths.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "style: typography + spacing per skim restructure design"
```

---

## Task 13: Sitemap (crawlability hardening)

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via install)

`site` is already set, so `@astrojs/sitemap` auto-generates a sitemap for `/`, `/about`, and the case-study route.

- [ ] **Step 1: Install the integration**

Run: `npm install @astrojs/sitemap`
Expected: adds `@astrojs/sitemap` to `dependencies`. (If npm is unavailable in the execution environment, surface that and stop — do not fake the install.)

- [ ] **Step 2: Wire it into the config**

Edit `astro.config.mjs` to import and register the integration:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://karangandhi.dev',
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 3: Verify the sitemap is emitted**

Run: `npm run build && ls dist/sitemap-index.xml dist/sitemap-0.xml`
Expected: both files exist; `grep -c "karangandhi.dev/about" dist/sitemap-0.xml` returns ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat(seo): generate sitemap"
```

---

## Task 14: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS — all data + command tests green (including the updated featured/footer and nav assertions).

- [ ] **Step 2: Type-check and build**

Run: `npx astro check && npm run build`
Expected: 0 errors; `dist/` contains `index.html`, `about/index.html`, `projects/ble-environmental-sensor-node/index.html`, and the sitemap files.

- [ ] **Step 3: Cross-page link sanity**

Run: `grep -o 'href="/about[^"]*"' dist/index.html | sort -u`
Expected: includes `/about` (see-more + header) and the Qualcomm `/about#experience` link. Then `grep -o 'href="/#[a-z]*"\|href="#[a-z]*"' dist/about/index.html | sort -u` should show the header's `/#projects` and `/#contact` resolve back to home.

- [ ] **Step 4: Manual review checklist (open `npm run dev` if available)**

Confirm visually:
- Home is ~one screen before the project grid; only 4 project cards, each with a dashed proof footer.
- Proof pills and Qualcomm card render high.
- AI/Skills/full Experience/Education/Now are **absent** from home, **present** on `/about`.
- `/about` sticky sub-nav jumps to each section without the header overlapping the heading.
- BLE case study shows the role/core-work/validation summary rows and the "Rapid BLE Bring-Up and I2C Sensor Validation" section above "Debugging challenges".

- [ ] **Step 5: Final commit (if any verification fixups were needed)**

```bash
git add -A
git commit -m "chore: verification fixups for skim restructure"
```

---

## Self-review (spec coverage)

- Skim home order (Hero → proof → Qualcomm → 4 projects → /about link → BLE callout → contact) — Tasks 4, 5, 7.
- Deep `/about` with sticky sub-nav + full experience/projects(8)/skills/ai/education/now — Tasks 6, 8, 9.
- 4 featured projects, `stm32-virtual-vehicle-ecu` de-duplicated + moved off home — Task 1.
- Project proof footer (status/validation/evidence), graceful degrade — Tasks 1, 3.
- BLE flagship blurb on home card — Task 1.
- AI section reframe on /about — Task 8.
- BLE case-study summary box + standalone I2C narrative, no "18 failed pairings" callout — Task 11.
- Typography/spacing (15px body, 26px sec-head, 1.75 cs prose, 70ch measure, 80px sections) — Task 12.
- Crawlability hardening: per-page `/about` + case-study `<title>`/`description` (Tasks 9, 11 via BaseLayout) + sitemap (Task 13).
- Nav repoint to `/about#…`, header absolute links — Tasks 2, 10.

**Deferred to Karan (design open items, implemented as clearly-marked drafts so work isn't blocked):** non-BLE `status`/`validation`/`evidence` wording (Task 1, drafted from repo data), and exact Canadian-PR / relocation wording (Contact already states "based in Canada (Canadian PR) and India"; left unchanged pending Karan's confirmed wording — adjust in `src/components/Contact.astro` if changed).
