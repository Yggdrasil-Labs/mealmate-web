// @vitest-environment jsdom
import type { RecipeDetail } from '@/modules/recipe/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecipeForm } from '@/modules/recipe/composables/useRecipeForm'

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
  updateRecipe,
  updateRecipeIngredients,
  updateRecipeSteps,
  updateRecipeNutrition,
} = await import('@/modules/recipe/api')

const fetchRecipeDetailMock = vi.mocked(fetchRecipeDetail)
const createRecipeMock = vi.mocked(createRecipe)
const updateRecipeMock = vi.mocked(updateRecipe)
const updateRecipeIngredientsMock = vi.mocked(updateRecipeIngredients)
const updateRecipeStepsMock = vi.mocked(updateRecipeSteps)
const updateRecipeNutritionMock = vi.mocked(updateRecipeNutrition)

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
    { ingredientId: 'ing-1', name: '牛腩', quantity: '500', unit: '克', sortNo: 1 },
  ],
  steps: [
    { stepNo: 1, description: '牛腩切块焯水', imageUrl: '' },
  ],
  nutrition: {
    calories: 350,
    protein: 28,
    fat: 18,
    carbs: 15,
  },
}

describe('useRecipeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchRecipeDetailMock.mockResolvedValue(recipeDetail)
    createRecipeMock.mockResolvedValue('recipe-new')
    updateRecipeMock.mockResolvedValue(undefined)
    updateRecipeIngredientsMock.mockResolvedValue(undefined)
    updateRecipeStepsMock.mockResolvedValue(undefined)
    updateRecipeNutritionMock.mockResolvedValue(undefined)
  })

  it('initializes with default values in add mode', () => {
    const form = useRecipeForm({ mode: 'add' })

    expect(form.formData.name).toBe('')
    expect(form.formData.recipeType).toBe('HOME_COOKING')
    expect(form.formData.ingredients).toEqual([])
    expect(form.formData.steps).toEqual([])
  })

  it('loads detail in edit mode', async () => {
    const form = useRecipeForm({ mode: 'edit', recipeId: 'recipe-1' })

    await form.ready

    expect(fetchRecipeDetailMock).toHaveBeenCalledWith('recipe-1')
    expect(form.formData.name).toBe('番茄牛腩煲')
    expect(form.formData.ingredients).toHaveLength(1)
  })

  it('saves a new recipe', async () => {
    const form = useRecipeForm({ mode: 'add' })

    form.formData.name = '新菜品'
    await form.save()

    expect(createRecipeMock).toHaveBeenCalled()
    expect(form.saving.value).toBe(false)
  })

  it('updates an existing recipe', async () => {
    const form = useRecipeForm({ mode: 'edit', recipeId: 'recipe-1' })

    await form.ready

    form.formData.name = '更新后的名称'
    await form.save()

    expect(updateRecipeMock).toHaveBeenCalled()
    expect(form.saving.value).toBe(false)
  })

  it('preserves form state on save failure', async () => {
    const form = useRecipeForm({ mode: 'add' })

    form.formData.name = '新菜品'
    createRecipeMock.mockRejectedValue(new Error('保存失败'))

    try {
      await form.save()
    }
    catch {
      // 预期会抛出错误
    }

    expect(form.formData.name).toBe('新菜品')
    expect(form.error.value).toBeTruthy()
  })
})
