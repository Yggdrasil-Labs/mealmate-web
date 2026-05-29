<script setup lang="ts">
import type { MealPlanItem } from '../types'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'ReplaceRecipeDrawer' })

defineProps<{
  visible: boolean
  targetItem: MealPlanItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', recipeId: number): void
}>()

const { t } = useI18n()
const searchQuery = ref('')
const selectedRecipeId = ref<number | null>(null)

function handleConfirm() {
  if (selectedRecipeId.value != null)
    emit('confirm', selectedRecipeId.value)
}

function handleClose() {
  searchQuery.value = ''
  selectedRecipeId.value = null
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="replace-drawer-mask" @click.self="handleClose">
      <aside class="replace-drawer" role="dialog" :aria-label="t('mealPlan.replace')">
        <header class="replace-drawer__header">
          <h3 class="replace-drawer__title">
            {{ t('mealPlan.replace') }}
          </h3>
          <span v-if="targetItem" class="replace-drawer__subtitle">
            {{ targetItem.recipeName }}
          </span>
          <button type="button" class="replace-drawer__close" @click="handleClose">
            ✕
          </button>
        </header>

        <div class="replace-drawer__search">
          <input
            v-model="searchQuery"
            type="search"
            class="replace-drawer__input"
            :placeholder="t('mealPlan.searchRecipe', '搜索菜品...')"
          >
        </div>

        <div class="replace-drawer__body">
          <!-- 候选菜品列表占位，后续接入菜品搜索 API -->
          <p class="replace-drawer__placeholder">
            {{ t('mealPlan.searchHint', '输入关键词搜索候选菜品') }}
          </p>
        </div>

        <footer class="replace-drawer__footer">
          <button type="button" class="replace-drawer__btn replace-drawer__btn--cancel" @click="handleClose">
            {{ t('mealPlan.cancel', '取消') }}
          </button>
          <button
            type="button"
            class="replace-drawer__btn replace-drawer__btn--confirm"
            :disabled="selectedRecipeId == null"
            @click="handleConfirm"
          >
            {{ t('mealPlan.confirmReplace', '确认替换') }}
          </button>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.replace-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
}

.replace-drawer {
  width: 400px;
  max-width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.replace-drawer__header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.replace-drawer__title {
  margin: 0;
  font-size: 1rem;
}

.replace-drawer__subtitle {
  font-size: 0.85rem;
  color: #64748b;
}

.replace-drawer__close {
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

.replace-drawer__search {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.replace-drawer__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--btn-radius);
  font-size: 0.875rem;
}

.replace-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.replace-drawer__placeholder {
  color: #94a3b8;
  text-align: center;
  margin-top: 2rem;
}

.replace-drawer__footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.replace-drawer__btn {
  min-height: var(--btn-height-lg);
  padding: 0.5rem 1rem;
  border-radius: var(--btn-radius);
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.replace-drawer__btn--cancel {
  background: #f1f5f9;
  color: #475569;
}

.replace-drawer__btn--confirm {
  background: #0f766e;
  color: #fff;
}

.replace-drawer__btn--confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端全屏 */
@media (max-width: 768px) {
  .replace-drawer {
    width: 100%;
  }
}
</style>
