<script setup lang="ts">
import type { DayMeal, MealPlanItem } from '../types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MEAL_TYPE } from '../constants'
import MealItemCard from './MealItemCard.vue'

defineOptions({ name: 'WeekCalendarGrid' })

const props = defineProps<{
  dayMeals: Record<string, DayMeal>
  weekStartDate: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'replace', item: MealPlanItem): void
  (e: 'delete', item: MealPlanItem): void
  (e: 'add', date: string, mealType: string): void
}>()

const { t } = useI18n()

/** 生成当前周 7 天日期列表 */
const weekDays = computed(() => {
  const days: string[] = []
  if (!props.weekStartDate)
    return days
  const start = new Date(props.weekStartDate)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
})

const mealTypes = [
  { key: MEAL_TYPE.BREAKFAST, label: () => t('mealPlan.mealType.breakfast') },
  { key: MEAL_TYPE.LUNCH, label: () => t('mealPlan.mealType.lunch') },
  { key: MEAL_TYPE.DINNER, label: () => t('mealPlan.mealType.dinner') },
]

/** 获取某天某餐的菜品列表 */
function getItems(date: string, mealType: string): MealPlanItem[] {
  const day = props.dayMeals[date]
  if (!day)
    return []
  const key = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner'
  return day[key] ?? []
}

/** 判断日期是否为今天 */
function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10)
}

/** 格式化日期为短标签（周几 + 日期） */
function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const weekDayNames = ['日', '一', '二', '三', '四', '五', '六']
  return `周${weekDayNames[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<template>
  <div class="week-grid">
    <!-- 桌面端: 7列×3行网格 -->
    <div class="week-grid__desktop">
      <!-- 表头: 日期 -->
      <div class="week-grid__header" />
      <div v-for="date in weekDays" :key="`h-${date}`" class="week-grid__header">
        {{ formatDayLabel(date) }}
      </div>

      <!-- 每个餐次一行 -->
      <template v-for="meal in mealTypes" :key="meal.key">
        <div class="week-grid__meal-label">
          {{ meal.label() }}
        </div>
        <div
          v-for="date in weekDays"
          :key="`${meal.key}-${date}`"
          class="week-grid__cell"
          :class="{ 'is-today': isToday(date) }"
        >
          <MealItemCard
            v-for="item in getItems(date, meal.key)"
            :key="item.itemId"
            :item="item"
            :readonly="readonly"
            @replace="emit('replace', $event)"
            @delete="emit('delete', $event)"
          />
          <button
            v-if="!readonly"
            type="button"
            class="week-grid__add-btn"
            @click="emit('add', date, meal.key)"
          >
            + {{ t('mealPlan.add') }}
          </button>
        </div>
      </template>
    </div>

    <!-- 移动端: 单日视图 -->
    <div class="week-grid__mobile">
      <div v-for="date in weekDays" :key="`m-${date}`" class="week-grid__day-section">
        <h3 class="week-grid__day-title">
          {{ formatDayLabel(date) }}
        </h3>
        <div v-for="meal in mealTypes" :key="`m-${meal.key}-${date}`" class="week-grid__meal-section">
          <h4 class="week-grid__meal-title">
            {{ meal.label() }}
          </h4>
          <MealItemCard
            v-for="item in getItems(date, meal.key)"
            :key="item.itemId"
            :item="item"
            :readonly="readonly"
            @replace="emit('replace', $event)"
            @delete="emit('delete', $event)"
          />
          <button
            v-if="!readonly"
            type="button"
            class="week-grid__add-btn"
            @click="emit('add', date, meal.key)"
          >
            + {{ t('mealPlan.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-grid {
  overflow-x: auto;
}

.week-grid__desktop {
  display: grid;
  grid-template-columns: 4rem repeat(7, minmax(120px, 1fr));
  gap: 1px;
  min-width: 900px;
  background: var(--color-border-strong);
  border-radius: var(--btn-radius);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.week-grid__mobile {
  display: none;
}

.week-grid__header {
  padding: var(--space-2);
  background: var(--color-surface-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  text-align: center;
  color: var(--color-text-secondary);
  border-bottom: 2px solid var(--color-border-strong);
}

.week-grid__meal-label {
  padding: var(--space-2);
  background: var(--color-surface-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.week-grid__cell {
  background: var(--color-surface);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 64px;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.week-grid__cell:hover {
  background: var(--color-surface-muted);
}

.week-grid__add-btn {
  min-height: 22px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-soft);
  font-size: 11px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.week-grid__add-btn:hover {
  background: var(--color-surface-muted);
}

.week-grid__add-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.week-grid__header.is-today {
  color: var(--color-primary);
  font-weight: 700;
  border-bottom-color: var(--color-primary);
}

.week-grid__cell.is-today {
  background: var(--color-primary-soft);
}

@media (min-width: 769px) and (max-width: 1024px) {
  .week-grid__desktop {
    grid-template-columns: 4rem repeat(7, 1fr);
    font-size: var(--text-xs);
  }

  .week-grid__cell {
    padding: var(--space-1);
    min-height: 64px;
  }

  .week-grid__header,
  .week-grid__meal-label {
    padding: var(--space-1);
    font-size: 0.7rem;
  }
}

/* 移动端切换 */
@media (max-width: 768px) {
  .week-grid__desktop {
    display: none;
  }

  .week-grid__mobile {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .week-grid__day-section {
    border: var(--card-border);
    border-radius: var(--btn-radius);
    padding: var(--space-3);
  }

  .week-grid__day-title {
    margin: 0 0 var(--space-2);
    font-size: var(--text-base);
    color: var(--color-text);
  }

  .week-grid__meal-section {
    margin-bottom: var(--space-2);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .week-grid__meal-title {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }
}
</style>
