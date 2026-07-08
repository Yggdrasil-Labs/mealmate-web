<script setup lang="ts">
import type { AiMealPlanResult } from '@/modules/meal-plan/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { aiGeneratePlan } from '@/modules/meal-plan/api'
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

const { plan, loading, isConfirmed, selectedWeekStart, navigateWeek, goToday, generate, confirm } = useWeeklyPlan()
const replaceItem = useReplaceItem()
const manualAdd = useManualAdd()

// ─── AI 生成状态 ───
const aiGenerating = ref(false)
const reasoning = ref<Record<string, string>>({})
const showFallbackTip = ref(false)

/**
 * AI 生成周计划：弹出指令输入框 → 调用 API → 刷新计划 + 展示 reasoning。
 * LLM 不可用时 API 返回 fallback=true，前端显示降级提示。
 */
async function handleAiGenerate() {
  try {
    const { value: userHint } = await ElMessageBox.prompt(
      '输入本周饮食偏好（可选，如"这周想吃清淡的川菜"）',
      'AI 生成周计划',
      {
        confirmButtonText: '生成',
        cancelButtonText: '取消',
        inputPlaceholder: '留空则根据家庭情况自动搭配',
      },
    )

    aiGenerating.value = true
    showFallbackTip.value = false
    reasoning.value = {}

    const result: AiMealPlanResult = await aiGeneratePlan({
      familyId: 1, // TODO: 从用户上下文获取
      weekStartDate: selectedWeekStart.value,
      userHint: userHint || undefined,
    })

    // 刷新计划数据
    if (plan.value) {
      plan.value.planId = result.planId
      plan.value.weekStartDate = result.weekStartDate
      plan.value.weekEndDate = result.weekEndDate
      plan.value.status = result.status
      plan.value.dayMeals = result.dayMeals
    }

    // 存储 reasoning
    reasoning.value = result.reasoning || {}

    // fallback 提示
    if (result.fallback) {
      showFallbackTip.value = true
      ElMessage.warning('AI 暂不可用，已使用规则引擎生成')
    }
    else {
      ElMessage.success('AI 周计划生成成功')
    }
  }
  catch (e: any) {
    if (e === 'cancel' || e?.message === 'cancel')
      return
    ElMessage.error(e?.message || 'AI 生成失败')
  }
  finally {
    aiGenerating.value = false
  }
}

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
        <el-button
          type="primary"
          :loading="aiGenerating"
          :disabled="isConfirmed"
          @click="handleAiGenerate"
        >
          ✨ AI 生成
        </el-button>
        <WeekNavigator
          :week-start-date="selectedWeekStart"
          @prev="navigateWeek(-1)"
          @next="navigateWeek(1)"
          @today="goToday"
        />
      </template>
    </PageHeader>

    <!-- AI fallback 提示 -->
    <el-alert
      v-if="showFallbackTip"
      title="AI 暂不可用，已使用规则引擎生成"
      type="warning"
      show-icon
      closable
      @close="showFallbackTip = false"
    />

    <!-- 加载态：骨架屏 -->
    <div v-if="loading" class="weekly-meal-plan__skeleton">
      <div class="skeleton" style="height: 32px; width: 120px;" />
      <div class="weekly-meal-plan__skeleton-grid">
        <div v-for="i in 7" :key="i" class="skeleton" style="height: 80px;" />
      </div>
    </div>

    <!-- 空态 -->
    <div v-else-if="!plan" class="weekly-meal-plan__empty">
      <span class="weekly-meal-plan__empty-icon" aria-hidden="true">📋</span>
      <h2 class="weekly-meal-plan__empty-title">
        暂无本周计划
      </h2>
      <p class="weekly-meal-plan__empty-desc">
        {{ t('mealPlan.emptyHint', '当前周暂无计划，点击下方按钮生成') }}
      </p>
      <p class="weekly-meal-plan__empty-sub">
        {{ t('mealPlan.emptySubHint', '生成后可调整每日三餐安排') }}
      </p>
    </div>

    <!-- 网格 -->
    <WeekCalendarGrid
      v-else
      :day-meals="plan.dayMeals"
      :week-start-date="plan.weekStartDate"
      :readonly="isConfirmed"
      @adjust="replaceItem.open"
      @delete="handleDelete"
      @add="manualAdd.open"
    />

    <!-- AI 推荐理由 -->
    <div v-if="Object.keys(reasoning).length > 0" class="weekly-meal-plan__reasoning">
      <h3 class="weekly-meal-plan__reasoning-title">
        📝 每日推荐理由
      </h3>
      <div v-for="(reason, date) in reasoning" :key="date" class="weekly-meal-plan__reasoning-item">
        <span class="weekly-meal-plan__reasoning-date">{{ date }}</span>
        <span class="weekly-meal-plan__reasoning-text">{{ reason }}</span>
      </div>
    </div>

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

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-muted) 25%,
    var(--color-border) 50%,
    var(--color-surface-muted) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--card-radius);
  animation: skeleton-breathe 1.5s ease-in-out infinite;
}

@keyframes skeleton-breathe {
  0%,
  100% {
    background-position: 200% 0;
  }
  50% {
    background-position: -200% 0;
  }
}

.weekly-meal-plan__empty-icon {
  font-size: 3rem;
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

.weekly-meal-plan__empty-sub {
  margin: var(--space-1) 0 0;
  color: var(--color-text-soft);
  font-size: var(--text-xs);
  text-align: center;
}

.weekly-meal-plan__reasoning {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--color-surface-muted);
  border-radius: var(--card-radius);
}

.weekly-meal-plan__reasoning-title {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.weekly-meal-plan__reasoning-item {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-1) 0;
  font-size: var(--text-xs);
  line-height: 1.5;
}

.weekly-meal-plan__reasoning-date {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-weight: 500;
  min-width: 5.5em;
}

.weekly-meal-plan__reasoning-text {
  color: var(--color-text);
}
</style>
