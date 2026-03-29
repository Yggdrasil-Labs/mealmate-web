import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { LayoutShellPage } from './LayoutShellPage'

const PAGE_TITLE_RE = /Asgard Frontend/
const WINDOW_SIZE_RE = /\d+ × \d+/
const MOUSE_POSITION_RE = /\(\d+, \d+\)/

/**
 * 首页页面对象类
 */
export class HomePage extends BasePage {
  private readonly navbar: Locator
  private readonly navBrandTitle: Locator
  private readonly heroTitle: Locator
  private readonly gradientText: Locator
  private readonly heroSubtitle: Locator
  private readonly featureCards: Locator
  private readonly demoContentHeaders: Locator
  private readonly demoContentParagraphs: Locator
  private readonly envKeys: Locator
  private readonly heroContent: Locator
  private readonly shell: LayoutShellPage

  constructor(page: Page) {
    super(page)

    this.navbar = page.locator('.navbar')
    this.navBrandTitle = page.locator('.nav-brand h1')
    this.heroTitle = page.locator('.hero-title')
    this.gradientText = page.locator('.gradient-text')
    this.heroSubtitle = page.locator('.hero-subtitle')
    this.featureCards = page.locator('.feature-card')
    this.demoContentHeaders = page.locator('.demo-content h4')
    this.demoContentParagraphs = page.locator('.demo-content p')
    this.envKeys = page.locator('.env-key')
    this.heroContent = page.locator('.hero-content')
    this.shell = new LayoutShellPage(page)
  }

  async navigateToHome() {
    await this.goto('/')
    await this.waitForLoadState()
  }

  async verifyPageTitle() {
    await this.expectTitleToContain(PAGE_TITLE_RE)
  }

  async verifyNavbar() {
    await this.expectElementVisible(this.navbar)
    await this.expectElementToContainText(this.navBrandTitle, 'Asgard Frontend Template')
  }

  async verifyHeroSection() {
    await this.expectElementToContainText(this.heroTitle, '面向通用场景的')
    await this.expectElementToContainText(this.gradientText, 'Vue 3 模板工程')
    await this.expectElementToContainText(this.heroSubtitle, '仅保留基础能力')
  }

  async verifyFeatureCards() {
    await this.expectElementCount(this.featureCards, 3)
    await this.expectElementToContainText(this.featureCards.first(), '技术栈基线')
    await this.expectElementToContainText(this.featureCards.nth(1), '运行时演示')
    await this.expectElementToContainText(this.featureCards.nth(2), '环境信息')
  }

  async verifyVueUseDemo() {
    await this.expectElementToContainText(this.demoContentHeaders.nth(0), '窗口尺寸')
    await this.expectElementToContainText(this.demoContentHeaders.nth(1), '鼠标位置')
    await this.expectElementToContainText(this.demoContentHeaders.nth(2), '深色模式')

    const windowSizeText = await this.getElementText(this.demoContentParagraphs.nth(0))
    expect(windowSizeText).toMatch(WINDOW_SIZE_RE)

    const mousePositionText = await this.getElementText(this.demoContentParagraphs.nth(1))
    expect(mousePositionText).toMatch(MOUSE_POSITION_RE)
  }

  async verifyEnvironmentInfo() {
    const expectedEnvKeys = [
      '运行模式',
      '应用环境',
      '应用名称',
      '应用版本',
      'API 地址',
      '开发模式',
      '生产模式',
      '测试模式',
    ]

    for (let i = 0; i < expectedEnvKeys.length; i++) {
      await this.expectElementToContainText(this.envKeys.nth(i), expectedEnvKeys[i]!)
    }
  }

  async verifyResponsiveDesign() {
    await this.setViewportSize({ width: 1200, height: 800 })
    await this.expectElementVisible(this.heroContent)

    await this.setViewportSize({ width: 375, height: 667 })
    await this.expectElementVisible(this.heroContent)
  }

  layoutShell() {
    return this.shell
  }
}
