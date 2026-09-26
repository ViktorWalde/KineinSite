import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const aprender = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/aprender" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    ideVersion: z.string().min(1),
    platform: z.string().min(1),
    lastTested: z.coerce.date(),
    status: z.enum(["draft", "verified"]),
    prerequisites: z.array(z.string()).default([]),
    references: z.array(z.url()).default([]),
  }),
});

const estudos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/estudos" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    language: z.string().min(1),
    standard: z.string().min(1),
    platform: z.string().min(1),
    toolchain: z.string().min(1),
    lastTested: z.coerce.date(),
    status: z.enum(["draft", "verified"]),
  }),
});

export const collections = { aprender, estudos };
