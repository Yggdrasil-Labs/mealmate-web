import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTabsStore } from '@/stores/tabs'

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTabsStore', () => {
  it('keeps home pinned and not closable', () => {
    const store = useTabsStore()
    store.open({
      key: 'Home',
      routeName: 'Home',
      path: '/',
      fullPath: '/',
      title: '首页',
      closable: false,
      pinned: true,
    })

    expect(store.items[0]?.pinned).toBe(true)
    expect(store.items[0]?.closable).toBe(false)
  })

  it('does not reorder existing tabs when activating an already opened tab', () => {
    const store = useTabsStore()
    const now = vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4)

    store.open({
      key: 'Home',
      routeName: 'Home',
      path: '/',
      fullPath: '/',
      title: '首页',
      closable: false,
      pinned: true,
    })
    store.open({
      key: 'ProFormDemo',
      routeName: 'ProFormDemo',
      path: '/pro-form-demo',
      fullPath: '/pro-form-demo',
      title: 'ProForm 示例',
    })
    store.open({
      key: 'ProTableDemo',
      routeName: 'ProTableDemo',
      path: '/pro-table-demo',
      fullPath: '/pro-table-demo',
      title: 'ProTable 示例',
    })

    const initialOrder = store.items.map(item => item.key)

    store.open({
      key: 'ProFormDemo',
      routeName: 'ProFormDemo',
      path: '/pro-form-demo',
      fullPath: '/pro-form-demo',
      title: 'ProForm 示例',
    })

    expect(store.activeKey).toBe('ProFormDemo')
    expect(store.items.map(item => item.key)).toEqual(initialOrder)
    expect(now).toHaveBeenCalled()
  })
})
