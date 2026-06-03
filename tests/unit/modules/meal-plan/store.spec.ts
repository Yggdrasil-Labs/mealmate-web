import type { MealPlanItem, WeeklyMealPlan } from '@/modules/meal-plan/types'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useMealPlanStore } from '@/modules/meal-plan/store'

function makeItem(over: Partial<MealPlanItem> = {}): MealPlanItem {
  return {
    itemId: 1,
    recipeId: 100,
    recipeName: '番茄炒蛋',
    crowdType: 'ALL',
    mealType: 'LUNCH',
    isWeightLoss: false,
    isBabyMeal: false,
    duplicateFlag: false,
    manuallyAdjusted: false,
    adjustCount: 0,
    ...over,
  }
}

beforeEach(() => setActivePinia(createPinia()))

describe('useMealPlanStore.updateItem', () => {
  it('replaces the matching item by itemId across day meals', () => {
    const store = useMealPlanStore()
    store.currentPlan = {
      planId: 1,
      weekStartDate: '2026-06-01',
      weekEndDate: '2026-06-07',
      status: 'DRAFT',
      dayMeals: {
        '2026-06-01': { date: '2026-06-01', breakfast: [], lunch: [makeItem()], dinner: [] },
      },
    } as WeeklyMealPlan

    store.updateItem(makeItem({ itemId: 1, recipeId: 200, recipeName: '红烧肉', manuallyAdjusted: true, adjustCount: 1 }))

    const lunch = store.currentPlan!.dayMeals['2026-06-01'].lunch[0]
    expect(lunch.recipeName).toBe('红烧肉')
    expect(lunch.manuallyAdjusted).toBe(true)
    expect(lunch.adjustCount).toBe(1)
  })

  it('does nothing when no plan is loaded', () => {
    const store = useMealPlanStore()
    expect(() => store.updateItem(makeItem())).not.toThrow()
  })
})
