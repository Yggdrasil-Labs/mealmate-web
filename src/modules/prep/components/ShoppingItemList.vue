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
  gap: 0.5rem;
}

.shopping-list__item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.shopping-list__item--purchased {
  opacity: 0.6;
  text-decoration: line-through;
}

.shopping-list__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.shopping-list__checkbox {
  width: 20px;
  height: 20px;
}

.shopping-list__name {
  font-size: 0.9rem;
  color: #0f172a;
}

.shopping-list__qty {
  font-size: 0.8rem;
  color: #64748b;
}

.shopping-list__empty {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}
</style>
