# Engineering Blog — Design

**Date:** 2026-06-26
**Status:** Approved, pending implementation plan

## Goal

Add an Engineering Blog section to the portfolio that holds both long-form
technical writeups and short notes/TILs, presented as a single chronological
feed. It must inherit the existing terminal aesthetic exactly — no new visual
language. The flow mirrors the existing projects/case-studies system:
nav tab → index of terminal cards → click a card → dedicated post page.

## Context

The site is an Astro project with an established pattern this design reuses:

- `src/content/` holds markdown entries via a typed content collection
  (`case-studies`, defined in `src/content/config.ts`).
- `src/pages/projects/index.astro` renders entries as terminal-themed `.card`s.
- `src/pages/projects/[slug].astro` + `src/layouts/CaseStudyLayout.astro` render
  each entry as a full page (terminal "contents" TOC, `$`-prefixed headings,
  prose styles in `global.css` under `.cs-body` / `.cs-toc`).
- Persistent top nav tabs come from `src/data/sections.ts` (`SiteNav.astro`).
- Command chips + breadcrumb commands come from `src/data/nav.ts`.

The blog is essentially a second content collection plus one nav tab, reusing
the card and prose styling already in `global.css`.

## Content model

New Astro content collection `blog`, sibling to `case-studies`, with markdown
files in `src/content/blog/*.md`. Schema (added to `src/content/config.ts`):

| Field         | Type                      | Notes                                          |
|---------------|---------------------------|------------------------------------------------|
| `title`       | string                    | Post title                                     |
| `summary`     | string                    | One-line description, shown on the card        |
| `kind`        | `'article' \| 'note'`     | Drives the badge and whether the TOC renders   |
| `date`        | coerced date              | Sorts the feed (newest first)                  |
| `tags`        | string[]                  | Terminal-style tag pills                       |
| `readingTime` | string, optional          | Auto-estimated from body word count if omitted |
| `draft`       | boolean, default `false`  | Hides the post from the feed when `true`       |

No `platform` / `stack` / `repoUrl` (unlike case studies) — blog posts are
prose-first, so the post header stays lighter.

## Navigation

`blog` is added in two places, matching how every existing section works:

- `src/data/sections.ts`: a new `SectionKey` `'blog'` and a tab
  `{ key: 'blog', label: 'blog', href: '/blog' }`, slotted **between `ai` and
  `about`**. This makes it appear in the persistent top `SiteNav` and in the
  breadcrumb logic (`crumbsFor`).
- `src/data/nav.ts`: a command `{ cmd: 'blog', label: 'blog', target: '/blog' }`
  so it also appears in the command chips.

Breadcrumb on blog pages reads `karan@embedded:~/blog$`.

## Pages & components

- **`src/pages/blog/index.astro`** — the unified feed, newest first (sorted by
  `date` descending, drafts excluded). Reuses the existing terminal `.card`
  styling. Header reads like `ls blog/ --all`. Each card shows: a small
  `note`/`article` badge, title, summary, date, and tags.
- **`src/pages/blog/[slug].astro`** — `getStaticPaths` over the `blog`
  collection; renders each post via `BlogPostLayout`.
- **`src/layouts/BlogPostLayout.astro`** — a dedicated layout (NOT reusing
  `CaseStudyLayout`, to avoid empty project-fact fields). Built from the same
  prose/TOC styles as `CaseStudyLayout`:
  - `$`-prefixed headings, terminal "contents" TOC, code/blockquote/image styles
    (reuse the existing `.cs-body` / `.cs-toc` CSS classes).
  - Lighter header: title, then a meta line of `date · reading time · tags`.
    No platform/stack/repo facts.
  - For `kind: 'note'`, the TOC is suppressed (notes are short).
- **Blog card** — extend the existing card pattern (a small `BlogCard.astro`, or
  inline markup reusing `.card`), adding the `note`/`article` badge. No new card
  visual language.

## Reuse vs. add

- **Reuse:** all `global.css` styling (`.card`, `.term`, `.cs-body`, `.cs-toc`,
  `.tag`, badge styles), `SiteNav`, `PageLayout`, breadcrumb logic in
  `sections.ts`.
- **Add:** the `blog` collection schema; `src/pages/blog/index.astro`;
  `src/pages/blog/[slug].astro`; `src/layouts/BlogPostLayout.astro`; a blog card;
  the two nav entries; the first real post (content supplied by the user,
  adapted to the terminal theme like the case studies).

## First post

The user has a post ready and will supply the content. It will be adapted to the
terminal theme (headings, TOC, code blocks, tags) and wired in as the first real
`blog` entry — no throwaway placeholder.

## Out of scope (YAGNI)

- Tag/type filtering on the index (unified feed only, for now).
- Two-section split of articles vs. notes.
- RSS feed, comments, pagination — revisit only if post count grows.
