import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Next.js loads .env.local into process.env automatically; Vite/Vitest
// doesn't, so integration tests that import real query/mutation code
// (which reads process.env.NEXT_PUBLIC_SUPABASE_URL etc. via
// lib/supabase/client.ts) need it done explicitly here.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (!(key in process.env)) process.env[key] = value;
  }

  return {
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      // Integration tests chain several real network round-trips against
      // the live Supabase project (login + multiple query/mutation calls
      // per test) — the 5s default is tuned for pure unit tests, not this.
      testTimeout: 20000,
    },
  };
});
