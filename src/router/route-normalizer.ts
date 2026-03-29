import type { AppRouteRecord } from './types'

export function normalizeAppRoutes(routes: AppRouteRecord[]): AppRouteRecord[] {
  return routes.map((route, index) => {
    if (!route.meta?.title)
      throw new Error(`Route "${route.name}" is missing meta.title`)

    const isHome = route.path === '/'

    return {
      ...route,
      meta: {
        ...route.meta,
        layout: route.meta.layout ?? 'default',
        menu: {
          visible: route.meta.menu?.visible ?? true,
          order: route.meta.menu?.order ?? index,
          activeMenu: route.meta.menu?.activeMenu,
        },
        tab: {
          enabled: route.meta.tab?.enabled ?? true,
          closable: route.meta.tab?.closable ?? !isHome,
          pinned: route.meta.tab?.pinned ?? isHome,
          singleton: route.meta.tab?.singleton ?? isHome,
        },
        keepAlive: {
          enabled: route.meta.keepAlive?.enabled ?? false,
          strategy: route.meta.keepAlive?.strategy ?? 'routeName',
        },
      },
      children: route.children ? normalizeAppRoutes(route.children) : undefined,
    }
  })
}
