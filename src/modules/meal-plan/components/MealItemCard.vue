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
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.meal-item-card--duplicate {
  border-color: #f59e0b;
}

.meal-item-card__cover {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-item-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-item-card__initial {
  font-weight: 600;
  color: #64748b;
}

.meal-item-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.meal-item-card__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meal-item-card__badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: #e0f2fe;
  color: #0369a1;
}

.meal-item-card__badge--dup {
  background: #fef3c7;
  color: #92400e;
}

.meal-item-card__actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.meal-item-card__action {
  min-width: 44px;
  min-height: 32px;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  cursor: pointer;
}

.meal-item-card__action:hover {
  background: #e2e8f0;
}

.meal-item-card__action--danger:hover {
  background: #fee2e2;
  color: #dc2626;
}
</style>
