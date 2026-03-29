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
  it('activates current menu item and tab on navigation', async () => {
    const app = await mountRouter('/pro-form-demo')

    expect(app.menuStore.activeKey).toBe('ProFormDemo')
    expect(app.tabsStore.activeKey).toBe('ProFormDemo')
    expect(app.tabsStore.items.find(item => item.key === 'Home')?.pinned).toBe(true)
    expect(app.tabsStore.items.find(item => item.key === 'Home')?.closable).toBe(false)
    expect(app.tabsStore.items.some(item => item.key === 'ProFormDemo')).toBe(true)

    await router.push('/pro-detail-demo')
    await nextTick()

    expect(app.menuStore.activeKey).toBe('ProDetailDemo')
    expect(app.tabsStore.activeKey).toBe('ProDetailDemo')
    expect(app.tabsStore.items.some(item => item.key === 'Home')).toBe(true)

    app.unmount()
  })
})
