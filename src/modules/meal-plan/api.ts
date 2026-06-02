import type {
  AdjustMealItemParams,
  MealPlanItem,
  MealPlanItemHistory,
  RecipeBrief,
  WeeklyMealPlan,
} from './types'

import http from '@/utils/api/http'

const BASE = '/api/meal-plans'

export function getCurrentWeekPlan(params?: { weekStartDate?: string }) {
  return http.get<WeeklyMealPlan>(`${BASE}/current`, { params })
}

export function getWeekPlan(planId: number) {
  return http.get<WeeklyMealPlan>(`${BASE}/${planId}`)
}

export function adjustMealItem(planId: number, itemId: number, body: AdjustMealItemParams) {
  return http.put<MealPlanItem>(`${BASE}/${planId}/items/${itemId}`, body)
}

export function getRecommendRecipes(planId: number, itemId: number) {
  return http.get<RecipeBrief[]>(`${BASE}/${planId}/items/${itemId}/recommend`)
}

export function getItemHistory(planId: number, itemId: number) {
  return http.get<MealPlanItemHistory[]>(`${BASE}/${planId}/items/${itemId}/history`)
}

export function searchRecipes(keyword: string) {
  return http.get<RecipeBrief[]>('/api/recipes/search', { params: { keyword } })
}
