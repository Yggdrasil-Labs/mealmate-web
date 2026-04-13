/**
 * ProDialog 公共类型定义
 * 与 docs/components/pro-dialog.md 对齐。
 */

import type { VNodeChild } from 'vue'

export type ProDialogMode = 'custom' | 'confirm'

export type ProDialogPlacement = 'center'

export type ProDialogFooterAlign = 'left' | 'center' | 'right'

export type ProDialogConfirmType = 'primary' | 'danger'

export type ProDialogCloseReason
  = | 'close-icon'
    | 'mask'
    | 'esc'
    | 'cancel'
    | 'programmatic'

export interface ProDialogBeforeCloseContext {
  reason: ProDialogCloseReason
  close: () => void
}

export type ProDialogBeforeClose = (
  reason: ProDialogCloseReason,
  context: ProDialogBeforeCloseContext,
) => boolean | Promise<boolean>

export interface ProDialogProps {
  modelValue: boolean
  title?: string
  mode?: ProDialogMode
  width?: string | number
  placement?: ProDialogPlacement
  showClose?: boolean
  maskClosable?: boolean
  escClosable?: boolean
  showFooter?: boolean
  loading?: boolean
  confirmLoading?: boolean
  confirmDisabled?: boolean
  confirmText?: string
  cancelText?: string
  confirmType?: ProDialogConfirmType
  closeOnConfirm?: boolean
  destroyOnClose?: boolean
  bodyClass?: string
  footerAlign?: ProDialogFooterAlign
  beforeClose?: ProDialogBeforeClose
}

export interface ProDialogExpose {
  open: () => void
  close: () => void
  toggle: (force?: boolean) => void
}

export interface ProDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
  (e: 'closed'): void
}

export interface ProDialogSlotProps {
  close: () => void
  confirm: () => void
  loading: boolean
  confirmLoading: boolean
  confirmDisabled: boolean
}

export type ProDialogFooterSlot = () => VNodeChild
