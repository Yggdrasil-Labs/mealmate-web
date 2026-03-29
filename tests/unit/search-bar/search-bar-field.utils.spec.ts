import { describe, expect, it } from 'vitest'
import {
  resolveSearchFieldOptions,
  shouldResetDependentFieldValue,
} from '@/components/search-bar/search-bar-field.utils'

describe('search-bar field utils', () => {
  it('runtime options 返回空数组时保持空数组，不回退静态选项', () => {
    const resolved = resolveSearchFieldOptions([], [
      { label: '静态', value: 'static' },
    ])

    expect(resolved).toEqual([])
  })

  it('runtime options 未返回数组时回退静态选项', () => {
    const fallback = [
      { label: '静态', value: 'static' },
    ]

    expect(resolveSearchFieldOptions(undefined, fallback)).toEqual(fallback)
  })

  it('依赖字段变化后会清空当前已选值', () => {
    expect(shouldResetDependentFieldValue('growth', '"draft"', '"published"')).toBe(true)
  })

  it('依赖字段未变化时保留当前值', () => {
    expect(shouldResetDependentFieldValue('growth', '"published"', '"published"')).toBe(false)
  })

  it('当前没有已选值时不触发清空', () => {
    expect(shouldResetDependentFieldValue('', '"draft"', '"published"')).toBe(false)
    expect(shouldResetDependentFieldValue(undefined, '"draft"', '"published"')).toBe(false)
  })
})
