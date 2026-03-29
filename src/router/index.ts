import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useMenuStore, useTabsStore } from '@/stores'
import { normalizedAppRouteSchema } from './app-route-tree'
import { createRouteRecords } from './app-routes'

function findRouteByPath(path: string) {
  for (const routeItem of normalizedAppRouteSchema) {
    if (routeItem.path === path)
      return routeItem

    if (routeItem.children) {
      const nested = routeItem.children.find(child => child.path === path)
      if (nested)
        return nested
    }
  }

  return null
}

function buildTabRecord(route: RouteLocationNormalizedLoaded) {
  const routeKey = String(route.name ?? route.path)

  return {
    key: routeKey,
    routeName: routeKey,
    path: route.path,
    fullPath: route.fullPath,
    title: String(route.meta.title ?? routeKey),
    closable: route.meta.tab?.closable ?? routeKey !== 'Home',
    pinned: route.meta.tab?.pinned ?? routeKey === 'Home',
  }
}

function syncShellState(to: RouteLocationNormalizedLoaded) {
  const menuStore = useMenuStore()
  const tabsStore = useTabsStore()
  const currentKey = String(to.name ?? to.path)

  menuStore.syncRoute(String(to.meta.menu?.activeMenu ?? currentKey))

  const homeRoute = findRouteByPath('/')
  if (homeRoute && currentKey !== homeRoute.name && !tabsStore.items.some(item => item.key === homeRoute.name)) {
    tabsStore.syncRoute({
      key: homeRoute.name,
      routeName: homeRoute.name,
      path: homeRoute.path,
      fullPath: homeRoute.path,
      title: homeRoute.meta.title,
      closable: homeRoute.meta.tab?.closable ?? false,
      pinned: homeRoute.meta.tab?.pinned ?? true,
    })
  }

  if (to.meta.tab?.enabled !== false) {
    tabsStore.syncRoute(buildTabRecord(to))
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: createRouteRecords(),
})

// 路由守卫（模板默认不做业务鉴权）
// 路由后置守卫
router.afterEach((to) => {
  syncShellState(to)

  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Asgard Frontend`
  }
})

export default router
