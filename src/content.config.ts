import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const paintings = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/paintings' }),
  schema: z.object({
    image: z.string(),
    title: z.string(),
    year: z.coerce.string().nullish(),
    size: z.coerce.string().nullish(),
    technique: z.string().nullish(),
    technique_other: z.string().nullish(),
    sold: z.boolean().nullish(),
    period: z.string().nullish(),
    featured: z.boolean().nullish(),
  }),
});

const periods = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/periods' }),
  schema: z.object({
    order: z.coerce.number().nullish(),
    title: z.string(), // nome in inglese
    title_it: z.string().nullish(),
    title_es: z.string().nullish(),
    years: z.coerce.string().nullish(),
  }),
});

// Impostazioni varie (home, barra, biografia, mostra, libri, ecc.): un file per sezione.
const settings = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/settings' }),
  schema: z.record(z.string(), z.any()),
});

export const collections = { paintings, periods, settings };
