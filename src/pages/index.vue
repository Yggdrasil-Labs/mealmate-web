<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/** 快捷入口定义 */
const shortcuts = [
  {
    icon: '计',
    title: '周计划',
    description: '查看和管理本周三餐安排',
    path: '/weekly-meal-plan',
    color: 'var(--color-primary)',
    bg: 'var(--color-primary-soft)',
  },
  {
    icon: '菜',
    title: '菜品库',
    description: '浏览和管理所有菜品',
    path: '/recipes',
    color: 'var(--color-success)',
    bg: 'var(--color-success-soft)',
  },
  {
    icon: '家',
    title: '家庭画像',
    description: '管理家庭成员和饮食偏好',
    path: '/family/profile',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-soft)',
  },
  {
    icon: '购',
    title: '采购清单',
    description: '查看本周需要采购的食材',
    path: '/shopping-list',
    color: 'var(--color-info)',
    bg: 'var(--color-info-soft)',
  },
  {
    icon: '备',
    title: '备菜计划',
    description: '查看备菜任务和进度',
    path: '/prep-plan',
    color: 'var(--color-success)',
    bg: 'var(--color-success-soft)',
  },
]
</script>

<template>
  <div class="home-dashboard">
    <header class="home-dashboard__header">
      <h1 class="home-dashboard__title">
        欢迎使用 MealMate
      </h1>
      <p class="home-dashboard__subtitle">
        家庭饮食规划助手，从这里开始管理您的一周三餐。
      </p>
    </header>

    <div class="home-dashboard__summary">
      <div class="home-dashboard__stat">
        <span class="home-dashboard__stat-value">—</span>
        <span class="home-dashboard__stat-label">本周计划</span>
      </div>
      <div class="home-dashboard__stat">
        <span class="home-dashboard__stat-value">—</span>
        <span class="home-dashboard__stat-label">待采购项</span>
      </div>
      <div class="home-dashboard__stat">
        <span class="home-dashboard__stat-value">—</span>
        <span class="home-dashboard__stat-label">备菜任务</span>
      </div>
    </div>

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
        <span class="home-dashboard__card-desc">{{ item.description }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.home-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-4);
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
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
}

.home-dashboard__summary {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.home-dashboard__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.home-dashboard__stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.home-dashboard__stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.home-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.home-dashboard__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-6);
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
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--_card-color, var(--color-primary-soft));
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 700;
}

.home-dashboard__card-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.home-dashboard__card-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .home-dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
