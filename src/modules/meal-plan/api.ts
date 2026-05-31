import type { PrepPlan, ShoppingItem } from '../prep/types'
import type { ConfirmPlanResult, GenerateRequest, WeeklyMealPlan } from './types'
import http from '@/utils/api/http'

/** 生成周计划 */
export function generatePlan(data: GenerateRequest) {
  return http.post<WeeklyMealPlan>('/api/meal-plans/generate', data)
}

/** 获取当前周计划（支持传 weekStartDate 查询指定周） */
export function getCurrentPlan(weekStartDate?: string, familyId?: string) {
  const params: Record<string, string> = {}
  if (weekStartDate)
    params.weekStartDate = weekStartDate
  if (familyId)
    params.familyId = familyId
  return http.get<WeeklyMealPlan>('/api/meal-plans/current', Object.keys(params).length > 0 ? params : undefined)
}

/** 获取计划详情 */
export function getPlanDetail(planId: number) {
  return http.get<WeeklyMealPlan>(`/api/meal-plans/${planId}`)
}

/** 替换计划中某餐项 */
export function replaceItem(planId: number, itemId: number, recipeId: number) {
  return http.put(`/api/meal-plans/${planId}/items/${itemId}/replace`, { recipeId })
}

/** 添加计划项（从菜品库选择） */
export function addItem(planId: number, data: { recipeId: number, mealDate: string, mealType: string, crowdType?: string }) {
  return http.post(`/api/meal-plans/${planId}/items`, data)
}

/** 删除计划项 */
export function deleteItem(planId: number, itemId: number) {
  return http.delete(`/api/meal-plans/${planId}/items/${itemId}`)
}

/** 手动添加自定义菜品项 */
export function manualAddItem(planId: number, data: { recipeName: string, mealDate: string, mealType: string, crowdType?: string }) {
  return http.post(`/api/meal-plans/${planId}/items/manual`, data)
}

/** 确认计划 */
export function confirmPlan(planId: number) {
  return http.post<ConfirmPlanResult>(`/api/meal-plans/${planId}/confirm`)
}

/** 获取备菜计划 */
export function getPrepPlan(planId: number) {
  return http.get<PrepPlan>(`/api/meal-plans/${planId}/prep-plan`)
}

/** 更新备菜项状态 */
export function updatePrepItemStatus(planId: number, itemId: number, status: string) {
  return http.put(`/api/meal-plans/${planId}/prep-plan/items/${itemId}/status`, { status })
}

/** 获取采购清单 */
export function getShoppingList(planId: number) {
  return http.get<ShoppingItem[]>(`/api/meal-plans/${planId}/shopping-list`)
}

/** 更新采购项状态 */
export function updateShoppingItem(planId: number, itemId: number, purchased: boolean) {
  return http.put(`/api/meal-plans/${planId}/shopping-list/items/${itemId}`, { purchased })
}
