import type { ProFormModelValue } from '@/types/pro-form'

export function toFormRecord(modelValue: ProFormModelValue): Record<string, unknown> {
  return modelValue as Record<string, unknown>
}
