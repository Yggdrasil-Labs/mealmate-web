<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'WeekNavigator' })

const props = defineProps<{
  weekStartDate: string
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
}>()

const { t } = useI18n()

/** 格式化周范围显示文本 */
const weekLabel = computed(() => {
  if (!props.weekStartDate)
    return ''
  const start = new Date(props.weekStartDate)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(start)} - ${fmt(end)}`
})

/** 判断当前是否已在本周 */
const isCurrentWeek = computed(() => {
  if (!props.weekStartDate)
    return true
  const now = new Date()
  const day = now.getDay()
  const offset = day === 0 ? -6 : 1 - day
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
  return props.weekStartDate === monday.toISOString().slice(0, 10)
})
</script>

<template>
  <nav class="week-navigator" aria-label="周选择器">
    <button
      type="button"
      class="week-navigator__btn"
      :aria-label="t('mealPlan.prevWeek', '上一周')"
      @click="emit('prev')"
    >
      ‹
    </button>
    <span class="week-navigator__label">{{ weekLabel }}</span>
    <button
      type="button"
      class="week-navigator__btn"
      :aria-label="t('mealPlan.nextWeek', '下一周')"
      @click="emit('next')"
    >
      ›
    </button>
    <button
      v-if="!isCurrentWeek"
      type="button"
      class="week-navigator__btn week-navigator__btn--today"
      @click="emit('today')"
    >
      {{ t('mealPlan.today', '本周') }}
    </button>
  </nav>
</template>

<style scoped>
.week-navigator {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.week-navigator__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: var(--btn-height-md);
  border: var(--card-border);
  border-radius: var(--btn-radius);
  background: var(--color-surface);
  font-size: var(--text-lg);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.week-navigator__btn:hover {
  background: var(--color-surface-muted);
}

.week-navigator__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.week-navigator__label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.week-navigator__btn--today {
  font-size: var(--text-xs);
  padding: 0 var(--space-2);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
