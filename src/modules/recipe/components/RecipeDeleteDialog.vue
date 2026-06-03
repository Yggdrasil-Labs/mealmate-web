<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'

/**
 * RecipeDeleteDialog 组件
 *
 * 删除菜品确认对话框，显示菜品名称并要求用户确认。
 */

interface Props {
  visible: boolean
  recipeName: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    title="删除菜品"
    width="400px"
    @close="handleCancel"
  >
    <div class="recipe-delete-dialog__content">
      <p class="recipe-delete-dialog__message">
        确定要删除菜品 <strong>{{ recipeName }}</strong> 吗？
      </p>
      <p class="recipe-delete-dialog__warning">
        此操作不可恢复。
      </p>
    </div>

    <template #footer>
      <div class="recipe-delete-dialog__footer">
        <ElButton
          data-testid="recipe-delete-cancel"
          @click="handleCancel"
        >
          取消
        </ElButton>
        <ElButton
          type="danger"
          data-testid="recipe-delete-confirm"
          @click="handleConfirm"
        >
          确认删除
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.recipe-delete-dialog__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.recipe-delete-dialog__message {
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
}

.recipe-delete-dialog__message strong {
  color: var(--color-danger);
}

.recipe-delete-dialog__warning {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.recipe-delete-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
</style>
