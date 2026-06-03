export interface PrepPlanItem {
  id: number
  ingredientName: string
  quantity: number | null
  unit: string | null
  storageMethod: string | null
  priority: 'HIGH' | 'NORMAL' | 'LOW'
  taskStatus: 'TODO' | 'DONE'
}

export interface PrepPlan {
  id: number
  planId: number
  pushStatus: string
  items: PrepPlanItem[]
}

export interface ShoppingItem {
  id: number
  ingredientName: string
  totalQuantity: number | null
  unit: string | null
  purchased: boolean
  sortNo: number
}
