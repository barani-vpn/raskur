import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: { enabled: false },
  build: { format: 'directory', inlineStylesheets: 'never' },
});
