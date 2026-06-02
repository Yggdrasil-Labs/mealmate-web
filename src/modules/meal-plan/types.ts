export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'
export type CrowdType = 'ALL' | 'ADULT' | 'BABY'
export type PlanStatus = 'DRAFT' | 'CONFIRMED' | 'ARCHIVED'
export type AdjustReason = 'LACK_INGREDIENT' | 'TASTE_CHANGE' | 'OUTING' | 'OTHER'

export interface WeeklyMealPlan {
  planId: number
  weekStartDate: string
  weekEndDate: string
  status: PlanStatus
  dayMeals: Record<string, DayMeal>
}

export interface DayMeal {
  date: string
  breakfast: MealPlanItem[]
  lunch: MealPlanItem[]
  dinner: MealPlanItem[]
}

export interface MealPlanItem {
  itemId: number
  recipeId: number
  recipeName: string
  crowdType: CrowdType
  mealType: MealType
  weightLoss: boolean
  manuallyAdjusted: boolean
  adjustCount: number
  coverImageUrl?: string
  cookTimeMinutes?: number
}

export interface RecipeBrief {
  recipeId: number
  name: string
  recipeType: string
  seasonTag: string
  coverImageUrl?: string
  cookTimeMinutes?: number
}

export interface MealPlanItemHistory {
  historyId: number
  oldRecipeName: string
  newRecipeName: string
  adjustReason: string | null
  adjustedAt: string
}

export interface AdjustMealItemParams {
  newRecipeId: number
  adjustReason?: AdjustReason
}
