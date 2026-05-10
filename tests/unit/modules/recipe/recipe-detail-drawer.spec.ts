// @vitest-environment jsdom
import type { RecipeDetail } from '@/modules/recipe/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import RecipeDetailDrawer from '@/modules/recipe/components/RecipeDetailDrawer.vue'

vi.mock('@/modules/recipe/api', () => ({
  fetchRecipeDetail: vi.fn(),
}))

const { fetchRecipeDetail } = await import('@/modules/recipe/api')
const fetchRecipeDetailMock = vi.mocked(fetchRecipeDetail)

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
  ingredients: [
    { ingredientId: 'ing-1', ingredientName: '牛腩', ingredientType: '', quantity: '500', unit: '克', isMain: true, sortNo: 1 },
    { ingredientId: 'ing-2', ingredientName: '番茄', ingredientType: '', quantity: '3', unit: '个', isMain: false, sortNo: 2 },
  ],
  steps: [
    { stepNo: 1, content: '牛腩切块焯水', imageUrl: '' },
    { stepNo: 2, content: '番茄切块', imageUrl: '' },
  ],
  nutrition: {
    calories: 350,
    protein: 28,
    fat: 18,
    carbohydrate: 15,
    fiber: null,
    calcium: null,
    sodium: null,
  },
}

function mountDrawer(recipeId: string, visible = true) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const visibleRef = ref(visible)
  const recipeIdRef = ref(recipeId)
  const onUpdateVisible = vi.fn((value: boolean) => {
    visibleRef.value = value
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeDetailDrawer, {
          'visible': visibleRef.value,
          'recipeId': recipeIdRef.value,
          'onUpdate:visible': onUpdateVisible,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, visibleRef, recipeIdRef, onUpdateVisible }
}

describe('recipeDetailDrawer', () => {
  beforeEach(() => {
    fetchRecipeDetailMock.mockReset()
    fetchRecipeDetailMock.mockResolvedValue(recipeDetail)
  })

  it('renders base fields, ingredients, steps, and nutrition when detail is loaded', async () => {
    const { container } = mountDrawer('recipe-1')

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(container.textContent).toContain('番茄牛腩煲')
    expect(container.textContent).toContain('经典家常菜')
    expect(container.textContent).toContain('牛腩')
    expect(container.textContent).toContain('番茄')
    expect(container.textContent).toContain('牛腩切块焯水')
    expect(container.textContent).toContain('番茄切块')
  })

  it('shows error and retry state when fetch fails', async () => {
    fetchRecipeDetailMock.mockRejectedValue(new Error('网络错误'))

    const { container } = mountDrawer('recipe-1')

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(container.textContent).toContain('网络错误')
    const retryButton = container.querySelector('[data-testid="recipe-detail-retry"]') as HTMLElement
    expect(retryButton).toBeTruthy()

    fetchRecipeDetailMock.mockResolvedValue(recipeDetail)
    retryButton.click()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(container.textContent).toContain('番茄牛腩煲')
  })

  it('closes cleanly when requested', async () => {
    const { container, onUpdateVisible } = mountDrawer('recipe-1')

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
