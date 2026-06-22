import type { MealPlanItem, MealPlanItemHistory, RecipeBrief, WeeklyMealPlan } from './types'

function mockItem(id: number, name: string, adjusted = false): MealPlanItem {
  return {
    itemId: id,
    recipeId: id * 10,
    recipeName: name,
    crowdType: 'ALL',
    mealType: 'LUNCH',
    weightLoss: false,
    babyMeal: false,
    duplicateFlag: false,
    manuallyAdjusted: adjusted,
    adjustCount: adjusted ? 1 : 0,
  }
}

export const mockWeekPlan: WeeklyMealPlan = {
  planId: 1,
  weekStartDate: '2026-06-02',
  weekEndDate: '2026-06-08',
  status: 'DRAFT',
  dayMeals: {
    '2026-06-02': {
      date: '2026-06-02',
      breakfast: [mockItem(1, '小米粥')],
      lunch: [mockItem(2, '红烧肉'), mockItem(3, '清蒸鱼')],
      dinner: [mockItem(4, '番茄炒蛋', true), mockItem(5, '紫菜蛋花汤')],
    },
  },
}

export const mockRecommendList: RecipeBrief[] = [
  { recipeId: 101, name: '口水鸡', recipeType: 'MAIN', seasonTag: 'SUMMER', cookTimeMinutes: 40 },
  {
    recipeId: 102,
    name: '凉拌黄瓜',
    recipeType: 'SIDE',
    seasonTag: 'SUMMER',
    cookTimeMinutes: 10,
  },
]

export const mockHistory: MealPlanItemHistory[] = [
  {
    historyId: 1,
    oldRecipeName: '香煎豆腐',
    newRecipeName: '番茄炒蛋',
    adjustReason: 'TASTE_CHANGE',
    adjustedAt: '2026-06-01 18:30',
  },
]
