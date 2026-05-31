import type { GenerateRequest, WeeklyMealPlan } from './types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_FAMILY_ID } from '@/modules/family/constants'
import * as api from './api'

export const useMealPlanStore = defineStore('mealPlan', () => {
  const currentPlan = ref<WeeklyMealPlan | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedWeekStart = ref('')

  async function loadCurrentPlan() {
    loading.value = true
    error.value = null
    try {
      const res = await api.getCurrentPlan(selectedWeekStart.value || undefined, DEFAULT_FAMILY_ID)
      currentPlan.value = res.data ?? null
    }
    catch (e: any) {
      error.value = e.message || '加载失败'
    }
    finally {
      loading.value = false
    }
  }

  async function generate(data: GenerateRequest) {
    loading.value = true
    error.value = null
    try {
      const res = await api.generatePlan({ ...data, familyId: DEFAULT_FAMILY_ID })
      currentPlan.value = res.data ?? null
    }
    catch (e: any) {
      error.value = e.message || '生成失败'
    }
    finally {
      loading.value = false
    }
  }

  async function replaceItem(itemId: number, recipeId: number) {
    if (!currentPlan.value)
      return
    try {
      await api.replaceItem(currentPlan.value.planId, itemId, recipeId)
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '替换失败'
    }
  }

  async function addItem(data: { recipeId: number, mealDate: string, mealType: string, crowdType?: string }) {
    if (!currentPlan.value)
      return
    try {
      await api.addItem(currentPlan.value.planId, data)
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '添加失败'
    }
  }

  async function deleteItem(itemId: number) {
    if (!currentPlan.value)
      return
    try {
      await api.deleteItem(currentPlan.value.planId, itemId)
      await loadCurrentPlan()
    }
    catch (e: any) {
      error.value = e.message || '删除失败'
    }
  }

  async function confirmPlan() {
    if (!currentPlan.value)
      return
    try {
      const res = await api.confirmPlan(currentPlan.value.planId)
      await loadCurrentPlan()
      return res.data
    }
    catch (e: any) {
      error.value = e.message || '确认失败'
    }
  }

  return {
    currentPlan,
    loading,
    error,
    selectedWeekStart,
    loadCurrentPlan,
    generate,
    replaceItem,
    addItem,
    deleteItem,
    confirmPlan,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMealPlanStore, import.meta.hot))
