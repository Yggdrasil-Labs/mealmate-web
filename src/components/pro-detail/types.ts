import type {
  FormFieldMeta,
  FormFieldSchema,
  FormFieldUi,
  ProFormContext,
} from '@/types/pro-form'
import type { BaseFieldMeta, BaseFieldUi } from '@/types/shared-field'

export type DetailFieldMeta = BaseFieldMeta & FormFieldMeta & {
  /** 仅详情使用的空值占位文案 */
  emptyText?: string
}

export type DetailFieldUi = BaseFieldUi & FormFieldUi & {
  /** 仅详情使用的一键复制开关；不属于 ProForm 的编辑协议。 */
  copyable?: boolean
}

export interface DetailFieldSchema extends FormFieldSchema {
  /** 详情页在共享基础字段协议之上补展示扩展，不承接表单提交语义。 */
  meta: DetailFieldMeta
  ui: DetailFieldUi
}

export type ProDetailContext = ProFormContext
