// @vitest-environment jsdom
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import AppLayoutRenderer from '@/app/shell/AppLayoutRenderer.vue'
import { resolveLayout } from '@/app/shell/layout-registry'
import i18n from '@/locales/i18n'

vi.mock('@/layouts/components/AppHeader.vue', () => ({
  default: defineComponent({
    name: 'AppHeaderStub',
    setup() {
      return () => h('header', { class: 'app-header-stub' }, 'header')
    },
  }),
}))

vi.mock('@/layouts/components/AppSider.vue', () => ({
  default: defineComponent({
    name: 'AppSiderStub',
    setup() {
      return () => h('aside', { class: 'app-sider-stub' }, 'sider')
    },
  }),
}))

vi.mock('@/layouts/components/AppTabs.vue', () => ({
  default: defineComponent({
    name: 'AppTabsStub',
    setup() {
      return () => h('section', { class: 'app-tabs-stub' }, 'tabs')
    },
  }),
}))

vi.mock('@/app/shell/AppPageRenderer.vue', () => ({
  default: defineComponent({
    name: 'AppPageRendererStub',
    setup() {
      return () => h('div', { class: 'app-page-renderer-stub' }, 'page')
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

async function mountLayout(layout: string) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: AppLayoutRenderer,
        meta: { layout },
      },
    ],
  })

  const Host = defineComponent({
    setup() {
      return () => h(RouterView)
    },
  })

  const app = createApp(Host)
  app.use(createPinia())
  app.use(i18n)
  app.use(router)
  await router.push('/')
  await router.isReady()
  app.mount(container)
  await nextTick()

  return {
    container,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('app layout renderer', () => {
  it('resolves known and unknown layouts through the registry', () => {
    expect(resolveLayout('default')).toBeTruthy()
    expect(resolveLayout('blank')).toBeTruthy()
    expect(resolveLayout('workspace')).toBe(resolveLayout('default'))
  })

  it('renders blank layout for blank route meta', async () => {
    const app = await mountLayout('blank')

    expect(app.container.innerHTML).toContain('blank-layout')

    app.unmount()
  })
})
