import type {
  CreateRecipePayload,
  RecipeCrowdTag,
  RecipeDetail,
  RecipeDifficultyLevel,
  RecipeIngredientItem,
  RecipeNutrition,
  RecipeSeasonTag,
  RecipeStepItem,
  RecipeType,
} from '../types'
import { reactive, ref, shallowRef } from 'vue'
import {
  createRecipe,
  fetchRecipeDetail,
  updateRecipe,
  updateRecipeIngredients,
  updateRecipeNutrition,
  updateRecipeSteps,
} from '../api'

/**
 * useRecipeForm composable
 *
 * 管理菜品表单的状态和保存逻辑。
 * 支持新增和编辑模式，通过 reset() 切换模式而不需要重新创建实例。
 */

export interface RecipeFormData {
  name: string
  recipeType: RecipeType
  crowdTag: RecipeCrowdTag
  seasonTag: RecipeSeasonTag
  difficultyLevel: RecipeDifficultyLevel
  cookingTimeMin: number
  isBabyFriendly: boolean
  isWeightLossFriendly: boolean
  ingredients: RecipeIngredientItem[]
  steps: RecipeStepItem[]
  nutrition?: RecipeNutrition
}

export interface UseRecipeFormOptions {
  mode: 'add' | 'edit'
  recipeId?: string
}

function createDefaultFormData(): RecipeFormData {
  return {
    name: '',
    recipeType: 'HOME_COOKING',
    crowdTag: 'GENERAL',
    seasonTag: 'ALL_SEASON',
    difficultyLevel: 'MEDIUM',
    cookingTimeMin: 30,
    isBabyFriendly: false,
    isWeightLossFriendly: false,
    ingredients: [],
    steps: [],
    nutrition: undefined,
  }
}

function hydrateFormData(detail: RecipeDetail): RecipeFormData {
  return {
    name: detail.name,
    recipeType: detail.recipeType,
    crowdTag: detail.crowdTag,
    seasonTag: detail.seasonTag,
    difficultyLevel: detail.difficultyLevel,
    cookingTimeMin: detail.cookingTimeMin,
    isBabyFriendly: detail.isBabyFriendly,
    isWeightLossFriendly: detail.isWeightLossFriendly,
    ingredients: detail.ingredients || [],
    steps: detail.steps || [],
    nutrition: detail.nutrition,
  }
}

export function useRecipeForm(initialOptions: UseRecipeFormOptions) {
  const formData = reactive<RecipeFormData>(createDefaultFormData())
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  const recipeId = ref(initialOptions.recipeId)

  let currentOptions = { ...initialOptions }
  let loadToken = 0

  async function loadDetail() {
    if (currentOptions.mode !== 'edit' || !currentOptions.recipeId)
      return

    const token = ++loadToken
    loading.value = true
    error.value = null

    try {
      const detail = await fetchRecipeDetail(currentOptions.recipeId)
      // 竞态保护：忽略过期的请求结果
      if (token !== loadToken)
        return
      Object.assign(formData, hydrateFormData(detail))
    }
    catch (err) {
      if (token !== loadToken)
        return
      error.value = err instanceof Error ? err : new Error('加载菜品详情失败')
    }
    finally {
      if (token === loadToken)
        loading.value = false
    }
  }

  /** 重置表单状态并切换模式，支持 await 等待加载完成。 */
  async function reset(options: UseRecipeFormOptions) {
    currentOptions = { ...options }
    recipeId.value = options.recipeId
    error.value = null
    Object.assign(formData, createDefaultFormData())
    await loadDetail()
  }

  function buildPayload(): CreateRecipePayload {
    return {
      name: formData.name,
      recipeType: formData.recipeType,
      crowdTag: formData.crowdTag,
      seasonTag: formData.seasonTag,
      difficultyLevel: formData.difficultyLevel,
      cookingTimeMin: formData.cookingTimeMin,
      babyFriendly: formData.isBabyFriendly,
      weightLossFriendly: formData.isWeightLossFriendly,
      ingredients: formData.ingredients.map((ing, idx) => ({
        ingredientName: ing.ingredientName,
        ingredientType: ing.ingredientType || undefined,
        quantity: ing.quantity ? Number(ing.quantity) : undefined,
        unit: ing.unit || undefined,
        mainIngredient: ing.isMain,
        sortNo: idx + 1,
      })),
    }
  }

  async function save() {
    saving.value = true
    error.value = null

    try {
      if (currentOptions.mode === 'add') {
        const created = await createRecipe(buildPayload())
        recipeId.value = created.recipeId

        if (formData.steps.length > 0) {
          await updateRecipeSteps(created.recipeId, formData.steps)
        }
        if (formData.nutrition) {
          await updateRecipeNutrition(created.recipeId, formData.nutrition)
        }
      }
      else {
        if (!recipeId.value)
          throw new Error('缺少菜品 ID')

        await updateRecipe(recipeId.value, buildPayload())
        await updateRecipeIngredients(recipeId.value, formData.ingredients)
        await updateRecipeSteps(recipeId.value, formData.steps)
        if (formData.nutrition) {
          await updateRecipeNutrition(recipeId.value, formData.nutrition)
        }
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('保存失败')
      throw err
    }
    finally {
      saving.value = false
    }
  }

  loadDetail()

  return {
    formData,
    loading,
    saving,
    error,
    recipeId,
    save,
    reset,
  }
}
