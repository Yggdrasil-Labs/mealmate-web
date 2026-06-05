import { beforeEach, describe, expect, it, vi } from 'vitest'

// mock http 返回 COLA 统一响应 { data: ... }
vi.mock('@/utils/api/http', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: null })),
    put: vi.fn(() => Promise.resolve({ data: null })),
    post: vi.fn(() => Promise.resolve({ data: null })),
    delete: vi.fn(() => Promise.resolve({ data: null })),
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
  replaceItem,
  generatePlan,
} = await import('@/modules/meal-plan/api')

beforeEach(() => {
  vi.mocked(http.get).mockClear()
  vi.mocked(http.put).mockClear()
  vi.mocked(http.post).mockClear()
  vi.mocked(http.delete).mockClear()
})

describe('meal-plan api', () => {
  it('adjustMealItem PUTs to /api/meal-plans/{planId}/items/{itemId}', async () => {
    const body = { newRecipeId: 200, adjustReason: 'OTHER' as const }
    await adjustMealItem(1, 10, body)
    expect(http.put).toHaveBeenCalledWith('/api/meal-plans/1/items/10', body)
  })

  it('getCurrentWeekPlan GETs /current with params', async () => {
    await getCurrentWeekPlan({ weekStartDate: '2026-06-01' })
    expect(http.get).toHaveBeenCalledWith('/api/meal-plans/current', { weekStartDate: '2026-06-01' })
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
    expect(http.get).toHaveBeenCalledWith('/api/recipes/search', { keyword: '鸡' })
  })

  it('replaceItem PUTs to /api/meal-plans/{planId}/items/{itemId}/replace', async () => {
    await replaceItem(1, 10, { newRecipeId: 300 })
    expect(http.put).toHaveBeenCalledWith('/api/meal-plans/1/items/10/replace', { newRecipeId: 300 })
  })

  it('generatePlan POSTs to /api/meal-plans/generate', async () => {
    await generatePlan({ weekStartDate: '2026-06-02', forceRegenerate: true })
    expect(http.post).toHaveBeenCalledWith('/api/meal-plans/generate', { weekStartDate: '2026-06-02', forceRegenerate: true })
  })
})
