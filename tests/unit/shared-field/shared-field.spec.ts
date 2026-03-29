import { describe, expect, it } from 'vitest'
import { isFieldVisible, resolveFieldLabel } from '@/types/shared-field'

describe('shared field contract', () => {
  it('supports shared field metadata helpers', () => {
    expect(resolveFieldLabel({ label: '名称' })).toBe('名称')
    expect(isFieldVisible({ visible: false })).toBe(false)
    expect(isFieldVisible({})).toBe(true)
  })
})
