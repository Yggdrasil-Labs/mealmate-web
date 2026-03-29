import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

const PAGE_TITLE_RE = /MealMate/

/**
 * 首页页面对象类
 */
export class HomePage extends BasePage {
  private readonly homeCard: Locator
  private readonly eyebrow: Locator
  private readonly title: Locator
  private readonly subtitle: Locator
  private readonly highlights: Locator

  constructor(page: Page) {
    super(page)

    this.homeCard = page.locator('.demo-clean__card')
    this.eyebrow = page.locator('.demo-clean__eyebrow')
    this.title = page.locator('.demo-clean h1')
    this.subtitle = page.locator('.demo-clean__subtitle')
    this.highlights = page.locator('.demo-clean__highlight')
  }

  async navigateToHome() {
    await this.goto('/')
    await this.waitForLoadState()
  }

  async verifyPageTitle() {
    await this.expectTitleToContain(PAGE_TITLE_RE)
  }

  async verifyHomeContent() {
    await this.expectElementVisible(this.homeCard)
    await this.expectElementToContainText(this.eyebrow, '项目首页')
    await this.expectElementToContainText(this.title, '内容已整理')
    await this.expectElementToContainText(this.subtitle, '正式内容')
    await this.expectElementCount(this.highlights, 2)
    await this.expectElementToContainText(this.highlights.first(), '当前状态')
    await this.expectElementToContainText(this.highlights.nth(1), '下一步')
  }

  async verifyResponsiveDesign() {
    await this.setViewportSize({ width: 1200, height: 800 })
    await this.expectElementVisible(this.homeCard)

    await this.setViewportSize({ width: 375, height: 667 })
    await this.expectElementVisible(this.homeCard)
  }
}
