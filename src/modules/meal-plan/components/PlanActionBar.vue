<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'PlanActionBar' })

defineProps<{
  status: 'DRAFT' | 'CONFIRMED' | 'ARCHIVED' | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'generate'): void
  (e: 'confirm'): void
  (e: 'gotoPrepPlan'): void
  (e: 'gotoShoppingList'): void
}>()

const { t } = useI18n()
</script>

<template>
  <footer class="plan-action-bar">
    <!-- 无计划：生成按钮 -->
    <template v-if="!status">
      <button
        type="button"
        class="plan-action-bar__btn plan-action-bar__btn--primary"
        :disabled="loading"
        @click="emit('generate')"
      >
        {{ t('mealPlan.generate') }}
      </button>
    </template>

    <!-- DRAFT：确认按钮 -->
    <template v-else-if="status === 'DRAFT'">
      <button
        type="button"
        class="plan-action-bar__btn plan-action-bar__btn--primary"
        :disabled="loading"
        @click="emit('confirm')"
      >
        {{ t('mealPlan.confirm') }}
      </button>
    </template>

    <!-- CONFIRMED：跳转备菜/采购 -->
    <template v-else-if="status === 'CONFIRMED'">
      <button
        type="button"
        class="plan-action-bar__btn plan-action-bar__btn--secondary"
        @click="emit('gotoPrepPlan')"
      >
        {{ t('mealPlan.prepPlan') }}
      </button>
      <button
        type="button"
        class="plan-action-bar__btn plan-action-bar__btn--secondary"
        @click="emit('gotoShoppingList')"
      >
        {{ t('mealPlan.shoppingList') }}
      </button>
    </template>
  </footer>
</template>

<style scoped>
.plan-action-bar {
  position: sticky;
  bottom: 0;
  padding: 0.75rem 1rem;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.plan-action-bar__btn {
  min-height: 44px;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.plan-action-bar__btn--primary {
  background: #0f766e;
  color: #fff;
}

.plan-action-bar__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.plan-action-bar__btn--secondary {
  background: #f1f5f9;
  color: #0f766e;
  border: 1px solid #0f766e;
}
</style>
