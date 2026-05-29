<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useMealPlanStore } from '@/modules/meal-plan/store'
import PrepTaskList from '@/modules/prep/components/PrepTaskList.vue'
import { usePrepPlan } from '@/modules/prep/composables/usePrepPlan'

const { t } = useI18n()
const router = useRouter()
const store = useMealPlanStore()
const { prepPlan, loading, load, toggleItemStatus } = usePrepPlan(() => store.currentPlan?.planId)

onMounted(() => load())
</script>

<template>
  <div class="prep-plan-page">
    <PageHeader :title="t('mealPlan.prepPlan')" />

    <div v-if="loading" class="prep-plan-page__skeleton">
      <div v-for="i in 5" :key="i" class="skeleton" style="height: 48px;" />
    </div>

    <!-- 无计划时引导 -->
    <div v-else-if="!store.currentPlan?.planId" class="prep-plan-page__empty">
      <span class="prep-plan-page__empty-icon" aria-hidden="true">🥗</span>
      <h2 class="prep-plan-page__empty-title">
        暂无备菜计划
      </h2>
      <p class="prep-plan-page__empty-desc">
        暂无已确认的计划，请先前往周计划页面确认计划。
      </p>
      <button type="button" class="prep-plan-page__btn" @click="router.push('/weekly-meal-plan')">
        前往周计划
      </button>
    </div>

    <PrepTaskList
      v-else
      :items="prepPlan?.items ?? []"
      @toggle="toggleItemStatus"
    />
  </div>
</template>

<style scoped>
.prep-plan-page {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.prep-plan-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.prep-plan-page__empty {
  padding: var(--space-12) var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
  gap: var(--space-2);
}

.prep-plan-page__empty-icon {
  font-size: 3rem;
}

.prep-plan-page__empty-title {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.prep-plan-page__empty-desc {
  margin: 0;
  color: var(--color-text-muted);
}

.prep-plan-page__btn {
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

.prep-plan-page__btn:hover {
  background: var(--color-primary-soft);
}

.prep-plan-page__btn:active {
  transform: scale(0.97);
}

.prep-plan-page__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
