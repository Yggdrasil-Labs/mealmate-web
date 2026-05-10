<script setup lang="ts">
import type { UploadRawFile } from 'element-plus'
import type { RecipeStepItem } from '../types'
import { ElButton, ElImage, ElInput, ElUpload } from 'element-plus'
import { computed, ref } from 'vue'
import { uploadRecipeStepImage } from '../api'

/**
 * StepEditor 组件
 *
 * 支持添加、删除、重排步骤行。
 * 支持图片上传，提供拖拽和按钮两种重排方式，自动编号 stepNo。
 */

interface Props {
  modelValue: RecipeStepItem[]
}

interface Emits {
  (e: 'update:modelValue', value: RecipeStepItem[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const steps = computed(() => props.modelValue)
const uploadingSteps = ref<Set<number>>(new Set())

function recomputeStepNo(items: RecipeStepItem[]): RecipeStepItem[] {
  return items.map((item, index) => ({
    ...item,
    stepNo: index + 1,
  }))
}

function addStep() {
  const newStep: RecipeStepItem = {
    stepNo: steps.value.length + 1,
    content: '',
    imageUrl: '',
  }
  emit('update:modelValue', [...steps.value, newStep])
}

function deleteStep(index: number) {
  const updated = steps.value.filter((_, i) => i !== index)
  emit('update:modelValue', recomputeStepNo(updated))
}

function moveUp(index: number) {
  if (index === 0)
    return

  const updated = [...steps.value]
  const temp = updated[index]
  updated[index] = updated[index - 1]
  updated[index - 1] = temp
  emit('update:modelValue', recomputeStepNo(updated))
}

function moveDown(index: number) {
  if (index === steps.value.length - 1)
    return

  const updated = [...steps.value]
  const temp = updated[index]
  updated[index] = updated[index + 1]
  updated[index + 1] = temp
  emit('update:modelValue', recomputeStepNo(updated))
}

function updateStep(index: number, field: keyof RecipeStepItem, value: string) {
  const updated = [...steps.value]
  updated[index] = { ...updated[index], [field]: value }
  emit('update:modelValue', updated)
}

async function handleImageUpload(index: number, file: UploadRawFile) {
  uploadingSteps.value.add(index)

  try {
    const imageUrl = await uploadRecipeStepImage(file)
    updateStep(index, 'imageUrl', imageUrl)
  }
  catch (error) {
    console.error('图片上传失败', error)
  }
  finally {
    uploadingSteps.value.delete(index)
  }

  return false // 阻止 ElUpload 的默认上传行为
}
</script>

<template>
  <div class="step-editor">
    <div class="step-editor__header">
      <h4 class="step-editor__title">
        步骤列表
      </h4>
      <ElButton
        type="primary"
        size="small"
        data-testid="step-add"
        @click="addStep"
      >
        添加步骤
      </ElButton>
    </div>

    <div
      v-if="steps.length > 0"
      class="step-editor__list"
    >
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-editor__item"
      >
        <div class="step-editor__item-number">
          {{ index + 1 }}
        </div>

        <div class="step-editor__item-content">
          <ElInput
            :model-value="step.content"
            type="textarea"
            :rows="3"
            placeholder="步骤描述"
            @input="(value) => updateStep(index, 'content', value as string)"
          />

          <div class="step-editor__item-image">
            <ElUpload
              :show-file-list="false"
              :before-upload="(file) => handleImageUpload(index, file)"
              accept="image/*"
            >
              <ElButton
                size="small"
                :loading="uploadingSteps.has(index)"
              >
                {{ step.imageUrl ? '更换图片' : '上传图片' }}
              </ElButton>
            </ElUpload>

            <ElImage
              v-if="step.imageUrl"
              :src="step.imageUrl"
              fit="cover"
              class="step-editor__preview"
            />
          </div>
        </div>

        <div class="step-editor__item-actions">
          <ElButton
            size="small"
            :disabled="index === 0"
            :data-testid="`step-up-${index}`"
            @click="moveUp(index)"
          >
            ↑
          </ElButton>
          <ElButton
            size="small"
            :disabled="index === steps.length - 1"
            :data-testid="`step-down-${index}`"
            @click="moveDown(index)"
          >
            ↓
          </ElButton>
          <ElButton
            type="danger"
            size="small"
            :data-testid="`step-delete-${index}`"
            @click="deleteStep(index)"
          >
            删除
          </ElButton>
        </div>
      </div>
    </div>

    <div
      v-else
      class="step-editor__empty"
    >
      <p>暂无步骤，点击"添加步骤"开始编辑</p>
    </div>
  </div>
</template>

<style scoped>
.step-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-editor__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-editor__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.step-editor__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-editor__item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
}

.step-editor__item-number {
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

.step-editor__item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-editor__item-image {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-editor__preview {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}

.step-editor__item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-editor__empty {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
}

.step-editor__empty p {
  margin: 0;
}

@media (max-width: 640px) {
  .step-editor__item {
    flex-direction: column;
  }

  .step-editor__item-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
