import type {
  RecipeDetail,
  RecipeIngredientItem,
  RecipeNutrition,
  RecipeStepItem,
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
 * 支持新增和编辑模式，处理部分保存失败场景。
 */

export interface RecipeFormData {
  name: string
  recipeType: string
  crowdTag: string
  seasonTag: string
  difficultyLevel: string
  cookingTimeMin: number
  description: string
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
    crowdTag: 'FAMILY',
    seasonTag: 'ALL',
    difficultyLevel: 'MEDIUM',
    cookingTimeMin: 30,
    description: '',
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
    description: detail.description || '',
    isBabyFriendly: detail.isBabyFriendly,
    isWeightLossFriendly: detail.isWeightLossFriendly,
    ingredients: detail.ingredients || [],
    steps: detail.steps || [],
    nutrition: detail.nutrition,
  }
}

export function useRecipeForm(options: UseRecipeFormOptions) {
  const formData = reactive<RecipeFormData>(createDefaultFormData())
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  const recipeId = ref(options.recipeId)

  async function loadDetail() {
    if (options.mode !== 'edit' || !options.recipeId)
      return

    loading.value = true
    error.value = null

    try {
      const detail = await fetchRecipeDetail(options.recipeId)
      Object.assign(formData, hydrateFormData(detail))
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('加载菜品详情失败')
    }
    finally {
      loading.value = false
    }
  }

  async function save() {
    saving.value = true
    error.value = null

    try {
      if (options.mode === 'add') {
        // 新增模式：创建菜品
        const created = await createRecipe({
          name: formData.name,
          recipeType: formData.recipeType as any,
          crowdTag: formData.crowdTag as any,
          seasonTag: formData.seasonTag as any,
          difficultyLevel: formData.difficultyLevel as any,
          cookingTimeMin: formData.cookingTimeMin,
          description: formData.description,
          isBabyFriendly: formData.isBabyFriendly,
          isWeightLossFriendly: formData.isWeightLossFriendly,
        })
        recipeId.value = created.recipeId

        // 保存食材、步骤和营养信息
        if (formData.ingredients.length > 0) {
          await updateRecipeIngredients(created.recipeId, formData.ingredients)
        }
        if (formData.steps.length > 0) {
          await updateRecipeSteps(created.recipeId, formData.steps)
        }
        if (formData.nutrition) {
          await updateRecipeNutrition(created.recipeId, formData.nutrition)
        }
      }
      else {
        // 编辑模式：更新菜品
        if (!recipeId.value)
          throw new Error('缺少菜品 ID')

        await updateRecipe(recipeId.value, {
          name: formData.name,
          recipeType: formData.recipeType as any,
          crowdTag: formData.crowdTag as any,
          seasonTag: formData.seasonTag as any,
          difficultyLevel: formData.difficultyLevel as any,
          cookingTimeMin: formData.cookingTimeMin,
          description: formData.description,
          isBabyFriendly: formData.isBabyFriendly,
          isWeightLossFriendly: formData.isWeightLossFriendly,
        })

        // 更新食材、步骤和营养信息
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

  const ready = loadDetail()

  return {
    formData,
    loading,
    saving,
    error,
    recipeId,
    ready,
    save,
  }
}
