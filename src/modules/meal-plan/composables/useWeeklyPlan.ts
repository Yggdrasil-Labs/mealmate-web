import { ElMessageBox } from 'element-plus'
import { computed, onMounted } from 'vue'
import { useMealPlanStore } from '../store'

/**
 * 周计划页面核心逻辑：加载、生成、确认、周切换。
 */
export function useWeeklyPlan() {
  const store = useMealPlanStore()

  const plan = computed(() => store.currentPlan)
  const loading = computed(() => store.loading)
  const isDraft = computed(() => plan.value?.status === 'DRAFT')
  const isConfirmed = computed(() => plan.value?.status === 'CONFIRMED')

  /** 获取当前周起始日期（周一） */
  function getCurrentWeekStart(): string {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return monday.toISOString().slice(0, 10)
  }

  /** 切换周 */
  function navigateWeek(offset: number) {
    const current = store.selectedWeekStart || getCurrentWeekStart()
    const date = new Date(current)
    date.setDate(date.getDate() + offset * 7)
    store.selectedWeekStart = date.toISOString().slice(0, 10)
    store.loadCurrentPlan()
  }

  /** 生成计划 */
  async function generate(forceRegenerate = false) {
    const weekStart = store.selectedWeekStart || getCurrentWeekStart()
    await store.generate({ weekStartDate: weekStart, forceRegenerate })
  }

  /** 确认计划（二次确认后提交） */
  async function confirm() {
    try {
      await ElMessageBox.confirm('确认后计划将锁定且不可编辑，是否继续？', '确认计划', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
    }
    catch {
      return // 用户取消
    }
    return store.confirmPlan()
  }

  onMounted(() => {
    if (!store.selectedWeekStart)
      store.selectedWeekStart = getCurrentWeekStart()
    store.loadCurrentPlan()
  })

  return {
    plan,
    loading,
    isDraft,
    isConfirmed,
    selectedWeekStart: computed(() => store.selectedWeekStart),
    navigateWeek,
    generate,
    confirm,
  }
}
