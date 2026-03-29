import type { Locator, Page } from '@playwright/test'

/**
 * ProTable 示例页
 */
export class ProTableDemoPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/pro-table-demo')
    await this.resetViewportOrigin()
  }

  root() {
    return this.page.getByTestId('pro-table-demo')
  }

  tableBodyRows() {
    return this.root().locator('.el-table__body-wrapper tbody tr')
  }

  async clickClearData() {
    await this.resetViewportOrigin()
    await this.clickInViewport(this.page.getByTestId('pro-table-demo-clear-data'))
  }

  async clickRestoreData() {
    await this.resetViewportOrigin()
    await this.clickInViewport(this.page.getByTestId('pro-table-demo-restore-data'))
  }

  async clickPaginationNext() {
    await this.resetViewportOrigin()
    const pagination = this.root().getByTestId('pro-table-pagination')
    await this.clickInViewport(pagination.locator('.btn-next'))
  }

  async clickSimulateError() {
    await this.resetViewportOrigin()
    await this.clickInViewport(this.page.getByTestId('pro-table-demo-trigger-error'))
  }

  async clickRetry() {
    await this.resetViewportOrigin()
    await this.clickInViewport(this.root().getByTestId('pro-table-retry'))
  }

  batchCount() {
    return this.page.getByTestId('pro-table-demo-batch')
  }

  rowClickCount() {
    return this.page.getByTestId('pro-table-demo-row-click-count')
  }

  lastAction() {
    return this.page.getByTestId('pro-table-demo-last-action')
  }

  async toggleRowSelection(index: number) {
    await this.resetViewportOrigin()
    const row = this.tableBodyRows().nth(index)
    const checkbox = row.locator('.el-checkbox').first()

    await row.scrollIntoViewIfNeeded()
    await this.resetTableScrollLeft()
    await this.clickInViewport(checkbox)
  }

  /** 名称列（示例页带自定义插槽 ★） */
  firstNameCell() {
    return this.page.getByTestId('pro-table-demo-custom-name').first()
  }

  firstLinkCell() {
    return this.page.getByTestId('pro-table-cell-link').first()
  }

  async dispatchClickOnFirstLinkCell() {
    await this.firstLinkCell().dispatchEvent('click')
  }

  firstInlineActionButton() {
    return this.tableBodyRows().first().getByRole('button', { name: '查看' })
  }

  async dispatchClickOnFirstInlineActionButton() {
    await this.firstInlineActionButton().dispatchEvent('click')
  }

  private async clickInViewport(locator: Locator) {
    await locator.scrollIntoViewIfNeeded()
    await locator.click()
  }

  private async resetViewportOrigin() {
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      for (const selector of ['.default-layout__main', '.default-layout__page-container']) {
        const element = document.querySelector<HTMLElement>(selector)
        if (element)
          element.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    })
    await this.resetTableScrollLeft()
  }

  private async resetTableScrollLeft() {
    await this.page.evaluate(() => {
      const selectors = [
        '.pro-table__scroll',
        '.el-table__body-wrapper',
        '.el-table__header-wrapper',
      ]

      for (const selector of selectors) {
        const element = document.querySelector<HTMLElement>(selector)
        if (element)
          element.scrollLeft = 0
      }
    })
  }
}
