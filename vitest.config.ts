import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitest/config'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/types/route-map.d.ts',
    }),
    vue(),
    Components({
      dts: 'src/types/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  test: {
    // 默认仍以 Playwright E2E 为主；仅开启 unit spec 以支持局部验证
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{git,cache,output,temp}/**'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@scss/base/variables" as *; @use "@scss/base/mixins" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@scss': path.resolve(__dirname, './src/assets/scss'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
