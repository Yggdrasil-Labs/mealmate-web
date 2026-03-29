import type {
  FormFieldBreakpoints,
  FormFieldOption,
  FormFieldTooltip,
  FormFieldValueType,
  ProFormContext,
} from '@/types/pro-form'

export type SearchFieldValueType = FormFieldValueType

export type SearchRouteQuery = Record<string, unknown>
export type SearchSerializedValues = Record<string, unknown>

export interface SearchFieldMeta {
  field: string
  label: string
  valueType: SearchFieldValueType
  defaultValue?: unknown
}

export interface SearchFieldLayout {
  group?: 'basic' | 'advanced'
  span?: number
  labelWidth?: string | number
  breakpoints?: FormFieldBreakpoints
}

export interface SearchFieldUi {
  component: string
  props?: Record<string, unknown>
  layout?: SearchFieldLayout
  tooltip?: FormFieldTooltip
  options?: FormFieldOption[]
  slot?: string
}

export interface SearchFieldTransform {
  input?: (
    value: unknown,
    formValues: Record<string, unknown>,
    context: ProFormContext,
  ) => unknown
  serialize?: (
    value: unknown,
    formValues: Record<string, unknown>,
    context: ProFormContext,
  ) => unknown
  deserialize?: (
    query: SearchRouteQuery,
    context: ProFormContext,
  ) => unknown
}

export interface SearchFieldRuntime {
  visible?: boolean
  disabled?: boolean
  dependencies?: string[]
  options?: (
    formValues: Record<string, unknown>,
    context: ProFormContext,
  ) => FormFieldOption[] | Promise<FormFieldOption[]>
  transform?: SearchFieldTransform
  preserveOnReset?: boolean
}

export interface SearchFieldSchema {
  meta: SearchFieldMeta
  ui: SearchFieldUi
  runtime?: SearchFieldRuntime
}

export interface SearchBarSearchPayload {
  rawValues: Record<string, unknown>
  serializedValues: SearchSerializedValues
}

export interface SearchBarProps {
  schema: SearchFieldSchema[]
  modelValue: Record<string, unknown>
  context?: ProFormContext
  loading?: boolean
  defaultCollapsed?: boolean
  defaultVisibleCount?: number
  syncRoute?: boolean
  routeKey?: string
  autoSearchOnInit?: boolean
  labelWidth?: string | number
}

export interface SearchBarEmits {
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'search', payload: SearchBarSearchPayload): void
  (e: 'reset', payload: SearchBarSearchPayload): void
  (e: 'valuesChange', changedValues: Record<string, unknown>, allValues: Record<string, unknown>): void
  (e: 'toggleExpand', expanded: boolean): void
}

export interface SearchBarExpose {
  setFieldsValue: (values: Record<string, unknown>) => void
  getFieldsValue: () => Record<string, unknown>
  search: (values?: Record<string, unknown>) => Promise<SearchBarSearchPayload>
  reset: () => Promise<SearchBarSearchPayload>
  toggleExpand: (force?: boolean) => void
  serialize: (values?: Record<string, unknown>) => SearchSerializedValues
  deserialize: (query: SearchRouteQuery) => Record<string, unknown>
}
