<script setup lang="ts">
import type { MealPlanItem } from '../types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'MealItemCard' })

const props = defineProps<{
  item: MealPlanItem
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'replace', item: MealPlanItem): void
  (e: 'delete', item: MealPlanItem): void
}>()

const { t } = useI18n()

const initial = computed(() => props.item.recipeName.slice(0, 1))
</script>

<template>
  <article class="meal-item-card" :class="{ 'meal-item-card--duplicate': item.duplicateFlag }">
    <div class="meal-item-card__cover">
      <img
        v-if="item.coverImageUrl"
        class="meal-item-card__image"
        :src="item.coverImageUrl"
        :alt="item.recipeName"
      >
      <span v-else class="meal-item-card__initial">{{ initial }}</span>
    </div>

    <div class="meal-item-card__body">
      <span class="meal-item-card__name">{{ item.recipeName }}</span>
      <span v-if="item.duplicateFlag" class="meal-item-card__badge meal-item-card__badge--dup">
        {{ t('mealPlan.duplicate', '重复') }}
      </span>
      <span v-if="item.isWeightLoss" class="meal-item-card__badge">减脂</span>
      <span v-if="item.isBabyMeal" class="meal-item-card__badge">宝宝餐</span>
    </div>

    <div v-if="!readonly" class="meal-item-card__actions">
      <button type="button" class="meal-item-card__action" @click="emit('replace', item)">
        {{ t('mealPlan.replace') }}
      </button>
      <button type="button" class="meal-item-card__action meal-item-card__action--danger" @click="emit('delete', item)">
        {{ t('mealPlan.delete') }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.meal-item-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.meal-item-card:hover {
  background: var(--color-surface-muted);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.meal-item-card--duplicate {
  border-color: var(--color-warning);
}

.meal-item-card__cover {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-surface-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
}

.meal-item-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-item-card__initial {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.meal-item-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
}

.meal-item-card__name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  word-break: break-all;
}

.meal-item-card__badge {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--color-info-soft);
  color: var(--color-info);
  line-height: 1.5;
  white-space: nowrap;
}

.meal-item-card__badge--dup {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.meal-item-card__actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.meal-item-card:hover .meal-item-card__actions {
  opacity: 1;
}

.meal-item-card__action {
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.meal-item-card__action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.meal-item-card__action:active {
  transform: scale(0.97);
}

.meal-item-card__action:hover {
  background: var(--color-border-strong);
}

.meal-item-card__action--danger:hover {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}
@media (max-width: 768px) {
  .meal-item-card__actions {
    opacity: 1;
  }
}
</style>
