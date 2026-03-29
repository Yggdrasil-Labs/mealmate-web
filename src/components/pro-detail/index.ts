/**
 * ProDetail 入口：组件与类型 re-export
 * @see docs/plans/2026-03-16-pro-detail-design.md
 */

export { default as ProDetail } from './ProDetail.vue'
export { default as ProDetailField } from './ProDetailField.vue'

export type {
  DetailFieldMeta,
  DetailFieldSchema,
  DetailFieldUi,
  ProDetailContext,
} from './types'
