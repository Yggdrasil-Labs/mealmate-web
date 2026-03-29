import type { Component } from 'vue'
import { getFieldComponent, registerDefaultFieldComponents, registerFieldComponent } from '@/components/pro-form/form-registry'

const searchFieldRegistry = new Map<string, Component>()

export function registerSearchFieldComponent(name: string, component: Component) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('registerSearchFieldComponent: name 必须是非空字符串')
  }
  if (!component) {
    throw new TypeError('registerSearchFieldComponent: component 必须存在')
  }

  searchFieldRegistry.set(name, component)
}

export function getSearchFieldComponent(name: string): Component | undefined {
  if (!name || typeof name !== 'string')
    return undefined

  return searchFieldRegistry.get(name) ?? getFieldComponent(name)
}

export function registerDefaultSearchFieldComponents() {
  registerDefaultFieldComponents()

  // SearchBar 先复用 ProForm 已有组件注册表，避免两套字段组件定义长期漂移。
  const sharedNames = [
    'Input',
    'Select',
    'DatePicker',
    'Switch',
    'Checkbox',
    'CheckboxGroup',
    'InputNumber',
    'Tag',
  ] as const

  for (const name of sharedNames) {
    const component = getFieldComponent(name)
    if (component)
      registerSearchFieldComponent(name, component)
  }
}

export { registerFieldComponent as registerSharedFieldComponent }
