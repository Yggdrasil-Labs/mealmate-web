/**
 * 图标适配层总开关：当前启用哪套 provider
 * 切换图标库时只改此处与对应 provider 实现
 */
import type { Component } from 'vue'
import type { SemanticIconName } from './icon.types'
import { getIconifyIcon } from './providers/iconify'

export function getIconComponent(
  name: SemanticIconName,
  _source?: 'default' | 'local',
): Component | undefined {
  // source === 'local' 时走 SvgIcon，由 AppIcon 内部处理
  return getIconifyIcon(name)
}
