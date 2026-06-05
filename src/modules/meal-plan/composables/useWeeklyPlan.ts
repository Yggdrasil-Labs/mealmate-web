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

  /** 获取当前周起始日期（周一），使用本地时间避免时区问题 */
  function getCurrentWeekStart(): string {
    const now = new Date()
    const day = now.getDay()
    const offset = day === 0 ? -6 : 1 - day
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const y = monday.getFullYear()
    const m = String(monday.getMonth() + 1).padStart(2, '0')
    const d = String(monday.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  /** 切换周 */
  function navigateWeek(offset: number) {
    const current = store.selectedWeekStart || getCurrentWeekStart()
    const date = new Date(`${current}T00:00:00`)
    date.setDate(date.getDate() + offset * 7)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    store.selectedWeekStart = `${y}-${m}-${d}`
    store.loadCurrentPlan()
  }

  /** 生成计划（已有草稿时二次确认覆盖） */
  async function generate(forceRegenerate = false) {
    if (plan.value?.status === 'DRAFT' && !forceRegenerate) {
      try {
        await ElMessageBox.confirm(
          '当前周已有草稿计划，重新生成将覆盖现有安排，是否继续？',
          '覆盖确认',
          { confirmButtonText: '重新生成', cancelButtonText: '取消', type: 'warning' },
        )
      }
      catch {
        return
      }
    }
    const weekStart = store.selectedWeekStart || getCurrentWeekStart()
    await store.generate({ weekStartDate: weekStart, forceRegenerate: forceRegenerate || !!plan.value })
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
