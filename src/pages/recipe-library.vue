<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
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
        <header class="recipe-library-page__hero">
          <div>
            <p class="recipe-library-page__eyebrow">
              菜品库
            </p>
            <h1 class="recipe-library-page__title">
              菜品库
            </h1>
            <p class="recipe-library-page__subtitle">
              管理您的菜品，包括食材、步骤和营养信息。
            </p>
          </div>
          <ElButton
            type="primary"
            @click="handleAdd"
          >
            新增菜品
          </ElButton>
        </header>

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
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.16), transparent 26%),
    linear-gradient(180deg, #fffdf7 0%, #fff 100%);
}

.recipe-library-page__shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1.25rem;
}

.recipe-library-page__state,
.recipe-library-page__hero,
.recipe-library-page__section {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
}

.recipe-library-page__state {
  display: grid;
  gap: 0.8rem;
  place-items: center;
  padding: 2rem;
  text-align: center;
}

.recipe-library-page__state-label,
.recipe-library-page__eyebrow {
  margin: 0;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.recipe-library-page__state-copy {
  margin: 0;
  color: #475569;
}

.recipe-library-page__state-button {
  min-height: 44px;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  background: #0f766e;
  color: #fff;
  font: inherit;
}

.recipe-library-page__hero {
  padding: 1.5rem;
}

.recipe-library-page__title {
  margin: 0.55rem 0 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
  color: #0f172a;
}

.recipe-library-page__subtitle {
  max-width: 52ch;
  margin: 0.75rem 0 0;
  color: #475569;
  line-height: 1.7;
}

.recipe-library-page__section {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.recipe-library-page__section-head h2 {
  margin: 0;
  font-size: 1.05rem;
  color: #0f172a;
}

.recipe-library-page__section-head p {
  margin: 0.35rem 0 0;
  color: #64748b;
}

.recipe-library-page__placeholder {
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.55);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.75));
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
    padding: 1rem;
  }

  .recipe-library-page__hero,
  .recipe-library-page__section,
  .recipe-library-page__state {
    padding: 1rem;
  }
}
</style>
