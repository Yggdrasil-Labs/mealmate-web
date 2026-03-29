import { ElInput } from 'element-plus'
import { describe, expect, it } from 'vitest'

import { getFieldComponent, registerDefaultFieldComponents } from '@/components/pro-form'
import {
  getSearchFieldComponent,
  registerDefaultSearchFieldComponents,
  registerSearchFieldComponent,
} from '@/components/search-bar/search-bar-registry'

describe('search-bar registry', () => {
  it('支持注册并读取自定义字段组件', () => {
    registerSearchFieldComponent('CustomSearchField', ElInput)

    expect(getSearchFieldComponent('CustomSearchField')).toBe(ElInput)
  })

  it('默认注册后可以复用 ProForm 的字段组件映射', () => {
    registerDefaultFieldComponents()
    registerDefaultSearchFieldComponents()

    expect(getSearchFieldComponent('Input')).toBe(getFieldComponent('Input'))
    expect(getSearchFieldComponent('Select')).toBe(getFieldComponent('Select'))
  })
})
