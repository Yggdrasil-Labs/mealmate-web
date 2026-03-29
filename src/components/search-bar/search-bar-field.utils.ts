import type { FormFieldOption } from '@/types/pro-form'

export function resolveSearchFieldOptions(
  runtimeOptions: FormFieldOption[] | undefined,
  fallbackOptions: FormFieldOption[],
): FormFieldOption[] {
  return Array.isArray(runtimeOptions)
    ? runtimeOptions
    : fallbackOptions
}

function hasSelectableValue(value: unknown): boolean {
  if (value == null)
    return false
  if (typeof value === 'string')
    return value.trim() !== ''
  if (Array.isArray(value))
    return value.length > 0
  return true
}

export function shouldResetDependentFieldValue(
  currentValue: unknown,
  previousDependencySignature: string | undefined,
  nextDependencySignature: string,
): boolean {
  return previousDependencySignature !== undefined
    && previousDependencySignature !== nextDependencySignature
    && hasSelectableValue(currentValue)
}
