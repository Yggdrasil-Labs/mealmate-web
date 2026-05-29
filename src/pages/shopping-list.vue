<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useMealPlanStore } from '@/modules/meal-plan/store'
import ShoppingItemList from '@/modules/prep/components/ShoppingItemList.vue'
import { useShoppingList } from '@/modules/prep/composables/useShoppingList'

const { t } = useI18n()
const router = useRouter()
const store = useMealPlanStore()
const { items, loading, load, togglePurchased } = useShoppingList(() => store.currentPlan?.planId)

onMounted(() => load())
</script>

<template>
  <div class="shopping-list-page">
    <PageHeader :title="t('mealPlan.shoppingList')" />

    <div v-if="loading" class="shopping-list-page__skeleton">
      <div v-for="i in 5" :key="i" class="skeleton" style="height: 48px;" />
    </div>

    <!-- 无计划时引导 -->
    <div v-else-if="!store.currentPlan?.planId" class="shopping-list-page__empty">
      <span class="shopping-list-page__empty-icon" aria-hidden="true">购</span>
      <h2 class="shopping-list-page__empty-title">
        暂无采购清单
      </h2>
      <p class="shopping-list-page__empty-desc">
        暂无已确认的计划，请先前往周计划页面确认计划。
      </p>
      <button type="button" class="shopping-list-page__btn" @click="router.push('/weekly-meal-plan')">
        前往周计划
      </button>
    </div>

    <ShoppingItemList
      v-else
      :items="items"
      @toggle="togglePurchased"
    />
  </div>
</template>

<style scoped>
.shopping-list-page {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.shopping-list-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.shopping-list-page__empty {
  padding: var(--space-12) var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
  gap: var(--space-2);
}

.shopping-list-page__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-info-soft);
  color: var(--color-info);
  font-size: var(--text-xl);
  font-weight: 700;
}

.shopping-list-page__empty-title {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.shopping-list-page__empty-desc {
  margin: 0;
  color: var(--color-text-muted);
}

.shopping-list-page__btn {
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-6);
  border: 1px solid var(--color-primary);
  border-radius: var(--btn-radius);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.shopping-list-page__btn:hover {
  background: var(--color-primary-soft);
}

.shopping-list-page__btn:active {
  transform: scale(0.97);
}

.shopping-list-page__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
