<script setup lang="ts">
import type { RecipeNutrition } from '../types'
import type { FormFieldSchema } from '@/types/pro-form'
import { ProForm } from '@/components/pro-form'

/**
 * NutritionForm — 营养信息表单（ProForm schema 驱动）
 *
 * 所有字段可选，支持热量、蛋白质、脂肪、碳水。
 */

defineProps<{
  modelValue?: RecipeNutrition
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecipeNutrition | undefined): void
}>()

const schema: FormFieldSchema[] = [
  { meta: { field: 'calories', label: '热量（千卡）', valueType: 'number', required: false }, ui: { component: 'InputNumber', props: { 'min': 0, 'max': 9999, 'controlsPosition': 'right', 'data-testid': 'nutrition-calories' }, layout: { span: 12 } } },
  { meta: { field: 'protein', label: '蛋白质（克）', valueType: 'number', required: false }, ui: { component: 'InputNumber', props: { 'min': 0, 'max': 999, 'precision': 1, 'controlsPosition': 'right', 'data-testid': 'nutrition-protein' }, layout: { span: 12 } } },
  { meta: { field: 'fat', label: '脂肪（克）', valueType: 'number', required: false }, ui: { component: 'InputNumber', props: { 'min': 0, 'max': 999, 'precision': 1, 'controlsPosition': 'right', 'data-testid': 'nutrition-fat' }, layout: { span: 12 } } },
  { meta: { field: 'carbohydrate', label: '碳水（克）', valueType: 'number', required: false }, ui: { component: 'InputNumber', props: { 'min': 0, 'max': 999, 'precision': 1, 'controlsPosition': 'right', 'data-testid': 'nutrition-carbs' }, layout: { span: 12 } } },
]
</script>

<template>
  <div class="nutrition-form">
    <h4 class="nutrition-form__title">
      营养信息（每份）
    </h4>
    <ProForm
      :schema="schema"
      :model-value="modelValue || {}"
      :loading="false"
      @update:model-value="emit('update:modelValue', $event as RecipeNutrition)"
    />
  </div>
</template>

<style scoped>
.nutrition-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.nutrition-form__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}
</style>
