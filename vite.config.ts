import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  // Base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/ai-problem-solving-facilitator/' : '/'
});
