// @vitest-environment jsdom
import type { RecipeStepItem } from '@/modules/recipe/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import StepEditor from '@/modules/recipe/components/StepEditor.vue'

vi.mock('@/modules/recipe/api', () => ({
  uploadRecipeStepImage: vi.fn(),
}))

const { uploadRecipeStepImage } = await import('@/modules/recipe/api')
const uploadRecipeStepImageMock = vi.mocked(uploadRecipeStepImage)

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountEditor(initialSteps: RecipeStepItem[] = []) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const steps = ref<RecipeStepItem[]>(initialSteps)
  const onChange = vi.fn((value: RecipeStepItem[]) => {
    steps.value = value
  })

  const Host = defineComponent({
    setup() {
      return () =>
        h(StepEditor, {
          'modelValue': steps.value,
          'onUpdate:modelValue': onChange,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, steps, onChange }
}

describe('stepEditor', () => {
  beforeEach(() => {
    uploadRecipeStepImageMock.mockReset()
    uploadRecipeStepImageMock.mockResolvedValue('https://example.com/step-image.jpg')
  })

  it('adds a new step row', async () => {
    const { container, onChange } = mountEditor()

    await nextTick()

    const addButton = container.querySelector('[data-testid="step-add"]') as HTMLElement
    expect(addButton).toBeTruthy()

    addButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newSteps = onChange.mock.calls[0][0] as RecipeStepItem[]
    expect(newSteps).toHaveLength(1)
    expect(newSteps[0].stepNo).toBe(1)
  })

  it('deletes a step row', async () => {
    const initialSteps: RecipeStepItem[] = [
      { stepNo: 1, description: '牛腩切块焯水', imageUrl: '' },
      { stepNo: 2, description: '番茄切块', imageUrl: '' },
    ]
    const { container, onChange } = mountEditor(initialSteps)

    await nextTick()

    const deleteButtons = container.querySelectorAll('[data-testid^="step-delete-"]')
    expect(deleteButtons.length).toBe(2)

    ;(deleteButtons[0] as HTMLElement).click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newSteps = onChange.mock.calls[0][0] as RecipeStepItem[]
    expect(newSteps).toHaveLength(1)
    expect(newSteps[0].description).toBe('番茄切块')
  })

  it('moves a step up', async () => {
    const initialSteps: RecipeStepItem[] = [
      { stepNo: 1, description: '牛腩切块焯水', imageUrl: '' },
      { stepNo: 2, description: '番茄切块', imageUrl: '' },
    ]
    const { container, onChange } = mountEditor(initialSteps)

    await nextTick()

    const upButton = container.querySelector('[data-testid="step-up-1"]') as HTMLElement
    expect(upButton).toBeTruthy()

    upButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newSteps = onChange.mock.calls[0][0] as RecipeStepItem[]
    expect(newSteps[0].description).toBe('番茄切块')
    expect(newSteps[0].stepNo).toBe(1)
    expect(newSteps[1].description).toBe('牛腩切块焯水')
    expect(newSteps[1].stepNo).toBe(2)
  })

  it('moves a step down', async () => {
    const initialSteps: RecipeStepItem[] = [
      { stepNo: 1, description: '牛腩切块焯水', imageUrl: '' },
      { stepNo: 2, description: '番茄切块', imageUrl: '' },
    ]
    const { container, onChange } = mountEditor(initialSteps)

    await nextTick()

    const downButton = container.querySelector('[data-testid="step-down-0"]') as HTMLElement
    expect(downButton).toBeTruthy()

    downButton.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const newSteps = onChange.mock.calls[0][0] as RecipeStepItem[]
    expect(newSteps[0].description).toBe('番茄切块')
    expect(newSteps[0].stepNo).toBe(1)
    expect(newSteps[1].description).toBe('牛腩切块焯水')
    expect(newSteps[1].stepNo).toBe(2)
  })

  it('recomputes stepNo after reorder', async () => {
    const initialSteps: RecipeStepItem[] = [
      { stepNo: 1, description: '牛腩切块焯水', imageUrl: '' },
      { stepNo: 2, description: '番茄切块', imageUrl: '' },
      { stepNo: 3, description: '炖煮', imageUrl: '' },
    ]
    const { container, onChange } = mountEditor(initialSteps)

    await nextTick()

    const upButton = container.querySelector('[data-testid="step-up-2"]') as HTMLElement
    upButton.click()
    await nextTick()

    const newSteps = onChange.mock.calls[0][0] as RecipeStepItem[]
    expect(newSteps[0].stepNo).toBe(1)
    expect(newSteps[1].stepNo).toBe(2)
    expect(newSteps[2].stepNo).toBe(3)
    expect(newSteps[1].description).toBe('炖煮')
  })
})
