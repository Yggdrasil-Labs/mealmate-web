// @vitest-environment jsdom
import type { RecipeBrief } from '@/modules/meal-plan/types'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import RecipeSearchPanel from '@/modules/meal-plan/components/RecipeSearchPanel.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(a => a.unmount())
  document.body.innerHTML = ''
})

function mount(props: { results: RecipeBrief[], loading: boolean, selectedId?: number }) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onSearch = vi.fn()
  const onSelect = vi.fn()
  const Host = defineComponent({
    setup() {
      return () => h(RecipeSearchPanel, { ...props, onSearch, onSelect })
    },
  })
  const app = createApp(Host)
  app.use(createPinia())
  app.mount(container)
  mountedApps.push({ unmount: () => app.unmount() })
  return { container, onSearch, onSelect }
}

describe('recipeSearchPanel', () => {
  it('renders ElInput for keyword search', async () => {
    mount({ results: [], loading: false })
    await nextTick()
    const input = document.body.querySelector('.el-input')
    expect(input).not.toBeNull()
  })

  it('renders result items when provided', async () => {
    const results: RecipeBrief[] = [
      { recipeId: 1, name: '红烧肉', recipeType: '红烧', seasonTag: '冬', cookTimeMinutes: 60 },
      { recipeId: 2, name: '清蒸鱼', recipeType: '蒸菜', seasonTag: '四季' },
    ]
    mount({ results, loading: false })
    await nextTick()
    const items = document.body.querySelectorAll('.recipe-search-panel__item')
    expect(items.length).toBe(2)
    expect(items[0]?.textContent).toContain('红烧肉')
  })

  it('highlights selected item', async () => {
    const results: RecipeBrief[] = [
      { recipeId: 1, name: '红烧肉', recipeType: '红烧', seasonTag: '冬' },
    ]
    mount({ results, loading: false, selectedId: 1 })
    await nextTick()
    const selected = document.body.querySelector('.recipe-search-panel__item--selected')
    expect(selected).not.toBeNull()
  })
})
