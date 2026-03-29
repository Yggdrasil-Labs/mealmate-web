// @vitest-environment jsdom
import type { ProDialogExpose, ProDialogProps } from '@/components/pro-dialog/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import ProDialog from '@/components/pro-dialog/ProDialog.vue'

const mountedDialogs: Array<ReturnType<typeof mountDialog>> = []

afterEach(() => {
  mountedDialogs.splice(0).forEach((dialog) => {
    dialog.unmount()
  })
  document.body.innerHTML = ''
})

function flush() {
  return Promise.resolve().then(() => nextTick())
}

function mountDialog(
  props: Partial<ProDialogProps> = {},
  slots: Record<string, () => unknown> = {},
  options: { withPageButton?: boolean } = {},
) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const visible = ref(props.modelValue ?? false)
  const dialogRef = ref<ProDialogExpose | null>(null)
  const pageClicks = ref(0)
  const events = {
    open: vi.fn(),
    opened: vi.fn(),
    confirm: vi.fn(),
    cancel: vi.fn(),
    close: vi.fn(),
    closed: vi.fn(),
  }

  const Host = defineComponent({
    setup() {
      return () =>
        h('div', { class: 'host-shell' }, [
          options.withPageButton
            ? h(
                'button',
                {
                  'type': 'button',
                  'data-testid': 'page-button',
                  'onClick': () => {
                    pageClicks.value += 1
                  },
                },
                'Page button',
              )
            : null,
          h(
            ProDialog,
            {
              'ref': dialogRef,
              'modelValue': visible.value,
              'title': props.title,
              'mode': props.mode,
              'width': props.width,
              'placement': props.placement,
              'showClose': props.showClose,
              'maskClosable': props.maskClosable,
              'escClosable': props.escClosable,
              'showFooter': props.showFooter,
              'loading': props.loading,
              'confirmLoading': props.confirmLoading,
              'confirmDisabled': props.confirmDisabled,
              'confirmText': props.confirmText,
              'cancelText': props.cancelText,
              'confirmType': props.confirmType,
              'closeOnConfirm': props.closeOnConfirm,
              'destroyOnClose': props.destroyOnClose,
              'bodyClass': props.bodyClass,
              'footerAlign': props.footerAlign,
              'beforeClose': props.beforeClose,
              'onUpdate:modelValue': (next: boolean) => {
                visible.value = next
              },
              'onOpen': events.open,
              'onOpened': events.opened,
              'onConfirm': events.confirm,
              'onCancel': events.cancel,
              'onClose': events.close,
              'onClosed': events.closed,
            },
            {
              'default': slots.default ?? (() => h('div', { class: 'dialog-body-copy' }, 'ProDialog body')),
              'footer': slots.footer,
              'header-extra': slots['header-extra'],
              'body-prefix': slots['body-prefix'],
              'body-suffix': slots['body-suffix'],
              'footer-extra': slots['footer-extra'],
            },
          ),
        ])
    },
  })

  const app = createApp(Host)
  app.mount(container)

  const dialog = {
    app,
    container,
    visible,
    dialogRef,
    events,
    pageClicks,
    async flush() {
      await flush()
      await flush()
    },
    unmount() {
      app.unmount()
      container.remove()
    },
  }

  mountedDialogs.push(dialog)
  return dialog
}

