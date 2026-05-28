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
  </nav>
</template>

<style scoped>
.week-navigator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.week-navigator__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 1.25rem;
  cursor: pointer;
}

.week-navigator__btn:hover {
  background: #f1f5f9;
}

.week-navigator__label {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}
</style>
