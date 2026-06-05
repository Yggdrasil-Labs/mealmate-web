// @vitest-environment jsdom
import type { RecipeNutrition } from '@/modules/recipe/types'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { registerDefaultFieldComponents } from '@/components/pro-form'
import i18n from '@/locales/i18n'
import NutritionForm from '@/modules/recipe/components/NutritionForm.vue'

registerDefaultFieldComponents()

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
  app.use(createPinia())
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, nutrition, onChange }
}

describe('nutritionForm', () => {
  it('renders all nutrition field labels', async () => {
    const { container } = mountForm({ calories: 350, protein: 28, fat: 18, carbs: 15 })
    await nextTick()
    await nextTick()

    const text = container.textContent || ''
    expect(text).toContain('热量')
    expect(text).toContain('蛋白质')
    expect(text).toContain('脂肪')
    expect(text).toContain('碳水')
  })

  it('renders section title', async () => {
    const { container } = mountForm()
    await nextTick()

    expect(container.textContent).toContain('营养信息（每份）')
  })

  it('renders InputNumber controls', async () => {
    const { container } = mountForm({ calories: 350, protein: 28, fat: 18, carbs: 15 })
    await nextTick()
    await nextTick()

    const inputs = container.querySelectorAll('.el-input-number')
    expect(inputs.length).toBe(4)
  })
})
