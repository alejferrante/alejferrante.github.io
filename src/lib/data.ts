import { getCollection, getEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { pick, type Lang } from '../i18n/ui';

// ---------- Immagini ----------
// Tutte le foto caricate dal pannello finiscono in src/assets/uploads.
// Qui le colleghiamo al loro percorso, così Astro può ottimizzarle.
const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif,gif,tif,tiff,JPG,JPEG,PNG,WEBP,AVIF,GIF,TIF,TIFF}',
  { eager: true },
);
const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(uploads)) {
  byName.set(path.toLowerCase(), mod.default);
  byName.set(path.split('/').pop()!.toLowerCase(), mod.default);
}

export function img(path: string | null | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const p = decodeURI(String(path)).trim().toLowerCase();
  return byName.get(p) ?? byName.get(p.split('/').pop()!);
}

// ---------- Impostazioni ----------
export async function settings<T = Record<string, any>>(name: string): Promise<T> {
  const entry = await getEntry('settings', name);
  return (entry?.data ?? {}) as T;
}

/**
 * Pagine che si possono nascondere dal pannello (Stampa, Premi): basta togliere la spunta
 * "Mostra questa pagina sul sito". Se il campo manca, la pagina è visibile.
 */
export async function pageShown(name: 'press' | 'awards'): Promise<boolean> {
  const s = await settings<{ show?: boolean }>(name);
  return s.show !== false;
}

// ---------- Foto con didascalia (mostre passate, premi) ----------
export type Photo = { image: ImageMetadata; title: string };

export function photoList(items: unknown, lang: Lang): Photo[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((it: any) => ({ image: img(it?.image), title: pick(it?.title, lang) }))
    .filter((p): p is Photo => !!p.image);
}

// ---------- Periodi e opere ----------
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type Painting = {
  id: string;
  title: string;
  year: string;
  size: string;
  technique: string; // codice dal menu a tendina (vedi TECHNIQUES)
  techniqueOther: string; // tecnica scritta a mano
  sold: boolean;
  period: string;
  featured: boolean;
  image: ImageMetadata;
};

// Tecniche del menu a tendina del pannello, tradotte nelle tre lingue.
// Per aggiungerne una: qui e in public/admin/config.yml (campo "technique").
export const TECHNIQUES: Record<string, Record<Lang, string>> = {
  'acrylic-canvas': { en: 'Acrylic on canvas', it: 'Acrilico su tela', es: 'Acrílico sobre tela' },
  'acrylic-mixed-canvas': {
    en: 'Acrylic and mixed media on canvas',
    it: 'Acrilico e tecnica mista su tela',
    es: 'Acrílico y técnica mixta sobre tela',
  },
  'acrylic-mixed': { en: 'Acrylic and mixed media', it: 'Acrilico e tecnica mista', es: 'Acrílico y técnica mixta' },
  'acrylic-wood': { en: 'Acrylic on wood', it: 'Acrilico su legno', es: 'Acrílico sobre madera' },
};

const SOLD: Record<Lang, string> = { en: 'Sold', it: 'Venduto', es: 'Vendido' };

/** "100 x 150", "cm 100x150", "100 × 150 cm" → "100 × 150 cm". Altrimenti lascia com'è scritto. */
export function formatSize(s: string): string {
  const m = /^\s*(?:cm\s*)?(\d+(?:[.,]\d+)?)\s*[x×X*]\s*(\d+(?:[.,]\d+)?)\s*(?:cm)?\s*$/.exec(s);
  return m ? `${m[1]} × ${m[2]} cm` : s.trim();
}

/** Riga sotto il titolo: anno · misure · tecnica · venduto */
export function workMeta(w: Painting, lang: Lang): string {
  const tech = w.techniqueOther || (TECHNIQUES[w.technique]?.[lang] ?? '');
  return [w.year, w.size && formatSize(w.size), tech, w.sold && SOLD[lang]].filter(Boolean).join(' · ');
}

