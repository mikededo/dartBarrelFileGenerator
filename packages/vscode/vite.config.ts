import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.mts'),
      fileName: 'extension',
      formats: ['cjs'],
      name: 'dbfg'
    },
    minify: false,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      external: ['vscode', 'node:fs', 'node:path']
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@dbf/core': resolve(__dirname, '../core/src')
    }
  }
});
