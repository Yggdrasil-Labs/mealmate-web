// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import i18n, { setLocale } from '@/locales/i18n'
import FamilyMemberDeleteDialog from '@/modules/family/components/FamilyMemberDeleteDialog.vue'

const mountedApps: Array<{ unmount: () => void }> = []

afterEach(() => {
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountDeleteDialog() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const visible = ref(true)
  const onConfirm = vi.fn()
  const onCancel = vi.fn()

  const Host = defineComponent({
    setup() {
      return () =>
        h(FamilyMemberDeleteDialog, {
          'modelValue': visible.value,
          'memberName': '小满',
          'onUpdate:modelValue': (next: boolean) => {
            visible.value = next
          },
          onConfirm,
          onCancel,
        })
    },
  })

  const app = createApp(Host)
  app.use(i18n)
  app.mount(container)

  const mounted = {
    visible,
    onConfirm,
    onCancel,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
  mountedApps.push(mounted)
  return mounted
}

describe('familyMemberDeleteDialog', () => {
  it('confirms and cancels correctly', async () => {
    await setLocale('zh-CN')
    const dialog = mountDeleteDialog()
    await nextTick()

    document.body.querySelector('[data-testid="family-member-delete-cancel"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(dialog.onCancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.visible.value = true
    await nextTick()

    document.body.querySelector('[data-testid="family-member-delete-confirm"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(dialog.onConfirm).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)
  })
})
