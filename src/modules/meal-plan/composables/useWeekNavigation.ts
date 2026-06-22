import { computed, onMounted, watch } from 'vue'
import { useMealPlanStore } from '@/modules/meal-plan/store'

/**
 * 周切换导航逻辑。供 prep-plan、shopping-list 等依赖周计划的页面复用。
 * @param loadData 当 planId 变化时需要触发的数据加载函数
 */
export function useWeekNavigation(loadData: () => void) {
  const store = useMealPlanStore()

  const weekStart = computed(() => store.currentPlan?.weekStartDate || store.selectedWeekStart)
  const isConfirmed = computed(() => store.currentPlan?.status === 'CONFIRMED')

  function navigateWeek(offset: number) {
    const current = store.selectedWeekStart || store.currentPlan?.weekStartDate || ''
    if (!current)
      return
    const date = new Date(`${current}T00:00:00`)
    date.setDate(date.getDate() + offset * 7)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    store.selectedWeekStart = `${y}-${m}-${d}`
    store.loadCurrentPlan()
  }

  watch(() => store.currentPlan?.planId, () => loadData())
  onMounted(() => {
    if (!store.currentPlan)
      store.loadCurrentPlan()
    else
      loadData()
  })

  return { weekStart, isConfirmed, navigateWeek }
}
