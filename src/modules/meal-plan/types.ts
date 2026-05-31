export interface MealPlanItem {
  itemId: number
  recipeId: number
  recipeName: string
  crowdType: string | null
  isWeightLoss: boolean
  isBabyMeal: boolean
  duplicateFlag: boolean
  coverImageUrl: string | null
  cookingTimeMin: number | null
  sortOrder: number
}

export interface DayMeal {
  date: string
  breakfast: MealPlanItem[]
  lunch: MealPlanItem[]
  dinner: MealPlanItem[]
}

export interface WeeklyMealPlan {
  planId: number
  weekStartDate: string
  weekEndDate: string
  status: 'DRAFT' | 'CONFIRMED' | 'ARCHIVED'
  planSource: string
  dayMeals: Record<string, DayMeal>
}

export interface ConfirmPlanResult {
  planId: number
  status: string
  prepPlanId: number
  prepItemCount: number
  shoppingItemCount: number
}

export interface GenerateRequest {
  familyId?: string
  weekStartDate: string
  forceRegenerate?: boolean
}
