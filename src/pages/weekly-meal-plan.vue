<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
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
    <header class="weekly-meal-plan__header">
      <h1 class="weekly-meal-plan__title">
        {{ t('mealPlan.title') }}
      </h1>
      <WeekNavigator
        :week-start-date="selectedWeekStart"
        @prev="navigateWeek(-1)"
        @next="navigateWeek(1)"
      />
    </header>

    <!-- 加载态 -->
    <div v-if="loading" class="weekly-meal-plan__loading">
      加载中...
    </div>

    <!-- 空态 -->
    <div v-else-if="!plan" class="weekly-meal-plan__empty">
      <p>{{ t('mealPlan.emptyHint', '当前周暂无计划，点击下方按钮生成') }}</p>
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
  gap: 1rem;
  padding: 1rem;
  min-height: 0;
}

.weekly-meal-plan__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.weekly-meal-plan__title {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.weekly-meal-plan__loading,
.weekly-meal-plan__empty {
  display: grid;
  place-items: center;
  padding: 3rem 1rem;
  color: #64748b;
}
</style>
