/**
 * ProForm Schema 驱动表单类型定义
 * 与 docs/plans/2026-03-14-pro-form-design.md 对齐
 */

import type { Component } from 'vue'
import type {
  BaseFieldLayout,
  BaseFieldMeta,
  BaseFieldRuntime,
  BaseFieldUi,
} from './shared-field'

// ---------------------------------------------------------------------------
// 表单上下文（供 when、options、transform 等使用）
// ---------------------------------------------------------------------------

/** ProForm 上下文，透传给 when/options/transform 等 */
export type ProFormContext = Record<string, unknown>

/** ProForm 对外接受的表单值类型：允许业务侧传入具名对象，而不强制声明索引签名 */
export type ProFormModelValue = object

// ---------------------------------------------------------------------------
// 字段 Meta（标识、展示、值类型）
// ---------------------------------------------------------------------------

/** 字段值类型（与 valueType 约定一致） */
export type FormFieldValueType
  = 'string' | 'number' | 'boolean' | 'array' | 'date' | 'dateRange' | (string & {})

/** 字段元信息：field、label、valueType、默认值、是否必填 */
export interface FormFieldMeta extends BaseFieldMeta {
  /**
   * 是否必填
   * 首版保持为显式 boolean（也可由 validation.rules 进一步表达）
   */
  required: boolean
}

// ---------------------------------------------------------------------------
// 字段 UI 布局与提示
// ---------------------------------------------------------------------------