export type Period = {
  id: string;
  slug: string; // usato nell'indirizzo della pagina
  order: number;
  name: Record<string, string>;
  years: string;
  works: Painting[];
};

const yearNum = (y: string) => {
  const m = /\d{3,4}/.exec(y);
  return m ? Number(m[0]) : 99999;
};

export async function paintings(): Promise<Painting[]> {
  const all = await getCollection('paintings');
  const out: Painting[] = [];
  for (const e of all) {
    const image = img(e.data.image);
    if (!image) {
      console.warn(`[sito] Immagine non trovata per l'opera "${e.data.title}": ${e.data.image}`);
      continue;
    }
    out.push({
      id: e.id,
      title: e.data.title,
      year: e.data.year ?? '',
      size: e.data.size ?? '',
      technique: e.data.technique ?? '',
      techniqueOther: (e.data.technique_other ?? '').trim(),
      sold: !!e.data.sold,
      period: e.data.period ?? '',
      featured: !!e.data.featured,
      image,
    });
  }
  // Ordine: per anno, poi per titolo.
  return out.sort((a, b) => yearNum(a.year) - yearNum(b.year) || a.title.localeCompare(b.title));
}

export async function periods(): Promise<Period[]> {
  const [all, works] = await Promise.all([getCollection('periods'), paintings()]);
  const used = new Set<string>();
  return all
    .map((e) => {
      const name = { en: e.data.title, it: e.data.title_it ?? '', es: e.data.title_es ?? '' };
      let slug = slugify(name.en) || e.id;
      if (used.has(slug)) slug = `${slug}-${e.id}`;
      used.add(slug);
      return {
        id: e.id,
        slug,
        order: e.data.order ?? 999,
        name,
        years: e.data.years ?? '',
        works: works.filter((w) => w.period === e.id),
      };
    })
    .sort((a, b) => a.order - b.order || pick(a.name, 'en').localeCompare(pick(b.name, 'en')));
}

/** 2–3 opere da mostrare in anteprima per un periodo: prima quelle spuntate, poi le altre. */
export function previewWorks(p: Period): Painting[] {
  const chosen = p.works.filter((w) => w.featured);
  const rest = p.works.filter((w) => !w.featured);
  return [...chosen, ...rest].slice(0, 3);
}

/** Tutte le opere insieme: nell'ordine dei periodi (come nella home), poi le opere senza periodo. */
export async function allWorks(): Promise<Painting[]> {
  const [ps, works] = await Promise.all([periods(), paintings()]);
  const seen = new Set<string>();
  const out: Painting[] = [];
  for (const p of ps) for (const w of p.works) if (!seen.has(w.id)) (seen.add(w.id), out.push(w));
  for (const w of works) if (!seen.has(w.id)) out.push(w);
  return out;
}

// ---------- Mostra ----------
export type Exhibition = {
  show: boolean;
  headline?: Record<string, string>;
  venue?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  link?: string;
  photos?: { image?: string; title?: string }[];
};

const dateStr = (d: unknown) => {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
};

/** La mostra è "attiva" se è spuntata, ha una frase e non è ancora finita. */
export async function exhibition() {
  const ex = await settings<Exhibition>('exhibition');
  const end = dateStr(ex.end_date);
  const start = dateStr(ex.start_date);
  const today = new Date().toISOString().slice(0, 10);
  const hasText = !!pick(ex.headline, 'en');
  const active = !!ex.show && hasText && (!end || end >= today);
  return { ...ex, start, end, active };
}

export function formatRange(start: string, end: string, locale: string): string {
  const f = (s: string) =>
    new Date(`${s}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  if (start && end) return `${f(start)} – ${f(end)}`;
  return start ? f(start) : end ? f(end) : '';
}

// ---------- Video ----------
export function youtubeId(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const s = String(url).trim();
  const m =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(s) ||
    /^([A-Za-z0-9_-]{11})$/.exec(s);
  return m?.[1];
}
