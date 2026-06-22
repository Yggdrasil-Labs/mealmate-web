<script setup lang="ts">
import type { MealPlanItem } from '../types'

defineOptions({ name: 'MealItemCard' })

defineProps<{
  item: MealPlanItem
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'adjust', item: MealPlanItem): void
  (e: 'delete', item: MealPlanItem): void
  (e: 'history', item: MealPlanItem): void
}>()
</script>

<template>
  <article class="meal-item-card" :class="{ 'meal-item-card--duplicate': item.duplicateFlag }">
    <!-- 已调整角标：manuallyAdjusted 时显示调整次数，点击触发 history 事件 -->
    <span
      v-if="item.manuallyAdjusted"
      class="meal-item-card__badge"
      :title="`已调整 ${item.adjustCount} 次`"
      @click.stop="emit('history', item)"
    >
      {{ item.adjustCount }}
    </span>

    <span class="meal-item-card__name">{{ item.recipeName }}</span>
    <span v-if="item.babyMeal" class="meal-item-card__tag meal-item-card__tag--baby">宝</span>
    <span v-if="item.weightLoss" class="meal-item-card__tag meal-item-card__tag--diet">轻</span>
    <div v-if="!readonly" class="meal-item-card__actions">
      <button type="button" class="meal-item-card__action" @click="emit('adjust', item)">
        换
      </button>
      <button type="button" class="meal-item-card__action meal-item-card__action--danger" @click="emit('delete', item)">
        ✕
      </button>
    </div>
  </article>
</template>

<style scoped>
.meal-item-card {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 12px;
  line-height: 1.3;
  cursor: default;
  transition: background-color var(--duration-fast) var(--ease-out);
  position: relative;
}

.meal-item-card:hover {
  background: var(--color-surface-muted);
}

.meal-item-card--duplicate {
  border-color: var(--color-warning);
  background: var(--color-warning-soft);
}

.meal-item-card__name {
  color: var(--color-text);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 72px;
}

.meal-item-card__tag {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
}

.meal-item-card__tag--baby {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.meal-item-card__tag--diet {
  background: var(--color-info-soft);
  color: var(--color-info);
}

.meal-item-card__actions {
  display: none;
  gap: 2px;
  margin-left: auto;
}

.meal-item-card:hover .meal-item-card__actions {
  display: flex;
}

.meal-item-card__action {
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 4px;
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.meal-item-card__action:hover {
  background: var(--color-border-strong);
  color: var(--color-text);
}

.meal-item-card__action--danger:hover {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.meal-item-card__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background: var(--el-color-warning, #e6a23c);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  cursor: pointer;
  z-index: 1;
}

@media (max-width: 768px) {
  .meal-item-card__actions {
    display: flex;
  }

  .meal-item-card__name {
    max-width: none;
  }
}
</style>
