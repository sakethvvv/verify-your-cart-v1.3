import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    // CRITICAL: Set base to '/' for Firebase/Cloudflare. 
    // This ensures assets (CSS/JS) are always loaded from the domain root.
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
          output: {
              manualChunks: {
                  vendor: ['react', 'react-dom', 'lucide-react', '@google/genai']
              }
          }
      }
    },
    define: {
      // Inject API Key safely.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || env.GEMINI_API_KEY || ''),
      'process.env': {},
    },
  };
});