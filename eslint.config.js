// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: [
    '.github/**',
    '.vscode/**',
    'docs/**',
    '.cursor/**',
  ],
  languageOptions: {
    globals: {
      // Vite 构建时注入
      __APP_VERSION__: 'readonly',
      // unplugin-auto-import 自动导入（VueUse 等）
      useWindowSize: 'readonly',
      useMouse: 'readonly',
      useDark: 'readonly',
      useCounter: 'readonly',
      useLocalStorage: 'readonly',
      syncRef: 'readonly',
      useCycleList: 'readonly',
      useTitle: 'readonly',
      useSupported: 'readonly',
    },
  },
  rules: {
    'no-console': ['warn', {
      allow: ['log', 'warn', 'error'], // 允许常用的 console 方法
    }],
  },
  // 为测试文件添加特殊配置
  test: true,
  // 测试文件特殊规则
  testRules: {
    'no-console': 'off', // 测试文件中允许 console
    '@typescript-eslint/no-explicit-any': 'off', // 测试文件中允许 any
    'vue/multi-word-component-names': 'off', // 测试文件中允许单单词组件名
  },
})
