import { ref } from 'vue'
import { manualAddItem } from '../api'
import { useMealPlanStore } from '../store'

/**
 * 手动添加菜品逻辑：打开抽屉、输入菜名、提交创建。
 */
export function useManualAdd() {
  const store = useMealPlanStore()
  const visible = ref(false)
  const mealDate = ref('')
  const mealType = ref('')

  function open(date: string, type: string) {
    mealDate.value = date
    mealType.value = type
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  async function submit(recipeName: string, crowdType?: string) {
    if (!store.currentPlan)
      return
    await manualAddItem(store.currentPlan.planId, {
      recipeName,
      mealDate: mealDate.value,
      mealType: mealType.value,
      crowdType,
    })
    await store.loadCurrentPlan()
    close()
  }

  return { visible, mealDate, mealType, open, close, submit }
}
