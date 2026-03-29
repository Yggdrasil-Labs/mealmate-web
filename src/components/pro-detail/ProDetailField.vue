<script setup lang="ts">
import type { DetailFieldSchema, ProDetailContext } from './types'
import { ElMessage, ElTag } from 'element-plus'
import { computed } from 'vue'

const props = defineProps<{
  schema: DetailFieldSchema
  data: Record<string, unknown>
  context?: ProDetailContext
}>()

const emit = defineEmits<{
  (e: 'copy', payload: { field: string, value: unknown }): void
}>()

const fieldKey = computed(() => props.schema.meta.field)

const rawValue = computed(() => props.data[fieldKey.value])

const displayValue = computed(() => {
  let value = rawValue.value
  const displayTransform = props.schema.runtime?.transform?.display
  if (typeof displayTransform === 'function') {
    try {
      value = displayTransform(value)
    }
    catch {
      // ignore transform errors, fallback to raw value
      value = rawValue.value
    }
  }

  const isEmpty = value === null || value === undefined || value === ''
  const emptyText = props.schema.meta.emptyText ?? '-'
  return isEmpty ? emptyText : value
})

const isTag = computed(() => props.schema.ui.component === 'Tag')

const isCopyable = computed(() => props.schema.ui.copyable === true)

async function handleCopy() {
  const value = displayValue.value
  try {
    await navigator.clipboard.writeText(String(value ?? ''))
    ElMessage.success('已复制')
    emit('copy', { field: fieldKey.value, value })
  }
  catch {
    ElMessage.error('复制失败')
  }
}
</script>

<template>
  <slot
    name="custom-render"
    :schema="schema"
    :value="displayValue"
    :raw-value="rawValue"
    :data="data"
    :context="context"
  >
    <span class="pro-detail__value">
      <template v-if="isTag">
        <ElTag>
          {{ displayValue }}
        </ElTag>
      </template>
      <template v-else>
        {{ displayValue }}
      </template>
    </span>

    <slot
      name="field-suffix"
      :schema="schema"
      :value="displayValue"
      :raw-value="rawValue"
      :data="data"
      :context="context"
    />

    <slot
      name="field-help"
      :schema="schema"
      :value="displayValue"
      :raw-value="rawValue"
      :data="data"
      :context="context"
    />

    <ElTooltip
      v-if="isCopyable"
      content="复制"
      placement="top"
    >
      <button
        type="button"
        class="pro-detail__copy"
        @click.stop="handleCopy"
      >
        ⧉
      </button>
    </ElTooltip>
  </slot>
</template>

<style scoped>
.pro-detail__value {
  margin-right: 8px;
}

.pro-detail__copy {
  margin-left: 4px;
  padding: 0 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--el-text-color-secondary, #909399);
}

.pro-detail__copy:hover {
  color: var(--el-color-primary, #409eff);
}
</style>
