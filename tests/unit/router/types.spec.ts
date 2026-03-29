import type { AppLayoutName, AppRouteMeta, AppRouteRecord } from '@/router/types'
import { describe, expect, it } from 'vitest'

describe('router types', () => {
  it('supports default and blank layouts', () => {
    const layout: AppLayoutName = 'default'
    expect(layout).toBe('default')
  })

  it('requires title inside route meta', () => {
    const route: AppRouteRecord = {
      name: 'Home',
      path: '/',
      component: 'index',
      meta: { title: '首页' } satisfies AppRouteMeta,
    }

    expect(route.meta.title).toBe('首页')
  })
})
