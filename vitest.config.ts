import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: 'src/types/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  test: {
    // 默认仍以 Playwright E2E 为主；仅开启 unit spec 以支持局部验证
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{git,cache,output,temp}/**'],
    css: false,
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
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
