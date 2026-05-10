// @vitest-environment jsdom
import type { RecipeSummary } from '@/modules/recipe/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import RecipeCard from '@/modules/recipe/components/RecipeCard.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function createRecipe(overrides: Partial<RecipeSummary> = {}): RecipeSummary {
  return {
    recipeId: 'recipe-manual-pumpkin-porridge',
    name: '南瓜小米粥',
    recipeType: 'SOUP',
    sourceType: 'MANUAL',
    crowdTag: 'CHILD_FRIENDLY',
    seasonTag: 'AUTUMN',
    difficultyLevel: 'EASY',
    cookingTimeMin: 35,
    coverImageUrl: '',
    isBabyFriendly: true,
    isWeightLossFriendly: true,
    status: 'PUBLISHED',
    ...overrides,
  }
}

function mountCard(recipeValue: RecipeSummary) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const recipe = ref(recipeValue)
  const onView = vi.fn()
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeCard, {
          recipe: recipe.value,
          onView,
          onEdit,
          onDelete,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    onView,
    onEdit,
    onDelete,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('recipeCard', () => {
  it('renders summary data and friendly badges', async () => {
    await setLocale('zh-CN')
    mountCard(createRecipe())
    await nextTick()

    expect(document.body.querySelector('[data-testid="recipe-card-name"]')?.textContent).toContain('南瓜小米粥')
    expect(document.body.querySelector('[data-testid="recipe-card-source"]')?.textContent).toContain('手动录入')
    expect(document.body.querySelector('[data-testid="recipe-card-type"]')?.textContent).toContain('汤羹')
    expect(document.body.querySelector('[data-testid="recipe-card-difficulty"]')?.textContent).toContain('简单')
    expect(document.body.querySelector('[data-testid="recipe-card-crowd"]')?.textContent).toContain('儿童友好')
    expect(document.body.querySelector('[data-testid="recipe-card-time"]')?.textContent).toContain('35')
    expect(document.body.querySelector('[data-testid="recipe-card-badges"]')?.textContent).toContain('宝宝友好')
    expect(document.body.querySelector('[data-testid="recipe-card-badges"]')?.textContent).toContain('减脂友好')
  })

  it('emits view, edit, and delete for manual recipes', async () => {
    await setLocale('zh-CN')
    const card = mountCard(createRecipe())
    await nextTick()

    document.body.querySelector('[data-testid="recipe-card-view"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.querySelector('[data-testid="recipe-card-edit"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.body.querySelector('[data-testid="recipe-card-delete"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(card.onView).toHaveBeenCalledWith('recipe-manual-pumpkin-porridge')
    expect(card.onEdit).toHaveBeenCalledWith('recipe-manual-pumpkin-porridge')
    expect(card.onDelete).toHaveBeenCalledWith('recipe-manual-pumpkin-porridge')
  })

  it('shows only view for system recipes', async () => {
    await setLocale('zh-CN')
    mountCard(createRecipe({ sourceType: 'SYSTEM', recipeId: 'recipe-system-cod' }))
    await nextTick()

    expect(document.body.querySelector('[data-testid="recipe-card-view"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="recipe-card-edit"]')).toBeNull()
    expect(document.body.querySelector('[data-testid="recipe-card-delete"]')).toBeNull()
  })

  it('shows edit but not delete for ai-generated recipes', async () => {
    await setLocale('zh-CN')
    mountCard(createRecipe({ sourceType: 'AI_GENERATED', recipeId: 'recipe-ai-chicken-bento' }))
    await nextTick()

    expect(document.body.querySelector('[data-testid="recipe-card-view"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="recipe-card-edit"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="recipe-card-delete"]')).toBeNull()
  })
})
