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
