<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
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
    <h1 class="prep-plan-page__title">
      {{ t('mealPlan.prepPlan') }}
    </h1>

    <div v-if="loading" class="prep-plan-page__loading">
      加载中...
    </div>

    <!-- 无计划时引导 -->
    <div v-else-if="!store.currentPlan?.planId" class="prep-plan-page__empty">
      <p>暂无已确认的计划，请先前往周计划页面确认计划。</p>
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prep-plan-page__title {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.prep-plan-page__loading {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.prep-plan-page__empty {
  padding: 3rem 1rem;
  text-align: center;
  color: #64748b;
}

.prep-plan-page__btn {
  margin-top: 0.75rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: #fff;
  color: #0f766e;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
