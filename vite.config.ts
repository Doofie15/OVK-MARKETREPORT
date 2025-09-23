import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: '0.0.0.0', // Allow external connections
        port: 5173,
        strictPort: true,
        cors: true,
        // Allow mobile testing
        fs: {
          strict: false
        }
      },
      preview: {
        host: '0.0.0.0',
        port: 4173,
        strictPort: true,
        cors: true
      }
    };
});
