<script setup lang="ts">
import type { ProTableContext, TableColumnSchema } from '@/types/pro-table'

defineOptions({ name: 'ProTableCellText' })

defineProps<{
  column: TableColumnSchema
  row: Record<string, unknown>
  value: unknown
  /** 已应用 formatter 的展示文案 */
  displayText: string
  context: ProTableContext
}>()
</script>

<template>
  <span class="pro-table-cell-text">{{ displayText }}</span>
</template>
