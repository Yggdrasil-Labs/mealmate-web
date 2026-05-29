<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { deleteRecipe } from '@/modules/recipe/api'
import RecipeDeleteDialog from '@/modules/recipe/components/RecipeDeleteDialog.vue'
import RecipeDetailDrawer from '@/modules/recipe/components/RecipeDetailDrawer.vue'
import RecipeFilterBar from '@/modules/recipe/components/RecipeFilterBar.vue'
import RecipeFormDrawer from '@/modules/recipe/components/RecipeFormDrawer.vue'
import RecipeGrid from '@/modules/recipe/components/RecipeGrid.vue'
import { useRecipeList } from '@/modules/recipe/composables/useRecipeList'

/**
 * RecipeLibrary 页面
 *
 * 菜品库主页面，集成筛选、列表、详情、编辑和删除功能。
 */

const list = useRecipeList()

const detailDrawerVisible = ref(false)
const detailRecipeId = ref('')

const formDrawerVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const formRecipeId = ref<string | undefined>(undefined)

const deleteDialogVisible = ref(false)
const deleteRecipeId = ref('')
const deleteRecipeName = ref('')

function handleView(recipeId: string) {
  detailRecipeId.value = recipeId
  detailDrawerVisible.value = true
}

function handleAdd() {
  formMode.value = 'add'
  formRecipeId.value = undefined
  formDrawerVisible.value = true
}

function handleEdit(recipeId: string) {
  formMode.value = 'edit'
  formRecipeId.value = recipeId
  formDrawerVisible.value = true
}

function handleDelete(recipeId: string) {
  const recipe = list.items.value.find(r => r.recipeId === recipeId)
  deleteRecipeId.value = recipeId
  deleteRecipeName.value = recipe?.name || ''
  deleteDialogVisible.value = true
}

async function handleDeleteConfirm() {
  await deleteRecipe(deleteRecipeId.value)
  deleteDialogVisible.value = false
  await list.reload()
}

function handleDeleteCancel() {
  deleteDialogVisible.value = false
}

async function handleSaved() {
  formDrawerVisible.value = false
  await list.reload()
}
</script>

<template>
  <section class="recipe-library-page">
    <div class="recipe-library-page__shell">
      <!-- 错误状态 -->
      <div
        v-if="list.error.value"
        class="recipe-library-page__state"
      >
        <p class="recipe-library-page__state-label">
          菜品库
        </p>
        <p class="recipe-library-page__state-copy">
          {{ list.error.value.message }}
        </p>
        <ElButton
          type="primary"
          class="recipe-library-page__state-button"
          @click="list.reload"
        >
          重试
        </ElButton>
      </div>

      <!-- 正常内容 -->
      <template v-else>
        <PageHeader
          title="菜品库"
          subtitle="管理您的菜品，包括食材、步骤和营养信息。"
        >
          <template #actions>
            <ElButton type="primary" @click="handleAdd">
              新增菜品
            </ElButton>
          </template>
        </PageHeader>

        <!-- 筛选栏 -->
        <section class="recipe-library-page__section">
          <RecipeFilterBar
            v-model="list.filters"
            @values-change="list.handleFilterValuesChange"
            @search="list.handleFilterSearch"
            @reset="list.handleFilterReset"
          />
        </section>

        <!-- 菜品网格 -->
        <section class="recipe-library-page__section">
          <RecipeGrid
            :recipes="list.items.value"
            :loading="list.loading.value"
            :total="list.total.value"
            @add-recipe="handleAdd"
            @view-recipe="handleView"
            @edit-recipe="handleEdit"
            @delete-recipe="handleDelete"
          />
        </section>
      </template>
    </div>

    <!-- 详情抽屉 -->
    <RecipeDetailDrawer
      v-model:visible="detailDrawerVisible"
      :recipe-id="detailRecipeId"
    />

    <!-- 表单抽屉 -->
    <RecipeFormDrawer
      v-model:visible="formDrawerVisible"
      :mode="formMode"
      :recipe-id="formRecipeId"
      @saved="handleSaved"
    />

    <!-- 删除对话框 -->
    <RecipeDeleteDialog
      :visible="deleteDialogVisible"
      :recipe-name="deleteRecipeName"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </section>
</template>

<style scoped>
.recipe-library-page {
  min-height: 100%;
  padding: var(--space-6);
}

.recipe-library-page__shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-4);
}

.recipe-library-page__state,
.recipe-library-page__section {
  border: var(--card-border);
  border-radius: var(--card-radius);
  background: var(--color-surface);
  box-shadow: var(--card-shadow);
}

.recipe-library-page__state {
  display: grid;
  gap: var(--space-3);
  place-items: center;
  padding: var(--space-8);
  text-align: center;
  border-left: 3px solid var(--color-danger);
  background: var(--color-danger-soft);
}

.recipe-library-page__state-label,
.recipe-library-page__eyebrow {
  margin: 0;
  letter-spacing: 0.08em;
  font-size: var(--text-xs);
  color: var(--color-text-soft);
  text-transform: uppercase;
}

.recipe-library-page__state-copy {
  margin: 0;
  color: var(--color-text-secondary);
}

.recipe-library-page__state-button {
  min-height: var(--btn-height-lg);
  border: none;
  border-radius: var(--btn-radius-pill);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  font: inherit;
}

.recipe-library-page__section {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
}

.recipe-library-page__section-head h2 {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text);
}

.recipe-library-page__section-head p {
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
}

.recipe-library-page__placeholder {
  border-radius: var(--card-radius);
  border: 1px dashed var(--color-border-strong);
  background: var(--color-surface-muted);
}

.recipe-library-page__placeholder--bar {
  min-height: 72px;
}

.recipe-library-page__grid-placeholder {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.recipe-library-page__placeholder--card {
  min-height: 180px;
}

.recipe-library-page__section--supporting {
  margin-bottom: 0.25rem;
}

.recipe-library-page__supporting {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.recipe-library-page__placeholder--panel {
  min-height: 160px;
}

.recipe-library-page__placeholder--dialog {
  min-height: 112px;
}

@media (max-width: 960px) {
  .recipe-library-page__grid-placeholder,
  .recipe-library-page__supporting {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .recipe-library-page {
    padding: var(--space-4);
  }

  .recipe-library-page__hero,
  .recipe-library-page__section,
  .recipe-library-page__state {
    padding: var(--space-4);
  }
}
</style>
