# Engineering Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Engineering Blog to the portfolio — a unified, newest-first feed of articles and short notes that inherits the existing terminal aesthetic, with a dedicated post layout and the first real post wired in.

**Architecture:** A new Astro content collection `blog` (sibling to `case-studies`) drives `/blog` (a feed of terminal-styled cards) and `/blog/[slug]` (each post rendered via a new `BlogPostLayout`). Navigation gains a `blog` tab between `ai` and `about` plus a command chip. Reading time is auto-estimated by a small unit-tested helper. All visuals reuse existing `global.css` classes (`.card`, `.cs-body`, `.cs-toc`, `.tag`) — only a handful of new blog-specific styles are added.

**Tech Stack:** Astro 4 content collections, TypeScript, Vitest (unit tests for data/helpers), existing terminal CSS.

**Spec:** `docs/superpowers/specs/2026-06-26-engineering-blog-design.md`

---

## File Structure

**Create:**
- `src/lib/readingTime.ts` — word-count → "N min read" helper (unit-testable)
- `src/lib/readingTime.test.ts` — its tests
- `src/content/blog/what-building-a-small-rtos-taught-me-about-debugging.md` — first post
- `src/layouts/BlogPostLayout.astro` — dedicated post layout (light header, conditional TOC)
- `src/pages/blog/index.astro` — the unified feed
- `src/pages/blog/[slug].astro` — per-post route
- `src/components/BlogCard.astro` — one terminal card in the feed

**Modify:**
- `src/data/sections.ts` — add `'blog'` SectionKey + tab between `ai` and `about`
- `src/data/sections.test.ts` — update expected tabs
- `src/data/nav.ts` — add the `blog` command chip
- `src/content/config.ts` — define the `blog` collection schema
- `src/styles/global.css` — add blog badge / feed / meta styles

---

## Task 1: Add the `blog` nav tab

**Files:**
- Modify: `src/data/sections.ts`
- Test: `src/data/sections.test.ts`

- [ ] **Step 1: Update the failing test for the new tab order**

In `src/data/sections.test.ts`, replace the first `it` block:

```ts
  it('exposes the seven top-level tabs in order', () => {
    expect(sections.map((s) => s.key)).toEqual([
      'home', 'experience', 'projects', 'skills', 'ai', 'blog', 'about',
    ]);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/data/sections.test.ts`
Expected: FAIL — received array is missing `'blog'`.

- [ ] **Step 3: Add `blog` to the SectionKey type and the tabs list**

In `src/data/sections.ts`, update the type:

```ts
export type SectionKey = 'home' | 'experience' | 'projects' | 'skills' | 'ai' | 'blog' | 'about';
```

And insert the tab between `ai` and `about` in the `sections` array:

```ts
  { key: 'ai', label: 'ai', href: '/ai' },
  { key: 'blog', label: 'blog', href: '/blog' },
  { key: 'about', label: 'about', href: '/about' },
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/data/sections.test.ts`
Expected: PASS (both `sections` and `crumbsFor` describe blocks green).

- [ ] **Step 5: Commit**

```bash
git add src/data/sections.ts src/data/sections.test.ts
git commit -m "feat(blog): add blog nav tab between ai and about"
```

---

## Task 2: Add the `blog` command chip

**Files:**
- Modify: `src/data/nav.ts`

- [ ] **Step 1: Add the command**

In `src/data/nav.ts`, insert into the `commands` array right after the `ai` entry:

```ts
  { cmd: 'ai', label: 'ai', target: '/ai' },
  { cmd: 'blog', label: 'blog', target: '/blog' },
  { cmd: 'experience', label: 'experience', target: '/experience' },
```

- [ ] **Step 2: Commit**

```bash
git add src/data/nav.ts
git commit -m "feat(blog): add blog command chip to nav"
```

---

## Task 3: Define the `blog` content collection

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Add the `blog` collection schema**

Replace the entire contents of `src/content/config.ts` with:

