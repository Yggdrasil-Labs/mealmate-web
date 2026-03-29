<script setup lang="ts">
import { ElTag } from 'element-plus'

defineOptions({ name: 'FormFieldTag' })

defineProps<{
  modelValue?: unknown
}>()

defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()
</script>

<template>
  <ElTag>
    {{ modelValue != null && modelValue !== '' ? String(modelValue) : '-' }}
  </ElTag>
</template>
