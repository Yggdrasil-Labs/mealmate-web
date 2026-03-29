import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LayoutShellPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  navigation() {
    return this.page.getByRole('navigation', { name: '主导航' })
  }

  sider() {
    return this.page.getByTestId('layout-sider')
  }

  headerNavToggle() {
    return this.page.getByTestId('header-nav-toggle')
  }

  siderToggle() {
    return this.page.getByTestId('sider-toggle')
  }

  tabs() {
    return this.page.getByRole('tablist', { name: '页面标签' })
  }

  main() {
    return this.page.locator('.default-layout__main')
  }

  tab(name: string) {
    return this.page.getByRole('tab', { name })
  }

  tabClose(name: string) {
    return this.page.getByTestId(`tab-close-${this.tabKeyFromTitle(name)}`)
  }

  refreshCurrentTab() {
    return this.page.getByTestId('tabs-refresh-current')
  }

  closeOtherTabs() {
    return this.page.getByTestId('tabs-close-others')
  }

  menuItem(name: string) {
    return this.navigation().getByRole('button', { name })
  }

  iconRailItem(name: string) {
    return this.navigation().getByRole('button', { name })
  }

  async openMenuItem(name: string) {
    if (!(await this.navigation().isVisible()))
      await this.openMobileDrawer()

    await this.menuItem(name).click()
  }

  async openMobileDrawer() {
    await this.headerNavToggle().click()
  }

  async toggleDesktopCollapse() {
    await this.siderToggle().click()
  }

  async selectTab(name: string) {
    await this.tab(name).click()
  }

  async closeTab(name: string) {
    await this.page.getByTestId(`tab-close-${this.tabKeyFromTitle(name)}`).click()
  }

  async refreshActiveTab() {
    await this.refreshCurrentTab().click()
  }

  async closeInactiveTabs() {
    await this.closeOtherTabs().click()
  }

  async expectNavigationVisible() {
    await this.expectElementVisible(this.navigation())
  }

  async expectTabVisible(name: string) {
    await this.expectElementVisible(this.tab(name))
  }

  async expectDrawerHidden() {
    await this.expectElementHidden(this.sider())
  }

  async expectDrawerVisible() {
    await this.expectElementVisible(this.sider())
  }

  async expectIconRailItemVisible(name: string) {
    const item = this.iconRailItem(name)
    await this.expectElementVisible(item)
    await expect(item).toHaveAttribute('aria-label', name)
  }

  async injectScrollableContent() {
    await this.page.evaluate(() => {
      const surface = document.querySelector<HTMLElement>('.default-layout__main-surface')
      if (!surface)
        throw new Error('Missing .default-layout__main-surface')

      let probe = surface.querySelector<HTMLElement>('[data-scroll-probe="true"]')
      if (!probe) {
        probe = document.createElement('div')
        probe.dataset.scrollProbe = 'true'
        probe.style.height = '2400px'
        probe.style.marginTop = '24px'
        probe.style.borderRadius = '24px'
        probe.style.background = 'linear-gradient(180deg, rgba(47, 111, 235, 0.08), rgba(47, 111, 235, 0.2))'
        surface.appendChild(probe)
      }
    })
  }

  async scrollMainTo(offset: number) {
    await this.main().evaluate((element, nextOffset) => {
      element.scrollTo({ top: nextOffset, behavior: 'instant' as ScrollBehavior })
    }, offset)
  }

  async expectMainScrollWithoutWindowScroll() {
    await expect.poll(async () => {
      return await this.main().evaluate((element) => {
        return {
          mainScrollTop: element.scrollTop,
          windowScrollY: window.scrollY,
        }
      })
    }).toMatchObject({
      mainScrollTop: expect.any(Number),
      windowScrollY: 0,
    })

    const { mainScrollTop, windowScrollY } = await this.main().evaluate((element) => {
      return {
        mainScrollTop: element.scrollTop,
        windowScrollY: window.scrollY,
      }
    })

    expect(mainScrollTop).toBeGreaterThan(0)
    expect(windowScrollY).toBe(0)
  }

  private tabKeyFromTitle(title: string) {
    const tabKeyMap: Record<string, string> = {
      '首页': 'Home',
      'ProDialog 示例': 'ProDialogDemo',
      'ProForm 示例': 'ProFormDemo',
      'ProDetail 示例': 'ProDetailDemo',
      'ProTable 示例': 'ProTableDemo',
      'SearchBar 示例': 'SearchBarDemo',
    }

    return tabKeyMap[title] ?? title
  }
}
