/**
 * ProDialog 入口：组件与类型 re-export
 * @see docs/plans/2026-03-28-dialog-design.md
 */

export { default as ProDialog } from './ProDialog.vue'

export type {
  ProDialogBeforeClose,
  ProDialogBeforeCloseContext,
  ProDialogCloseReason,
  ProDialogConfirmType,
  ProDialogEmits,
  ProDialogExpose,
  ProDialogFooterAlign,
  ProDialogFooterSlot,
  ProDialogMode,
  ProDialogPlacement,
  ProDialogProps,
  ProDialogSlotProps,
} from './types'
