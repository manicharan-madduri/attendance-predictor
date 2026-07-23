import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // ── Local dev only: proxy /api → Express on :5000 ──────────────────────────
  // This block is ignored in production builds (Vercel). In production,
  // VITE_API_URL env var points directly to the Render backend.
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // ── Production build output ─────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
