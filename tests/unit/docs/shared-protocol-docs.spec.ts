import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('shared protocol docs', () => {
  it('documents the shared field protocol', () => {
    const content = fs.readFileSync('docs/components/shared-field-protocol.md', 'utf-8')
    expect(content).toContain('BaseFieldMeta')
    expect(content).toContain('共享字段协议')
  })
})
