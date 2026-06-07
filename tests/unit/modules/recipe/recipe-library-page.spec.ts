// @vitest-environment jsdom
import type { RecipeSummary } from '@/modules/recipe/types'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from '@/locales/i18n'
import RecipeLibraryPage from '@/pages/recipe-library.vue'

vi.mock('@/modules/recipe/api', () => ({
  fetchRecipePage: vi.fn(),
  fetchRecipeDetail: vi.fn(),
  deleteRecipe: vi.fn(),
}))

const { fetchRecipePage, fetchRecipeDetail, deleteRecipe } = await import('@/modules/recipe/api')
const fetchRecipePageMock = vi.mocked(fetchRecipePage)
const fetchRecipeDetailMock = vi.mocked(fetchRecipeDetail)
const deleteRecipeMock = vi.mocked(deleteRecipe)

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

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

async function mountPage() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/recipes', component: RecipeLibraryPage }],
  })

  await router.push('/recipes')
  await router.isReady()

  const Host = defineComponent({
    setup() {
      return () => h('div', [h(RecipeLibraryPage)])
    },
  })

  const app = createApp(Host)
  app.use(createPinia())
  app.use(i18n)
  app.use(router)
  app.mount(container)
  mountedApps.push(app)

  return { container, router }
}

describe('recipeLibraryPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    fetchRecipePageMock.mockResolvedValue({
      list: [recipeSummary],
      total: 1,
      pageNum: 1,
      pageSize: 12,
    })
    fetchRecipeDetailMock.mockResolvedValue({
      ...recipeSummary,
      description: '经典家常菜',
      ingredients: [],
      steps: [],
    })
    deleteRecipeMock.mockResolvedValue(undefined)
  })

  it('loads and displays recipe list', async () => {
    const { container } = await mountPage()

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(fetchRecipePageMock).toHaveBeenCalled()
    expect(container.textContent).toContain('番茄牛腩煲')
  })
})
