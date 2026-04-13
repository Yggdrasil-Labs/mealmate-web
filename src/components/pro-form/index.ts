/**
 * ProForm 入口：组件与注册表 API、类型 re-export
 * @see docs/components/pro-form.md
 */

export {
  getFieldComponent,
  registerDefaultFieldComponents,
  registerFieldComponent,
} from './form-registry'
export { default as ProForm } from './ProForm.vue'
export { default as ProFormField } from './ProFormField.vue'
export { buildElFormRules } from './validation'

export type {
  FormFieldSchema,
  ProFormContext,
  ProFormEmits,
  ProFormExpose,
  ProFormLayout,
  ProFormModelValue,
  ProFormProps,
} from '@/types/pro-form'
