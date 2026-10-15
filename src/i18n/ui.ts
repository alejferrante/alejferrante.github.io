// Testi fissi dell'interfaccia (menu, pulsanti, messaggi) nelle tre lingue.
// I contenuti veri (biografia, opere, recensioni…) si modificano dal pannello /admin.

export const LANGS = ['en', 'it', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_LABELS: Record<Lang, string> = { en: 'EN', it: 'IT', es: 'ES' };
export const LANG_NAMES: Record<Lang, string> = { en: 'English', it: 'Italiano', es: 'Español' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', it: 'it', es: 'es' };
export const DATE_LOCALE: Record<Lang, string> = { en: 'en-GB', it: 'it-IT', es: 'es-AR' };

const strings = {
  biography: { en: 'Biography', it: 'Biografia', es: 'Biografía' },
  exhibitionHistory: { en: 'Exhibition history', it: 'Percorso espositivo', es: 'Trayectoria expositiva' },
  paintings: { en: 'Paintings', it: 'Opere', es: 'Obras' },
  exhibitions: { en: 'Exhibitions', it: 'Mostre', es: 'Exposiciones' },
  books: { en: 'Books', it: 'Libri', es: 'Libros' },
  awards: { en: 'Awards', it: 'Premi', es: 'Premios' },
  press: { en: 'Press', it: 'Stampa', es: 'Prensa' },
  video: { en: 'Video', it: 'Video', es: 'Video' },
  reviews: { en: 'Critical Reviews', it: 'Critica', es: 'Crítica' },
  skip: { en: 'Skip to content', it: 'Vai al contenuto', es: 'Ir al contenido' },
  menu: { en: 'Menu', it: 'Menu', es: 'Menú' },
  closeMenu: { en: 'Close menu', it: 'Chiudi il menu', es: 'Cerrar el menú' },
  language: { en: 'Language', it: 'Lingua', es: 'Idioma' },
  scroll: { en: 'Scroll', it: 'Scorri', es: 'Desplazá' },
  selectPeriod: {
    en: 'Select a period to see all its works',
    it: 'Scegli un periodo per vedere tutte le sue opere',
    es: 'Elegí un período para ver todas sus obras',
  },
  seeAllPaintings: { en: 'or see all the paintings', it: 'oppure guarda tutte le opere', es: 'o mirá todas las obras' },
  allPaintings: { en: 'All paintings', it: 'Tutte le opere', es: 'Todas las obras' },
  viewAll: { en: 'View all works', it: 'Vedi tutte le opere', es: 'Ver todas las obras' },
  allPeriods: { en: 'All periods', it: 'Tutti i periodi', es: 'Todos los períodos' },
  works: { en: 'works', it: 'opere', es: 'obras' },
  upcoming: { en: 'Upcoming exhibition', it: 'Prossima mostra', es: 'Próxima exposición' },
  current: { en: 'Current exhibition', it: 'Mostra in corso', es: 'Exposición en curso' },
  moreInfo: { en: 'More information', it: 'Maggiori informazioni', es: 'Más información' },
  pastExhibitions: { en: 'Past exhibitions', it: 'Mostre passate', es: 'Exposiciones anteriores' },
  booksIntro: { en: 'Scroll to browse the covers', it: 'Scorri per sfogliare le copertine', es: 'Desplazá para ver las tapas' },
  photosIntro: { en: 'Click a photo to enlarge it', it: 'Clicca una foto per ingrandirla', es: 'Hacé clic en una foto para ampliarla' },
  pressIntro: { en: 'Click an article to enlarge it', it: 'Clicca un articolo per ingrandirlo', es: 'Hacé clic en un artículo para ampliarlo' },
  videoIntro: { en: 'The making of the paintings', it: 'La nascita delle opere', es: 'Cómo nacen las obras' },
  playVideo: { en: 'Play video', it: 'Riproduci il video', es: 'Reproducir el video' },
  videoSoon: {
    en: 'Video link not added yet',
    it: 'Link del video non ancora inserito',
    es: 'Enlace del video todavía no agregado',
  },
  previous: { en: 'Previous', it: 'Precedente', es: 'Anterior' },
  next: { en: 'Next', it: 'Successiva', es: 'Siguiente' },
  close: { en: 'Close', it: 'Chiudi', es: 'Cerrar' },
  zoomIn: { en: 'Zoom in', it: 'Ingrandisci', es: 'Ampliar' },
  zoomOut: { en: 'Zoom out', it: 'Riduci', es: 'Reducir' },
  enlarge: { en: 'Enlarge', it: 'Ingrandisci', es: 'Ampliar' },
  contact: { en: 'Contact', it: 'Contatti', es: 'Contacto' },
  follow: { en: 'Follow', it: 'Seguimi', es: 'Seguime' },
  painter: { en: 'Painter', it: 'Pittore', es: 'Pintor' },
  rights: { en: 'All rights reserved.', it: 'Tutti i diritti riservati.', es: 'Todos los derechos reservados.' },
  notFound: { en: 'Page not found', it: 'Pagina non trovata', es: 'Página no encontrada' },
  backHome: { en: 'Back to the home page', it: 'Torna alla home', es: 'Volver al inicio' },
} as const;

export type UiKey = keyof typeof strings;

export function t(lang: Lang, key: UiKey): string {
  return strings[key][lang] ?? strings[key].en;
}

/** Sceglie la traduzione di un testo; se manca, usa l'inglese (o la prima disponibile). */
export function pick(value: unknown, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const v = value as Partial<Record<Lang, string | null>>;
  return (v[lang] || v.en || v.it || v.es || '').toString();
}

/** Percorso di una pagina nella lingua scelta: '' → '/', 'books' → '/it/books'. */
export function href(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  if (!clean) return prefix ? `${prefix}/` : '/';
  return `${prefix}/${clean}`;
}

export function langParam(lang: Lang): string | undefined {
  return lang === DEFAULT_LANG ? undefined : lang;
}

export function langFromParam(p: string | undefined): Lang {
  return (LANGS as readonly string[]).includes(p ?? '') ? (p as Lang) : DEFAULT_LANG;
}

export const langPaths = () => LANGS.map((l) => ({ params: { lang: langParam(l) }, props: { lang: l } }));
