import type { MealPlanItem, WeeklyMealPlan } from './types'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'

import { confirmPlan as confirmPlanApi, deleteItem as deleteItemApi, generatePlan, getCurrentWeekPlan, replaceItem as replaceItemApi } from './api'

export const useMealPlanStore = defineStore('mealPlan', () => {
  const currentPlan = ref<WeeklyMealPlan | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedWeekStart = ref('')

  async function fetchCurrentWeekPlan(weekStartDate?: string) {
    loading.value = true
    error.value = null
    try {
      currentPlan.value = await getCurrentWeekPlan(
        { weekStartDate, familyId: Number(DEFAULT_FAMILY_ID) },
      )
    }
    catch (e: any) {
      error.value = e.message || '加载失败'
    }
    finally {
      loading.value = false
    }
  }

  async function loadCurrentPlan() {
    loading.value = true
    error.value = null
    try {
      currentPlan.value = await getCurrentWeekPlan(
        { weekStartDate: selectedWeekStart.value || undefined, familyId: Number(DEFAULT_FAMILY_ID) },
      )
    }
    catch (e: any) {
      error.value = e.message || '加载失败'
    }
    finally {
      loading.value = false
    }
  }

  async function generate(params: { weekStartDate: string, forceRegenerate?: boolean, familyId?: number }) {
    loading.value = true
    error.value = null
    try {
      currentPlan.value = await generatePlan(params)
    }
    catch (e: any) {
      error.value = e.message || '生成失败'
    }
    finally {
      loading.value = false
    }
  }

  async function confirmPlan() {
    if (!currentPlan.value)
      return
    loading.value = true
    error.value = null
    try {
      await confirmPlanApi(currentPlan.value.planId)
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '确认失败'
    }
    finally {
      loading.value = false
    }
  }

  async function deleteItem(itemId: number) {
    if (!currentPlan.value)
      return
    try {
      await deleteItemApi(currentPlan.value.planId, itemId)
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '删除失败'
    }
  }

  async function replaceItem(itemId: number, newRecipeId: number) {
    if (!currentPlan.value)
      return
    try {
      await replaceItemApi(currentPlan.value.planId, itemId, { newRecipeId })
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '替换失败'
    }
  }

  /** 遍历所有天的所有餐次，替换匹配的 item */
  function updateItem(updatedItem: MealPlanItem) {
    if (!currentPlan.value)
      return
    for (const day of Object.values(currentPlan.value.dayMeals)) {
      for (const mealType of ['breakfast', 'lunch', 'dinner'] as const) {
        const idx = day[mealType].findIndex(i => i.itemId === updatedItem.itemId)
        if (idx !== -1) {
          day[mealType][idx] = updatedItem
          return
        }
      }
    }
  }

  return { currentPlan, loading, error, selectedWeekStart, fetchCurrentWeekPlan, loadCurrentPlan, generate, confirmPlan, deleteItem, replaceItem, updateItem }
})
