import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const materialSymbolsPath = path.dirname(
    fileURLToPath(import.meta.resolve('material-symbols/package.json'))
);


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        materialSymbolsPath,
      ],
    },
  },
});