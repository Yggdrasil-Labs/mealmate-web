import type { MealPlanItem } from '../types'
import { ref } from 'vue'
import { useMealPlanStore } from '../store'

/**
 * 替换菜品项逻辑：打开抽屉、选择新菜品、提交替换。
 */
export function useReplaceItem() {
  const store = useMealPlanStore()
  const visible = ref(false)
  const targetItem = ref<MealPlanItem | null>(null)

  function open(item: MealPlanItem) {
    targetItem.value = item
    visible.value = true
  }

  function close() {
    visible.value = false
    targetItem.value = null
  }

  async function replace(newRecipeId: number) {
    if (!targetItem.value)
      return
    await store.replaceItem(targetItem.value.itemId, newRecipeId)
    close()
  }

  return { visible, targetItem, open, close, replace }
}
