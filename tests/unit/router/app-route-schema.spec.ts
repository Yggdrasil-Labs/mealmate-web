import { describe, expect, it } from 'vitest'
import { appRouteSchema } from '@/router/app-route-schema'

describe('app route schema', () => {
  it('declares home route', () => {
    expect(appRouteSchema.some(route => route.path === '/')).toBe(true)
  })

  it('marks home as pinned tab', () => {
    const home = appRouteSchema.find(route => route.path === '/')
    expect(home?.meta.tab?.pinned).toBe(true)
  })

  it('declares semantic icons for menu routes', () => {
    expect(appRouteSchema.every(route => typeof route.meta.icon === 'string' && route.meta.icon.length > 0)).toBe(true)
  })
})
