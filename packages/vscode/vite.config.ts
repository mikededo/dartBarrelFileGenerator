import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      fileName: 'extension',
      formats: ['cjs'],
      name: 'dbfg'
    },
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      external: ['vscode', 'node:fs', 'node:path', '@dbf/core']
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@dbf/core': resolve(__dirname, '../core/src')
    }
  }
});
