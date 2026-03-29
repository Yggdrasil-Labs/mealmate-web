import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMenuStore } from '@/stores/menu'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useMenuStore', () => {
  it('derives ancestor open keys for nested menu nodes', () => {
    const store = useMenuStore()

    store.setTree([
      {
        key: 'Workspace',
        path: '/workspace',
        title: 'Workspace',
        children: [
          {
            key: 'WorkspaceList',
            path: '/workspace/list',
            title: 'Workspace List',
          },
          {
            key: 'WorkspaceDetail',
            path: '/workspace/detail',
            title: 'Workspace Detail',
          },
        ],
      },
    ])

    store.syncRoute('WorkspaceDetail')

    expect(store.activeKey).toBe('WorkspaceDetail')
    expect(store.openKeys).toEqual(['Workspace'])
  })
})
