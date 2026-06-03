<script setup lang="ts">
import type { AdjustReason, MealPlanItem, RecipeBrief } from '../types'

import { ref, watch } from 'vue'

import { useAdjustMealItem } from '../composables/useAdjustMealItem'
import RecipeSearchPanel from './RecipeSearchPanel.vue'

defineOptions({ name: 'AdjustMealDrawer' })

const props = defineProps<{
  visible: boolean
  planId: number
  itemId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'adjusted', item: MealPlanItem): void
}>()

const {
  recommendList,
  searchResults,
  recommendLoading,
  searchLoading,
  adjustLoading,
  openAdjust,
  doSearch,
  confirmAdjust,
} = useAdjustMealItem()

const activeTab = ref('recommend')
const selectedRecipe = ref<RecipeBrief | null>(null)
const adjustReason = ref<AdjustReason | undefined>(undefined)

/** 打开时重置状态并加载推荐列表 */
watch(() => props.visible, (v) => {
  if (v) {
    selectedRecipe.value = null
    adjustReason.value = undefined
    activeTab.value = 'recommend'
    openAdjust(props.planId, props.itemId)
  }
})

function selectRecipe(recipe: RecipeBrief) {
  selectedRecipe.value = recipe
}

/** 确认替换后通知父组件并关闭 */
async function handleConfirm() {
  if (!selectedRecipe.value)
    return
  const updated = await confirmAdjust(selectedRecipe.value.recipeId, adjustReason.value)
  if (updated) {
    emit('adjusted', updated)
    emit('close')
  }
}

const reasonOptions = [
  { value: 'LACK_INGREDIENT', label: '食材缺货' },
  { value: 'TASTE_CHANGE', label: '口味变化' },
  { value: 'OUTING', label: '外出就餐' },
  { value: 'OTHER', label: '其他' },
]
</script>

<template>
  <ElDrawer
    :model-value="visible"
    title="调整菜品"
    direction="rtl"
    size="400px"
    @close="emit('close')"
  >
    <ElTabs v-model="activeTab">
      <ElTabPane label="推荐" name="recommend">
        <div v-if="recommendLoading" class="adjust-drawer__loading">
          加载中...
        </div>
        <ElEmpty v-else-if="!recommendList.length" description="暂无推荐，请手动搜索" />
        <div v-else class="adjust-drawer__list">
          <div
            v-for="r in recommendList"
            :key="r.recipeId"
            class="adjust-drawer__item"
            :class="{ 'adjust-drawer__item--selected': selectedRecipe?.recipeId === r.recipeId }"
            @click="selectRecipe(r)"
          >
            <span>{{ r.name }}</span>
            <span v-if="r.cookTimeMinutes" class="adjust-drawer__time">{{ r.cookTimeMinutes }}分钟</span>
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="搜索" name="search">
        <RecipeSearchPanel
          :results="searchResults"
          :loading="searchLoading"
          :selected-id="selectedRecipe?.recipeId"
          @search="doSearch"
          @select="selectRecipe"
        />
      </ElTabPane>
    </ElTabs>

    <!-- 底部确认条：选中菜品后显示 -->
    <div v-if="selectedRecipe" class="adjust-drawer__confirm">
      <span class="adjust-drawer__selected-name">{{ selectedRecipe.name }}</span>
      <ElSelect v-model="adjustReason" placeholder="原因(可选)" clearable size="small" style="width: 120px">
        <ElOption v-for="o in reasonOptions" :key="o.value" :label="o.label" :value="o.value" />
      </ElSelect>
      <ElButton type="primary" size="small" :loading="adjustLoading" @click="handleConfirm">
        确认替换
      </ElButton>
    </div>
  </ElDrawer>
</template>

<style scoped>
.adjust-drawer__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.adjust-drawer__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.adjust-drawer__item:hover {
  border-color: var(--el-color-primary-light-5);
}

.adjust-drawer__item--selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.adjust-drawer__time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.adjust-drawer__confirm {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.adjust-drawer__selected-name {
  flex: 1;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.adjust-drawer__loading {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-secondary);
}
</style>
