import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(""),
    category: z.enum(["feature", "tactics", "technique", "practice", "fitness", "gear", "mindset", "other"]).default("other"),
    tags: z.array(z.string()).default([]),
    source: z.string().default(""),
    sourceUrl: z.string().optional(),
    image: z.string().optional(),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
