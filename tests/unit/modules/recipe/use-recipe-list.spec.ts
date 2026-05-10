import type { RecipeFilters, RecipeSummary } from '@/modules/recipe/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useRecipeList } from '@/modules/recipe/composables/useRecipeList'
import { createDefaultRecipeFilters } from '@/modules/recipe/constants'

vi.mock('@/modules/recipe/api', () => ({
  fetchRecipePage: vi.fn(),
}))

const { fetchRecipePage } = await import('@/modules/recipe/api')
const fetchRecipePageMock = vi.mocked(fetchRecipePage)

const recipeSummary: RecipeSummary = {
  recipeId: 'recipe-1',
  name: '番茄牛腩煲',
  recipeType: 'HOME_COOKING',
  sourceType: 'MANUAL',
  crowdTag: 'FAMILY',
  seasonTag: 'AUTUMN',
  difficultyLevel: 'MEDIUM',
  cookingTimeMin: 60,
  coverImageUrl: '',
  isBabyFriendly: false,
  isWeightLossFriendly: false,
  status: 'PUBLISHED',
}

async function installRouter(query: Record<string, string> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/recipes', component: { template: '<div />' } }],
  })

  await router.push({ path: '/recipes', query })
  await router.isReady()
  return router
}

beforeEach(() => {
  vi.useRealTimers()
  fetchRecipePageMock.mockReset()
  fetchRecipePageMock.mockImplementation(async (filters: RecipeFilters) => ({
    list: [recipeSummary],
    total: 1,
    pageNum: filters.pageNum,
    pageSize: filters.pageSize,
  }))
})

describe('useRecipeList', () => {
  it('loads the initial recipe page with default filters', async () => {
    const router = await installRouter()

    const list = useRecipeList({ routeQuery: router.currentRoute.value.query })
    await list.ready

    expect(fetchRecipePageMock).toHaveBeenCalledWith(createDefaultRecipeFilters())
    expect(list.items.value).toEqual([recipeSummary])
    expect(list.total.value).toBe(1)
    expect(list.loading.value).toBe(false)
    expect(list.error.value).toBeNull()
  })

  it('resets pageNum to 1 and debounces loads when filters change', async () => {
    vi.useFakeTimers()
    const router = await installRouter()

    const list = useRecipeList({ routeQuery: router.currentRoute.value.query })
    await list.ready

    await list.setPage(3)
    fetchRecipePageMock.mockClear()

    list.handleFilterValuesChange(
      { keyword: '南瓜' },
      { ...list.filterValues.value, keyword: '南瓜' },
    )

    expect(list.filters.pageNum).toBe(1)
    expect(fetchRecipePageMock).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(299)
    expect(fetchRecipePageMock).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(fetchRecipePageMock).toHaveBeenCalledTimes(1)
    expect(fetchRecipePageMock).toHaveBeenLastCalledWith({
      ...createDefaultRecipeFilters(),
      keyword: '南瓜',
      pageNum: 1,
    })
  })

  it('hydrates filters and pagination from route query on reload', async () => {
    const router = await installRouter({
      keyword: '鸡',
      recipeType: 'STAPLE',
      isBabyFriendly: 'true',
      maxCookingTime: '30',
      pageNum: '2',
      pageSize: '24',
    })

    const list = useRecipeList({ routeQuery: router.currentRoute.value.query })
    await list.ready

    expect(list.filters).toMatchObject({
      keyword: '鸡',
      recipeType: 'STAPLE',
      isBabyFriendly: true,
      maxCookingTime: 30,
      pageNum: 2,
      pageSize: 24,
    })
    expect(fetchRecipePageMock).toHaveBeenCalledWith(expect.objectContaining({
      keyword: '鸡',
      recipeType: 'STAPLE',
      isBabyFriendly: true,
      maxCookingTime: 30,
      pageNum: 2,
      pageSize: 24,
    }))
  })

  it('reset restores default filters and reloads the first page', async () => {
    const router = await installRouter()

    const list = useRecipeList({ routeQuery: router.currentRoute.value.query })
    await list.ready

    await list.handleFilterSearch({
      rawValues: {
        ...list.filterValues.value,
        keyword: '鱼',
        difficultyLevel: 'EASY',
      },
      serializedValues: {},
    })
    await nextTick()
    fetchRecipePageMock.mockClear()

    await list.handleFilterReset({
      rawValues: createDefaultRecipeFilters(),
      serializedValues: {},
    })

    expect({ ...list.filters }).toEqual(createDefaultRecipeFilters())
    expect(fetchRecipePageMock).toHaveBeenCalledTimes(1)
    expect(fetchRecipePageMock).toHaveBeenCalledWith(createDefaultRecipeFilters())
  })

  it('normalizes malformed route query values back to defaults', async () => {
    const router = await installRouter({
      isWeightLossFriendly: 'maybe',
      maxCookingTime: 'soon',
      pageNum: '0',
      pageSize: '-1',
    })

    const list = useRecipeList({ routeQuery: router.currentRoute.value.query })
    await list.ready

    expect({ ...list.filters }).toEqual(createDefaultRecipeFilters())
  })
})
