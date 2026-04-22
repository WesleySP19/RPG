import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    port: 8020,
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws-grimoire': {
        target: 'ws://localhost:8080',
        ws: true
      }
    }
  }
});
