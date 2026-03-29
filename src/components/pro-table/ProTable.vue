<script setup lang="ts">
import type { VNode } from 'vue'
import type { SemanticIconName } from '@/components/icon/icon.types'
import type {
  ProTablePaginationState,
  ProTableProps,
  ProTableSelectionState,
  ProTableSortState,
  TableColumnSchema,
} from '@/types/pro-table'
import {
  ElAlert,
  ElButton,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElTooltip,
} from 'element-plus'
import { Comment, computed, Fragment, markRaw, nextTick, onMounted, ref, Text, useSlots, watch } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import {
  ProTableDynamicCellHost,
  renderBuiltinCell,
} from '@/components/pro-table/cell-renderer'

defineOptions({ name: 'ProTable' })

const props = withDefaults(defineProps<ProTableProps>(), {
  loading: false,
  context: () => ({}),
  sort: () => ({ field: null, order: null }),
  selection: () => ({ enabled: false, selectedRowKeys: [] }),
  reserveSelection: true,
  emptyMode: 'default',
  error: null,
})

const emit = defineEmits<{
  'update:pagination': [value: ProTablePaginationState]
  'update:sort': [value: ProTableSortState]
  'update:selection': [value: ProTableSelectionState]
  'rowClick': [row: Record<string, unknown>, column: unknown, event: Event]
  'rowDblclick': [row: Record<string, unknown>, column: unknown, event: Event]
  'retry': []
}>()

const HEADER_TOOLTIP_ICONS: readonly SemanticIconName[] = [
  'info',
  'warning',
  'error',
  'success',
] as const

function headerTooltipIcon(icon?: string): SemanticIconName | undefined {
  if (!icon)
    return undefined
  return (HEADER_TOOLTIP_ICONS as readonly string[]).includes(icon)
    ? (icon as SemanticIconName)
    : undefined
}

const slots = useSlots()
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

/** 稳定引用，供 `#cell` 的 `defaultRender` 与 `component :is` 使用 */
const DynamicCellHost = markRaw(ProTableDynamicCellHost)

function slotHasVisibleContent(name: 'toolbar-prefix' | 'toolbar-extra') {
  const nodes = slots[name]?.() ?? []
  return nodes.some(node => vnodeHasVisibleContent(node))
}

function vnodeHasVisibleContent(node: VNode): boolean {
  if (node.type === Comment)
    return false
  if (node.type === Text)
    return String(node.children ?? '').trim().length > 0
  if (node.type === Fragment)
    return Array.isArray(node.children) && node.children.some(child => child && vnodeHasVisibleContent(child as VNode))
  return true
}

const hasToolbarPrefix = computed(() => slotHasVisibleContent('toolbar-prefix'))
const hasToolbarExtra = computed(() => slotHasVisibleContent('toolbar-extra'))
const showToolbar = computed(() => hasToolbarPrefix.value || hasToolbarExtra.value)

const errorMessage = computed(() => {
  const e = props.error
  if (e == null)
    return ''
  return typeof e === 'string' ? e : e.message
})

/** 错误条：与表格同区展示，不卸载 `ElTable`（便于保留父组件传入的 `data`） */
const showErrorBanner = computed(
  () => props.error != null && !props.loading,
)

const showEmptyState = computed(() => props.error == null)

const visibleColumns = computed(() =>
  props.columns.filter(c => c.runtime?.visible !== false),
)

/** 与 `ElTable` `row-key` 字符串化一致 */
function resolveRowKey(row: Record<string, unknown>): string {
  const rawKey = typeof props.rowKey === 'function'
    ? props.rowKey(row)
    : row[props.rowKey]
  const resolved = String(rawKey)
  if (import.meta.env.DEV && (resolved === '' || resolved === 'undefined' || resolved === 'null'))
    console.warn('[ProTable] rowKey 解析结果异常，可能导致选择态冲突', { row, rawKey, resolved })
  return resolved
}

function rowKeySelected(resolvedKey: string): boolean {
  return props.selection.selectedRowKeys.some(k => String(k) === resolvedKey)
}

const emptyText = computed(() => {
  switch (props.emptyMode) {
    case 'before-query':
      return '请输入条件后查询'
    case 'no-result':
      return '暂无符合条件的数据'
    default:
      return '暂无数据'
  }
})

const showPagination = computed(() => props.pagination !== false)

