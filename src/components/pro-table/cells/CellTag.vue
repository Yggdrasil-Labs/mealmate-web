<script setup lang="ts">
import type { ProTableContext, TableColumnSchema } from '@/types/pro-table'
import { ElTag } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'ProTableCellTag' })

const props = defineProps<{
  column: TableColumnSchema
  row: Record<string, unknown>
  value: unknown
  displayText: string
  context: ProTableContext
}>()

const tagType = computed(() =>
  props.column.runtime?.tagType?.(props.value, props.row) ?? 'info',
)
</script>

<template>
  <ElTag :type="tagType" disable-transitions>
    {{ displayText }}
  </ElTag>
</template>
