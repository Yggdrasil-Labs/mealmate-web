<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'ManualAddDrawer' })

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', recipeName: string): void
}>()

const { t } = useI18n()
const recipeName = ref('')

function handleSubmit() {
  const name = recipeName.value.trim()
  if (name) {
    emit('submit', name)
    recipeName.value = ''
  }
}

function handleClose() {
  recipeName.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="manual-drawer-mask" @click.self="handleClose">
    <aside class="manual-drawer" role="dialog" :aria-label="t('mealPlan.manualAdd')">
      <header class="manual-drawer__header">
        <h3 class="manual-drawer__title">
          {{ t('mealPlan.manualAdd') }}
        </h3>
        <button type="button" class="manual-drawer__close" @click="handleClose">
          ✕
        </button>
      </header>

      <div class="manual-drawer__body">
        <label class="manual-drawer__label">
          {{ t('mealPlan.recipeName', '菜品名称') }}
        </label>
        <input
          v-model="recipeName"
          type="text"
          class="manual-drawer__input"
          :placeholder="t('mealPlan.inputRecipeName', '请输入菜品名称')"
          @keyup.enter="handleSubmit"
        >
      </div>

      <footer class="manual-drawer__footer">
        <button type="button" class="manual-drawer__btn manual-drawer__btn--cancel" @click="handleClose">
          {{ t('mealPlan.cancel', '取消') }}
        </button>
        <button
          type="button"
          class="manual-drawer__btn manual-drawer__btn--confirm"
          :disabled="!recipeName.trim()"
          @click="handleSubmit"
        >
          {{ t('mealPlan.add') }}
        </button>
      </footer>
    </aside>
  </div>
</template>

<style scoped>
.manual-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
}

.manual-drawer {
  width: 360px;
  max-width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.manual-drawer__header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.manual-drawer__title {
  margin: 0;
  font-size: 1rem;
}

.manual-drawer__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  min-width: 44px;
  min-height: var(--btn-height-lg);
}

.manual-drawer__body {
  flex: 1;
  padding: 1rem;
}

.manual-drawer__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.manual-drawer__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--btn-radius);
  font-size: 0.875rem;
}

.manual-drawer__footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.manual-drawer__btn {
  min-height: var(--btn-height-lg);
  padding: 0.5rem 1rem;
  border-radius: var(--btn-radius);
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.manual-drawer__btn--cancel {
  background: #f1f5f9;
  color: #475569;
}

.manual-drawer__btn--confirm {
  background: #0f766e;
  color: #fff;
}

.manual-drawer__btn--confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .manual-drawer {
    width: 100%;
  }
}
</style>
