import type { MealPlanItem, WeeklyMealPlan } from './types'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { confirmPlan as confirmPlanApi, deleteItem as deleteItemApi, generatePlan, getCurrentWeekPlan } from './api'

export const useMealPlanStore = defineStore('mealPlan', () => {
  const currentPlan = ref<WeeklyMealPlan | null>(null)
  const loading = ref(false)
  const selectedWeekStart = ref('')

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

  async function loadCurrentPlan() {
    loading.value = true
    try {
      currentPlan.value = await getCurrentWeekPlan(
        selectedWeekStart.value ? { weekStartDate: selectedWeekStart.value } : undefined,
      )
    }
    finally {
      loading.value = false
    }
  }

  async function generate(params: { weekStartDate: string, forceRegenerate?: boolean }) {
    loading.value = true
    try {
      currentPlan.value = await generatePlan(params)
    }
    finally {
      loading.value = false
    }
  }

  async function confirmPlan() {
    if (!currentPlan.value) return
    loading.value = true
    try {
      await confirmPlanApi(currentPlan.value.planId)
      await loadCurrentPlan()
    }
    finally {
      loading.value = false
    }
  }

  async function deleteItem(itemId: number) {
    if (!currentPlan.value) return
    await deleteItemApi(currentPlan.value.planId, itemId)
    await loadCurrentPlan()
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

  return { currentPlan, loading, selectedWeekStart, fetchCurrentWeekPlan, loadCurrentPlan, generate, confirmPlan, deleteItem, updateItem }
})
