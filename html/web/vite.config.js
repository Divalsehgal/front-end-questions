import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Base path matching repository name for GitHub Pages handling
  base: '/dpjs/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        semanticForms: resolve(__dirname, 'semantic-forms-lab/index.html'),
        a11y: resolve(__dirname, 'a11y-lab/index.html'),
        shapes: resolve(__dirname, 'shapes-lab/index.html')
      }
    }
  }
});
