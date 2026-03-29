<script setup lang="ts">
import type { ProTableContext, TableColumnSchema, TableRowAction } from '@/types/pro-table'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'ProTableCellActions' })

const props = defineProps<{
  column: TableColumnSchema
  row: Record<string, unknown>
  value: unknown
  displayText: string
  context: ProTableContext
}>()

const INLINE_MAX = 2

function isVisible(a: TableRowAction): boolean {
  const v = a.visible
  if (v === undefined)
    return true
  return typeof v === 'function' ? v(props.row) : v
}

function isDisabled(a: TableRowAction): boolean {
  const d = a.disabled
  if (d === undefined)
    return false
  return typeof d === 'function' ? d(props.row) : d
}

const visibleActions = computed(() =>
  (props.column.runtime?.actions ?? []).filter(isVisible),
)

const inlineActions = computed(() => visibleActions.value.slice(0, INLINE_MAX))

const moreActions = computed(() => visibleActions.value.slice(INLINE_MAX))
</script>

<template>
  <div class="pro-table-cell-actions">
    <template v-for="(a, i) in inlineActions" :key="i">
      <ElButton
        link
        type="primary"
        :class="{ 'is-danger-link': a.danger }"
        :disabled="isDisabled(a)"
        @click.stop="a.onClick?.(row)"
      >
        {{ a.label }}
      </ElButton>
    </template>
    <ElDropdown v-if="moreActions.length" trigger="click">
      <ElButton link type="primary" @click.stop>
        更多
      </ElButton>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="(a, i) in moreActions"
            :key="i"
            :disabled="isDisabled(a)"
            @click.stop="a.onClick?.(row)"
          >
            <span :class="{ 'text-danger': a.danger }">{{ a.label }}</span>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <div class="pro-table-cell-actions__extra" @click.stop>
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pro-table-cell-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.is-danger-link {
  color: var(--el-color-danger) !important;
}

.text-danger {
  color: var(--el-color-danger);
}
</style>