```ts
import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.string(),
    role: z.string().optional(),
    coreWork: z.string().optional(),
    validation: z.string().optional(),
    platform: z.string(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    repoUrl: z.string().url(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['article', 'note']),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  'blog': blog,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat(blog): define blog content collection schema"
```

---

## Task 4: Reading-time helper (TDD)

**Files:**
- Create: `src/lib/readingTime.ts`
- Test: `src/lib/readingTime.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/readingTime.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from './readingTime';

describe('estimateReadingTime', () => {
  it('rounds up to whole minutes at 200 wpm', () => {
    const text = Array(201).fill('word').join(' '); // 201 words
    expect(estimateReadingTime(text)).toBe('2 min read');
  });

  it('never returns less than 1 min', () => {
    expect(estimateReadingTime('short')).toBe('1 min read');
  });

  it('ignores leading/trailing and repeated whitespace', () => {
    expect(estimateReadingTime('  one   two  ')).toBe('1 min read');
  });

  it('handles an empty string as 1 min', () => {
    expect(estimateReadingTime('')).toBe('1 min read');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/readingTime.test.ts`
Expected: FAIL — "Failed to resolve import './readingTime'" / `estimateReadingTime is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/readingTime.ts`:

```ts
const WORDS_PER_MINUTE = 200;

/** Estimate reading time from raw text/markdown, e.g. "10 min read". */
export function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/lib/readingTime.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/readingTime.ts src/lib/readingTime.test.ts
git commit -m "feat(blog): add reading-time estimator helper"
```

---

## Task 5: Add the first blog post

**Files:**
- Create: `src/content/blog/what-building-a-small-rtos-taught-me-about-debugging.md`

Note: the leading `# ...` H1 from the supplied draft is intentionally omitted — `BlogPostLayout` renders the title H1 from frontmatter, and the body must start at `##` so the auto-generated TOC is correct.

- [ ] **Step 1: Create the post file**

Create `src/content/blog/what-building-a-small-rtos-taught-me-about-debugging.md` with exactly:

