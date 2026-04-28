import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as recipeApi from '@/modules/recipe/api'
import { resetRecipeMockData } from '@/modules/recipe/mock'
import { useRecipeStore } from '@/modules/recipe/store'

vi.mock('@/config/env', () => ({
  env: {
    USE_MOCK: true,
  },
}))

beforeEach(() => {
  setActivePinia(createPinia())
  resetRecipeMockData()
})

describe('useRecipeStore', () => {
  it('tracks the active recipe id', () => {
    const store = useRecipeStore()

    expect(store.activeRecipeId).toBeNull()

    store.setActiveRecipe('recipe-manual-braised-beef')

    expect(store.activeRecipeId).toBe('recipe-manual-braised-beef')
  })

  it('caches detail in the store', async () => {
    const store = useRecipeStore()
    const fetchRecipeDetailSpy = vi.spyOn(recipeApi, 'fetchRecipeDetail')

    const firstDetail = await store.fetchRecipeDetail('recipe-manual-braised-beef')
    const secondDetail = await store.fetchRecipeDetail('recipe-manual-braised-beef')

    expect(fetchRecipeDetailSpy).toHaveBeenCalledTimes(1)
    expect(firstDetail).toBe(secondDetail)
    expect(store.recipeDetailMap['recipe-manual-braised-beef']?.name).toBe('番茄牛腩煲')
  })

  it('clears cached detail by recipe id', async () => {
    const store = useRecipeStore()

    await store.fetchRecipeDetail('recipe-manual-braised-beef')
    store.clearRecipeDetail('recipe-manual-braised-beef')

    expect(store.recipeDetailMap['recipe-manual-braised-beef']).toBeUndefined()
  })
})
