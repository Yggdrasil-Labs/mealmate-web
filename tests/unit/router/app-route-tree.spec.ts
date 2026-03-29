import { describe, expect, it } from 'vitest'
import { appRouteSchema } from '@/router/app-route-schema'
import { getNormalizedAppRoutes, normalizedAppRouteSchema } from '@/router/app-route-tree'

describe('app route tree', () => {
  it('exposes a normalized shared schema for shell consumers', () => {
    expect(normalizedAppRouteSchema).toHaveLength(appRouteSchema.length)
    expect(normalizedAppRouteSchema.find(route => route.path === '/')?.meta.tab?.pinned).toBe(true)
    expect(normalizedAppRouteSchema.find(route => route.path === '/')?.meta.layout).toBe('default')
  })

  it('returns the shared normalized schema for the default source', () => {
    expect(getNormalizedAppRoutes()).toBe(normalizedAppRouteSchema)
  })
})
