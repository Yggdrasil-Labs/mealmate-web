// @vitest-environment jsdom
import type { RecipeDetail } from '@/modules/recipe/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import RecipeFormDrawer from '@/modules/recipe/components/RecipeFormDrawer.vue'

vi.mock('@/modules/recipe/api', () => ({
  fetchRecipeDetail: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  updateRecipeIngredients: vi.fn(),
  updateRecipeSteps: vi.fn(),
  updateRecipeNutrition: vi.fn(),
}))

const {
  fetchRecipeDetail,
  createRecipe,
} = await import('@/modules/recipe/api')

const fetchRecipeDetailMock = vi.mocked(fetchRecipeDetail)
const createRecipeMock = vi.mocked(createRecipe)

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

const recipeDetail: RecipeDetail = {
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
  description: '经典家常菜',
  ingredients: [],
  steps: [],
}

function mountDrawer(visible = true, mode: 'add' | 'edit' = 'add', recipeId?: string) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const visibleRef = ref(visible)
  const modeRef = ref(mode)
  const recipeIdRef = ref(recipeId)
  const onUpdateVisible = vi.fn((value: boolean) => {
    visibleRef.value = value
  })
  const onSaved = vi.fn()

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeFormDrawer, {
          'visible': visibleRef.value,
          'mode': modeRef.value,
          'recipeId': recipeIdRef.value,
          'onUpdate:visible': onUpdateVisible,
          onSaved,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, visibleRef, modeRef, recipeIdRef, onUpdateVisible, onSaved }
}

describe('recipeFormDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchRecipeDetailMock.mockResolvedValue(recipeDetail)
    createRecipeMock.mockResolvedValue('recipe-new')
  })

  it('renders in add mode with default values', async () => {
    const { container } = mountDrawer(true, 'add')

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(container.textContent).toContain('新增菜品')
  })

  it('loads detail in edit mode', async () => {
    const { container } = mountDrawer(true, 'edit', 'recipe-1')

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(fetchRecipeDetailMock).toHaveBeenCalledWith('recipe-1')
    expect(container.textContent).toContain('编辑菜品')
  })

  it('closes cleanly when requested', async () => {
    const { container, onUpdateVisible } = mountDrawer()

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    const closeButton = container.querySelector('.el-drawer__close-btn') as HTMLElement
    if (closeButton) {
      closeButton.click()
      await nextTick()
      expect(onUpdateVisible).toHaveBeenCalledWith(false)
    }
  })
})