/** 响应式栅格断点（与 ElCol 对齐） */
export interface FormFieldBreakpoints {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

/** 字段布局：分组、栅格 span、对齐、标签宽、断点、操作区 */
export interface FormFieldLayout extends BaseFieldLayout {
  /** 标签/内容对齐 */
  align?: 'left' | 'right' | 'center'
  /** 字段级标签宽度，覆盖表单级 */
  labelWidth?: string | number
  /** 响应式 span */
  breakpoints?: FormFieldBreakpoints
  /** 操作区（如按钮）配置，首版可留空 */
  actions?: unknown
}

/** 标签上 Tooltip 配置（悬停标签文字即显示提示） */
export interface FormFieldTooltip {
  /** 提示内容 */
  content: string
  /** 展示位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

/** 选项项（Select/Radio/Checkbox 等） */
export interface FormFieldOption {
  label: string
  value: unknown
  [key: string]: unknown
}

/** 字段 UI 配置：组件名、props、布局、tooltip、静态 options、只读、插槽名 */
export interface FormFieldUi extends BaseFieldUi {
  /** 组件注册表名称（如 'Input' | 'Select'） */
  component: string
  /** 透传给控件的 props */
  props?: Record<string, unknown>
  /** 布局配置 */
  layout?: FormFieldLayout
  /** 标签旁 tooltip */
  tooltip?: FormFieldTooltip
  /** 静态选项（Select/Radio/Checkbox 等） */
  options?: FormFieldOption[]
  /** 静态只读 */
  readonly?: boolean
  /** 使用的插槽名（如 custom-render） */
  slot?: string
}

// ---------------------------------------------------------------------------
// 校验：与 Element Plus Form rules 兼容
// ---------------------------------------------------------------------------

/** 校验触发时机 */
export type ValidationTrigger = 'change' | 'blur' | 'submit'

export type ValidationRuleValidator
  = | ((value: unknown, formValues: Record<string, unknown>, context: ProFormContext) => boolean | Promise<boolean>)
    | ((
      value: unknown,
      formValues: Record<string, unknown>,
      context: ProFormContext,
      done: (ok: boolean) => void,
    ) => void)

/**
 * 单条校验规则
 * validator 支持：
 * - 同步/异步返回 boolean | Promise<boolean>
 * - callback 风格 (value, formValues, context, done) => void
 */
export interface ValidationRule {
  /** 规则名（便于调试） */
  name?: string
  /** 触发时机，可与 Element 一致 */
  trigger?: ValidationTrigger | ValidationTrigger[]
  /** 何时启用：boolean 或根据表单值/上下文计算 */
  when?: boolean | ((formValues: Record<string, unknown>, context: ProFormContext) => boolean)
  /** 校验函数：支持同步/异步返回 boolean，也支持 callback 风格 */
  validator: ValidationRuleValidator
  /** 错误提示文案 */
  message: string
}

/** 字段级校验配置 */
export interface ValidationConfig {
  /** 是否在第一条失败时停止 */
  validateFirst?: boolean
  /** 隐藏字段是否参与校验，默认 false */
  validateWhenHidden?: boolean
  /** 依赖字段变化时是否重新校验，默认 true */
  revalidateOnDependencyChange?: boolean
  /** 防抖毫秒数 */
  debounce?: number
  /** 规则列表 */
  rules: ValidationRule[]
}

// ---------------------------------------------------------------------------
// 字段 Runtime（可见性、禁用、依赖、动态 options、转换、校验）
// ---------------------------------------------------------------------------

/** 值的转换：输入（控件→内部）、提交（内部→提交）、展示（内部→展示） */
export interface FormFieldTransform {
  /** 控件值 → 表单内部值 */
  input?: (value: unknown) => unknown
  /** 表单内部值 → 提交给后端 */
  submit?: (value: unknown) => unknown
  /** 内部值 → 展示用（如只读态） */
  display?: (value: unknown) => unknown
}

/** 字段运行时配置（首版以静态 + 简单依赖为主） */
export interface FormFieldRuntime extends BaseFieldRuntime {
  /** 是否可见 */
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 依赖的字段 key 列表，变化时重算 options / 重校验 */
  dependencies?: string[]
  /** 动态选项：(formValues, context) => Option[] */
  options?: (
    formValues: Record<string, unknown>,
    context: ProFormContext,
  ) => FormFieldOption[] | Promise<FormFieldOption[]>
  /** 值转换 */
  transform?: FormFieldTransform
  /** 校验配置 */
  validation?: ValidationConfig
}

// ---------------------------------------------------------------------------
// 字段 Schema（meta + ui + runtime）
// ---------------------------------------------------------------------------

/** 单字段完整 Schema */
export interface FormFieldSchema {
  meta: FormFieldMeta
  ui: FormFieldUi
  runtime?: FormFieldRuntime
}

// ---------------------------------------------------------------------------
// 表单级布局与根组件
// ---------------------------------------------------------------------------

/** 表单级布局默认值 */
export interface ProFormLayout {
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
}

/** ProForm 根组件 Props */
export interface ProFormProps {
  /** 字段 Schema 数组 */
  schema: FormFieldSchema[]
  /** 表单值（v-model） */
  modelValue: ProFormModelValue
  /** 模式：编辑 / 只读。readonly 仅用于编辑表单的临时只读态，正式详情展示应使用 ProDetail。 */
  mode?: 'edit' | 'readonly'
  /** 透传上下文 */
  context?: ProFormContext
  /** 表单级布局 */
  layout?: ProFormLayout
  /** 加载态 */
  loading?: boolean
}

/** ProForm 暴露的方法 */
export interface ProFormExpose {
  setFieldsValue: (values: Record<string, unknown>) => void
  getFieldsValue: () => Record<string, unknown>
  resetFields: () => void
  validate: () => Promise<boolean>
  validateField: (field?: string | string[]) => Promise<void>
  clearValidate: (field?: string | string[]) => void
  /** 校验通过后 emit('submit', getFieldsValue())，失败时滚动到首个错误 */
  submit: () => Promise<void>
}

/** ProForm 事件（emit）类型 */
export interface ProFormEmits {
  (e: 'update:modelValue', value: ProFormModelValue): void
  (e: 'submit', values: Record<string, unknown>): void
  (e: 'reset', values: Record<string, unknown>): void
  (e: 'valuesChange', changedValues: Record<string, unknown>, allValues: Record<string, unknown>): void
}

/** 供内部/子组件使用的 ProForm 上下文类型（含 form 值、context、layout 等） */
export interface ProFormContextInternal {
  formValues: Record<string, unknown>
  context: ProFormContext
  layout?: ProFormLayout
  mode: 'edit' | 'readonly'
  disabled: boolean
  registerFieldComponent?: (name: string, component: Component) => void
  getFieldComponent?: (name: string) => Component | undefined
}
