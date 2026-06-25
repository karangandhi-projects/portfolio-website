# Portfolio Skim-Layer Restructure — Design

**Date:** 2026-06-25
**Status:** Approved design, pending implementation plan
**Project:** `portfolio-website` (Astro static site)

## Problem

Live reviews of the terminal-themed portfolio agree on one thing: the **aesthetic and
the depth are strong, but the content is too dense to skim**. Today the site is a single
long page stacking ten sections (Hero → About → Projects → Skills → EngineeringStyle →
AiEngineering → Experience → Education → Now → Contact), navigated only by anchor-scroll
chips. Specific problems:

- Too much scrolling; navigation through one mega-page is tedious.
- No fast "skim layer" for a recruiter doing a 20-second scan.
- Qualcomm experience (the biggest trust signal) is buried low.
- Too many projects shown; two ECU projects look like duplicates.
- Project cards don't show what's *real* (status / evidence / validation).
- AI-assisted engineering dominates the first impression more than it should.
- Body text/headings feel small; long paragraphs run too wide.

**Goal:** Keep the depth and the aesthetic. Add a sharp hierarchy so the flow is
*Hero → proof → Qualcomm → 4 projects → one case study → contact*, with all depth one
click away. No new content burden beyond what's specified here.

## Chosen approach — Hybrid (skim home + depth on /about)

Selected over (A) one tightened collapsible page and (B) full multi-page routing.

- **Home page = pure skim layer**, roughly one screen of meaningful content before the
  fold, then 4 projects and a case-study teaser.
- **`/about` page = all the depth** (full experience, full project list, skills, AI,
  education/now), with a small sticky sub-nav so it is jump-able, not a scroll-slog.
- **Case studies stay at `/projects/[slug]`** as today.

This most directly delivers the reviewers' prescribed flow while giving the depth a real
home instead of cramming it onto one page.

## Information architecture

### Home (`/index.astro`)

Order:

1. **Hero** — unchanged (whoami, title, tech logos, command nav).
2. **Proof strip** — NEW. Style: inline terminal pills rendered like `cat proof.txt`
   output. Facts only from `experience.ts`:
   - `3 yrs Qualcomm firmware` · `LTE / 5G modem` · `RTOS · drivers · power` ·
     `~30% faster crash-log debug` · `STM32 · BLE · Linux driver projects` ·
     `validation-first` · `open to roles`
   - Explicitly **no** "1000+ crash logs" (not in data). No PR line here.
3. **"In 10 seconds"** — kept, tightened.
4. **Qualcomm credibility card** — NEW, pulled high (right after the 10-seconds block).
   Mini card from the real `experience.ts` summary: "Production firmware experience —
   Qualcomm: ARM-based LTE/5G modem firmware covering RTOS, low-level drivers, power
   management, crash-log debugging, and on-target integration testing." Full details
   live on `/about`.
5. **4 featured projects** — see below, each with a Status/Validation/Evidence footer.
6. **Link to `/about`** — "See full work & background →".
7. **Featured case-study callout** — BLE, links to `/projects/ble-environmental-sensor-node`.
8. **Contact** — includes the "Canadian PR / open to relocation" line.

`AiEngineering`, `Skills`, full `Experience`, `Education`, `Now` are **removed from home**.

### `/about` (new page)

Sticky sub-nav (`experience · projects · skills · ai · education`) over:

1. **Full experience** — both `experiences[]` entries in full.
2. **Full project list** — all 8 projects. `bluetooth-audio-manager-linux` labeled
   "Linux utility / automation". `stm32-virtual-vehicle-ecu` gets a one-line note
   distinguishing it from `mini-ecu-v2` (vehicle-behavior simulation focus) so they do
   not read as duplicates.
3. **Skills**.
4. **AI-assisted engineering** — reframed (see below).
5. **Education / Now**.

### Navigation

The terminal command-nav (`nav.ts` / `CommandNav.astro`) updates so depth commands point
to `/about#section` instead of same-page anchors; `projects` → home grid; `resume`
unchanged. Smooth-scroll/anchor behavior preserved within each page.

## Featured projects (home)

Four cards: `ble-environmental-sensor-node`, `mini-ecu-v2`, `vnet-driver`,
`stm32-smart-sensor-hub`. `stm32-virtual-vehicle-ecu` moves to the `/about` full list
(not featured on home).

### Project proof footer

Add three optional fields to the `Project` type in `projects.ts`:

- `status` — e.g. "v1.0 working prototype", "working driver".
- `validation` — how it was proven (tests, tooling, on-target checks).
- `evidence` — what a reviewer can inspect (GitHub, README, arch docs, screenshots,
  case study).

Rendered as a dashed-off footer in `ProjectCard.astro`. Footer degrades gracefully when a
project has no formal test suite. Values are drafted truthfully from each repo's README and
**reviewed/corrected by Karan before shipping**. For BLE, validation uses the real numbers
(62 Unity tests, 25-case manual matrix, nRF Connect verification).

### BLE card description (flagship)

The BLE home card uses Karan's full ~70-word blurb (longer than the other three cards is
acceptable — it is the flagship):

> "Learned BLE from scratch and built a working ESP32-C3 BLE environmental sensor node
> within two weeks. Extended the project from simulated data to a real I2C temperature
> sensor, systematically isolated a non-responsive sensor using address scanning,
> multimeter checks, address-line testing, and replacement comparison, then demonstrated
> live temperature readings over BLE. Independently captured I2C bus transactions using an
> unfamiliar logic analyzer."

