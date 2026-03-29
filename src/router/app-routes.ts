import type { RouteRecordRaw } from 'vue-router'
import type { AppRouteRecord } from './types'
import { appRouteSchema } from './app-route-schema'
import { getNormalizedAppRoutes } from './app-route-tree'

const views = import.meta.glob('/src/pages/*.vue')

export function resolvePageComponent(component: string) {
  const key = `/src/pages/${component}.vue`
  const loader = views[key]
  if (!loader)
    throw new Error(`View not found: ${component}`)

  return loader
}

function toRouteRecord(route: AppRouteRecord): RouteRecordRaw {
  return {
    path: route.path,
    name: route.name,
    component: resolvePageComponent(route.component),
    meta: route.meta,
    children: route.children?.map(toRouteRecord),
  }
}

export function createRouteRecords(routes: AppRouteRecord[] = appRouteSchema): RouteRecordRaw[] {
  return getNormalizedAppRoutes(routes).map(toRouteRecord)
}
