<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import ManualAddDrawer from '@/modules/meal-plan/components/ManualAddDrawer.vue'
import PlanActionBar from '@/modules/meal-plan/components/PlanActionBar.vue'
import ReplaceRecipeDrawer from '@/modules/meal-plan/components/ReplaceRecipeDrawer.vue'
import WeekCalendarGrid from '@/modules/meal-plan/components/WeekCalendarGrid.vue'
import WeekNavigator from '@/modules/meal-plan/components/WeekNavigator.vue'
import { useManualAdd } from '@/modules/meal-plan/composables/useManualAdd'
import { useReplaceItem } from '@/modules/meal-plan/composables/useReplaceItem'
import { useWeeklyPlan } from '@/modules/meal-plan/composables/useWeeklyPlan'

const { t } = useI18n()
const router = useRouter()

const { plan, loading, isConfirmed, selectedWeekStart, navigateWeek, generate, confirm } = useWeeklyPlan()
const replaceItem = useReplaceItem()
const manualAdd = useManualAdd()

async function handleDelete(item: { itemId: number }) {
  const { useMealPlanStore } = await import('@/modules/meal-plan/store')
  const store = useMealPlanStore()
  await store.deleteItem(item.itemId)
}
</script>

<template>
  <div class="weekly-meal-plan">
    <PageHeader :title="t('mealPlan.title')">
      <template #actions>
        <WeekNavigator
          :week-start-date="selectedWeekStart"
          @prev="navigateWeek(-1)"
          @next="navigateWeek(1)"
        />
      </template>
    </PageHeader>

    <!-- 加载态：骨架屏 -->
    <div v-if="loading" class="weekly-meal-plan__skeleton">
      <div class="skeleton" style="height: 32px; width: 120px;" />
      <div class="weekly-meal-plan__skeleton-grid">
        <div v-for="i in 7" :key="i" class="skeleton" style="height: 80px;" />
      </div>
    </div>

    <!-- 空态 -->
    <div v-else-if="!plan" class="weekly-meal-plan__empty">
      <span class="weekly-meal-plan__empty-icon" aria-hidden="true">计</span>
      <h2 class="weekly-meal-plan__empty-title">
        暂无本周计划
      </h2>
      <p class="weekly-meal-plan__empty-desc">
        {{ t('mealPlan.emptyHint', '当前周暂无计划，点击下方按钮生成') }}
      </p>
    </div>

    <!-- 网格 -->
    <WeekCalendarGrid
      v-else
      :day-meals="plan.dayMeals"
      :week-start-date="plan.weekStartDate"
      :readonly="isConfirmed"
      @replace="replaceItem.open"
      @delete="handleDelete"
      @add="manualAdd.open"
    />

    <!-- 底部操作栏 -->
    <PlanActionBar
      :status="plan?.status ?? null"
      :loading="loading"
      @generate="generate()"
      @confirm="confirm()"
      @goto-prep-plan="router.push('/prep-plan')"
      @goto-shopping-list="router.push('/shopping-list')"
    />

    <!-- 替换抽屉 -->
    <ReplaceRecipeDrawer
      :visible="replaceItem.visible.value"
      :target-item="replaceItem.targetItem.value"
      @close="replaceItem.close"
      @confirm="replaceItem.replace"
    />

    <!-- 手动添加抽屉 -->
    <ManualAddDrawer
      :visible="manualAdd.visible.value"
      @close="manualAdd.close"
      @submit="manualAdd.submit"
    />
  </div>
</template>

<style scoped>
.weekly-meal-plan {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  min-height: 0;
}

.weekly-meal-plan__loading,
.weekly-meal-plan__empty {
  display: grid;
  place-items: center;
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-muted);
}

.weekly-meal-plan__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.weekly-meal-plan__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-2);
}

.weekly-meal-plan__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: var(--text-xl);
  font-weight: 700;
}

.weekly-meal-plan__empty-title {
  margin: var(--space-3) 0 0;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.weekly-meal-plan__empty-desc {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
