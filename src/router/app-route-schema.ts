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
    name: 'FamilyProfile',
    path: '/family/profile',
    component: 'family-profile',
    meta: {
      title: '家庭画像',
      icon: 'menu-user',
    },
  },
]