## AI section reframe (on /about)

Reframe from "AI-assisted engineering" toward engineering-first maturity:

> "Spec-driven, documented, validation-first embedded development, with AI used as an
> engineering assistant for planning, review, documentation, and workflow acceleration."

Message: embedded engineer first; AI improves engineering discipline, not a replacement for
understanding.

## BLE case study polish (`/projects/[slug]`)

1. **Summary box at top** — Role / Platform / Core work / Validation / Status:
   - Role: Firmware + Android companion app + documentation + validation
   - Platform: ESP32-C3, ESP-IDF, NimBLE, SSD1306 OLED
   - Core work: Custom GATT profile, notifications, MITM passkey pairing, sensor
     override, TinyML classification
   - Validation: 62 Unity tests, 25-case manual matrix, nRF Connect verification
   - Status: v1.0 working prototype
2. **New standalone section — "Rapid BLE Bring-Up and I2C Sensor Validation"** — Karan's
   full narrative, verbatim, lightly formatted into paragraphs, positioned as the lead
   debugging section:

   > This project began as a focused two-week BLE learning sprint. I learned BLE
   > fundamentals, implemented a custom GATT-based environmental sensor node on ESP32-C3
   > using ESP-IDF and NimBLE, documented the architecture, and prepared a working demo
   > with OLED display feedback.
   >
   > During a live hardware integration exercise, I extended the project from simulated
   > temperature values to a real I2C temperature sensor. The firmware integration path
   > was correct, but the first sensor did not respond during I2C address discovery.
   >
   > I debugged the issue systematically instead of assuming a code problem. I verified the
   > wiring and electrical connections with a multimeter, scanned the full valid I2C
   > address range, and tested the address-select line in multiple configurations: pulled
   > high, floating, and connected to ground. The sensor still did not acknowledge on the
   > bus.
   >
   > After receiving a replacement sensor, I configured the address-select line to 3.3V,
   > repeated the integration, and the new sensor responded correctly. I completed the
   > firmware integration and demonstrated live temperature readings flowing from the I2C
   > sensor into the BLE data path.
   >
   > I also independently configured an unfamiliar logic analyzer, installed the required
   > software, connected the probes, captured I2C transactions, and identified where the
   > temperature data was transferred on the bus.
   >
   > This exercise validated my ability to learn quickly, integrate real hardware under
   > pressure, debug firmware-versus-hardware issues systematically, and use unfamiliar lab
   > tools independently.

3. Keep all existing detailed sections; break long paragraphs for readability.
4. The reviewer's "18 failed pairing attempts" callout is **not** included (unverified).

## Typography & spacing

Edits in `global.css`, preserving the terminal aesthetic, colors, and cursor:

- Component paragraph text `14px → 15px` (e.g. `.card-body p`, comment lines).
- Case-study prose line-height `1.6 → ~1.75`.
- Section heading `.sec-head h2` `22px → 26px`.
- Constrain long prose blocks to a `~70ch` measure (currently runs the full 1040px).
- Increase whitespace between major sections (`.section` padding `64px → 80px`;
  keep the existing mobile reduction).

## Technical / crawlability — verified, no fix required

Investigated the reviewer's "almost no accessible text" concern. The site is **static,
server-rendered HTML** (Astro default static output). Findings:

- No JS gating of content; only client JS is `CommandNav` keydown handling.
- No content-hiding animation — no `opacity:0` reveals or IntersectionObserver; only the
  CSS cursor blink. A `prefers-reduced-motion` reset already exists.
- `<title>`, meta description, canonical, and OG/Twitter tags present; `site` is set to
  `https://karangandhi.dev`.

Conclusion: the concern is a false alarm (likely an incomplete external fetch). **Light
hardening still in scope:** per-page `<title>` / `description` for `/about` and case-study
pages, and a generated `sitemap`.

## Components affected (existing-codebase notes)

- `src/pages/index.astro` — re-composed to the skim order; drops deep sections.
- `src/pages/about.astro` — NEW page assembling the deep sections + sticky sub-nav.
- `src/components/ProofStrip.astro` — NEW (pills).
- `src/components/QualcommCard.astro` — NEW (or a small Hero/Experience variant).
- `src/components/ProjectCard.astro` — add Status/Validation/Evidence footer.
- `src/data/projects.ts` — add `status` / `validation` / `evidence` fields; set featured
  set to the four; add distinguishing note to `stm32-virtual-vehicle-ecu`; BLE blurb.
- `src/data/nav.ts` / `src/components/CommandNav.astro` — repoint depth commands to
  `/about#…`.
- `src/components/AiEngineering.astro` — reframed copy; rendered on `/about`.
- `src/content/case-studies/ble-environmental-sensor-node.md` — summary box + new section.
- `src/layouts/CaseStudyLayout.astro` — support the summary box; prose measure.
- `src/styles/global.css` — typography/spacing tokens.

## Out of scope (YAGNI)

- No full multi-page router beyond `/about` (case studies already separate).
- No redesign of colors/terminal chrome.
- No new projects or fabricated metrics.
- No CMS or content-collection restructure beyond the BLE case-study edits.

## Open items for Karan's spec review

- Confirm the I2C narrative interpretation (full standalone section, no pairing-failures
  callout).
- Provide/confirm truthful `status` / `validation` / `evidence` strings for the non-BLE
  featured projects.
- Confirm the exact Canadian PR / relocation wording for the contact section.
