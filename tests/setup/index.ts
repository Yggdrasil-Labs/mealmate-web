export type TestEnvironment = 'e2e'

export const testEnvironments = {
  e2e: {
    name: '端到端测试',
    description: '测试首页与基础能力',
    configFile: './playwright.config.ts',
    timeout: 60000,
    parallel: false,
  },
} as const

export function getTestEnvironmentConfig(env: TestEnvironment) {
  return testEnvironments[env]
}
