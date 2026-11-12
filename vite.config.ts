import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-all-repo-files',
        closeBundle() {
          const files = fs.readdirSync(__dirname);
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }
          for (const file of files) {
            if (
              file.endsWith('.html') ||
              file.endsWith('.xml') ||
              file.endsWith('.txt') ||
              file.endsWith('.png') ||
              file.endsWith('.ico') ||
              file.endsWith('.svg') ||
              file.endsWith('.webmanifest') ||
              file === 'incons' ||
              file === 'icons' ||
              file === '.nojekyll'
            ) {
              const src = path.resolve(__dirname, file);
              const dest = path.resolve(distDir, file);
              if (file === 'index.html' && fs.existsSync(dest)) {
                // index.html already built and bundled by vite
                continue;
              }
              if (fs.lstatSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true });
              } else {
                fs.copyFileSync(src, dest);
              }
            }
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

