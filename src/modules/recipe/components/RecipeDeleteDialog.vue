<script setup lang="ts">
import { ProDialog } from '@/components/pro-dialog'

/**
 * RecipeDeleteDialog — 删除菜品确认对话框
 *
 * 使用 ProDialog confirm 模式，统一删除确认交互。
 */

defineProps<{
  visible: boolean
  recipeName: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <ProDialog
    :model-value="visible"
    mode="confirm"
    title="删除菜品"
    width="400px"
    confirm-type="danger"
    confirm-text="确认删除"
    data-testid="recipe-delete-dialog"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
    @update:model-value="!$event && emit('cancel')"
  >
    <p class="recipe-delete-dialog__message">
      确定要删除菜品 <strong>{{ recipeName }}</strong> 吗？
    </p>
    <p class="recipe-delete-dialog__warning">
      此操作不可恢复。
    </p>
  </ProDialog>
</template>

<style scoped>
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
</style>
