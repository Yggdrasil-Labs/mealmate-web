import { describe, expect, it } from 'vitest'
import { normalizeAppRoutes } from '@/router/route-normalizer'

describe('normalizeAppRoutes', () => {
  it('fills default layout and menu visibility', () => {
    const [route] = normalizeAppRoutes([
      {
        name: 'Profile',
        path: '/profile',
        component: 'index',
        meta: { title: 'Profile' },
      },
    ])

    expect(route.meta.layout).toBe('default')
    expect(route.meta.menu?.visible).toBe(true)
  })

  it('throws when title is missing', () => {
    expect(() =>
      normalizeAppRoutes([
        {
          name: 'Broken',
          path: '/broken',
          component: 'index',
          meta: {} as never,
        },
      ]),
    ).toThrow(/title/i)
  })
})
