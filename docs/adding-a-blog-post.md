# Runbook: Add a Blog Post

A repeatable, low-friction procedure for publishing a new Engineering Blog post.

## Standing authorization

When Karan provides post content and says something like "post it to the blog,"
**do everything autonomously except the final publish** — create the file, verify, and start
a local preview without pausing for permission. Then **show Karan the preview and wait for
his approval before committing/pushing.** After he approves, finish (commit → merge → push)
autonomously.

So there is exactly **one** checkpoint: a local visual review right before posting. This
preserves the standing "local visual review before deploy" rule
([[portfolio-review-deploy-prefs]]) while keeping everything else hands-off.

> **`git push origin main` IS the deploy.** Vercel auto-builds and publishes the live site
> from GitHub `main` on every push. There is no separate deploy step — so the preview review
> in step 3 below is the deploy gate. **Never push without Karan's approval**, because the
> push puts the post live immediately.

If a post needs anything beyond a standard content file (new layout, schema change, custom
styling), that is *not* routine — fall back to the normal review/approval flow for those parts.

## Where posts live

- One markdown file per post: `src/content/blog/<slug>.md`
- The **slug comes from the filename** (e.g. `my-post-title.md` → `/blog/my-post-title`).
  Do not put a `slug` field in frontmatter — it is not in the schema and is ignored.
- The post is automatically picked up by:
  - the `/blog` feed (`src/pages/blog/index.astro`), newest-first by `date`
  - the home page **Latest Post** card (`src/pages/index.astro`), which shows the single
    newest non-draft post
  - its own page at `/blog/<slug>` via `src/pages/blog/[slug].astro`

  No wiring/registration is needed beyond creating the file.

## Frontmatter

Schema is defined in `src/content/config.ts` (the `blog` collection). Template:

```markdown
---
title: 'Exact Post Title'
summary: "One- or two-sentence summary shown on the card and below the H1."
kind: 'article'        # 'article' (long-form, gets a TOC) or 'note' (short, full-width)
date: 2026-06-26       # publish date; controls feed/home ordering (newest wins)
tags: ['tag-a', 'tag-b']
draft: false           # true = excluded from build/feed; omit or false to publish
---
```

Field rules:
- `title`, `summary`, `kind`, `date` are **required**.
- `tags` defaults to `[]`, `draft` defaults to `false` if omitted.
- **Do not set `readingTime`** — it is auto-estimated from the body (200 wpm, min 1 min)
  by `src/lib/readingTime.ts`. Only set it to override the auto value (must be a string
  like `"7 min read"`).

## Body rules

- **No leading `# H1`.** The layout renders the H1 from `title`. Start the body with an
  intro paragraph, then section headings.
- Use `##` for section headings (and `###` for sub-sections). For `kind: 'article'`, these
  populate the terminal "contents" TOC + scroll-spy. `kind: 'note'` renders full-width with
  no TOC.
- Standard markdown otherwise (links, **bold**, code, etc.).

## Procedure

From `portfolio-website/`:

```bash
# 1. Create src/content/blog/<slug>.md with frontmatter + body per the rules above.

# 2. Verify (autonomous)
npm run check          # astro check — expect 0 errors
npm run build          # expect /blog/<slug>/index.html generated, build Complete

# 3. Start the preview and hand the URL to Karan to review  <-- THE checkpoint
npm run preview        # serves dist/ at http://localhost:4321/
#   Ask him to look at /blog, the post page, and the home "Latest Post" card.
#   WAIT for his approval. Do not proceed past here without it.

# 4. After approval: commit on a short-lived branch, merge to main, push (autonomous)
#    NOTE: the push below auto-deploys to the live site via Vercel.
git checkout -b blog/<slug>
git add src/content/blog/<slug>.md
git commit -m "content(blog): add post — <short title>"
git checkout main
git merge --ff-only blog/<slug>
git push origin main

# 5. Stop the preview server.
```

## Quick sanity checks after build (before the preview)

```bash
# Post page exists and H1 comes from frontmatter (should be exactly one <h1>):
grep -c '<h1' dist/blog/<slug>/index.html      # -> 1

# Newest post is the one surfaced on the home "Latest Post" card:
grep -o '/blog/<slug>' dist/index.html | head -1
```
