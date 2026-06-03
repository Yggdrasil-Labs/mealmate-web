<script setup lang="ts">
import type { PrepPlanItem } from '../types'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'PrepTaskList' })

defineProps<{
  items: PrepPlanItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', itemId: number, status: 'TODO' | 'DONE'): void
}>()

const { t } = useI18n()

function priorityOrder(p: string) {
  return p === 'HIGH' ? 0 : p === 'NORMAL' ? 1 : 2
}
</script>

<template>
  <ul class="prep-task-list">
    <li
      v-for="item in [...items].sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority))"
      :key="item.id"
      class="prep-task-list__item"
      :class="{ 'prep-task-list__item--done': item.taskStatus === 'DONE' }"
    >
      <label class="prep-task-list__label">
        <input
          type="checkbox"
          class="prep-task-list__checkbox"
          :checked="item.taskStatus === 'DONE'"
          @change="emit('toggle', item.id, item.taskStatus === 'DONE' ? 'TODO' : 'DONE')"
        >
        <span class="prep-task-list__name">{{ item.ingredientName }}</span>
        <span v-if="item.quantity" class="prep-task-list__qty">
          {{ item.quantity }}{{ item.unit ?? '' }}
        </span>
      </label>
      <span
        class="prep-task-list__priority"
        :class="`prep-task-list__priority--${item.priority.toLowerCase()}`"
      >
        {{ item.priority === 'HIGH' ? t('mealPlan.priorityHigh', '高') : item.priority === 'NORMAL' ? t('mealPlan.priorityNormal', '中') : t('mealPlan.priorityLow', '低') }}
      </span>
    </li>
    <li v-if="!items.length" class="prep-task-list__empty">
      {{ t('mealPlan.noPrepItems', '暂无备菜任务') }}
    </li>
  </ul>
</template>

<style scoped>
.prep-task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.prep-task-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border: var(--card-border);
  border-left: 3px solid transparent;
  border-radius: var(--btn-radius);
  background: var(--color-surface);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.prep-task-list__item:has(.prep-task-list__priority--high) {
  border-left-color: var(--color-danger);
}

.prep-task-list__item:has(.prep-task-list__priority--normal) {
  border-left-color: var(--color-info);
}

.prep-task-list__item:has(.prep-task-list__priority--low) {
  border-left-color: var(--color-border-strong);
}

.prep-task-list__item:hover {
  background: var(--color-surface-muted);
  box-shadow: var(--card-shadow);
}

.prep-task-list__item--done {
  opacity: 0.6;
  text-decoration: line-through;
}

.prep-task-list__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.prep-task-list__checkbox {
  width: 20px;
  height: 20px;
}

.prep-task-list__name {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.prep-task-list__qty {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.prep-task-list__priority {
  font-size: var(--badge-font-size);
  padding: 0 var(--space-2);
  border-radius: var(--space-1);
}

.prep-task-list__priority--high {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.prep-task-list__priority--normal {
  background: var(--color-info-soft);
  color: var(--color-info);
}

.prep-task-list__priority--low {
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}

.prep-task-list__empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-soft);
}
</style>