```markdown
---
title: 'What Building a Small RTOS Taught Me About Debugging'
slug: 'what-building-a-small-rtos-taught-me-about-debugging'
summary: "Building a small RTOS on a Cortex-M4 taught me that firmware debugging isn't about finding the wrong line — it's about understanding system behavior over time."
kind: 'article'
date: 2026-06-26
tags: ['rtos', 'debugging', 'firmware', 'embedded', 'cortex-m']
draft: false
---

During my master's program, I took a course called **EE-6314 Real-Time Operating Systems**.

As part of the course, I built a small RTOS in C for the TM4C123GH6PM, an ARM Cortex-M4F microcontroller. It was not a production RTOS. It was a learning project meant to help us understand how an RTOS works under the hood.

The project had a cooperative and preemptive scheduler, priority-based scheduling, round-robin scheduling, semaphores, thread sleep and deletion, system calls, and a UART shell to inspect the system while it was running.

Looking back, it was very much a student project. Most of the implementation lived in one C file. If I were writing it today, I would separate the scheduler, synchronization code, shell, hardware setup, and demo tasks into cleaner modules.

But at the time, keeping everything together also forced me to stay close to the whole system. I had to see how the pieces interacted with each other.

That project was one of the first times I realized something important:

**Embedded debugging is hard because system behavior is hard to observe.**

## When the code runs, but the behavior is wrong

One part of the course was designed to teach us about priority inversion.

Priority inversion happens when a high-priority task is waiting for a resource held by a lower-priority task. If other tasks keep running in between, the high-priority task may not run when we expect it to. Priority inheritance helps by temporarily raising the priority of the task holding the resource.

When this is explained in a diagram, it feels simple.

But when it happens inside your own RTOS, it feels very different.

I remember trying to understand why a high-priority task was not running as often as it should. The system was not completely broken. Tasks were running. The shell was working. Some parts looked correct.

But the timing behavior was wrong.

So I did what many firmware engineers do during debugging.

I stared at logs.
I added more prints.
I checked which function was running.
I looked at timing.
I checked registers.
I ran the same case again.
I doubted the hardware.
Then I doubted my own code.

The hard part was not finding one obvious wrong line.

The hard part was understanding how tasks, priorities, resources, and timing were interacting over time.

That stayed with me.

## Logs help, but they do not show everything

I use logs a lot. Logs are useful. They are often the first thing I check when something fails.

But logs usually show only small parts of the system.

They can tell me what message was printed. They may tell me when it was printed. They may tell me which module printed it.

But many embedded problems need a deeper question:

**What was the system doing before the failure became visible?**

That question is harder to answer.

In embedded systems, failures often come from interactions. A task may miss its timing requirement. A resource may be locked for too long. A queue may slowly fill up. An interrupt may happen more often than expected. A state machine may enter a path that looks valid but still causes bad behavior later.

The visible symptom is not always close to the real cause.

This is why problems like race conditions and priority inversion are difficult. They are not always captured clearly by one log line. They happen because of timing, order, scheduling, and shared resources.

By the time the system fails, the most important part may have already happened.

## Debugging is really about understanding behavior

Over time, my debugging process became more systematic.

First, reproduce the issue. Then isolate the area. Add logs only where needed. Check the hardware. Check timing. Check the state of the system. Check the implementation. Try a known working example if one is available. Compare the differences. Form a hypothesis. Then test it.

This sounds simple when written down.

In practice, it can take time.

That is what I find both frustrating and interesting about embedded debugging. When I do not understand why the system failed, it feels like I am only seeing the tip of the problem. The logs may show me the symptom, but not the full behavior that caused it.

At the same time, I enjoy debugging. It feels like solving a puzzle. When the root cause finally becomes clear, there is a small Eureka moment. The system that looked confusing suddenly starts to make sense.

But the time it takes to reach that point matters.

In real projects, debugging time affects schedules, confidence, and reliability. Some bugs are especially hard because the system may look fine most of the time. Then one timing issue, one ordering issue, or one resource-sharing issue exposes the problem.

That is also why the Mars Pathfinder priority inversion example stayed with me when my professor discussed it. A small scheduling or resource-sharing issue can look harmless at first, but over time it can affect a mission-critical system.

The lesson was not just "use priority inheritance."

The bigger lesson was that system behavior matters.

## What I started thinking about

That RTOS project changed how I think about firmware debugging.

Earlier, I thought of debugging mostly as finding the wrong line of code.

Now I think of it more as understanding system behavior.

What was running?
What was blocked?
Which resource was held?
Which task was waiting?
What happened before the symptom?
What changed over time?
Which assumption was wrong?

These questions are not always easy to answer from normal logs.

This is the area I have been thinking about more recently: how firmware behavior can be made easier to observe and understand.

I am interested in looking at embedded systems through behavior over time: tasks, events, resources, memory, timing, synchronization, and state changes. Not just as separate log messages, but as connected parts of one system.

I am also exploring the idea of controlled failure scenarios. Before any debugging or observability idea can be useful, I think it should be tested against known failures. That means creating cases where timing issues, blocked tasks, resource contention, synchronization problems, or state-machine issues can be reproduced and studied.

The goal is not to collect endless data.

More data can easily become more noise.

The goal is to collect the right information so an engineer can move faster from symptom to understanding.

## The takeaway

Building a small RTOS taught me that firmware debugging is not only about code correctness.

A system can compile. Individual functions can look correct. Logs can look normal. But the runtime behavior can still be wrong because of timing, scheduling, synchronization, or resource interactions.

That is the part I find most interesting.

Logs are useful, but firmware debugging needs better ways to reason about behavior over time.

The more embedded projects I worked on, the more I realized that debugging is not just about finding the wrong line of code.

It is about understanding the system behavior.

---

**Project reference:** [EE-6314 RTOS – TM4C123GH6PM Course Project](https://github.com/karangandhi-projects/EE-6314-RTOS)
```

- [ ] **Step 2: Commit**

```bash
git add src/content/blog/what-building-a-small-rtos-taught-me-about-debugging.md
git commit -m "content(blog): add first post — RTOS debugging"
```

---

## Task 6: Blog theme CSS

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append the blog styles**

