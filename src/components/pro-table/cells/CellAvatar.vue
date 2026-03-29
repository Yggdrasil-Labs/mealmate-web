<script setup lang="ts">
import type { ProTableContext, TableColumnSchema } from '@/types/pro-table'
import { ElAvatar } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'ProTableCellAvatar' })

const props = defineProps<{
  column: TableColumnSchema
  row: Record<string, unknown>
  value: unknown
  displayText: string
  context: ProTableContext
}>()

const src = computed(() => {
  const v = props.value
  if (v == null || v === '')
    return undefined
  return String(v)
})
</script>

<template>
  <ElAvatar v-if="src" :src="src" :size="32" />
  <span v-else class="pro-table-cell-text">—</span>
</template>
