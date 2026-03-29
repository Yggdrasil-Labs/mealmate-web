import type { PropType, Slots, VNode } from 'vue'
import type { ProTableContext, TableColumnSchema } from '@/types/pro-table'
import { defineComponent, h } from 'vue'
import CellText from '@/components/pro-table/cells/CellText.vue'
import { getColumnComponent } from '@/components/pro-table/column-registry'

function formatDisplay(
  column: TableColumnSchema,
  row: Record<string, unknown>,
  raw: unknown,
  context: ProTableContext,
): string {
  const fmt = column.runtime?.formatter
  if (fmt) {
    try {
      const out = fmt(raw, row, context)
      if (out == null)
        return '—'
      return typeof out === 'string' ? out : String(out)
    }
    catch (error) {
      if (import.meta.env.DEV)
        console.warn('[ProTable] formatter 执行失败，已回退到原始值', error)
    }
  }
  if (raw == null || raw === '')
    return '—'
  return String(raw)
}

/** 纯 `h()` 渲染内置单元格（无 per-cell `defineComponent`） */
export function renderBuiltinCell(
  column: TableColumnSchema,
  row: Record<string, unknown>,
  context: ProTableContext,
  tableSlots: Slots,
): VNode {
  const raw = row[column.meta.field]
  const displayText = formatDisplay(column, row, raw, context)
  const compName = column.ui.component
  const Comp = getColumnComponent(compName) ?? getColumnComponent('Text') ?? CellText
  const isActions = compName === 'Actions'
  const baseProps = {
    column,
    row,
    value: raw,
    displayText,
    context,
  }
  if (isActions) {
    return h(Comp, baseProps, {
      extra: () => tableSlots['row-actions-extra']?.({ row }) ?? [],
    })
  }
  return h(Comp, baseProps)
}

/**
 * 模块级单一包装组件：避免每个单元格 `defineComponent` 产生新组件类型。
 * 通过 `renderFn` 闭包更新内容。
 */
export const ProTableDynamicCellHost = defineComponent({
  name: 'ProTableDynamicCellHost',
  props: {
    renderFn: {
      type: Function as PropType<() => VNode>,
      required: true,
    },
  },
  setup(props) {
    return () => props.renderFn()
  },
})
