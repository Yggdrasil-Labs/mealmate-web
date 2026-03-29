// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import i18n from '@/locales/i18n'
import { useAppShellStore } from '@/stores'

vi.mock('@/components/icon/AppIcon.vue', () => ({
  default: defineComponent({
    name: 'AppIcon',
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      return () => h('span', { 'class': 'app-icon-stub', 'data-icon-name': props.name })
    },
  }),
}))

const mountedContainers: HTMLElement[] = []

afterEach(() => {
  mountedContainers.splice(0).forEach((container) => {
    container.remove()
  })
  document.body.innerHTML = ''
})

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true,
  })
  window.dispatchEvent(new Event('resize'))
}

function createDummyPage(name: string) {
  return defineComponent({
    name,
    setup() {
      return () => h('div', { class: `${name.toLowerCase()}-page` }, name)
    },
  })
}

async function mountResponsiveShell(width: number) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  setViewportWidth(width)

  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: DefaultLayout,
        children: [
          {
            path: '',
            name: 'Home',
            component: createDummyPage('Home'),
            meta: {
              title: '首页',
              tab: { enabled: true, closable: false, pinned: true, singleton: true },
              keepAlive: { enabled: false, strategy: 'routeName' },
            },
          },
        ],
      },
    ],
  })

  const app = createApp(defineComponent({
    setup() {
      return () => h(RouterView)
    },
  }))

  app.use(pinia)
  app.use(i18n)
  app.use(router)
  await router.push('/')
  await router.isReady()
  app.mount(container)
  await nextTick()
  await nextTick()

  return {
    app,
    container,
    shellStore: useAppShellStore(),
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('responsive shell', () => {
  it('applies breakpoint state in the shell store', () => {
    setActivePinia(createPinia())
    const shellStore = useAppShellStore()

    shellStore.setViewportWidth(375)
    expect(shellStore.device).toBe('mobile')
    expect(shellStore.drawerVisible).toBe(false)
    expect(shellStore.siderCollapsed).toBe(false)

    shellStore.setViewportWidth(1024)
    expect(shellStore.device).toBe('tablet')
    expect(shellStore.drawerVisible).toBe(false)
    expect(shellStore.siderCollapsed).toBe(true)

    shellStore.setViewportWidth(1440)
    expect(shellStore.device).toBe('desktop')
    expect(shellStore.drawerVisible).toBe(false)
    expect(shellStore.siderCollapsed).toBe(false)
  })

  it('switches to drawer navigation on mobile width', async () => {
    const app = await mountResponsiveShell(375)
    const navToggle = app.container.querySelector<HTMLElement>('[data-testid="header-nav-toggle"]')
    const tabs = app.container.querySelector<HTMLElement>('.app-tabs')

    expect(app.shellStore.device).toBe('mobile')
    expect(app.container.querySelector('.app-sider')?.classList.contains('is-hidden')).toBe(true)
    expect(navToggle?.getAttribute('aria-label')).toBe('打开菜单')
    expect(navToggle?.textContent?.trim()).toBe('')
    expect(navToggle?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('expand')
    expect(tabs).toBeNull()

    app.container.querySelector('[data-testid="header-nav-toggle"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(app.shellStore.drawerVisible).toBe(true)
    expect(app.container.querySelector('.app-sider')?.classList.contains('is-hidden')).toBe(false)
    expect(navToggle?.getAttribute('aria-label')).toBe('关闭菜单')
    expect(navToggle?.textContent?.trim()).toBe('')
    expect(navToggle?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('close')

    app.unmount()
  })

  it('locks the shell to the viewport and delegates scrolling to the main region', async () => {
    const app = await mountResponsiveShell(1440)

    const shellRoot = app.container.querySelector<HTMLElement>('.default-layout')
    const shellViewport = app.container.querySelector<HTMLElement>('.default-layout__shell')
    const shellBody = app.container.querySelector<HTMLElement>('.default-layout__body')
    const header = app.container.querySelector<HTMLElement>('.app-header')
    const navToggle = app.container.querySelector<HTMLElement>('[data-testid="header-nav-toggle"]')
    const content = app.container.querySelector<HTMLElement>('.default-layout__content')
    const main = app.container.querySelector<HTMLElement>('.default-layout__main')
    const surface = app.container.querySelector<HTMLElement>('.default-layout__main-surface')
    const pageContainer = app.container.querySelector<HTMLElement>('.default-layout__page-container')

    expect(shellRoot).not.toBeNull()
    expect(shellViewport).not.toBeNull()
    expect(shellBody).not.toBeNull()
    expect(header).not.toBeNull()
    expect(navToggle).toBeNull()
    expect(content).not.toBeNull()
    expect(main).not.toBeNull()
    expect(surface).not.toBeNull()
    expect(pageContainer).not.toBeNull()
    expect(surface?.contains(pageContainer as Node)).toBe(true)

    app.unmount()
  })
})
