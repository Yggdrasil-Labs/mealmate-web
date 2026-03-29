/**
 * ProTable 列 Schema 与根组件类型
 * @see docs/superpowers/specs/2026-03-22-pro-table-design.md
 */

/** 表格上下文，透传给 formatter / visible / tagType 等 */
export type ProTableContext = Record<string, unknown>

/** 列值类型（与 Notion / ProForm 心智对齐，可扩展） */
export type TableColumnValueType
  = | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'enum'
    | 'image'
    | 'actions'
    | (string & {})

export interface TableColumnMeta {
  field: string
  label: string
  valueType: TableColumnValueType
}

/** 表头 Tooltip（列头「?」提示） */
export interface TableColumnTooltip {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 图标名，走项目 Iconify/ep 等；未传则仅文案 */
  icon?: string
}

export interface TableColumnUi {
  component: string
  /** 列在表格中的唯一 key（默认同 `meta.field`；多列同 field 时必须区分） */
  columnKey?: string
  /** 透传给内置渲染器（如 Link 的 href / to / target） */
  props?: Record<string, unknown>
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  ellipsis?: boolean
  sortable?: boolean
  tooltip?: TableColumnTooltip
}

export interface TableRowAction {
  label: string
  onClick?: (row: Record<string, unknown>) => void
  danger?: boolean
  disabled?: boolean | ((row: Record<string, unknown>) => boolean)
  visible?: boolean | ((row: Record<string, unknown>) => boolean)
}

/** 与 ElTag `type` 对齐 */
export type TableTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export interface TableColumnRuntime {
  visible?: boolean
  formatter?: (value: unknown, row: Record<string, unknown>, context: ProTableContext) => string
  tagType?: (value: unknown, row: Record<string, unknown>) => TableTagType | undefined
  actions?: TableRowAction[]
  /** 父层可结合 sort 与 sorter 拼请求参数；Table 仍 emit sort-change */
  sorter?: boolean | string | ((a: Record<string, unknown>, b: Record<string, unknown>) => number)
}

export interface TableColumnSchema {
  meta: TableColumnMeta
  ui: TableColumnUi
  runtime?: TableColumnRuntime
}

export interface ProTablePaginationState {
  page: number
  pageSize: number
  total: number
}

export interface ProTableSortState {
  field: string | null
  order: 'asc' | 'desc' | null
}

export interface ProTableSelectionState {
  enabled: boolean
  /**
   * 已选行键，与 `rowKey` 解析结果比较时按字符串对齐。
   * 可与 `row-key` 数值型并存；对内统一 `String()` 比较。
   */
  selectedRowKeys: (string | number)[]
}

export type ProTableEmptyMode = 'default' | 'before-query' | 'no-result'

export type ProTableError = string | { message: string } | null

export interface ProTableProps {
  columns: TableColumnSchema[]
  data: Record<string, unknown>[]
  rowKey: string | ((row: Record<string, unknown>) => string | number)
  loading?: boolean
  context?: ProTableContext
  pagination?: ProTablePaginationState | false
  sort?: ProTableSortState
  selection?: ProTableSelectionState
  /** 多选翻页是否保留已选行，默认 true */
  reserveSelection?: boolean
  height?: string | number
  maxHeight?: string | number
  emptyMode?: ProTableEmptyMode
  error?: ProTableError
}

export interface ProTableEmits {
  'update:pagination': [value: ProTablePaginationState]
  'update:sort': [value: ProTableSortState]
  'update:selection': [value: ProTableSelectionState]
  'rowClick': [row: Record<string, unknown>, column: unknown, event: Event]
  'rowDblclick': [row: Record<string, unknown>, column: unknown, event: Event]
  'retry': []
}
