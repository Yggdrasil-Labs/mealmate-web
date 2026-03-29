import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  getColumnComponent,
  registerColumnComponent,
  registerDefaultColumnComponents,
} from '@/components/pro-table/column-registry'

describe('pro-table/column-registry', () => {
  it('register + get 基本可用', () => {
    const Fake = {} as Component
    registerColumnComponent('Fake', Fake)
    expect(getColumnComponent('Fake')).toBe(Fake)
  })

  it('默认注册后 Text 有值', () => {
    registerDefaultColumnComponents()
    expect(getColumnComponent('Text')).toBeTruthy()
  })

  it('覆盖注册后 get 返回新组件', () => {
    const FakeB = {} as Component
    registerColumnComponent('CustomCol', FakeB)
    expect(getColumnComponent('CustomCol')).toBe(FakeB)
  })

  it('未知名称返回 undefined（由 ProTable 回落 Text）', () => {
    expect(getColumnComponent('UnknownXyz')).toBeUndefined()
  })
})
