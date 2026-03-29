import process from 'node:process'
import { defineConfig } from '@playwright/test'
import { createPlaywrightProjects } from './tests/e2e/projects'

/**
 * Playwright 配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e/specs',

  // 全局测试超时时间（30秒）
  timeout: 30 * 1000,

  // 每个测试的超时时间（10秒）
  expect: {
    timeout: 10 * 1000,
  },

  // 失败时重试次数
  retries: process.env.CI ? 2 : 0,

  // 并行运行的工作进程数
  workers: process.env.CI ? 1 : undefined,

  // 报告器配置
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['json', {
      outputFile: 'test-results/results.json',
    }],
    ['junit', {
      outputFile: 'test-results/results.xml',
    }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // 全局测试配置
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'X-E2E-Test': 'true',
    },
  },

  // 项目配置
  // WebKit 在部分 Linux/WSL 环境缺少系统依赖；默认仅在 macOS 启用，其他环境通过 PLAYWRIGHT_INCLUDE_WEBKIT=true 显式打开。
  projects: createPlaywrightProjects(),

  // Web 服务器配置（CI 下 preview 默认 4173，与 baseURL 5173 不一致会导致永远等不到端口）
  webServer: {
    command: process.env.CI ? 'pnpm preview --host 127.0.0.1 --port 5173' : 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: process.env.CI ? 'pipe' : 'ignore',
    stderr: process.env.CI ? 'pipe' : 'ignore',
    env: {
      NODE_ENV: 'test',
    },
  },
})