Add this block at the end of `src/styles/global.css` (after the existing themed-headings rule on the last line):

```css
/* blog feed + post */
.blog-feed { display: flex; flex-direction: column; gap: 14px; }
.blog-badge {
  font-family: var(--font-mono); font-size: 11px; padding: 3px 9px; border-radius: 6px;
  color: var(--accent); background: var(--accent-soft);
}
.blog-badge-note { color: var(--blue); background: rgba(88, 166, 255, .12); }
.card-bar .blog-badge { margin-left: auto; }
.blog-card-title { font-size: 17px; margin-bottom: 6px; letter-spacing: -0.01em; }
.blog-card-meta { font-size: 12px; color: var(--muted); margin-top: 10px; display: flex; gap: 8px; }
.blog-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); margin: 14px 0 4px; }
.blog-meta .blog-badge { margin: 0; }
.blog-meta-sep { color: var(--border); }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style(blog): add blog feed, card, and badge styles"
```

---

## Task 7: BlogPostLayout

**Files:**
- Create: `src/layouts/BlogPostLayout.astro`

This mirrors `CaseStudyLayout.astro`'s structure and TOC scroll-spy, but with a lighter header (date · reading time · tags, no project facts) and a TOC shown only for `kind: 'article'`. The `cs-grid` two-column class is applied only when a TOC is present, so notes (no TOC) render full-width.

- [ ] **Step 1: Create the layout**

Create `src/layouts/BlogPostLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';
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
  kind: 'article' | 'note';
  date: Date;
  tags: string[];
  readingTime: string;
  slug: string;
  headings?: Heading[];
}
const { title, summary, kind, date, tags, readingTime, slug, headings = [] } = Astro.props;
const pageTitle = `${title} — Blog — Karan Gandhi`;
const toc = kind === 'article' ? headings.filter((h) => h.depth === 2 || h.depth === 3) : [];
const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const crumbs: Crumb[] = [
  { label: '~', href: '/' },
  { label: 'blog', href: '/blog' },
  { label: slug },
];
---
<BaseLayout title={pageTitle} description={summary}>
  <SiteNav current="blog" crumbs={crumbs} />
  <main class={`container cs${toc.length > 0 ? ' cs-grid' : ''}`}>
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
            <span class="prompt">karan@embedded</span>:<span class="out">~/blog</span><span class="prompt">$</span> grep '^##' post.md
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
          <span class="accent">karan@embedded</span>:<span class="out">~/blog/</span><span class="prompt">cat post.md</span>
        </div>
        <h1>{title}</h1>
        <p class="cs-summary">{summary}</p>

        <div class="blog-meta mono">
          <span class={`blog-badge${kind === 'note' ? ' blog-badge-note' : ''}`}>{kind}</span>
          <span class="blog-meta-sep">·</span>
          <span>{dateStr}</span>
          <span class="blog-meta-sep">·</span>
          <span>{readingTime}</span>
        </div>

        <div class="cs-tags">
          {tags.map((t) => <span class="tag">{t}</span>)}
        </div>
      </header>

      <article class="cs-body">
        <slot />
      </article>

      <a class="cs-back mono" href="/blog">← back to all posts</a>
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

- [ ] **Step 2: Type-check the layout**

Run: `npm run check`
Expected: PASS — no type errors. (If `astro check` cannot run in this environment, defer to the build in Task 11.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BlogPostLayout.astro
git commit -m "feat(blog): add BlogPostLayout with light header and conditional TOC"
```

---

## Task 8: Blog post route

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create the route**

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import { estimateReadingTime } from '../../lib/readingTime';

