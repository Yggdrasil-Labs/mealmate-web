// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n from '@/locales/i18n'
import RecipeDeleteDialog from '@/modules/recipe/components/RecipeDeleteDialog.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountDialog(visible = true, recipeName = '番茄牛腩煲') {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const visibleRef = ref(visible)
  const recipeNameRef = ref(recipeName)
  const onConfirm = vi.fn()
  const onCancel = vi.fn()

  const Host = defineComponent({
    setup() {
      return () =>
        h(RecipeDeleteDialog, {
          visible: visibleRef.value,
          recipeName: recipeNameRef.value,
          onConfirm,
          onCancel,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)
  mountedApps.push(app)

  return { container, visibleRef, recipeNameRef, onConfirm, onCancel }
}

describe('recipeDeleteDialog', () => {
  it('shows delete confirmation copy with recipe name', async () => {
    const { container } = mountDialog(true, '番茄牛腩煲')

    await nextTick()

    expect(container.textContent).toContain('番茄牛腩煲')
    expect(container.textContent).toContain('删除')
  })

  it('emits confirm action when confirm button is clicked', async () => {
    const { onConfirm } = mountDialog()

    await nextTick()
    await nextTick()

    const confirmButton = document.body.querySelector('[data-testid="dialog-confirm"]') as HTMLElement
    expect(confirmButton).toBeTruthy()

    confirmButton.click()
    await nextTick()

    expect(onConfirm).toHaveBeenCalled()
  })

  it('emits cancel action when cancel button is clicked', async () => {
    const { onCancel } = mountDialog()

    await nextTick()
    await nextTick()

    const cancelButton = document.body.querySelector('[data-testid="dialog-cancel"]') as HTMLElement
    expect(cancelButton).toBeTruthy()

    cancelButton.click()
    await nextTick()

    expect(onCancel).toHaveBeenCalled()
  })
})
