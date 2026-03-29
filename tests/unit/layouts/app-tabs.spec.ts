// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import AppTabs from '@/layouts/components/AppTabs.vue'

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

async function mountTabs() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  const Host = defineComponent({
    setup() {
      return () => h(AppTabs, {
        items: [
          { key: 'Home', routeName: 'Home', path: '/', fullPath: '/', title: '首页', closable: false, pinned: true },
          { key: 'ProFormDemo', routeName: 'ProFormDemo', path: '/pro-form-demo', fullPath: '/pro-form-demo', title: 'ProForm 示例', closable: true, pinned: false },
        ],
        activeKey: 'ProFormDemo',
      })
    },
  })

  const app = createApp(Host)
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

describe('app tabs', () => {
  it('renders pinned home tab', async () => {
    const app = await mountTabs()
    const pinnedBadge = app.container.querySelector<HTMLElement>('.app-tabs__badge')

    expect(app.container.textContent).toContain('首页')
    expect(app.container.textContent).toContain('ProForm 示例')
    expect(pinnedBadge?.textContent?.trim()).toBe('')
    expect(pinnedBadge?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('success')

    app.unmount()
  })

  it('renders a compact toolbar with clear active tab markers', async () => {
    const app = await mountTabs()

    const summary = app.container.querySelector<HTMLElement>('.app-tabs__summary')
    const bar = app.container.querySelector<HTMLElement>('.app-tabs__bar')
    const list = app.container.querySelector<HTMLElement>('.app-tabs__list')
    const tools = app.container.querySelector<HTMLElement>('.app-tabs__actions')
    const activeItem = app.container.querySelector<HTMLElement>('.app-tabs__item.is-active')
    const actions = app.container.querySelectorAll<HTMLElement>('.app-tabs__action')
    const refreshAction = app.container.querySelector<HTMLElement>('[data-testid="tabs-refresh-current"]')
    const closeOthersAction = app.container.querySelector<HTMLElement>('[data-testid="tabs-close-others"]')

    expect(summary).toBeNull()
    expect(list?.parentElement).toBe(bar)
    expect(tools?.parentElement).toBe(bar)
    expect(activeItem).not.toBeNull()
    expect(actions).toHaveLength(2)
    expect(refreshAction?.getAttribute('aria-label')).toBe('刷新当前')
    expect(refreshAction?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('refresh')
    expect(refreshAction?.textContent?.trim()).toBe('')
    expect(closeOthersAction?.getAttribute('aria-label')).toBe('关闭其他')
    expect(closeOthersAction?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('close')
    expect(closeOthersAction?.textContent?.trim()).toBe('')

    app.unmount()
  })
})
