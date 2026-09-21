import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pages = ['index', 'rating', 'virtual-cards', 'virtual-card', 'service', 'reports', 'report', 'methodology', 'contacts', 'advertising', 'agreement', '404', 'ui-kit'];

export default defineConfig({
  build: { rollupOptions: { input: Object.fromEntries(pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)])) } },
  server: { host: '127.0.0.1' }
});
