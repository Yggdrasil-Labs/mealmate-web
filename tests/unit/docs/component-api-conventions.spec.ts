import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('component api conventions docs', () => {
  it('documents slot and event naming conventions', () => {
    const content = fs.readFileSync('docs/components/component-api-conventions.md', 'utf-8')
    expect(content).toContain('update:*')
    expect(content).toContain('header-extra')
    expect(content).toContain('作用域对象')
  })
})
