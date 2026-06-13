import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5174,
    host: true,
    allowedHosts: ['camera-rental-house-admin.up.railway.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
