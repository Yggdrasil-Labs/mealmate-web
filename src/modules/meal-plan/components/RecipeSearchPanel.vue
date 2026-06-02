<script setup lang="ts">
import type { RecipeBrief } from '../types'

import { ref } from 'vue'

defineOptions({ name: 'RecipeSearchPanel' })

defineProps<{
  results: RecipeBrief[]
  loading: boolean
  selectedId?: number
}>()

const emit = defineEmits<{
  (e: 'search', keyword: string): void
  (e: 'select', recipe: RecipeBrief): void
}>()

const keyword = ref('')

function onInput(val: string) {
  keyword.value = val
  emit('search', val)
}
</script>

<template>
  <div class="recipe-search-panel">
    <ElInput
      :model-value="keyword"
      placeholder="输入菜品名称搜索"
      clearable
      @update:model-value="onInput"
    />
    <div v-if="loading" class="recipe-search-panel__loading">
      搜索中...
    </div>
    <ElEmpty v-else-if="keyword && !results.length" description="未找到匹配菜品" />
    <div v-else class="recipe-search-panel__list">
      <div
        v-for="r in results"
        :key="r.recipeId"
        class="recipe-search-panel__item"
        :class="{ 'recipe-search-panel__item--selected': selectedId === r.recipeId }"
        @click="emit('select', r)"
      >
        <span>{{ r.name }}</span>
        <span v-if="r.seasonTag" class="recipe-search-panel__season">{{ r.seasonTag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-search-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-search-panel__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recipe-search-panel__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
}

.recipe-search-panel__item:hover {
  border-color: var(--el-color-primary-light-5);
}

.recipe-search-panel__item--selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.recipe-search-panel__season {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.recipe-search-panel__loading {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 12px;
}
</style>
