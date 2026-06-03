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

    <!-- DRAFT：确认按钮 + 重新生成 -->
    <template v-else-if="status === 'DRAFT'">
      <button
        type="button"
        class="plan-action-bar__btn plan-action-bar__btn--secondary"
        :disabled="loading"
        @click="emit('generate')"
      >
        {{ t('mealPlan.generate') }}
      </button>
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
  padding: var(--space-3) var(--space-4);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-strong);
  display: flex;
  gap: var(--space-2);
  justify-content: center;
}

.plan-action-bar__btn {
  min-height: var(--btn-height-lg);
  padding: var(--space-2) var(--space-6);
  border: none;
  border-radius: var(--btn-radius);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
}

.plan-action-bar__btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.plan-action-bar__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.plan-action-bar__btn--secondary {
  background: var(--color-surface-muted);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
