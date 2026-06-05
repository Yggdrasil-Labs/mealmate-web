<script setup lang="ts">
import { watch } from 'vue'
import { ProDialog } from '@/components/pro-dialog'
import { useAdjustMealItem } from '../composables/useAdjustMealItem'

/**
 * AdjustHistoryModal — 调整历史弹窗
 *
 * 使用 ProDialog custom 模式展示调整历史列表。
 */

defineOptions({ name: 'AdjustHistoryModal' })

const props = defineProps<{
  visible: boolean
  planId: number
  itemId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { historyList, historyLoading, loadHistory } = useAdjustMealItem()

const reasonLabels: Record<string, string> = {
  LACK_INGREDIENT: '食材缺货',
  TASTE_CHANGE: '口味变化',
  OUTING: '外出就餐',
  OTHER: '其他',
}

watch(() => props.visible, (v) => {
  if (v)
    loadHistory(props.planId, props.itemId)
})
</script>

<template>
  <ProDialog
    :model-value="visible"
    mode="custom"
    title="调整历史"
    width="420px"
    :show-footer="false"
    :loading="historyLoading"
    @update:model-value="!$event && emit('close')"
  >
    <ElEmpty v-if="!historyList.length && !historyLoading" description="暂无调整记录" />
    <ul v-else class="history-modal__list">
      <li v-for="h in historyList" :key="h.historyId" class="history-modal__item">
        <div class="history-modal__change">
          <span class="history-modal__old">{{ h.oldRecipeName }}</span>
          <span class="history-modal__arrow">→</span>
          <span class="history-modal__new">{{ h.newRecipeName }}</span>
        </div>
        <div class="history-modal__meta">
          <span>{{ h.adjustedAt }}</span>
          <span v-if="h.adjustReason" class="history-modal__reason">
            {{ reasonLabels[h.adjustReason] || h.adjustReason }}
          </span>
        </div>
      </li>
    </ul>
  </ProDialog>
</template>

<style scoped>
.history-modal__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-modal__item {
  padding: 10px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.history-modal__change {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.history-modal__old {
  color: var(--el-text-color-secondary);
  text-decoration: line-through;
}

.history-modal__arrow {
  color: var(--el-text-color-placeholder);
}

.history-modal__new {
  font-weight: 500;
}

.history-modal__meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  gap: 8px;
}

.history-modal__reason {
  background: var(--el-fill-color-light);
  padding: 0 6px;
  border-radius: 4px;
}
</style>
