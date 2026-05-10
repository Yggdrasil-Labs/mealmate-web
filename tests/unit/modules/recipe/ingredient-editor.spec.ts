// @vitest-environment jsdom
import type { RecipeIngredientItem } from '@/modules/recipe/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import IngredientEditor from '@/modules/recipe/components/IngredientEditor.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountEditor(initialIngredients: RecipeIngredientItem[] = []) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const ingredients = ref<RecipeIngredientItem[]>(initialIngredients)
  const onChange = vi.fn((value: RecipeIngredientItem[]) => {
    ingredients.value = value
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(IngredientEditor, {
          'modelValue': ingredients.value,
          'onUpdate:modelValue': onChange,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, ingredients, onChange }
}

describe('ingredientEditor', () => {
  it('adds a new ingredient row', async () => {
    const { container, onChange } = mountEditor()

    await nextTick()

    const addButton = container.querySelector('[data-testid="ingredient-add"]') as HTMLElement
    expect(addButton).toBeTruthy()

    addButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newIngredients = onChange.mock.calls[0][0] as RecipeIngredientItem[]
    expect(newIngredients).toHaveLength(1)
    expect(newIngredients[0].sortNo).toBe(1)
  })

  it('deletes an ingredient row', async () => {
    const initialIngredients: RecipeIngredientItem[] = [
      { ingredientId: 'ing-1', name: '牛腩', quantity: '500', unit: '克', sortNo: 1 },
      { ingredientId: 'ing-2', name: '番茄', quantity: '3', unit: '个', sortNo: 2 },
    ]
    const { container, onChange } = mountEditor(initialIngredients)

    await nextTick()

    const deleteButtons = container.querySelectorAll('[data-testid^="ingredient-delete-"]')
    expect(deleteButtons.length).toBe(2)

    ;(deleteButtons[0] as HTMLElement).click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newIngredients = onChange.mock.calls[0][0] as RecipeIngredientItem[]
    expect(newIngredients).toHaveLength(1)
    expect(newIngredients[0].name).toBe('番茄')
  })

  it('moves an ingredient up', async () => {
    const initialIngredients: RecipeIngredientItem[] = [
      { ingredientId: 'ing-1', name: '牛腩', quantity: '500', unit: '克', sortNo: 1 },
      { ingredientId: 'ing-2', name: '番茄', quantity: '3', unit: '个', sortNo: 2 },
    ]
    const { container, onChange } = mountEditor(initialIngredients)

    await nextTick()

    const upButton = container.querySelector('[data-testid="ingredient-up-1"]') as HTMLElement
    expect(upButton).toBeTruthy()

    upButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newIngredients = onChange.mock.calls[0][0] as RecipeIngredientItem[]
    expect(newIngredients[0].name).toBe('番茄')
    expect(newIngredients[0].sortNo).toBe(1)
    expect(newIngredients[1].name).toBe('牛腩')
    expect(newIngredients[1].sortNo).toBe(2)
  })

  it('moves an ingredient down', async () => {
    const initialIngredients: RecipeIngredientItem[] = [
      { ingredientId: 'ing-1', name: '牛腩', quantity: '500', unit: '克', sortNo: 1 },
      { ingredientId: 'ing-2', name: '番茄', quantity: '3', unit: '个', sortNo: 2 },
    ]
    const { container, onChange } = mountEditor(initialIngredients)

    await nextTick()

    const downButton = container.querySelector('[data-testid="ingredient-down-0"]') as HTMLElement
    expect(downButton).toBeTruthy()

    downButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newIngredients = onChange.mock.calls[0][0] as RecipeIngredientItem[]
    expect(newIngredients[0].name).toBe('番茄')
    expect(newIngredients[0].sortNo).toBe(1)
    expect(newIngredients[1].name).toBe('牛腩')
    expect(newIngredients[1].sortNo).toBe(2)
  })

  it('recomputes sortNo after reorder', async () => {
    const initialIngredients: RecipeIngredientItem[] = [
      { ingredientId: 'ing-1', name: '牛腩', quantity: '500', unit: '克', sortNo: 1 },
      { ingredientId: 'ing-2', name: '番茄', quantity: '3', unit: '个', sortNo: 2 },
      { ingredientId: 'ing-3', name: '土豆', quantity: '2', unit: '个', sortNo: 3 },
    ]
    const { container, onChange } = mountEditor(initialIngredients)

    await nextTick()

    const upButton = container.querySelector('[data-testid="ingredient-up-2"]') as HTMLElement
    upButton.click()
    await nextTick()

    const newIngredients = onChange.mock.calls[0][0] as RecipeIngredientItem[]
    expect(newIngredients[0].sortNo).toBe(1)
    expect(newIngredients[1].sortNo).toBe(2)
    expect(newIngredients[2].sortNo).toBe(3)
    expect(newIngredients[1].name).toBe('土豆')
  })
})
