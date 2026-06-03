import type { ShoppingItem } from '../types'
import { ref } from 'vue'
import { getShoppingList, updateShoppingItem } from '../api'

/**
 * 采购清单页面逻辑：加载、勾选已采购。
 */
export function useShoppingList(planId: () => number | undefined) {
  const items = ref<ShoppingItem[]>([])
  const loading = ref(false)

  async function load() {
    const id = planId()
    if (!id)
      return
    loading.value = true
    try {
      const res = await getShoppingList(id)
      items.value = res.data ?? []
    }
    finally {
      loading.value = false
    }
  }

  async function togglePurchased(itemId: number, purchased: boolean) {
    const id = planId()
    if (!id)
      return
    await updateShoppingItem(id, itemId, purchased)
    await load()
  }

  return { items, loading, load, togglePurchased }
}
