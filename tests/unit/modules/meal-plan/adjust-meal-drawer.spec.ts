import { createPinia } from 'pinia'
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import AdjustMealDrawer from '@/modules/meal-plan/components/AdjustMealDrawer.vue'

vi.mock('@/modules/meal-plan/composables/useAdjustMealItem', () => ({
  useAdjustMealItem: () => ({
    recommendList: ref([{ recipeId: 1, name: '宫保鸡丁', recipeType: '炒菜', seasonTag: '四季', cookTimeMinutes: 30 }]),
    searchResults: ref([]),
    recommendLoading: ref(false),
    searchLoading: ref(false),
    adjustLoading: ref(false),
    openAdjust: vi.fn(),
    doSearch: vi.fn(),
    confirmAdjust: vi.fn().mockResolvedValue({ itemId: 1, recipeId: 1, recipeName: '宫保鸡丁', crowdType: 'ALL', mealType: 'LUNCH', isWeightLoss: false, isBabyMeal: false, duplicateFlag: false, manuallyAdjusted: true, adjustCount: 1 }),
  }),
}))

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(a => a.unmount())
  document.body.innerHTML = ''
})

async function flush(n = 5) {
  for (let i = 0; i < n; i++) await nextTick()
}

function mount(props: { visible: boolean, planId: number, itemId: number }) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onClose = vi.fn()
  const onAdjusted = vi.fn()
  const Host = defineComponent({
    setup() {
      return () => h(AdjustMealDrawer, { ...props, onClose, onAdjusted })
    },
  })
  const app = createApp(Host)
  app.use(createPinia())
  app.mount(container)
  mountedApps.push({ unmount: () => app.unmount() })
  return { container, onClose, onAdjusted }
}

describe('adjustMealDrawer', () => {
  it('renders ElDrawer with title when visible', async () => {
    mount({ visible: true, planId: 1, itemId: 10 })
    await flush()
    const title = document.body.querySelector('.el-drawer__title')
    expect(title?.textContent).toContain('调整菜品')
  })

  it('displays recommended recipe items', async () => {
    mount({ visible: true, planId: 1, itemId: 10 })
    await flush()
    const items = document.body.querySelectorAll('.adjust-drawer__item')
    expect(items.length).toBe(1)
    expect(items[0]?.textContent).toContain('宫保鸡丁')
  })
})
