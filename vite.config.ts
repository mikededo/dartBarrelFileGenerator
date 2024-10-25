import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'dbfg',
      entry: './src/extension.ts',
      fileName: 'extension',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['vscode', 'node:fs', 'node:path']
    },
    sourcemap: true
  }
});
