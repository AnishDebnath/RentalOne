import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // ← expose on local network (0.0.0.0)
    allowedHosts: ['camera-rental-house-client.up.railway.app'],
    proxy: {
      // Forward every /api request to the Express server.
      // The browser never crosses origins, so CORS is never triggered.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
