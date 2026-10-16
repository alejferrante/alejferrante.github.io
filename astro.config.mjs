// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Il dominio del sito (lo stesso scritto in public/CNAME).
export const SITE_URL = 'https://www.ferrantealejandro.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Le foto caricate dal pannello vengono ottimizzate qui, in fase di build.
    responsiveStyles: false,
  },
});
