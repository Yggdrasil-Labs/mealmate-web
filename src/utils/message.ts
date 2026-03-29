/**
 * 全局消息与确认框封装，统一使用 Element Plus Message / MessageBox
 * 业务与 schema 层通过本工具调用，不直接使用 ElMessage / ElMessageBox
 */
import { ElMessage, ElMessageBox } from 'element-plus'

export function showSuccess(message: string): void {
  ElMessage.success(message)
}

export function showError(message: string): void {
  ElMessage.error(message)
}

export function showWarning(message: string): void {
  ElMessage.warning(message)
}

export function showInfo(message: string): void {
  ElMessage.info(message)
}

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function confirm(options: ConfirmOptions): Promise<Awaited<ReturnType<typeof ElMessageBox.confirm>>> {
  const { title, message, confirmText, cancelText } = options
  return ElMessageBox.confirm(message, title ?? '', {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type: 'warning',
  })
}
