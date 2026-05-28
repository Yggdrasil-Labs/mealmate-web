import type { PrepPlan } from '../types'
import { ref } from 'vue'
import { getPrepPlan, updatePrepItemStatus } from '../api'

/**
 * 备菜计划页面逻辑：加载、标记完成。
 */
export function usePrepPlan(planId: () => number | undefined) {
  const prepPlan = ref<PrepPlan | null>(null)
  const loading = ref(false)

  async function load() {
    const id = planId()
    if (!id)
      return
    loading.value = true
    try {
      const res = await getPrepPlan(id)
      prepPlan.value = res.data ?? null
    }
    finally {
      loading.value = false
    }
  }

  async function toggleItemStatus(itemId: number, status: 'TODO' | 'DONE') {
    const id = planId()
    if (!id)
      return
    await updatePrepItemStatus(id, itemId, status)
    await load()
  }

  return { prepPlan, loading, load, toggleItemStatus }
}
