import type { AppRouteRecord } from './types'

export const appRouteSchema: AppRouteRecord[] = [
  {
    name: 'Home',
    path: '/',
    component: 'index',
    meta: {
      title: '首页',
      icon: 'menu-dashboard',
      layout: 'default',
      tab: { enabled: true, closable: false, pinned: true, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'ProDialogDemo',
    path: '/pro-dialog-demo',
    component: 'pro-dialog-demo',
    meta: {
      title: 'ProDialog 示例',
      icon: 'menu-system',
      layout: 'default',
      tab: { enabled: true, closable: true, pinned: false, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'ProFormDemo',
    path: '/pro-form-demo',
    component: 'pro-form-demo',
    meta: {
      title: 'ProForm 示例',
      icon: 'edit',
      layout: 'default',
      tab: { enabled: true, closable: true, pinned: false, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'ProDetailDemo',
    path: '/pro-detail-demo',
    component: 'pro-detail-demo',
    meta: {
      title: 'ProDetail 示例',
      icon: 'info',
      layout: 'default',
      tab: { enabled: true, closable: true, pinned: false, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'ProTableDemo',
    path: '/pro-table-demo',
    component: 'pro-table-demo',
    meta: {
      title: 'ProTable 示例',
      icon: 'tech-tools',
      layout: 'default',
      tab: { enabled: true, closable: true, pinned: false, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
  {
    name: 'SearchBarDemo',
    path: '/search-bar-demo',
    component: 'search-bar-demo',
    meta: {
      title: 'SearchBar 示例',
      icon: 'search',
      layout: 'default',
      tab: { enabled: true, closable: true, pinned: false, singleton: true },
      keepAlive: { enabled: false, strategy: 'routeName' },
    },
  },
]
