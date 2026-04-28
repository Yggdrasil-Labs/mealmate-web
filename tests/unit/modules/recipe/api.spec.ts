import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createRecipe,
  deleteRecipe,
  fetchRecipeDetail,
  fetchRecipePage,
  updateRecipeIngredients,
  updateRecipeNutrition,
  updateRecipeSteps,
} from '@/modules/recipe/api'
import { resetRecipeMockData } from '@/modules/recipe/mock'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

beforeEach(() => {
  resetRecipeMockData()
})

describe('recipe api', () => {
  it('fetches filtered paged lists', async () => {
    const page = await fetchRecipePage({
      keyword: '鸡',
      recipeType: '',
      seasonTag: '',
      crowdTag: '',
      isBabyFriendly: undefined,
      isWeightLossFriendly: true,
      difficultyLevel: '',
      maxCookingTime: 30,
      pageNum: 1,
      pageSize: 10,
    })

    expect(page.total).toBe(1)
    expect(page.list).toHaveLength(1)
    expect(page.list[0]).toMatchObject({
      name: '香煎鸡胸便当',
      sourceType: 'AI_GENERATED',
      isWeightLossFriendly: true,
    })
  })

  it('distinguishes false boolean filters from no filter', async () => {
    const page = await fetchRecipePage({
      keyword: '',
      recipeType: '',
      seasonTag: '',
      crowdTag: '',
      isBabyFriendly: false,
      isWeightLossFriendly: false,
      difficultyLevel: '',
      maxCookingTime: undefined,
      pageNum: 1,
      pageSize: 20,
    })

    expect(page.total).toBe(1)
    expect(page.list[0]).toMatchObject({
      recipeId: 'recipe-manual-braised-beef',
      isBabyFriendly: false,
      isWeightLossFriendly: false,
    })
  })

  it('fetches recipe detail', async () => {
    const detail = await fetchRecipeDetail('recipe-manual-braised-beef')

    expect(detail).toMatchObject({
      recipeId: 'recipe-manual-braised-beef',
      name: '番茄牛腩煲',
      ingredients: expect.any(Array),
      steps: expect.any(Array),
      nutrition: expect.objectContaining({
        calories: 420,
      }),
    })
  })

  it('creates a manual recipe', async () => {
    const created = await createRecipe({
      name: '山药排骨汤',
      recipeType: 'SOUP',
      sourceType: 'MANUAL',
      crowdTag: 'FAMILY',
      seasonTag: 'WINTER',
      difficultyLevel: 'EASY',
      cookingTimeMin: 45,
      coverImageUrl: '',
      isBabyFriendly: true,
      isWeightLossFriendly: false,
      status: 'PUBLISHED',
    })

    expect(created).toMatchObject({
      name: '山药排骨汤',
      sourceType: 'MANUAL',
      recipeType: 'SOUP',
    })

    const page = await fetchRecipePage({
      keyword: '山药',
      recipeType: '',
      seasonTag: '',
      crowdTag: '',
      isBabyFriendly: undefined,
      isWeightLossFriendly: undefined,
      difficultyLevel: '',
      maxCookingTime: undefined,
      pageNum: 1,
      pageSize: 10,
    })

    expect(page.total).toBe(1)
    expect(page.list[0]?.recipeId).toBe(created.recipeId)
  })

  it('updates ingredients, steps, and nutrition for editable recipes', async () => {
    await expect(updateRecipeIngredients('recipe-ai-chicken-bento', [
      {
        ingredientName: '鸡胸肉',
        ingredientType: 'protein',
        quantity: '200',
        unit: 'g',
        isMain: true,
        sortNo: 1,
      },
    ])).resolves.toHaveLength(1)

    await expect(updateRecipeSteps('recipe-ai-chicken-bento', [
      {
        stepNo: 1,
        content: '鸡胸肉煎熟切片。',
        imageUrl: 'https://cdn.example.com/recipe/chicken-step-1.jpg',
      },
    ])).resolves.toHaveLength(1)

    await expect(updateRecipeNutrition('recipe-ai-chicken-bento', {
      calories: 320,
      protein: 32,
      fat: 12,
      carbohydrate: 24,
      fiber: 5,
      calcium: 88,
      sodium: 420,
    })).resolves.toMatchObject({
      protein: 32,
      carbohydrate: 24,
    })
  })

  it('deletes a manual recipe', async () => {
    await expect(deleteRecipe('recipe-manual-braised-beef')).resolves.toBeUndefined()

    const page = await fetchRecipePage({
      keyword: '牛腩',
      recipeType: '',
      seasonTag: '',
      crowdTag: '',
      isBabyFriendly: undefined,
      isWeightLossFriendly: undefined,
      difficultyLevel: '',
      maxCookingTime: undefined,
      pageNum: 1,
      pageSize: 10,
    })

    expect(page.total).toBe(0)
  })

  it('blocks delete on SYSTEM and AI_GENERATED recipes', async () => {
    await expect(deleteRecipe('recipe-system-cod')).rejects.toThrow(/only manual recipes can be deleted/i)
    await expect(deleteRecipe('recipe-ai-chicken-bento')).rejects.toThrow(/only manual recipes can be deleted/i)
  })

  it('allows edit but not delete for AI_GENERATED recipes', async () => {
    const updatedSteps = await updateRecipeSteps('recipe-ai-chicken-bento', [
      {
        stepNo: 1,
        content: '保留编辑能力的 AI 菜品步骤。',
        imageUrl: '',
      },
    ])

    expect(updatedSteps[0]?.content).toBe('保留编辑能力的 AI 菜品步骤。')

    await expect(deleteRecipe('recipe-ai-chicken-bento')).rejects.toThrow(/only manual recipes can be deleted/i)
  })
})
