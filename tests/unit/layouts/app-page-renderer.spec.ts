// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import AppPageRenderer from '@/app/shell/AppPageRenderer.vue'
import { useKeepAliveStore, useTabsStore } from '@/stores'

const mountedContainers: HTMLElement[] = []

afterEach(() => {
  mountedContainers.splice(0).forEach((container) => {
    container.remove()
  })
  document.body.innerHTML = ''
})

async function mountRenderer(path: string) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  const pinia = createPinia()
  setActivePinia(pinia)

  const CacheablePage = defineComponent({
    name: 'CacheablePage',
    setup() {
      const mountCount = window as typeof window & { __cacheableMountCount?: number }
      mountCount.__cacheableMountCount = (mountCount.__cacheableMountCount ?? 0) + 1

      return () => h('div', { class: 'cacheable-page' }, `Cacheable page ${mountCount.__cacheableMountCount}`)
    },
  })

  const PlainPage = defineComponent({
    name: 'PlainPage',
    setup() {
      return () => h('div', { class: 'plain-page' }, 'Plain page')
    },
  })

  const DetailPage = defineComponent({
    name: 'DetailPage',
    setup() {
      const detailMountCount = window as typeof window & { __detailMountCount?: number }
      detailMountCount.__detailMountCount = (detailMountCount.__detailMountCount ?? 0) + 1

      return () => h('div', { class: 'detail-page' }, `Detail page ${detailMountCount.__detailMountCount}`)
    },
  })

  const Host = defineComponent({
    setup() {
      return () => h(AppPageRenderer)
    },
  })

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: Host,
        children: [
          {
            path: 'cacheable',
            name: 'CacheablePage',
            component: CacheablePage,
            meta: {
              title: 'Cacheable page',
              keepAlive: { enabled: true, strategy: 'routeName' },
            },
          },
          {
            path: 'plain',
            name: 'PlainPage',
            component: PlainPage,
            meta: {
              title: 'Plain page',
              keepAlive: { enabled: false, strategy: 'routeName' },
            },
          },
          {
            path: 'detail',
            name: 'DetailPage',
            component: DetailPage,
            meta: {
              title: 'Detail page',
              keepAlive: { enabled: true, strategy: 'fullPath' },
            },
          },
        ],
      },
    ],
  })

  const app = createApp({
    setup() {
      return () => h(RouterView)
    },
  })

  app.use(pinia)
  app.use(router)
  await router.push(path)
  await router.isReady()
  app.mount(container)
  await nextTick()
  await nextTick()

  return {
    container,
    router,
    keepAliveStore: useKeepAliveStore(),
    tabsStore: useTabsStore(),
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('app page renderer', () => {
  it('remounts the current cacheable page after a tab refresh', async () => {
    const app = await mountRenderer('/cacheable')
    app.tabsStore.open({
      key: 'CacheablePage',
      routeName: 'CacheablePage',
      path: '/cacheable',
      fullPath: '/cacheable',
      title: 'Cacheable page',
      closable: true,
      pinned: false,
    })

    expect(app.container.textContent).toContain('Cacheable page 1')

    app.tabsStore.refresh('CacheablePage')
    await nextTick()
    await nextTick()

    expect(app.container.textContent).toContain('Cacheable page 2')

    app.unmount()
  })

  it('tracks distinct cache entries for fullPath keep-alive routes', async () => {
    const app = await mountRenderer('/detail?id=1')

    expect(app.keepAliveStore.keys).toContain('DetailPage:/detail?id=1')

    await app.router.push('/detail?id=2')
    await nextTick()
    await nextTick()

    expect(app.keepAliveStore.keys).toContain('DetailPage:/detail?id=1')
    expect(app.keepAliveStore.keys).toContain('DetailPage:/detail?id=2')

    app.unmount()
  })
})
