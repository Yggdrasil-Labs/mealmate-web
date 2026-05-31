<script setup lang="ts">
import type { RecipeIngredientItem } from '../types'
import { ElButton, ElInput } from 'element-plus'
import { computed } from 'vue'

/**
 * IngredientEditor 组件
 *
 * 支持添加、删除、重排食材行。
 * 提供拖拽和按钮两种重排方式，自动计算 sortNo。
 */

interface Props {
  modelValue: RecipeIngredientItem[]
}

interface Emits {
  (e: 'update:modelValue', value: RecipeIngredientItem[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const ingredients = computed(() => props.modelValue)

/** 生成前端临时 key（非后端 ID），仅用于列表渲染的 :key 绑定。 */
function generateId() {
  return `ing-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function recomputeSortNo(items: RecipeIngredientItem[]): RecipeIngredientItem[] {
  return items.map((item, index) => ({
    ...item,
    sortNo: index + 1,
  }))
}

function addIngredient() {
  const newIngredient: RecipeIngredientItem = {
    ingredientId: generateId(),
    ingredientName: '',
    ingredientType: '',
    quantity: '',
    unit: '',
    isMain: false,
    sortNo: ingredients.value.length + 1,
  }
  emit('update:modelValue', [...ingredients.value, newIngredient])
}

function deleteIngredient(index: number) {
  const updated = ingredients.value.filter((_, i) => i !== index)
  emit('update:modelValue', recomputeSortNo(updated))
}

function moveUp(index: number) {
  if (index === 0)
    return

  const updated = [...ingredients.value]
  const temp = updated[index]
  updated[index] = updated[index - 1]
  updated[index - 1] = temp
  emit('update:modelValue', recomputeSortNo(updated))
}

function moveDown(index: number) {
  if (index === ingredients.value.length - 1)
    return

  const updated = [...ingredients.value]
  const temp = updated[index]
  updated[index] = updated[index + 1]
  updated[index + 1] = temp
  emit('update:modelValue', recomputeSortNo(updated))
}

function updateIngredient(index: number, field: keyof RecipeIngredientItem, value: string) {
  const updated = [...ingredients.value]
  updated[index] = { ...updated[index], [field]: value }
  emit('update:modelValue', updated)
}
</script>

<template>
  <div class="ingredient-editor">
    <div class="ingredient-editor__header">
      <h4 class="ingredient-editor__title">
        <span class="ingredient-editor__required">*</span>食材列表
      </h4>
      <ElButton
        type="primary"
        size="small"
        data-testid="ingredient-add"
        @click="addIngredient"
      >
        添加食材
      </ElButton>
    </div>

    <div
      v-if="ingredients.length > 0"
      class="ingredient-editor__list"
    >
      <div
        v-for="(ingredient, index) in ingredients"
        :key="ingredient.ingredientId"
        class="ingredient-editor__item"
      >
        <div class="ingredient-editor__item-number">
          {{ index + 1 }}
        </div>

        <div class="ingredient-editor__item-fields">
          <ElInput
            :model-value="ingredient.ingredientName"
            placeholder="食材名称"
            @input="(value) => updateIngredient(index, 'ingredientName', value as string)"
          />
          <ElInput
            :model-value="ingredient.quantity"
            placeholder="数量"
            @input="(value) => updateIngredient(index, 'quantity', value as string)"
          />
          <ElInput
            :model-value="ingredient.unit"
            placeholder="单位"
            @input="(value) => updateIngredient(index, 'unit', value as string)"
          />
        </div>

        <div class="ingredient-editor__item-actions">
          <ElButton
            size="small"
            :disabled="index === 0"
            :data-testid="`ingredient-up-${index}`"
            @click="moveUp(index)"
          >
            ↑
          </ElButton>
          <ElButton
            size="small"
            :disabled="index === ingredients.length - 1"
            :data-testid="`ingredient-down-${index}`"
            @click="moveDown(index)"
          >
            ↓
          </ElButton>
          <ElButton
            type="danger"
            size="small"
            :data-testid="`ingredient-delete-${index}`"
            @click="deleteIngredient(index)"
          >
            删除
          </ElButton>
        </div>
      </div>
    </div>

    <div
      v-else
      class="ingredient-editor__empty"
    >
      <p>暂无食材，点击"添加食材"开始编辑</p>
    </div>
  </div>
</template>

<style scoped>
.ingredient-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ingredient-editor__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ingredient-editor__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.ingredient-editor__required {
  color: var(--el-color-danger, #f56c6c);
  margin-right: 4px;
}

.ingredient-editor__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ingredient-editor__item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
}

.ingredient-editor__item-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
}

.ingredient-editor__item-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.5rem;
}

.ingredient-editor__item-actions {
  display: flex;
  gap: 0.25rem;
}

.ingredient-editor__empty {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
}

.ingredient-editor__empty p {
  margin: 0;
}

@media (max-width: 640px) {
  .ingredient-editor__item {
    flex-direction: column;
  }

  .ingredient-editor__item-fields {
    grid-template-columns: 1fr;
  }

  .ingredient-editor__item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
