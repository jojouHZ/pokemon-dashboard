import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import circleDependency from 'vite-plugin-circular-dependency'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    circleDependency({
      circleImportThrowErr: false,
      outputFilePath: './circular-deps.json',
      outputInteractiveFilePath: './circular-deps.html',
      exclude: [/node_modules/, /\.git/],
      include: [/\.vue$/, /\.[jt]sx?$/],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
