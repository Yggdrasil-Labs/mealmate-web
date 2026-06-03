<script setup lang="ts">
import type { RecipeNutrition } from '../types'
import { ElFormItem, ElInputNumber } from 'element-plus'
import { computed } from 'vue'

/**
 * NutritionForm 组件
 *
 * 营养信息表单，支持热量、蛋白质、脂肪、碳水的输入。
 * 所有字段都是可选的。
 */

interface Props {
  modelValue?: RecipeNutrition
}

interface Emits {
  (e: 'update:modelValue', value: RecipeNutrition | undefined): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const nutrition = computed(() => props.modelValue || {})

function updateField(field: keyof RecipeNutrition, value: number | undefined) {
  const updated = { ...nutrition.value, [field]: value }
  emit('update:modelValue', updated)
}
</script>

<template>
  <div class="nutrition-form">
    <h4 class="nutrition-form__title">
      营养信息（每份）
    </h4>

    <div class="nutrition-form__fields">
      <ElFormItem label="热量（千卡）">
        <ElInputNumber
          :model-value="nutrition.calories"
          :min="0"
          :max="9999"
          controls-position="right"
          data-testid="nutrition-calories"
          @update:model-value="(value) => updateField('calories', value)"
        />
      </ElFormItem>

      <ElFormItem label="蛋白质（克）">
        <ElInputNumber
          :model-value="nutrition.protein"
          :min="0"
          :max="999"
          :precision="1"
          controls-position="right"
          data-testid="nutrition-protein"
          @update:model-value="(value) => updateField('protein', value)"
        />
      </ElFormItem>

      <ElFormItem label="脂肪（克）">
        <ElInputNumber
          :model-value="nutrition.fat"
          :min="0"
          :max="999"
          :precision="1"
          controls-position="right"
          data-testid="nutrition-fat"
          @update:model-value="(value) => updateField('fat', value)"
        />
      </ElFormItem>

      <ElFormItem label="碳水（克）">
        <ElInputNumber
          :model-value="nutrition.carbohydrate"
          :min="0"
          :max="999"
          :precision="1"
          controls-position="right"
          data-testid="nutrition-carbs"
          @update:model-value="(value) => updateField('carbohydrate', value)"
        />
      </ElFormItem>
    </div>
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

.nutrition-form__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media (max-width: 640px) {
  .nutrition-form__fields {
    grid-template-columns: 1fr;
  }
}
</style>
