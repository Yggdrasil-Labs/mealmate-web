<script setup lang="ts">
import type { ShoppingItem } from '../types'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'ShoppingItemList' })

defineProps<{
  items: ShoppingItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', itemId: number, purchased: boolean): void
}>()

const { t } = useI18n()
</script>

<template>
  <ul class="shopping-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="shopping-list__item"
      :class="{ 'shopping-list__item--purchased': item.purchased }"
    >
      <label class="shopping-list__label">
        <input
          type="checkbox"
          class="shopping-list__checkbox"
          :checked="item.purchased"
          @change="emit('toggle', item.id, !item.purchased)"
        >
        <span class="shopping-list__name">{{ item.ingredientName }}</span>
        <span v-if="item.totalQuantity" class="shopping-list__qty">
          {{ item.totalQuantity }}{{ item.unit ?? '' }}
        </span>
      </label>
    </li>
    <li v-if="!items.length" class="shopping-list__empty">
      {{ t('mealPlan.noShoppingItems', '暂无采购项') }}
    </li>
  </ul>
</template>

<style scoped>
.shopping-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.shopping-list__item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border: var(--card-border);
  border-left: 3px solid transparent;
  border-radius: var(--btn-radius);
  background: var(--color-surface);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.shopping-list__item:hover {
  background: var(--color-surface-muted);
  box-shadow: var(--card-shadow);
}

.shopping-list__item--purchased {
  opacity: 0.6;
  text-decoration: line-through;
  border-left-color: var(--color-success);
}

.shopping-list__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.shopping-list__checkbox {
  width: 20px;
  height: 20px;
}

.shopping-list__name {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.shopping-list__qty {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.shopping-list__empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-soft);
}
</style>
