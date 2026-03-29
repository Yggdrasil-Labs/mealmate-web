import type { TableColumnSchema } from '@/types/pro-table'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { renderBuiltinCell } from '@/components/pro-table/cell-renderer'
import { resetColumnComponentRegistryForTest } from '@/components/pro-table/column-registry'

function makeColumn(runtime?: TableColumnSchema['runtime']): TableColumnSchema {
  return {
    meta: { field: 'name', label: '名称', valueType: 'string' },
    ui: { component: 'Text' },
    runtime,
  }
}

async function renderCell(column: TableColumnSchema, row: Record<string, unknown>) {
  const vnode = renderBuiltinCell(column, row, {}, {})
  const app = createSSRApp(defineComponent({
    setup() {
      return () => h('div', [vnode])
    },
  }))
  return await renderToString(app)
}

beforeEach(() => {
  resetColumnComponentRegistryForTest()
})

afterEach(() => {
  resetColumnComponentRegistryForTest()
})

describe('pro-table/cell-renderer', () => {
  it('formatter 抛错时降级为原始值而不是中断渲染', async () => {
    const html = await renderCell(makeColumn({
      formatter: () => {
        throw new Error('formatter boom')
      },
    }), { name: 'Alpha' })

    expect(html).toContain('Alpha')
  })

  it('未注册默认列组件时仍能安全渲染 Text 单元格', async () => {
    const html = await renderCell(makeColumn(), { name: 'Fallback' })

    expect(html).toContain('Fallback')
  })
})
