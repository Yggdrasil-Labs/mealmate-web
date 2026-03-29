import { expect, test } from '@playwright/test'
import { ProTableDemoPage } from '../pages/ProTableDemoPage'

test.describe('ProTable 示例页', () => {
  test('表格有数据行且自定义名称列渲染', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()
    await expect(p.tableBodyRows().first()).toBeVisible()
    await expect(p.tableBodyRows()).toHaveCount(10)
    await expect(page.getByTestId('pro-table-demo-custom-name').first()).toContainText('★')
  })

  test('分页可切换且第二页首行与第一页不同', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()
    const firstPageCell = (await p.firstNameCell().textContent())?.trim() ?? ''
    await p.clickPaginationNext()
    await expect(p.tableBodyRows().first()).toBeVisible()
    await expect(p.tableBodyRows()).toHaveCount(10)
    const secondPageCell = (await p.firstNameCell().textContent())?.trim() ?? ''
    expect(secondPageCell).not.toBe(firstPageCell)
  })

  test('清空数据后展示空态', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()
    await p.clickClearData()
    await expect(p.root().locator('.el-table__empty-block')).toBeVisible()
    await p.clickRestoreData()
    await expect(p.tableBodyRows().first()).toBeVisible()
  })

  test('模拟失败后错误条与重试', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()
    await p.clickSimulateError()
    await expect(p.root().locator('.el-alert--error')).toBeVisible()
    await expect(p.tableBodyRows().first()).toBeVisible()
    await p.clickRetry()
    await expect(p.root().locator('.el-alert--error')).toHaveCount(0)
  })

  test('点击链接和行操作不会触发行点击', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()
    await expect(p.rowClickCount()).toContainText('0')

    await p.dispatchClickOnFirstLinkCell()
    await expect(p.rowClickCount()).toContainText('0')

    await p.dispatchClickOnFirstInlineActionButton()
    await expect(p.rowClickCount()).toContainText('0')
    await expect(p.lastAction()).toContainText('view:')
  })
})