const paginationState = computed(() =>
  props.pagination
    ? props.pagination
    : null,
)

let syncingSelection = false

function normalizeSelectionKeys(keys: Array<string | number>) {
  return [...new Set(keys.map(key => String(key)))]
}

function emitSelectionFromTable(selection: Record<string, unknown>[]) {
  if (syncingSelection)
    return
  const keys = normalizeSelectionKeys(selection.map(r => resolveRowKey(r)))
  if (!props.reserveSelection) {
    emit('update:selection', {
      enabled: props.selection.enabled,
      selectedRowKeys: keys,
    })
    return
  }
  const currentPageKeys = new Set(props.data.map(resolveRowKey))
  const mergedKeys = props.selection.selectedRowKeys
    .map(key => String(key))
    .filter(key => !currentPageKeys.has(key))
  mergedKeys.push(...keys)
  emit('update:selection', {
    enabled: props.selection.enabled,
    selectedRowKeys: normalizeSelectionKeys(mergedKeys),
  })
}

async function syncTableSelectionFromProps() {
  if (!props.selection.enabled || !tableRef.value)
    return
  syncingSelection = true
  await nextTick()
  tableRef.value.clearSelection()
  for (const row of props.data) {
    const key = resolveRowKey(row)
    if (rowKeySelected(key))
      tableRef.value.toggleRowSelection(row, true)
  }
  await nextTick()
  syncingSelection = false
}

watch(
  () => [
    props.data,
    props.selection.enabled,
    props.selection.selectedRowKeys.map(key => String(key)).join('|'),
  ] as const,
  () => {
    void syncTableSelectionFromProps()
  },
)

onMounted(() => {
  void syncTableSelectionFromProps()
})

watch(
  () => [props.sort?.field ?? null, props.sort?.order ?? null] as const,
  async ([field, order]) => {
    await nextTick()
    if (!tableRef.value)
      return
    if (!field || !order) {
      tableRef.value.clearSort()
      return
    }
    tableRef.value.sort(field, order === 'asc' ? 'ascending' : 'descending')
  },
  { immediate: true },
)

function onSortChange(payload: { prop: string | null, order: string | null }) {
  const order
    = payload.order === 'ascending'
      ? 'asc'
      : payload.order === 'descending'
        ? 'desc'
        : null
  emit('update:sort', {
    field: order ? payload.prop : null,
    order,
  })
}

function onPageChange(page: number) {
  if (!paginationState.value)
    return
  emit('update:pagination', { ...paginationState.value, page })
}

function onPageSizeChange(size: number) {
  if (!paginationState.value)
    return
  emit('update:pagination', {
    ...paginationState.value,
    pageSize: size,
    page: 1,
  })
}

function onRetry() {
  emit('retry')
}

function columnVueKey(col: TableColumnSchema, index: number) {
  return col.ui.columnKey ?? `${col.meta.field}-${index}`
}

function cellRenderFn(col: TableColumnSchema, row: Record<string, unknown>) {
  return () => renderBuiltinCell(col, row, props.context, slots)
}

defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: Record<string, unknown>, selected?: boolean) =>
    tableRef.value?.toggleRowSelection(row, selected),
  elTableRef: tableRef,
})
</script>

