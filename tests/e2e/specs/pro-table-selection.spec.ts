import { expect, test } from '@playwright/test'
import { ProTableDemoPage } from '../pages/ProTableDemoPage'

test.describe('ProTable 跨页选择', () => {
  test('跨页勾选后保留前一页已选项', async ({ page }) => {
    const p = new ProTableDemoPage(page)
    await p.goto()

    await p.toggleRowSelection(0)
    await expect(p.batchCount()).toContainText('1')

    await p.clickPaginationNext()
    await p.toggleRowSelection(0)
    await expect(p.batchCount()).toContainText('2')
  })
})
