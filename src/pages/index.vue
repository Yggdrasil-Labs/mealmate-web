<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMealPlanStore } from '@/modules/meal-plan/store'

const router = useRouter()
const store = useMealPlanStore()

/** 页面加载时获取本周计划 */
onMounted(() => {
  if (!store.currentPlan)
    store.loadCurrentPlan()
})

/** 计划状态标签 */
const planStatusLabel = computed(() => {
  if (!store.currentPlan)
    return '未生成'
  const map = { DRAFT: '草稿', CONFIRMED: '已确认', ARCHIVED: '已归档' }
  return map[store.currentPlan.status] ?? store.currentPlan.status
})

/** 今天的日期字符串 yyyy-MM-dd */
const todayStr = computed(() => new Date().toISOString().slice(0, 10))

/** 今日三餐数据 */
const todayMeals = computed(() => {
  if (!store.currentPlan?.dayMeals)
    return null
  return store.currentPlan.dayMeals[todayStr.value] ?? null
})

/** 本周计划菜品总数 */
const totalItems = computed(() => {
  if (!store.currentPlan?.dayMeals)
    return 0
  let count = 0
  for (const day of Object.values(store.currentPlan.dayMeals)) {
    count += day.breakfast.length + day.lunch.length + day.dinner.length
  }
  return count
})

/** 快捷入口 */
const shortcuts = [
  { icon: '📅', title: '周计划', desc: '管理本周三餐安排', path: '/weekly-meal-plan', color: 'var(--color-primary)', bg: 'var(--color-primary-soft)' },
  { icon: '🍳', title: '菜品库', desc: '浏览和管理菜品', path: '/recipes', color: 'var(--color-success)', bg: 'var(--color-success-soft)' },
  { icon: '👪', title: '家庭画像', desc: '成员和饮食偏好', path: '/family/profile', color: 'var(--color-warning)', bg: 'var(--color-warning-soft)' },
  { icon: '🛒', title: '采购清单', desc: '本周采购食材', path: '/shopping-list', color: 'var(--color-info)', bg: 'var(--color-info-soft)' },
  { icon: '🥘', title: '备菜计划', desc: '备菜任务和进度', path: '/prep-plan', color: 'var(--color-success)', bg: 'var(--color-success-soft)' },
]

const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' } as const
</script>

<template>
  <div class="home-dashboard">
    <header class="home-dashboard__header">
      <h1 class="home-dashboard__title">
        MealMate
      </h1>
      <p class="home-dashboard__subtitle">
        家庭饮食规划助手
      </p>
    </header>

    <!-- 本周概览统计 -->
    <div class="home-dashboard__summary">
      <div class="home-dashboard__stat">
        <span class="home-dashboard__stat-value home-dashboard__stat-value--status">{{ planStatusLabel }}</span>
        <span class="home-dashboard__stat-label">本周计划</span>
      </div>
      <div class="home-dashboard__stat">
        <span class="home-dashboard__stat-value home-dashboard__stat-value--number">{{ totalItems }}</span>
        <span class="home-dashboard__stat-label">安排菜品</span>
      </div>
    </div>

    <!-- 今日三餐 -->
    <section v-if="todayMeals" class="today-meals">
      <h2 class="today-meals__title">
        今日三餐
      </h2>
      <div class="today-meals__grid">
        <div
          v-for="mealKey in (['breakfast', 'lunch', 'dinner'] as const)"
          :key="mealKey"
          class="today-meals__slot"
        >
          <h3 class="today-meals__meal-label">
            {{ mealLabels[mealKey] }}
          </h3>
          <ul v-if="todayMeals[mealKey].length" class="today-meals__list">
            <li v-for="item in todayMeals[mealKey]" :key="item.itemId" class="today-meals__item">
              <span class="today-meals__recipe-name">{{ item.recipeName }}</span>
              <span v-if="item.isBabyMeal" class="today-meals__tag today-meals__tag--baby">宝</span>
              <span v-if="item.isWeightLoss" class="today-meals__tag today-meals__tag--diet">轻</span>
            </li>
          </ul>
          <span v-else class="today-meals__empty">暂无安排</span>
        </div>
      </div>
    </section>

    <!-- 无计划时提示 -->
    <section v-else-if="!store.loading" class="today-meals today-meals--empty">
      <span class="today-meals__empty-icon" aria-hidden="true">📋</span>
      <p class="today-meals__hint">
        本周暂无计划
      </p>
      <button type="button" class="today-meals__cta" @click="router.push('/weekly-meal-plan')">
        去生成周计划
      </button>
    </section>

    <!-- 快捷入口 -->
    <nav class="home-dashboard__grid" aria-label="快捷入口">
      <button
        v-for="item in shortcuts"
        :key="item.path"
        type="button"
        class="home-dashboard__card"
        :style="{ 'borderLeft': `3px solid ${item.color}`, '--_card-color': item.bg }"
        @click="router.push(item.path)"
      >
        <span class="home-dashboard__card-icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="home-dashboard__card-title">{{ item.title }}</span>
        <span class="home-dashboard__card-desc">{{ item.desc }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.home-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-4);
  min-height: 100%;
}

.home-dashboard__header {
  text-align: center;
}

.home-dashboard__title {
  margin: 0;
  font-size: var(--text-2xl);
  color: var(--color-text);
}

.home-dashboard__subtitle {
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.home-dashboard__summary {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.home-dashboard__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.home-dashboard__stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.home-dashboard__stat-value--status {
  color: var(--color-primary);
}

.home-dashboard__stat-value--number {
  color: var(--color-success);
}

.home-dashboard__stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 今日三餐 */
.today-meals {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.today-meals__title {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.today-meals__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.today-meals__slot {
  padding: var(--space-3);
  border: var(--card-border);
  border-radius: var(--card-radius);
  background: var(--color-surface);
}

.today-meals__meal-label {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.today-meals__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.today-meals__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.today-meals__recipe-name {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.today-meals__tag {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
}

.today-meals__tag--baby {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.today-meals__tag--diet {
  background: var(--color-info-soft);
  color: var(--color-info);
}

.today-meals__empty {
  font-size: var(--text-sm);
  color: var(--color-text-soft);
}

.today-meals--empty {
  text-align: center;
  padding: var(--space-6) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.today-meals__empty-icon {
  font-size: 3rem;
}

.today-meals__hint {
  color: var(--color-text-muted);
  margin: 0;
}

.today-meals__cta {
  padding: var(--space-2) var(--space-5);
  border: none;
  border-radius: var(--btn-radius-pill);
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.today-meals__cta:hover {
  opacity: 0.85;
}

.today-meals__cta:active {
  transform: scale(0.96);
}

.today-meals__cta:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 快捷入口 */
.home-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-3);
}

.home-dashboard__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-4);
  border: var(--card-border);
  border-radius: var(--card-radius);
  background: var(--color-surface);
  box-shadow: var(--card-shadow);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.home-dashboard__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.home-dashboard__card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.home-dashboard__card:active {
  transform: scale(0.98);
}

.home-dashboard__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--_card-color, var(--color-primary-soft));
  color: var(--color-text);
  font-size: var(--text-base);
  font-weight: 700;
}

.home-dashboard__card-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.home-dashboard__card-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .today-meals__grid {
    grid-template-columns: 1fr;
  }

  .home-dashboard__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
