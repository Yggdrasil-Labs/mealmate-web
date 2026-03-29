<script setup lang="ts">
import type {
  ProTablePaginationState,
  ProTableSelectionState,
  ProTableSortState,
  TableColumnSchema,
} from '@/types/pro-table'
import { computed, ref, watch } from 'vue'
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'
import { showSuccess } from '@/utils/message'

registerDefaultColumnComponents()

definePage({
  name: 'ProTableDemo',
  meta: { title: 'ProTable 示例' },
})

interface Row {
  id: number
  name: string
  status: string
  linkDemo: string
  avatar: string
  updatedAt: string
}

const baseRows: Row[] = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `项目 ${i + 1}`,
  status: i % 3 === 0 ? 'draft' : i % 3 === 1 ? 'published' : 'archived',
  linkDemo: `详情-${i + 1}`,
  avatar: i % 5 === 0 ? '' : `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`,
  updatedAt: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`,
}))

const sourceRows = ref<Row[]>([...baseRows])
const loading = ref(false)
const simulateError = ref(false)
const emptyMode = ref<'default' | 'before-query' | 'no-result'>('default')
const forceEmpty = ref(false)

const pagination = ref<ProTablePaginationState>({
  page: 1,
  pageSize: 10,
  total: baseRows.length,
})

const sort = ref<ProTableSortState>({
  field: null,
  order: null,
})

const selection = ref<ProTableSelectionState>({
  enabled: true,
  selectedRowKeys: [],
})

const error = ref<string | null>(null)
const rowClickCount = ref(0)
const lastRowAction = ref('none')

const tableContext = computed(() => ({
  statusText: {
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
  } as Record<string, string>,
}))

const sortedRows = computed(() => {
  const { field, order } = sort.value
  const list = [...sourceRows.value]
  if (!field || !order)
    return list
  return list.sort((a, b) => {
    const av = a[field as keyof Row]
    const bv = b[field as keyof Row]
    const cmp = String(av).localeCompare(String(bv), 'zh')
    return order === 'asc' ? cmp : -cmp
  })
})

const pagedData = computed(() => {
  const { page, pageSize } = pagination.value
  const total = forceEmpty.value ? 0 : sortedRows.value.length
  const start = (page - 1) * pageSize
  const slice = forceEmpty.value ? [] : sortedRows.value.slice(start, start + pageSize)
  return { rows: slice, total }
})

const tableData = computed(() =>
  pagedData.value.rows.map(r => ({ ...r }) as Record<string, unknown>),
)

watch(
  () => pagedData.value.total,
  (t) => {
    pagination.value = { ...pagination.value, total: t }
  },
)

function onRetry() {
  error.value = null
  simulateError.value = false
  showSuccess('已重试加载')
}

function onRowClick(row: Record<string, unknown>) {
  rowClickCount.value += 1
  lastRowAction.value = `row:${String(row.id)}`
}

function onAction(kind: string, row: Record<string, unknown>) {
  lastRowAction.value = `${kind}:${String(row.id)}`
  showSuccess(`${kind} id=${String(row.id)}`)
}

function triggerError() {
  simulateError.value = true
  error.value = '演示：接口暂时不可用'
}

function toggleLoading() {
  loading.value = !loading.value
}

function clearRows() {
  forceEmpty.value = true
  sourceRows.value = []
}

function restoreRows() {
  forceEmpty.value = false
  sourceRows.value = [...baseRows]
  pagination.value = {
    ...pagination.value,
    page: 1,
    total: baseRows.length,
  }
}

const columns = computed<TableColumnSchema[]>(() => [
  {
    meta: { field: 'name', label: '名称', valueType: 'string' },
    ui: {
      component: 'Text',
      minWidth: 140,
      ellipsis: true,
      sortable: true,
      tooltip: {
        content: '名称列支持排序与省略',
        placement: 'top',
        icon: 'info',
      },
    },
  },
  {
    meta: { field: 'status', label: '状态', valueType: 'enum' },
    ui: { component: 'Tag', width: 110, align: 'center' },
    runtime: {
      formatter: (v, _row, ctx) => {
        const map = (ctx?.statusText ?? {}) as Record<string, string>
        return map[String(v)] ?? String(v)
      },
      tagType: (v) => {
        const s = String(v)
        if (s === 'published')
          return 'success'
        if (s === 'archived')
          return 'info'
        return 'warning'
      },
    },
  },
  {
    meta: { field: 'linkDemo', label: '链接', valueType: 'string' },
    ui: {
      component: 'Link',
      width: 100,
      props: {
        href: 'https://example.com/pro-table-demo',
        target: '_blank',
      },
    },
  },
  {
    meta: { field: 'avatar', label: '头像', valueType: 'image' },
    ui: { component: 'Avatar', width: 80, align: 'center' },
  },
  {
    meta: { field: 'updatedAt', label: '更新时间', valueType: 'date' },
    ui: { component: 'Text', width: 120, sortable: true },
  },
  {
    meta: { field: '_actions', label: '操作', valueType: 'actions' },
    ui: { component: 'Actions', width: 200, fixed: 'right' },
    runtime: {
      actions: [
        {
          label: '查看',
          onClick: row => onAction('view', row),
        },
        {
          label: '编辑',
          onClick: row => onAction('edit', row),
        },
        {
          label: '删除',
          danger: true,
          onClick: row => onAction('delete', row),
        },
        {
          label: '更多项',
          onClick: row => onAction('more', row),
        },
      ],
    },
  },
])
</script>

<template>
  <div class="pro-table-demo" data-testid="pro-table-demo">
    <section class="pro-table-demo__toolbar">
      <h2 class="pro-table-demo__title">
        ProTable 示例
      </h2>
      <div class="pro-table-demo__actions">
        <el-button type="warning" data-testid="pro-table-demo-trigger-error" @click="triggerError">
          模拟请求失败
        </el-button>
        <el-button data-testid="pro-table-demo-toggle-loading" @click="toggleLoading">
          切换加载态
        </el-button>
        <el-button data-testid="pro-table-demo-clear-data" @click="clearRows">
          清空数据（空态）
        </el-button>
        <el-button type="primary" data-testid="pro-table-demo-restore-data" @click="restoreRows">
          恢复数据
        </el-button>
        <el-select v-model="emptyMode" style="width: 160px" data-testid="pro-table-demo-empty-mode">
          <el-option label="默认空态" value="default" />
          <el-option label="未查询" value="before-query" />
          <el-option label="无结果" value="no-result" />
        </el-select>
        <span data-testid="pro-table-demo-row-click-count">row-click: {{ rowClickCount }}</span>
        <span data-testid="pro-table-demo-last-action">last-action: {{ lastRowAction }}</span>
      </div>
    </section>

    <ProTable
      v-model:pagination="pagination"
      v-model:sort="sort"
      v-model:selection="selection"
      :columns="columns"
      :data="tableData"
      row-key="id"
      :loading="loading"
      :context="tableContext"
      :empty-mode="emptyMode"
      :error="simulateError ? error : null"
      max-height="420"
      @row-click="onRowClick"
      @retry="onRetry"
    >
      <template #toolbar-prefix>
        <el-button
          :disabled="selection.selectedRowKeys.length === 0"
          type="primary"
          data-testid="pro-table-demo-batch"
        >
          批量操作（已选 {{ selection.selectedRowKeys.length }}）
        </el-button>
      </template>
      <template #toolbar-extra>
        <span class="pro-table-demo__hint">与 SearchBar 组合时由父组件合并参数并重置页码</span>
      </template>
      <template #cell="{ field, row, defaultRender, builtinCellRender }">
        <template v-if="field === 'name'">
          <span data-testid="pro-table-demo-custom-name">{{ String(row.name) }} ★</span>
        </template>
        <component
          :is="defaultRender"
          v-else
          :render-fn="builtinCellRender"
        />
      </template>
      <template #row-actions-extra="{ row }">
        <el-button link type="info" size="small" data-testid="pro-table-demo-row-extra" @click="onAction('extra', row)">
          扩展
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<style scoped lang="scss">
.pro-table-demo {
  padding: 24px;
  width: 100%;
  min-width: 0;
}

.pro-table-demo__title {
  margin: 0 0 16px;
  font-size: 1.25rem;
}

.pro-table-demo__toolbar {
  margin-bottom: 16px;
  min-width: 0;
}

.pro-table-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.pro-table-demo__hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .pro-table-demo {
    padding: 16px;
  }

  .pro-table-demo__actions {
    align-items: stretch;
  }

  .pro-table-demo__actions > * {
    max-width: 100%;
  }

  .pro-table-demo__actions :deep(.el-button),
  .pro-table-demo__actions :deep(.el-select) {
    width: 100%;
  }
}
</style>
