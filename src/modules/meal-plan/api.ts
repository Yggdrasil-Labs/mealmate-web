import type {
  AdjustMealItemParams,
  MealPlanItem,
  MealPlanItemHistory,
  RecipeBrief,
  WeeklyMealPlan,
} from './types'

import http from '@/utils/api/http'

const BASE = '/api/meal-plans'

/** 从 COLA 统一响应中提取 data 字段 */
async function unwrap<T>(request: Promise<any>): Promise<T> {
  const res = await request
  return res.data as T
}

export function getCurrentWeekPlan(params?: { weekStartDate?: string, familyId?: number }) {
  return unwrap<WeeklyMealPlan | null>(http.get<WeeklyMealPlan>(`${BASE}/current`, params))
}

export function getWeekPlan(planId: number) {
  return unwrap<WeeklyMealPlan>(http.get<WeeklyMealPlan>(`${BASE}/${planId}`))
}

export function adjustMealItem(planId: number, itemId: number, body: AdjustMealItemParams) {
  return unwrap<MealPlanItem>(http.put<MealPlanItem>(`${BASE}/${planId}/items/${itemId}`, body, { _silent: true } as any))
}

export function getRecommendRecipes(planId: number, itemId: number) {
  return unwrap<RecipeBrief[]>(http.get<RecipeBrief[]>(`${BASE}/${planId}/items/${itemId}/recommend`))
}

export function getItemHistory(planId: number, itemId: number) {
  return unwrap<MealPlanItemHistory[]>(http.get<MealPlanItemHistory[]>(`${BASE}/${planId}/items/${itemId}/history`))
}

export function searchRecipes(keyword: string) {
  return unwrap<RecipeBrief[]>(http.get<RecipeBrief[]>('/api/recipes/search', { keyword }))
}

export function generatePlan(params: { weekStartDate: string, forceRegenerate?: boolean, familyId?: number }) {
  return unwrap<WeeklyMealPlan>(http.post<WeeklyMealPlan>(`${BASE}/generate`, params))
}

export function confirmPlan(planId: number) {
  return http.post(`${BASE}/${planId}/confirm`)
}

export function replaceItem(planId: number, itemId: number, body: { newRecipeId: number }) {
  return http.put(`${BASE}/${planId}/items/${itemId}/replace`, body)
}

export function deleteItem(planId: number, itemId: number) {
  return http.delete(`${BASE}/${planId}/items/${itemId}`)
}

export function manualAddItem(planId: number, body: { recipeName: string, mealDate: string, mealType: string, crowdType?: string }) {
  return http.post(`${BASE}/${planId}/items/manual`, body)
}

export function getPrepPlan(planId: number) {
  return http.get(`${BASE}/${planId}/prep-plan`)
}

export function updatePrepItemStatus(planId: number, itemId: number, status: string) {
  return http.put(`${BASE}/${planId}/prep-plan/items/${itemId}/status`, { status })
}

export function getShoppingList(planId: number) {
  return http.get(`${BASE}/${planId}/shopping-list`)
}

export function updateShoppingItem(planId: number, itemId: number, purchased: boolean) {
  return http.put(`${BASE}/${planId}/shopping-list/items/${itemId}`, { purchased })
}

// ─── AI 生成 ───

export function aiGeneratePlan(params: { familyId: number, weekStartDate: string, userHint?: string }) {
  return unwrap<import('./types').AiMealPlanResult>(http.post('/api/ai/meal-plans/generate', params))
}
