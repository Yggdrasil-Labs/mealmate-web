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
      key: 'CatalogPage',
      routeName: 'CatalogPage',
      path: '/catalog',
      fullPath: '/catalog',
      title: '商品目录',
    })
    store.open({
      key: 'OrdersPage',
      routeName: 'OrdersPage',
      path: '/orders',
      fullPath: '/orders',
      title: '订单管理',
    })

    const initialOrder = store.items.map(item => item.key)

    store.open({
      key: 'CatalogPage',
      routeName: 'CatalogPage',
      path: '/catalog',
      fullPath: '/catalog',
      title: '商品目录',
    })

    expect(store.activeKey).toBe('CatalogPage')
    expect(store.items.map(item => item.key)).toEqual(initialOrder)
    expect(now).toHaveBeenCalled()
  })
})