<template>
  <div class="pro-table">
    <div v-if="showToolbar" class="pro-table__toolbar">
      <div v-if="hasToolbarPrefix" class="pro-table__toolbar-prefix">
        <slot name="toolbar-prefix" />
      </div>
      <div v-if="hasToolbarExtra" class="pro-table__toolbar-extra">
        <slot name="toolbar-extra" />
      </div>
    </div>

    <div v-loading="loading" class="pro-table__main">
      <slot
        v-if="showErrorBanner"
        name="error"
        :message="errorMessage"
        :retry="onRetry"
      >
        <ElAlert
          class="pro-table__error-alert"
          type="error"
          :closable="false"
          show-icon
        >
          <div class="pro-table__error-body">
            <div class="pro-table__error-title">
              {{ errorMessage || '加载失败' }}
            </div>
            <div class="pro-table__error-actions">
              <span class="pro-table__error-desc">请检查网络或稍后重试</span>
              <ElButton type="primary" size="small" data-testid="pro-table-retry" @click="onRetry">
                重试
              </ElButton>
            </div>
          </div>
        </ElAlert>
      </slot>

      <div class="pro-table__scroll" data-scroll="x">
        <ElTable
          ref="tableRef"
          class="pro-table__table"
          :class="{ 'pro-table__table--error': showErrorBanner }"
          :data="data"
          :row-key="(row: Record<string, unknown>) => resolveRowKey(row)"
          :height="height"
          :max-height="maxHeight"
          @row-click="(row, column, e) => emit('rowClick', row as Record<string, unknown>, column, e)"
          @row-dblclick="(row, column, e) => emit('rowDblclick', row as Record<string, unknown>, column, e)"
          @sort-change="onSortChange"
          @selection-change="emitSelectionFromTable"
        >
          <ElTableColumn
            v-if="selection.enabled"
            type="selection"
            width="48"
            fixed="left"
            :reserve-selection="reserveSelection"
          />

          <ElTableColumn
            v-for="(col, colIndex) in visibleColumns"
            :key="columnVueKey(col, colIndex)"
            :prop="col.meta.field"
            :label="col.meta.label"
            :width="col.ui.width"
            :min-width="col.ui.minWidth"
            :align="col.ui.align"
            :header-align="col.ui.headerAlign ?? col.ui.align"
            :fixed="col.ui.fixed === false ? undefined : col.ui.fixed"
            :show-overflow-tooltip="col.ui.ellipsis === true"
            :sortable="col.ui.sortable ? 'custom' : false"
          >
            <template #header>
              <span class="pro-table__th-label">{{ col.meta.label }}</span>
              <ElTooltip
                v-if="col.ui.tooltip"
                :content="col.ui.tooltip.content"
                :placement="col.ui.tooltip.placement ?? 'top'"
              >
                <span class="pro-table__th-tip" aria-label="列说明">
                  <AppIcon
                    v-if="headerTooltipIcon(col.ui.tooltip.icon)"
                    :name="headerTooltipIcon(col.ui.tooltip.icon)!"
                    class="pro-table__th-icon"
                  />
                  <template v-else>
                    ?
                  </template>
                </span>
              </ElTooltip>
            </template>

            <template #default="{ row }">
              <slot
                name="cell"
                :field="col.meta.field"
                :row="row"
                :column-schema="col"
                :value="row[col.meta.field]"
                :context="context"
                :default-render="DynamicCellHost"
                :builtin-cell-render="cellRenderFn(col, row as Record<string, unknown>)"
              >
                <ProTableDynamicCellHost :render-fn="cellRenderFn(col, row as Record<string, unknown>)" />
              </slot>
            </template>
          </ElTableColumn>

          <template #empty>
            <slot v-if="showEmptyState" name="empty">
              {{ emptyText }}
            </slot>
          </template>
        </ElTable>
      </div>
    </div>

    <div
      v-if="showPagination && paginationState"
      data-testid="pro-table-pagination"
      class="pro-table__pagination"
    >
      <ElPagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="paginationState.pageSize"
        :current-page="paginationState.page"
        :total="paginationState.total"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="onPageChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pro-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.pro-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pro-table__toolbar-prefix,
.pro-table__toolbar-extra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.pro-table__main {
  min-height: 120px;
  min-width: 0;
}

.pro-table__error-alert {
  margin-bottom: 12px;
}

.pro-table__error-title {
  margin-bottom: 8px;
  font-weight: 600;
}

.pro-table__error-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.pro-table__error-desc {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.pro-table__table {
  width: 100%;
}

.pro-table__table--error {
  opacity: 0.92;
}

.pro-table__th-tip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  min-height: 16px;
  margin-left: 4px;
  border-radius: 50%;
  font-size: 11px;
  line-height: 1;
  cursor: default;
  color: var(--el-color-info);
  border: 1px solid var(--el-border-color);
  vertical-align: middle;
}

.pro-table__th-icon {
  width: 14px;
  height: 14px;
}

.pro-table__pagination {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
}

.pro-table__scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .pro-table__toolbar,
  .pro-table__pagination {
    justify-content: flex-start;
  }

  .pro-table__toolbar-prefix,
  .pro-table__toolbar-extra {
    width: 100%;
  }

  .pro-table__pagination :deep(.el-pagination) {
    justify-content: flex-start;
    flex-wrap: wrap;
    row-gap: 8px;
  }

  .pro-table__table {
    min-width: 640px;
  }
}
</style>
