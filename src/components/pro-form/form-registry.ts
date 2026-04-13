import type { Component } from 'vue'
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElSwitch,
} from 'element-plus'
import FormFieldTag from '@/components/field-components/FormFieldTag.vue'

const fieldComponentRegistry = new Map<string, Component>()

export function registerFieldComponent(name: string, component: Component) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('registerFieldComponent: name 必须是非空字符串')
  }
  if (!component) {
    throw new TypeError('registerFieldComponent: component 必须存在')
  }
  fieldComponentRegistry.set(name, component)
}

export function getFieldComponent(name: string): Component | undefined {
  if (!name || typeof name !== 'string')
    return undefined
  return fieldComponentRegistry.get(name)
}

/**
 * 注册默认字段组件映射。
 * 名称与 docs/components/pro-form.md 的约定对齐。
 */
export function registerDefaultFieldComponents() {
  registerFieldComponent('Input', ElInput)
  registerFieldComponent('Select', ElSelect)
  registerFieldComponent('DatePicker', ElDatePicker)
  registerFieldComponent('Switch', ElSwitch)
  registerFieldComponent('Checkbox', ElCheckbox)
  registerFieldComponent('CheckboxGroup', ElCheckboxGroup)
  registerFieldComponent('InputNumber', ElInputNumber)
  /** 仅展示用，表单中为只读 Tag；ProDetail 中同样用 Tag 展示 */
  registerFieldComponent('Tag', FormFieldTag)
}
