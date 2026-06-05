import { createPinia } from 'pinia'
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import AdjustHistoryModal from '@/modules/meal-plan/components/AdjustHistoryModal.vue'

vi.mock('@/modules/meal-plan/composables/useAdjustMealItem', () => ({
  useAdjustMealItem: () => ({
    historyList: ref([
      { historyId: 1, oldRecipeName: '番茄炒蛋', newRecipeName: '宫保鸡丁', adjustReason: 'TASTE_CHANGE', adjustedAt: '2026-06-01 12:00' },
    ]),
    historyLoading: ref(false),
    loadHistory: vi.fn(),
    recommendList: ref([]),
    searchResults: ref([]),
    recommendLoading: ref(false),
    searchLoading: ref(false),
    adjustLoading: ref(false),
    openAdjust: vi.fn(),
    doSearch: vi.fn(),
    confirmAdjust: vi.fn(),
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
  const Host = defineComponent({
    setup() {
      return () => h(AdjustHistoryModal, { ...props, onClose })
    },
  })
  const app = createApp(Host)
  app.use(createPinia())
  app.mount(container)
  mountedApps.push({ unmount: () => app.unmount() })
  return { container, onClose }
}

describe('adjustHistoryModal', () => {
  it('renders history list when visible', async () => {
    mount({ visible: true, planId: 1, itemId: 10 })
    await flush()
    const items = document.body.querySelectorAll('.history-modal__item')
    expect(items.length).toBe(1)
  })

  it('shows old and new recipe names', async () => {
    mount({ visible: true, planId: 1, itemId: 10 })
    await flush()
    const old = document.body.querySelector('.history-modal__old')
    const newEl = document.body.querySelector('.history-modal__new')
    expect(old?.textContent).toBe('番茄炒蛋')
    expect(newEl?.textContent).toBe('宫保鸡丁')
  })

  it('displays adjust reason label', async () => {
    mount({ visible: true, planId: 1, itemId: 10 })
    await flush()
    const reason = document.body.querySelector('.history-modal__reason')
    expect(reason?.textContent).toBe('口味变化')
  })
})
