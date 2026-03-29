import { describe, expect, it } from 'vitest'
import { createPlaywrightProjects, shouldIncludeMobileSafari } from '../../e2e/projects'

describe('playwright project selection', () => {
  it('defaults to disabling Mobile Safari outside macOS', () => {
    // 直接传入 env/platform，避免单测依赖当前执行机的真实操作系统。
    const env: NodeJS.ProcessEnv = {}

    expect(shouldIncludeMobileSafari(env, 'linux')).toBe(false)
    expect(createPlaywrightProjects(env, 'linux').map(project => project.name)).not.toContain('Mobile Safari')
  })

  it('allows opting into Mobile Safari explicitly', () => {
    // 即使不是 macOS，只要显式打开开关，也应该把 Mobile Safari 加回项目列表。
    const env: NodeJS.ProcessEnv = { PLAYWRIGHT_INCLUDE_WEBKIT: 'true' }

    expect(shouldIncludeMobileSafari(env, 'linux')).toBe(true)
    expect(createPlaywrightProjects(env, 'linux').map(project => project.name)).toContain('Mobile Safari')
  })
})
