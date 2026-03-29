import process from 'node:process'
import { devices } from '@playwright/test'

/** 与 `process.env` 兼容，且不依赖 `@types/node` 的 `NodeJS` 全局命名空间 */
type ProcessEnv = Readonly<Record<string, string | undefined>>

// WebKit 在 Linux/WSL 上经常因为系统库缺失无法启动，默认仅在 macOS 打开；
// 如需在其他环境强制覆盖，使用 PLAYWRIGHT_INCLUDE_WEBKIT=true/false。
export function shouldIncludeMobileSafari(
  env: ProcessEnv = process.env,
  platform = process.platform,
) {
  if (env.PLAYWRIGHT_INCLUDE_WEBKIT === 'true')
    return true

  if (env.PLAYWRIGHT_INCLUDE_WEBKIT === 'false')
    return false

  return platform === 'darwin'
}

export function createPlaywrightProjects(
  env: ProcessEnv = process.env,
  platform = process.platform,
) {
  // 这三组浏览器覆盖桌面 Chromium/Firefox 与一个主流移动端基线，属于默认回归集。
  const projects = [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ]

  if (shouldIncludeMobileSafari(env, platform)) {
    // 将 WebKit 作为可选项目追加，避免默认回归在依赖不完整的机器上整体失败。
    projects.push({
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    })
  }

  return projects
}
