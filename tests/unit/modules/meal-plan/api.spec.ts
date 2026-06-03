import { beforeEach, describe, expect, it, vi } from 'vitest'

// 直接 mock http，验证每个 API 函数的请求方法、路径与参数
vi.mock('@/utils/api/http', () => ({
  default: {
    get: vi.fn(() => Promise.resolve(undefined)),
    put: vi.fn(() => Promise.resolve(undefined)),
  },
}))

const { default: http } = await import('@/utils/api/http')
const {
  adjustMealItem,
  getCurrentWeekPlan,
  getItemHistory,
  getRecommendRecipes,
  getWeekPlan,
  searchRecipes,
} = await import('@/modules/meal-plan/api')

beforeEach(() => {
  vi.mocked(http.get).mockClear()
  vi.mocked(http.put).mockClear()
})

describe('meal-plan api', () => {
  it('adjustMealItem PUTs to /api/meal-plans/{planId}/items/{itemId}', async () => {
    const body = { newRecipeId: 200, adjustReason: 'OTHER' as const }
    await adjustMealItem(1, 10, body)
    expect(http.put).toHaveBeenCalledWith('/api/meal-plans/1/items/10', body)
  })

  it('getCurrentWeekPlan GETs /current with params', async () => {
    await getCurrentWeekPlan({ weekStartDate: '2026-06-01' })
    expect(http.get).toHaveBeenCalledWith('/api/meal-plans/current', { params: { weekStartDate: '2026-06-01' } })
  })

  it('getWeekPlan GETs by planId', async () => {
    await getWeekPlan(7)
    expect(http.get).toHaveBeenCalledWith('/api/meal-plans/7')
  })

  it('getRecommendRecipes GETs the recommend endpoint', async () => {
    await getRecommendRecipes(1, 10)
    expect(http.get).toHaveBeenCalledWith('/api/meal-plans/1/items/10/recommend')
  })

  it('getItemHistory GETs the history endpoint', async () => {
    await getItemHistory(1, 10)
    expect(http.get).toHaveBeenCalledWith('/api/meal-plans/1/items/10/history')
  })

  it('searchRecipes GETs /api/recipes/search with keyword', async () => {
    await searchRecipes('鸡')
    expect(http.get).toHaveBeenCalledWith('/api/recipes/search', { params: { keyword: '鸡' } })
  })
})
