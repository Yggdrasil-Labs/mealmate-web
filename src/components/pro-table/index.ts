/**
 * ProTable 入口：组件与列注册表
 * @see docs/superpowers/specs/2026-03-22-pro-table-design.md
 */

export { ProTableDynamicCellHost, renderBuiltinCell } from './cell-renderer'
export {
  getColumnComponent,
  registerColumnComponent,
  registerDefaultColumnComponents,
} from './column-registry'
export { default as ProTable } from './ProTable.vue'
