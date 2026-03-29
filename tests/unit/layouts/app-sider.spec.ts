// @vitest-environment jsdom
import type { MenuNode } from '@/stores/menu'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import AppSider from '@/layouts/components/AppSider.vue'

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

async function mountSider(options: { tree?: MenuNode[], collapsed?: boolean, mobile?: boolean, drawerVisible?: boolean } = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  mountedContainers.push(container)

  const onToggleCollapse = vi.fn()
  const tree = options.tree ?? [
    { key: 'Home', path: '/', title: '首页', icon: 'menu-dashboard' },
    { key: 'CatalogPage', path: '/catalog', title: '商品目录', icon: 'edit' },
  ]

  const Host = defineComponent({
    setup() {
      return () => h(AppSider, {
        tree,
        activeKey: 'CatalogPage',
        openKeys: ['Home'],
        collapsed: options.collapsed ?? false,
        mobile: options.mobile ?? false,
        drawerVisible: options.drawerVisible ?? true,
        onToggleCollapse,
      })
    },
  })

  const app = createApp(Host)
  app.mount(container)
  await nextTick()

  return {
    container,
    onToggleCollapse,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('app sider', () => {
  it('renders menu tree and an icon-only collapse toggle without hero copy', async () => {
    const app = await mountSider()
    const sider = app.container.querySelector<HTMLElement>('.app-sider')
    const toolbar = app.container.querySelector<HTMLElement>('.app-sider__toolbar')
    const firstItem = app.container.querySelector<HTMLElement>('.app-sider__item')

    expect(app.container.textContent).toContain('首页')
    expect(app.container.textContent).toContain('商品目录')
    expect(app.container.textContent).not.toContain('Workspace navigation')
    expect(app.container.textContent).not.toContain('主导航')
    expect(sider).not.toBeNull()
    expect(toolbar).not.toBeNull()
    expect(firstItem).not.toBeNull()

    const toggle = app.container.querySelector<HTMLButtonElement>('[data-testid="sider-toggle"]')

    expect(toggle?.getAttribute('aria-label')).toBe('收起菜单')
    expect(toggle?.querySelector('[data-testid="sider-toggle-fold"]')).not.toBeNull()
    expect(toggle?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('fold')
    expect(toggle?.textContent?.trim()).toBe('')

    toggle
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(app.onToggleCollapse).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('renders menu icons alongside titles in expanded mode', async () => {
    const app = await mountSider()

    const item = app.container.querySelector('.app-sider__item')
    const iconHost = item?.querySelector('.app-sider__icon')
    const title = item?.querySelector('.app-sider__title')

    expect(iconHost).not.toBeNull()
    expect(title?.textContent).toBe('首页')

    app.unmount()
  })

  it('renders collapsed navigation as an icon rail with accessible labels', async () => {
    const app = await mountSider({ collapsed: true })

    const items = app.container.querySelectorAll<HTMLButtonElement>('.app-sider__item')
    const homeItem = items[0]
    const activeItem = items[1]
    const toggle = app.container.querySelector<HTMLButtonElement>('[data-testid="sider-toggle"]')

    expect(homeItem?.querySelector('.app-sider__title')).toBeNull()
    expect(homeItem?.getAttribute('title')).toBe('首页')
    expect(homeItem?.getAttribute('aria-label')).toBe('首页')
    expect(activeItem?.classList.contains('is-active')).toBe(true)
    expect(toggle?.querySelector('[data-testid="sider-toggle-expand"]')).not.toBeNull()
    expect(toggle?.querySelector('.app-icon-stub')?.getAttribute('data-icon-name')).toBe('expand')

    app.unmount()
  })

  it('does not render a separate close drawer button on mobile', async () => {
    const app = await mountSider({ mobile: true, drawerVisible: true })

    expect(app.container.textContent).not.toContain('关闭抽屉')
    expect(app.container.querySelectorAll('[data-testid="sider-toggle"]')).toHaveLength(1)

    app.unmount()
  })
})
