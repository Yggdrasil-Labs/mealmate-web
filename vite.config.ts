import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import pkg from './package.json' with { type: 'json' }

const VUE_FILE_RE = /\.vue$/
const VUE_QUERY_RE = /\.vue\?vue/
const NODE_MODULES_RE = /[\\/]node_modules[\\/]/
const GIT_RE = /[\\/]\.git[\\/]/
const NUXT_RE = /[\\/]\.nuxt[\\/]/
const _API_PREFIX_RE = /^\/api/

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const envVars = loadEnv(mode, '.', '')
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    plugins: [
      vue({
        // 启用模板编译优化
        template: {
          compilerOptions: {
            // 移除生产环境的注释
            comments: !isProd,
          },
        },
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components'],
        // 自动导入组件（Element Plus 按需）
        resolvers: [ElementPlusResolver()],
        // 包含的文件类型
        include: [VUE_FILE_RE, VUE_QUERY_RE],
        // 排除的文件
        exclude: [NODE_MODULES_RE, GIT_RE, NUXT_RE],
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          'vue-router',
          'pinia',
          '@vueuse/core',
        ],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true, // 允许在 <template> 直接使用自动导入的 API
      }),
      Icons(),
    ].filter(Boolean),
    css: {
      preprocessorOptions: {
        scss: {
          // 全局导入 Sass 变量和混入
          additionalData: `@use "@scss/base/variables" as *; @use "@scss/base/mixins" as *;`,
          // 启用源映射（开发环境）
          sourceMap: isDev,
        },
      },
      // 启用 CSS 代码分割
      devSourcemap: isDev,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@locales': path.resolve(__dirname, './src/locales'),
        '@scss': path.resolve(__dirname, './src/assets/scss'),
      },
    },
    server: {
      host: true, // 允许局域网访问
      port: Number(envVars.VITE_PORT) || 5173,
      open: false,
      allowedHosts: true, // E2E: 允许 Docker 容器名访问
      // 启用 HTTPS（可选）
      // https: isDev && envVars.VITE_HTTPS === 'true',
      // 代理配置：转发 /api/* 到后端，保留完整路径
      proxy: {
        '/api': {
          target: envVars.VITE_API_PROXY_TARGET || envVars.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          timeout: 10000,
        },
      },
      // 开发服务器优化
      hmr: {
        overlay: true,
      },
      // 文件监听优化
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: isDev,
      // 构建优化
      minify: isProd ? 'esbuild' : false,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 构建大小警告阈值
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 优化的代码分割策略
          manualChunks: {
            // Vue 核心库
            'vue-vendor': ['vue', 'vue-router'],
            // Element Plus
            'element-plus': ['element-plus'],
            // UI 库
            'ui-vendor': ['@vueuse/core'],
            // HTTP 库
            'http-vendor': ['axios'],
            // 国际化
            'i18n-vendor': ['vue-i18n'],
            // 状态管理
            'store-vendor': ['pinia', 'pinia-plugin-persistedstate'],
            // 公共工具
            'common': ['src/utils', 'src/composables'],
          },
        },
        // 外部依赖（如果需要）
        external: [],
      },
    },
    // 优化选项
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        '@vueuse/core',
        'axios',
        'element-plus',
      ],
      exclude: [],
    },
    // 环境变量定义
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
})
