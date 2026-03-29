import { describe, expect, it } from 'vitest'
import { createRouteRecords } from '@/router/app-routes'

describe('createRouteRecords', () => {
  it('creates child routes under shell entry', () => {
    const routes = createRouteRecords()
    const home = routes.find(route => route.path === '/')
    expect(home).toBeTruthy()
  })

  it('uses lazy route loaders instead of defineAsyncComponent wrappers', () => {
    const routes = createRouteRecords()
    const home = routes.find(route => route.path === '/')

    expect(typeof home?.component).toBe('function')
  })

  it('preserves nested child routes from the schema', () => {
    const routes = createRouteRecords([
      {
        name: 'Workspace',
        path: '/workspace',
        component: 'index',
        meta: { title: 'Workspace' },
        children: [
          {
            name: 'WorkspaceDetail',
            path: '/workspace/detail',
            component: 'index',
            meta: { title: 'Workspace Detail' },
          },
        ],
      },
    ])

    expect(routes[0]?.children).toHaveLength(1)
    expect(routes[0]?.children?.[0]?.path).toBe('/workspace/detail')
    expect(routes[0]?.children?.[0]?.name).toBe('WorkspaceDetail')
  })
})
