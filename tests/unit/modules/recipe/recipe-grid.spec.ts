// @vitest-environment jsdom
import type { RecipeSummary } from '@/modules/recipe/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import RecipeGrid from '@/modules/recipe/components/RecipeGrid.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function createRecipe(overrides: Partial<RecipeSummary> = {}): RecipeSummary {
  return {
    recipeId: 'recipe-manual-braised-beef',
    name: '番茄牛腩煲',
    recipeType: 'HOME_COOKING',
    sourceType: 'MANUAL',
    crowdTag: 'FAMILY',
    seasonTag: 'AUTUMN',
    difficultyLevel: 'MEDIUM',
    cookingTimeMin: 60,
    coverImageUrl: '',
    isBabyFriendly: false,
    isWeightLossFriendly: false,
    status: 'PUBLISHED',
    ...overrides,
  }
}

function mountGrid(recipes: RecipeSummary[]) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onAddRecipe = vi.fn()
  const onViewRecipe = vi.fn()
  const onEditRecipe = vi.fn()
  const onDeleteRecipe = vi.fn()

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeGrid, {
          recipes,
          onAddRecipe,
          onViewRecipe,
          onEditRecipe,
          onDeleteRecipe,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    onAddRecipe,
    onViewRecipe,
    onEditRecipe,
    onDeleteRecipe,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('recipeGrid', () => {
  it('shows empty state and add-entry affordance', async () => {
    await setLocale('zh-CN')
    const grid = mountGrid([])
    await nextTick()

    expect(document.body.querySelector('[data-testid="recipe-grid-empty"]')?.textContent).toContain('暂无菜品')
    expect(document.body.querySelector('[data-testid="recipe-grid-empty"]')?.textContent).toContain('先新增一份菜品')

    document.body.querySelector('[data-testid="recipe-grid-add"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(grid.onAddRecipe).toHaveBeenCalledTimes(1)
  })

  it('renders cards in a responsive grid', async () => {
    await setLocale('zh-CN')
    mountGrid([
      createRecipe(),
      createRecipe({ recipeId: 'recipe-system-cod', name: '清蒸鳕鱼', sourceType: 'SYSTEM' }),
    ])
    await nextTick()

    expect(document.body.querySelector('[data-testid="recipe-grid-list"]')).not.toBeNull()
    expect(document.body.querySelectorAll('[data-testid="recipe-card-name"]')).toHaveLength(2)
    expect(document.body.textContent).toContain('番茄牛腩煲')
    expect(document.body.textContent).toContain('清蒸鳕鱼')
  })

  it('re-emits card actions with recipe ids', async () => {
    await setLocale('zh-CN')
    const grid = mountGrid([createRecipe()])
    await nextTick()

    document.body.querySelector('[data-testid="recipe-card-view"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.querySelector('[data-testid="recipe-card-edit"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.querySelector('[data-testid="recipe-card-delete"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(grid.onViewRecipe).toHaveBeenCalledWith('recipe-manual-braised-beef')
    expect(grid.onEditRecipe).toHaveBeenCalledWith('recipe-manual-braised-beef')
    expect(grid.onDeleteRecipe).toHaveBeenCalledWith('recipe-manual-braised-beef')
  })
})
