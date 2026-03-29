import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  getFieldComponent,
  registerDefaultFieldComponents,
  registerFieldComponent,
} from '@/components/pro-form/form-registry'

describe('pro-form/form-registry', () => {
  it('register + get 基本可用', () => {
    const FakeA = {} as Component
    registerFieldComponent('Fake', FakeA)
    expect(getFieldComponent('Fake')).toBe(FakeA)
  })

  it('默认注册后 get("Input") 有值', () => {
    registerDefaultFieldComponents()
    expect(getFieldComponent('Input')).toBeTruthy()
  })

  it('默认注册后 get("Tag") 仍指向共享字段组件', () => {
    registerDefaultFieldComponents()
    expect(getFieldComponent('Tag')).toBeTruthy()
  })

  it('覆盖注册后 get 返回新组件', () => {
    const FakeB = {} as Component
    registerFieldComponent('Input', FakeB)
    expect(getFieldComponent('Input')).toBe(FakeB)
  })
})
