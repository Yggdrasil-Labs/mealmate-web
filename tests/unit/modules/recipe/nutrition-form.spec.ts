// @vitest-environment jsdom
import type { RecipeNutrition } from '@/modules/recipe/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import NutritionForm from '@/modules/recipe/components/NutritionForm.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountForm(initialNutrition: RecipeNutrition | undefined = undefined) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const nutrition = ref<RecipeNutrition | undefined>(initialNutrition)
  const onChange = vi.fn((value: RecipeNutrition | undefined) => {
    nutrition.value = value
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(NutritionForm, {
          'modelValue': nutrition.value,
          'onUpdate:modelValue': onChange,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, nutrition, onChange }
}

describe('nutritionForm', () => {
  it('renders all nutrition fields', async () => {
    const initialNutrition: RecipeNutrition = {
      calories: 350,
      protein: 28,
      fat: 18,
      carbs: 15,
    }
    const { container } = mountForm(initialNutrition)

    await nextTick()

    expect(container.textContent).toContain('热量')
    expect(container.textContent).toContain('蛋白质')
    expect(container.textContent).toContain('脂肪')
    expect(container.textContent).toContain('碳水')
  })

  it('handles empty optional fields', async () => {
    const { container, onChange } = mountForm()

    await nextTick()

    const caloriesInput = container.querySelector('[data-testid="nutrition-calories"]') as HTMLInputElement
    expect(caloriesInput).toBeTruthy()

    // 空值应该被接受
    expect(onChange).not.toHaveBeenCalled()
  })

  it('updates nutrition values', async () => {
    const initialNutrition: RecipeNutrition = {
      calories: 350,
      protein: 28,
      fat: 18,
      carbs: 15,
    }
    const { container, onChange } = mountForm(initialNutrition)

    await nextTick()

    const caloriesInput = container.querySelector('[data-testid="nutrition-calories"] input') as HTMLInputElement
    expect(caloriesInput).toBeTruthy()

    caloriesInput.value = '400'
    caloriesInput.dispatchEvent(new Event('input'))
    await nextTick()

    expect(onChange).toHaveBeenCalled()
  })
})
