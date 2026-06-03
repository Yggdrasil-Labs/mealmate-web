import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/modules/meal-plan/api', () => ({
  getRecommendRecipes: vi.fn(),
  searchRecipes: vi.fn(),
  adjustMealItem: vi.fn(),
  getItemHistory: vi.fn(),
}))

// ElMessage 在 jsdom 外不可用，stub 掉只验证调用
vi.mock('element-plus', () => ({
  ElMessage: { warning: vi.fn(), error: vi.fn() },
}))

const api = await import('@/modules/meal-plan/api')
const { ElMessage } = await import('element-plus')
const { useAdjustMealItem } = await import('@/modules/meal-plan/composables/useAdjustMealItem')

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('useAdjustMealItem', () => {
  it('loads recommend list on openAdjust', async () => {
    vi.mocked(api.getRecommendRecipes).mockResolvedValue([
      { recipeId: 1, name: 'A', recipeType: '', seasonTag: '' },
    ])
    const c = useAdjustMealItem()
    await c.openAdjust(1, 10)
    expect(api.getRecommendRecipes).toHaveBeenCalledWith(1, 10)
    expect(c.recommendList.value).toHaveLength(1)
  })

  it('debounces search by 300ms', async () => {
    vi.useFakeTimers()
    vi.mocked(api.searchRecipes).mockResolvedValue([])
    const c = useAdjustMealItem()
    c.doSearch('鸡')
    c.doSearch('鸡胸')
    expect(api.searchRecipes).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(300)
    expect(api.searchRecipes).toHaveBeenCalledTimes(1)
    expect(api.searchRecipes).toHaveBeenCalledWith('鸡胸')
  })

  it('confirmAdjust calls api with current ids and updates the store', async () => {
    const updated = { itemId: 10, recipeId: 200 } as any
    vi.mocked(api.adjustMealItem).mockResolvedValue(updated)
    const c = useAdjustMealItem()
    c.planId.value = 1
    c.itemId.value = 10
    const res = await c.confirmAdjust(200, 'OTHER')
    expect(api.adjustMealItem).toHaveBeenCalledWith(1, 10, { newRecipeId: 200, adjustReason: 'OTHER' })
    expect(res).toBe(updated)
  })

  it('returns null and warns when the recipe duplicates in the week', async () => {
    vi.mocked(api.adjustMealItem).mockRejectedValue({ response: { data: { errCode: 'RECIPE_DUPLICATE_IN_WEEK' } } })
    const c = useAdjustMealItem()
    const res = await c.confirmAdjust(200)
    expect(res).toBeNull()
    expect(ElMessage.warning).toHaveBeenCalled()
  })

  it('loads history list', async () => {
    vi.mocked(api.getItemHistory).mockResolvedValue([
      { historyId: 1, oldRecipeName: 'A', newRecipeName: 'B', adjustReason: 'OTHER', adjustedAt: '2026-06-01' },
    ])
    const c = useAdjustMealItem()
    await c.loadHistory(1, 10)
    expect(c.historyList.value).toHaveLength(1)
  })
})
