// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, nextTick } from 'vue'
import i18n from '@/locales/i18n'
import router from '@/router'
import { useMenuStore, useTabsStore } from '@/stores'

const mountedContainers: HTMLElement[] = []

afterEach(() => {
  mountedContainers.splice(0).forEach((container) => {
    container.remove()
  })
  document.body.innerHTML = ''
})

async function mountRouter(path: string) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  const Host = defineComponent({
    setup() {
      return () => null
    },
  })

  const app = createApp(Host)
  const pinia = createPinia()

  setActivePinia(pinia)
  app.use(pinia)
  app.use(i18n)
  app.use(router)

  await router.push(path)
  await router.isReady()
  app.mount(container)
  await nextTick()

  return {
    container,
    menuStore: useMenuStore(),
    tabsStore: useTabsStore(),
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('router shell sync', () => {
  it('activates the home menu item and tab on navigation', async () => {
    const app = await mountRouter('/')

    expect(app.menuStore.activeKey).toBe('Home')
    expect(app.tabsStore.activeKey).toBe('Home')
    expect(app.tabsStore.items.find(item => item.key === 'Home')?.pinned).toBe(true)
    expect(app.tabsStore.items.find(item => item.key === 'Home')?.closable).toBe(false)
    expect(app.tabsStore.items).toHaveLength(1)

    app.unmount()
  })
})
