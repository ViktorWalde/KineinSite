import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Guia da IDE (ide/) e projetos guiados (projetos/). Uma pasta por capítulo,
// com o index.md e as capturas ao lado. Só "verified" vira página pública, e
// só depois de cada passo ser reproduzido na versão ideVersion.
const aprender = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/aprender" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    order: z.number().int().positive(),
    minutes: z.number().int().positive(),
    ideVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
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

// Uma nota por versão publicada; a mais recente vira o destaque da página
// inicial. O nome do arquivo é a parte da URL: 0-3-5.md -> /atualizacoes/0-3-5/.
const atualizacoes = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/atualizacoes" }),
  schema: z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    tag: z.string().regex(/^v\d+\.\d+\.\d+$/),
    title: z.string().min(1),
    date: z.coerce.date(),
    channel: z.enum(["beta", "estável"]),
    summary: z.string().min(1),
    highlights: z
      .array(z.object({ title: z.string().min(1), text: z.string().min(1) }))
      .min(1)
      .max(6),
    limits: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { aprender, estudos, atualizacoes };
