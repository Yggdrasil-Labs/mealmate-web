import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useKeepAliveStore } from '@/stores/keep-alive'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useKeepAliveStore', () => {
  it('registers and removes cache keys deterministically', () => {
    const store = useKeepAliveStore()

    store.register('Home')
    store.register('Home')
    store.register('ProFormDemo')
    expect(store.keys).toEqual(['Home', 'ProFormDemo'])

    store.remove('Home')
    expect(store.keys).toEqual(['ProFormDemo'])

    store.invalidate()
    expect(store.keys).toEqual([])
  })

  it('evicts sibling fullPath entries for the same component name on invalidation', () => {
    const store = useKeepAliveStore()

    store.register('DetailPage:/detail?id=1')
    store.register('DetailPage:/detail?id=2')
    store.register('UserList')

    store.invalidate('DetailPage:/detail?id=1')

    expect(store.keys).toEqual(['UserList'])
  })
})
