/**
 * Iconify（unplugin-icons + @iconify-json/ep）适配器
 * 将语义化 name 映射到具体图标组件，后续换库只改此文件
 */
import type { Component } from 'vue'
import type { SemanticIconName } from '../icon.types'

import IconEpBack from '~icons/ep/back'
import IconEpCalendar from '~icons/ep/calendar'
import IconEpClose from '~icons/ep/close'
import IconEpDelete from '~icons/ep/delete'
import IconEpDish from '~icons/ep/dish'
import IconEpEdit from '~icons/ep/edit'
import IconEpExpand from '~icons/ep/expand'
import IconEpFold from '~icons/ep/fold'
import IconEpFolder from '~icons/ep/folder'
import IconEpHomeFilled from '~icons/ep/home-filled'
import IconEpInfo from '~icons/ep/info-filled'
import IconEpKnifeFork from '~icons/ep/knife-fork'
import IconEpLink from '~icons/ep/link'
import IconEpAdd from '~icons/ep/plus'
import IconEpRefresh from '~icons/ep/refresh'
import IconEpError from '~icons/ep/remove'
import IconEpSearch from '~icons/ep/search'
import IconEpSetting from '~icons/ep/setting'
import IconEpShoppingCart from '~icons/ep/shopping-cart'
import IconEpSuccess from '~icons/ep/success-filled'
import IconEpUserFilled from '~icons/ep/user-filled'
import IconEpWarning from '~icons/ep/warning-filled'

const iconifyMap: Record<SemanticIconName, Component> = {
  'add': IconEpAdd,
  'back': IconEpBack,
  'close': IconEpClose,
  'delete': IconEpDelete,
  'edit': IconEpEdit,
  'error': IconEpError,
  'expand': IconEpExpand,
  'fold': IconEpFold,
  'info': IconEpInfo,
  'menu-dashboard': IconEpHomeFilled,
  'menu-system': IconEpInfo,
  'menu-user': IconEpUserFilled,
  'menu-recipe': IconEpDish,
  'menu-plan': IconEpCalendar,
  'menu-prep': IconEpKnifeFork,
  'menu-shopping': IconEpShoppingCart,
  'refresh': IconEpRefresh,
  'search': IconEpSearch,
  'status-error': IconEpError,
  'status-success': IconEpSuccess,
  'status-warning': IconEpWarning,
  'success': IconEpSuccess,
  'tech-vue': IconEpSuccess,
  'tech-vite': IconEpRefresh,
  'tech-router': IconEpLink,
  'tech-pinia': IconEpFolder,
  'tech-i18n': IconEpInfo,
  'tech-tools': IconEpSetting,
  'warning': IconEpWarning,
}

export function getIconifyIcon(name: SemanticIconName): Component | undefined {
  return iconifyMap[name]
}
