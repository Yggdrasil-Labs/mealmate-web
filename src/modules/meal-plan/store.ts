import type { MealPlanItem, WeeklyMealPlan } from './types'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getCurrentWeekPlan } from './api'

export const useMealPlanStore = defineStore('mealPlan', () => {
  const currentPlan = ref<WeeklyMealPlan | null>(null)
  const loading = ref(false)

  async function fetchCurrentWeekPlan(weekStartDate?: string) {
    loading.value = true
    try {
      currentPlan.value = await getCurrentWeekPlan(
        weekStartDate ? { weekStartDate } : undefined,
      )
    }
    finally {
      loading.value = false
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

  return { currentPlan, loading, fetchCurrentWeekPlan, updateItem }
})
