// @vitest-environment jsdom
import type { MealPlanItem } from '@/modules/meal-plan/types'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'

import MealItemCard from '@/modules/meal-plan/components/MealItemCard.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

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

function mountCard(item: MealPlanItem) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onAdjust = vi.fn()
  const onHistory = vi.fn()
  const onDelete = vi.fn()
  const Host = defineComponent({
    setup() {
      return () => h(MealItemCard, { item, onAdjust, onHistory, onDelete })
    },
  })
  const app = createApp(Host)
  app.mount(container)
  mountedApps.push({ unmount: () => app.unmount() })
  return { container, onAdjust, onHistory, onDelete }
}

describe('mealItemCard', () => {
  it('shows the adjust badge with adjustCount when manuallyAdjusted', async () => {
    const { container } = mountCard(makeItem({ manuallyAdjusted: true, adjustCount: 2 }))
    await nextTick()
    const badge = container.querySelector('.meal-item-card__badge')
    expect(badge?.textContent?.trim()).toBe('2')
  })

  it('hides the badge when not manually adjusted', async () => {
    const { container } = mountCard(makeItem())
    await nextTick()
    expect(container.querySelector('.meal-item-card__badge')).toBeNull()
  })

  it('emits history when the badge is clicked', async () => {
    const { container, onHistory } = mountCard(makeItem({ manuallyAdjusted: true, adjustCount: 1 }))
    await nextTick()
    container.querySelector<HTMLElement>('.meal-item-card__badge')?.click()
    expect(onHistory).toHaveBeenCalledTimes(1)
  })

  it('emits adjust when the replace button is clicked', async () => {
    const { container, onAdjust } = mountCard(makeItem())
    await nextTick()
    container.querySelector<HTMLElement>('.meal-item-card__action')?.click()
    expect(onAdjust).toHaveBeenCalledTimes(1)
  })
})
