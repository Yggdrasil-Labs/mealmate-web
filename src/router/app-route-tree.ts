import type { AppRouteRecord } from './types'
import { appRouteSchema } from './app-route-schema'
import { normalizeAppRoutes } from './route-normalizer'

export const normalizedAppRouteSchema: AppRouteRecord[] = normalizeAppRoutes(appRouteSchema)

export function getNormalizedAppRoutes(routes: AppRouteRecord[] = appRouteSchema): AppRouteRecord[] {
  if (routes === appRouteSchema || routes === normalizedAppRouteSchema)
    return normalizedAppRouteSchema

  return normalizeAppRoutes(routes)
}
