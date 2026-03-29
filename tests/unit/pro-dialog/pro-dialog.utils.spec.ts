import { describe, expect, it } from 'vitest'
import {
  canCloseByReason,
  resolveConfirmButtonType,
  resolveDialogWidth,
  resolveFooterVisibility,
} from '@/components/pro-dialog/pro-dialog.utils'

describe('pro-dialog utils', () => {
  it('会拦截被禁止的遮罩关闭和 ESC 关闭', () => {
    expect(
      canCloseByReason('mask', { maskClosable: false, escClosable: true }),
    ).toBe(false)
    expect(
      canCloseByReason('esc', { maskClosable: true, escClosable: false }),
    ).toBe(false)
  })

  it('会允许默认取消与程序化关闭', () => {
    expect(
      canCloseByReason('cancel', { maskClosable: false, escClosable: false }),
    ).toBe(true)
    expect(
      canCloseByReason('programmatic', { maskClosable: false, escClosable: false }),
    ).toBe(true)
  })

  it('存在 footer 插槽时默认 footer 不显示', () => {
    expect(resolveFooterVisibility(true, false)).toBe(false)
    expect(resolveFooterVisibility(false, true)).toBe(true)
  })

  it('会把 danger 确认态映射到危险按钮类型', () => {
    expect(resolveConfirmButtonType('danger')).toBe('danger')
    expect(resolveConfirmButtonType('primary')).toBe('primary')
  })

  it('会给 confirm 模式提供更窄的默认宽度', () => {
    expect(resolveDialogWidth('confirm')).toBe(480)
    expect(resolveDialogWidth('custom')).toBeUndefined()
    expect(resolveDialogWidth('confirm', 640)).toBe(640)
  })
})
