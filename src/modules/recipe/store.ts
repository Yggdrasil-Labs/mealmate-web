import type { RecipeDetail } from './types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, shallowRef } from 'vue'
import { fetchRecipeDetail as fetchRecipeDetailFromApi } from './api'

export const useRecipeStore = defineStore('recipe', () => {
  const activeRecipeId = shallowRef<string | null>(null)
  const recipeDetailMap = reactive<Record<string, RecipeDetail | undefined>>({})

  function setActiveRecipe(recipeId: string | null) {
    activeRecipeId.value = recipeId
  }

  function cacheRecipeDetail(detail: RecipeDetail) {
    recipeDetailMap[detail.recipeId] = detail
    return detail
  }

  function clearRecipeDetail(recipeId?: string) {
    if (!recipeId) {
      Object.keys(recipeDetailMap).forEach((key) => {
        delete recipeDetailMap[key]
      })
      return
    }

    delete recipeDetailMap[recipeId]
  }

  async function fetchRecipeDetail(recipeId: string, force = false) {
    setActiveRecipe(recipeId)

    if (!force && recipeDetailMap[recipeId])
      return recipeDetailMap[recipeId]!

    const detail = await fetchRecipeDetailFromApi(recipeId)
    cacheRecipeDetail(detail)
    return recipeDetailMap[recipeId]!
  }

  return {
    activeRecipeId,
    recipeDetailMap,
    setActiveRecipe,
    cacheRecipeDetail,
    clearRecipeDetail,
    fetchRecipeDetail,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot))
