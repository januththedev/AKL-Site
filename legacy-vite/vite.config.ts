import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // Exact host used by the managed development preview.
  server: { allowedHosts: ['terminal.local'] },
  preview: { allowedHosts: ['terminal.local'] },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2019',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
