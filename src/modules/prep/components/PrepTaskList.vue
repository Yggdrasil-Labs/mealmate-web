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
  gap: 0.5rem;
}

.prep-task-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.prep-task-list__item--done {
  opacity: 0.6;
  text-decoration: line-through;
}

.prep-task-list__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.prep-task-list__checkbox {
  width: 20px;
  height: 20px;
}

.prep-task-list__name {
  font-size: 0.9rem;
  color: #0f172a;
}

.prep-task-list__qty {
  font-size: 0.8rem;
  color: #64748b;
}

.prep-task-list__priority {
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.prep-task-list__priority--high {
  background: #fee2e2;
  color: #dc2626;
}

.prep-task-list__priority--normal {
  background: #e0f2fe;
  color: #0369a1;
}

.prep-task-list__priority--low {
  background: #f1f5f9;
  color: #64748b;
}

.prep-task-list__empty {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}
</style>
