/**
 * 共享字段协议：只承载多个公共组件真正共用的基础字段语义。
 */

export interface BaseFieldMeta {
  field: string
  label: string
  valueType: string
  defaultValue?: unknown
}

export interface BaseFieldLayout {
  group?: string
  span?: number
}

export interface BaseFieldUi {
  tooltip?: { content: string, placement?: string }
  layout?: BaseFieldLayout
}

export interface BaseFieldRuntime {
  visible?: boolean
}

export function isFieldVisible(runtime?: BaseFieldRuntime) {
  return runtime?.visible !== false
}

export function resolveFieldLabel(meta: Pick<BaseFieldMeta, 'label'>) {
  return meta.label
}