export async function getStaticPaths() {
  const entries = await getCollection('blog', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await entry.render();
const { title, summary, kind, date, tags, readingTime } = entry.data;
const computedReadingTime = readingTime ?? estimateReadingTime(entry.body);
---
<BlogPostLayout
  title={title}
  summary={summary}
  kind={kind}
  date={date}
  tags={tags}
  readingTime={computedReadingTime}
  slug={entry.slug}
  headings={headings}
>
  <Content />
</BlogPostLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/\[slug\].astro
git commit -m "feat(blog): add per-post route"
```

---

## Task 9: BlogCard component

**Files:**
- Create: `src/components/BlogCard.astro`

- [ ] **Step 1: Create the card**

Create `src/components/BlogCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'blog'>; readingTime: string; }
const { post, readingTime } = Astro.props;
const { title, summary, kind, date, tags } = post.data;
const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<a class="card" href={`/blog/${post.slug}`} aria-label={`${title} — read post`}>
  <div class="card-bar">
    <span class="path"><span class="dir">~/blog/</span>{post.slug}.md</span>
    <span class={`blog-badge${kind === 'note' ? ' blog-badge-note' : ''}`}>{kind}</span>
  </div>
  <div class="card-body">
    <h3 class="blog-card-title">{title}</h3>
    <p>{summary}</p>
    <div class="blog-card-meta mono">
      <span>{dateStr}</span>
      <span class="blog-meta-sep">·</span>
      <span>{readingTime}</span>
    </div>
    <div style="margin-top:12px;">
      {tags.map((t) => <span class="tag">{t}</span>)}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BlogCard.astro
git commit -m "feat(blog): add BlogCard for the feed"
```

---

## Task 10: Blog index page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create the feed page**

Create `src/pages/blog/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';
import { estimateReadingTime } from '../../lib/readingTime';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<PageLayout
  current="blog"
  title="Karan Gandhi — Blog"
  description="Engineering blog by Karan Gandhi — long-form writeups and short notes on firmware, RTOS internals, and embedded debugging."
>
  <section class="section">
    <div class="container">
      <SectionHeader cmd="ls blog/ --all" title="Engineering Blog" />
      {posts.length === 0 ? (
        <p class="muted mono">No posts yet.</p>
      ) : (
        <div class="blog-feed">
          {posts.map((post) => (
            <BlogCard post={post} readingTime={post.data.readingTime ?? estimateReadingTime(post.body)} />
          ))}
        </div>
      )}
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(blog): add blog index feed page"
```

---

## Task 11: Full verification

**Files:** none (verification + final state)

- [ ] **Step 1: Run the unit test suite**

Run: `npm test`
Expected: PASS — all suites green, including `sections.test.ts` (seven tabs) and `readingTime.test.ts` (4 tests).

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors. (If unavailable in this environment, rely on the build step.)

- [ ] **Step 3: Build the site**

Run: `npm run build`
Expected: build succeeds; output includes `/blog/index.html` and `/blog/what-building-a-small-rtos-taught-me-about-debugging/index.html`.

- [ ] **Step 4: Visual review before any deploy**

Run: `npm run preview` and open the local URL. Confirm:
- `blog` tab appears in the top nav between `ai` and `about`, and is highlighted on `/blog`.
- The feed shows the RTOS post card with an `article` badge, date, and reading time.
- Opening the post renders the terminal `contents` TOC (scroll-spy highlights as you scroll), `$`-prefixed headings, and the light header (badge · date · reading time · tags).
- Breadcrumb reads `karan@embedded:~/blog/<slug>$`.

Per project preference, do not deploy until this visual review is approved.

- [ ] **Step 5: Final commit (if any review tweaks were made)**

```bash
git add -A
git commit -m "chore(blog): finalize engineering blog section"
```

---

## Self-Review Notes

- **Spec coverage:** content model (Task 3), nav tab + command (Tasks 1–2), feed index (Task 10), per-post route + dedicated layout (Tasks 7–8), blog card with badge (Task 9), reading-time auto-estimate (Task 4), first real post (Task 5), styling reuse + small additions (Task 6) — all spec sections mapped.
- **Type consistency:** `estimateReadingTime` signature is identical across `[slug].astro` and `index.astro`; `BlogPostLayout` Props match what `[slug].astro` passes; `kind` is the literal union `'article' | 'note'` everywhere; collection key `'blog'` matches `config.ts`, `getCollection('blog')`, and `CollectionEntry<'blog'>`.
- **No placeholders:** every code step contains complete content.
