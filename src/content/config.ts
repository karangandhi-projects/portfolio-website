import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(), // must match the matching entry in src/data/projects.ts
    summary: z.string(),
    status: z.string(),
    platform: z.string(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    repoUrl: z.string().url(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'case-studies': caseStudies,
};