describe('pro-dialog', () => {
  it('applies width and renders the default footer', async () => {
    const dialog = mountDialog({
      title: '编辑状态',
      modelValue: false,
      width: 720,
    })

    dialog.dialogRef.value?.open()
    await dialog.flush()

    const dialogElement = document.body.querySelector('.el-dialog') as HTMLElement | null
    expect(dialog.visible.value).toBe(true)
    expect(dialog.events.open).toHaveBeenCalledTimes(1)
    expect(dialogElement).not.toBeNull()
    expect(dialogElement?.getAttribute('style')).toContain('--el-dialog-width: 720px')
    expect(document.body.querySelector('[data-testid="dialog-title"]')?.textContent).toContain('编辑状态')
    expect(document.body.querySelector('[data-testid="dialog-body"]')?.textContent).toContain('ProDialog body')
    expect(document.body.querySelector('[data-testid="dialog-cancel"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="dialog-confirm"]')).not.toBeNull()

    dialog.unmount()
  })

  it('keeps footer slots working while overriding the default footer', async () => {
    const dialog = mountDialog(
      {
        modelValue: true,
        title: '自定义 footer',
      },
      {
        footer: () => h('div', { class: 'custom-footer' }, 'Custom footer'),
      },
    )

    await dialog.flush()

    expect(document.body.querySelector('[data-testid="dialog-cancel"]')).toBeNull()
    expect(document.body.querySelector('[data-testid="dialog-confirm"]')).toBeNull()
    expect(document.body.querySelector('.custom-footer')).not.toBeNull()
    expect(document.body.querySelector('.custom-footer')?.textContent).toContain('Custom footer')

    dialog.unmount()
  })

  it('emits cancel only for explicit cancel actions', async () => {
    const dialog = mountDialog({
      modelValue: true,
      title: '取消语义',
      showClose: true,
      maskClosable: true,
      escClosable: true,
    })

    await dialog.flush()

    document.body.querySelector('[data-testid="dialog-cancel"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(dialog.events.cancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.dialogRef.value?.open()
    await dialog.flush()

    document.body.querySelector('[data-testid="dialog-close"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(dialog.events.cancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.dialogRef.value?.open()
    await dialog.flush()

    document.body.querySelector('.el-overlay')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(dialog.events.cancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.dialogRef.value?.open()
    await dialog.flush()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await dialog.flush()

    expect(dialog.events.cancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.unmount()
  })

  it('supports sync and async beforeClose interception', async () => {
    const syncBeforeClose = vi.fn().mockReturnValue(false)
    const syncDialog = mountDialog({
      modelValue: true,
      beforeClose: syncBeforeClose,
    })

    await syncDialog.flush()

    document.body.querySelector('[data-testid="dialog-cancel"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await syncDialog.flush()

    expect(syncBeforeClose).toHaveBeenCalledTimes(1)
    expect(syncDialog.visible.value).toBe(true)
    expect(syncDialog.events.cancel).not.toHaveBeenCalled()

    syncDialog.unmount()

    const asyncBeforeClose = vi.fn().mockResolvedValue(false)
    const asyncDialog = mountDialog({
      modelValue: true,
      beforeClose: asyncBeforeClose,
    })

    await asyncDialog.flush()

    document.body.querySelector('[data-testid="dialog-close"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await asyncDialog.flush()

    expect(asyncBeforeClose).toHaveBeenCalledTimes(1)
    expect(asyncDialog.visible.value).toBe(true)
    expect(asyncDialog.events.close).not.toHaveBeenCalled()

    asyncDialog.unmount()
  })

  it('still emits cancel when beforeClose closes through context.close()', async () => {
    const beforeClose = vi.fn().mockImplementation(async (_reason, context) => {
      context.close()
      return true
    })
    const dialog = mountDialog({
      modelValue: true,
      beforeClose,
    })

    await dialog.flush()

    document.body.querySelector('[data-testid="dialog-cancel"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(beforeClose).toHaveBeenCalledTimes(1)
    expect(dialog.events.cancel).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.unmount()
  })

  it('does not keep blocking the page when destroyOnClose is false', async () => {
    const dialog = mountDialog(
      {
        modelValue: true,
        title: '关闭后保留',
        destroyOnClose: false,
      },
      {},
      { withPageButton: true },
    )

    await dialog.flush()

    dialog.dialogRef.value?.close()
    await dialog.flush()

    const overlay = document.body.querySelector('.el-overlay') as HTMLElement | null
    expect(overlay).not.toBeNull()

    document.body.querySelector('[data-testid="page-button"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(dialog.pageClicks.value).toBe(1)
    expect(dialog.visible.value).toBe(false)

    dialog.unmount()
  })

  it('keeps confirm mode on the default footer, uses a compact default width, and closes after confirm', async () => {
    const dialog = mountDialog({
      modelValue: true,
      mode: 'confirm',
      title: '删除记录',
      confirmType: 'danger',
      confirmText: '删除',
    })

    await dialog.flush()

    const confirmButton = document.body.querySelector('[data-testid="dialog-confirm"]') as HTMLButtonElement | null
    const dialogElement = document.body.querySelector('.el-dialog') as HTMLElement | null
    expect(confirmButton).not.toBeNull()
    expect(confirmButton?.className).toContain('el-button--danger')
    expect(dialogElement?.getAttribute('style')).toContain('--el-dialog-width: 480px')

    confirmButton?.click()
    await dialog.flush()

    expect(dialog.events.confirm).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(false)

    dialog.unmount()
  })

  it('toggle(false) closes through the shared close pipeline', async () => {
    const dialog = mountDialog({
      modelValue: true,
    })

    await dialog.flush()

    dialog.dialogRef.value?.toggle(false)
    await dialog.flush()

    expect(dialog.visible.value).toBe(false)

    dialog.unmount()
  })

  it('keeps dialog open when closeOnConfirm is false', async () => {
    const dialog = mountDialog({
      modelValue: true,
      closeOnConfirm: false,
    })

    await dialog.flush()

    document.body.querySelector('[data-testid="dialog-confirm"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await dialog.flush()

    expect(dialog.events.confirm).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(true)

    dialog.unmount()
  })
})
