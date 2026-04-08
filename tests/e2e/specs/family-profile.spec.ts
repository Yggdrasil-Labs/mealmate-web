import { expect, test } from '@playwright/test'

test.describe('family profile', () => {
  test('uses a mobile-safe single-column layout and full-screen drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto('/family/profile')

    await expect(page.getByTestId('family-profile-title')).toContainText('MealMate 家庭')

    const desktopGrid = page.getByTestId('family-member-grid-list')
    const desktopColumnCount = await desktopGrid.evaluate((element) => {
      const styles = window.getComputedStyle(element)
      return styles.gridTemplateColumns.split(' ').filter(Boolean).length
    })
    expect(desktopColumnCount).toBeGreaterThan(1)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.reload()

    await expect(page.getByTestId('family-profile-title')).toContainText('MealMate 家庭')

    const grid = page.getByTestId('family-member-grid-list')
    await expect(grid).toBeVisible()

    const columnCount = await grid.evaluate((element) => {
      const styles = window.getComputedStyle(element)
      return styles.gridTemplateColumns.split(' ').filter(Boolean).length
    })
    expect(columnCount).toBe(1)

    const editButton = page.getByTestId('family-member-edit').first()
    const deleteButton = page.getByTestId('family-member-delete').first()
    await expect(editButton).toBeVisible()
    await expect(deleteButton).toBeVisible()

    await editButton.click()

    const drawer = page.getByTestId('family-member-drawer')
    await expect(drawer).toBeVisible()
    await expect(page.locator('.family-member-drawer__mask')).toBeVisible()

    const drawerWidth = await drawer.evaluate(element => element.getBoundingClientRect().width)
    expect(drawerWidth).toBeGreaterThanOrEqual(340)
  })
})
