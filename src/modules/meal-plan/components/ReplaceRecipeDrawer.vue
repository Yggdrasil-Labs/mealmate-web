<script setup lang="ts">
import type { MealPlanItem } from '../types'
import type { RecipeSummary } from '@/modules/recipe/types'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchRecipePage } from '@/modules/recipe/api'

defineOptions({ name: 'ReplaceRecipeDrawer' })

const props = defineProps<{
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
const candidates = ref<RecipeSummary[]>([])
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function search(keyword: string) {
  loading.value = true
  try {
    const result = await fetchRecipePage({ keyword, pageNum: 1, pageSize: 20 })
    candidates.value = result.list
  }
  catch {
    candidates.value = []
  }
  finally {
    loading.value = false
  }
}

watch(searchQuery, (val) => {
  if (debounceTimer)
    clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => search(val.trim()), 300)
})

// 抽屉打开时加载全部菜品
watch(() => props.visible, (val) => {
  if (val) {
    search('')
  }
})

function selectRecipe(id: number) {
  selectedRecipeId.value = id
}

function handleConfirm() {
  if (selectedRecipeId.value != null)
    emit('confirm', selectedRecipeId.value)
}

function handleClose() {
  searchQuery.value = ''
  selectedRecipeId.value = null
  candidates.value = []
  emit('close')
}
</script>

<template>
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
        <p v-if="loading" class="replace-drawer__placeholder">
          搜索中...
        </p>
        <ul v-else-if="candidates.length > 0" class="replace-drawer__list">
          <li
            v-for="recipe in candidates"
            :key="recipe.recipeId"
            class="replace-drawer__item"
            :class="{ 'is-selected': selectedRecipeId === Number(recipe.recipeId) }"
            @click="selectRecipe(Number(recipe.recipeId))"
          >
            <span class="replace-drawer__item-name">{{ recipe.name }}</span>
            <span class="replace-drawer__item-meta">{{ recipe.cookingTimeMin }}min</span>
          </li>
        </ul>
        <p v-else class="replace-drawer__placeholder">
          未找到匹配菜品
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

.replace-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.replace-drawer__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.replace-drawer__item:hover {
  background: var(--color-surface-muted);
}

.replace-drawer__item.is-selected {
  background: var(--color-primary-soft);
  outline: 2px solid var(--color-primary);
}

.replace-drawer__item-name {
  font-weight: 500;
  color: var(--color-text);
}

.replace-drawer__item-meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
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
