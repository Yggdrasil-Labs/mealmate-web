import type { Component } from 'vue'
import CellActions from './cells/CellActions.vue'
import CellAvatar from './cells/CellAvatar.vue'
import CellLink from './cells/CellLink.vue'
import CellTag from './cells/CellTag.vue'
import CellText from './cells/CellText.vue'

const columnComponentRegistry = new Map<string, Component>()

export function registerColumnComponent(name: string, component: Component) {
  if (!name || typeof name !== 'string')
    throw new TypeError('registerColumnComponent: name 必须是非空字符串')
  if (!component)
    throw new TypeError('registerColumnComponent: component 必须存在')
  columnComponentRegistry.set(name, component)
}

export function getColumnComponent(name: string): Component | undefined {
  if (!name || typeof name !== 'string')
    return undefined
  return columnComponentRegistry.get(name)
}

/** 注册内置列渲染器：Text、Tag、Link、Avatar、Actions */
export function registerDefaultColumnComponents() {
  registerColumnComponent('Text', CellText)
  registerColumnComponent('Tag', CellTag)
  registerColumnComponent('Link', CellLink)
  registerColumnComponent('Avatar', CellAvatar)
  registerColumnComponent('Actions', CellActions)
}

export function resetColumnComponentRegistryForTest() {
  columnComponentRegistry.clear()
}
