import type { AdjustReason, MealPlanItem, MealPlanItemHistory, RecipeBrief } from '../types'

import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

import { adjustMealItem, getItemHistory, getRecommendRecipes, searchRecipes } from '../api'
import { useMealPlanStore } from '../store'

export function useAdjustMealItem() {
  const store = useMealPlanStore()

  const planId = ref<number>(0)
  const itemId = ref<number>(0)
  const recommendList = ref<RecipeBrief[]>([])
  const searchResults = ref<RecipeBrief[]>([])
  const historyList = ref<MealPlanItemHistory[]>([])
  const recommendLoading = ref(false)
  const searchLoading = ref(false)
  const adjustLoading = ref(false)
  const historyLoading = ref(false)

  /** 打开调整，加载推荐列表 */
  async function openAdjust(pId: number, iId: number) {
    planId.value = pId
    itemId.value = iId
    recommendList.value = []
    searchResults.value = []
    recommendLoading.value = true
    try {
      recommendList.value = await getRecommendRecipes(pId, iId)
    }
    finally {
      recommendLoading.value = false
    }
  }

  /** 搜索菜品（300ms 防抖） */
  const doSearch = useDebounceFn(async (keyword: string) => {
    if (!keyword.trim()) {
      searchResults.value = []
      return
    }
    searchLoading.value = true
    try {
      searchResults.value = await searchRecipes(keyword)
    }
    finally {
      searchLoading.value = false
    }
  }, 300)

  /** 确认替换 */
  async function confirmAdjust(newRecipeId: number, adjustReason?: AdjustReason): Promise<MealPlanItem | null> {
    adjustLoading.value = true
    try {
      const updated = await adjustMealItem(planId.value, itemId.value, {
        newRecipeId,
        adjustReason,
      })
      store.updateItem(updated)
      return updated
    }
    catch (e: any) {
      const code = e?.response?.data?.errCode
      if (code === 'RECIPE_DUPLICATE_IN_WEEK')
        ElMessage.warning('该菜品本周已使用，请选择其他菜品')
      else if (code === 'MEAL_PLAN_FROZEN')
        ElMessage.error('计划已锁定，无法调整')
      else
        ElMessage.error('操作失败，请重试')
      return null
    }
    finally {
      adjustLoading.value = false
    }
  }

  /** 加载历史 */
  async function loadHistory(pId: number, iId: number) {
    historyLoading.value = true
    try {
      historyList.value = await getItemHistory(pId, iId)
    }
    finally {
      historyLoading.value = false
    }
  }

  return {
    planId,
    itemId,
    recommendList,
    searchResults,
    historyList,
    recommendLoading,
    searchLoading,
    adjustLoading,
    historyLoading,
    openAdjust,
    doSearch,
    confirmAdjust,
    loadHistory,
  }
}
