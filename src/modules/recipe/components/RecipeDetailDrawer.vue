<script setup lang="ts">
import type { RecipeDetail } from '../types'
import type { FormFieldSchema } from '@/types/pro-form'
import { ElButton, ElDrawer, ElEmpty, ElImage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProDetail } from '@/components/pro-detail'
import { fetchRecipeDetail } from '../api'
import { getRecipeCrowdTagLabel, getRecipeDifficultyLabel, getRecipeTypeLabel } from '../constants'

/**
 * RecipeDetailDrawer — 菜品详情抽屉
 *
 * 基础信息和营养信息使用 ProDetail schema 驱动展示。
 * 食材列表和步骤时间线保留自定义渲染。
 */

const props = defineProps<{
  visible: boolean
  recipeId: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const { t } = useI18n()

const detail = ref<RecipeDetail | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

const drawerSize = computed(() => window.innerWidth < 768 ? '100%' : '60%')

/** 基础信息 ProDetail schema */
const basicSchema = computed<FormFieldSchema[]>(() => [
  { meta: { field: 'recipeType', label: '类型', valueType: 'string', required: false }, ui: { component: 'Tag', layout: { span: 12 } } },
  { meta: { field: 'difficultyLevel', label: '难度', valueType: 'string', required: false }, ui: { component: 'Tag', layout: { span: 12 } } },
  { meta: { field: 'crowdTag', label: '人群', valueType: 'string', required: false }, ui: { component: 'Tag', layout: { span: 12 } } },
  { meta: { field: 'cookingTimeMin', label: '耗时', valueType: 'string', required: false }, ui: { layout: { span: 12 } } },
  { meta: { field: 'isBabyFriendly', label: '宝宝友好', valueType: 'string', required: false }, ui: { layout: { span: 12 } } },
  { meta: { field: 'isWeightLossFriendly', label: '控脂友好', valueType: 'string', required: false }, ui: { layout: { span: 12 } } },
])

/** 营养信息 ProDetail schema */
const nutritionSchema = computed<FormFieldSchema[]>(() => [
  { meta: { field: 'calories', label: '热量', valueType: 'string', required: false, emptyText: '—' }, ui: { layout: { span: 12, group: '营养信息（每份）' } } },
  { meta: { field: 'protein', label: '蛋白质', valueType: 'string', required: false, emptyText: '—' }, ui: { layout: { span: 12, group: '营养信息（每份）' } } },
  { meta: { field: 'fat', label: '脂肪', valueType: 'string', required: false, emptyText: '—' }, ui: { layout: { span: 12, group: '营养信息（每份）' } } },
  { meta: { field: 'carbohydrate', label: '碳水', valueType: 'string', required: false, emptyText: '—' }, ui: { layout: { span: 12, group: '营养信息（每份）' } } },
])

/** 将原始数据转换为 ProDetail 展示用的数据 */
const basicData = computed(() => {
  if (!detail.value)
    return {}
  return {
    recipeType: getRecipeTypeLabel(detail.value.recipeType, t),
    difficultyLevel: getRecipeDifficultyLabel(detail.value.difficultyLevel, t),
    crowdTag: getRecipeCrowdTagLabel(detail.value.crowdTag, t),
    cookingTimeMin: `${detail.value.cookingTimeMin} 分钟`,
    isBabyFriendly: detail.value.isBabyFriendly ? '是' : '否',
    isWeightLossFriendly: detail.value.isWeightLossFriendly ? '是' : '否',
  }
})

const nutritionData = computed(() => {
  const n = detail.value?.nutrition
  if (!n)
    return {}
  return {
    calories: n.calories ? `${n.calories} 千卡` : undefined,
    protein: n.protein ? `${n.protein} 克` : undefined,
    fat: n.fat ? `${n.fat} 克` : undefined,
    carbohydrate: n.carbohydrate ? `${n.carbohydrate} 克` : undefined,
  }
})

async function loadDetail() {
  if (!props.recipeId)
    return
  loading.value = true
  error.value = null
  try {
    detail.value = await fetchRecipeDetail(props.recipeId)
  }
  catch (err) {
    error.value = err instanceof Error ? err : new Error('加载菜品详情失败')
  }
  finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:visible', false)
}

watch(() => props.visible, (v) => {
  if (v && props.recipeId)
    void loadDetail()
}, { immediate: true })
</script>

<template>
  <ElDrawer :model-value="visible" :size="drawerSize" direction="rtl" @close="handleClose">
    <template #header>
      <h3>菜品详情</h3>
    </template>

    <div v-if="loading" class="recipe-detail-drawer__loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="recipe-detail-drawer__error">
      <p>{{ error.message }}</p>
      <ElButton type="primary" data-testid="recipe-detail-retry" @click="loadDetail">
        重试
      </ElButton>
    </div>

    <div v-else-if="detail" class="recipe-detail-drawer__content">
      <!-- 标题与描述 -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          {{ detail.name }}
        </h4>
        <p v-if="detail.description" class="recipe-detail-drawer__description">
          {{ detail.description }}
        </p>
      </section>

      <!-- 基础信息 (ProDetail) -->
      <section class="recipe-detail-drawer__section">
        <ProDetail :schema="basicSchema" :data="basicData" :layout="{ column: 2, border: true }" />
      </section>

      <!-- 食材列表 (自定义) -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          食材
        </h4>
        <div v-if="detail.ingredients?.length" class="recipe-detail-drawer__ingredients">
          <div v-for="ing in detail.ingredients" :key="ing.ingredientId" class="recipe-detail-drawer__ingredient">
            <span class="recipe-detail-drawer__ingredient-name">{{ ing.ingredientName }}</span>
            <span class="recipe-detail-drawer__ingredient-quantity">{{ ing.quantity }} {{ ing.unit }}</span>
          </div>
        </div>
        <ElEmpty v-else description="暂无食材" />
      </section>

      <!-- 步骤 (自定义时间线) -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          步骤
        </h4>
        <div v-if="detail.steps?.length" class="recipe-detail-drawer__steps">
          <div v-for="step in detail.steps" :key="step.stepNo" class="recipe-detail-drawer__step">
            <div class="recipe-detail-drawer__step-number">
              {{ step.stepNo }}
            </div>
            <div class="recipe-detail-drawer__step-content">
              <p class="recipe-detail-drawer__step-description">
                {{ step.content }}
              </p>
              <ElImage v-if="step.imageUrl" :src="step.imageUrl" fit="cover" class="recipe-detail-drawer__step-image" />
            </div>
          </div>
        </div>
        <ElEmpty v-else description="暂无步骤" />
      </section>

      <!-- 营养信息 (ProDetail) -->
      <section v-if="detail.nutrition" class="recipe-detail-drawer__section">
        <ProDetail :schema="nutritionSchema" :data="nutritionData" :layout="{ column: 2, border: true }" />
      </section>
    </div>

    <ElEmpty v-else description="暂无数据" />
  </ElDrawer>
</template>

<style scoped>
.recipe-detail-drawer__loading,
.recipe-detail-drawer__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
}

.recipe-detail-drawer__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.recipe-detail-drawer__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.recipe-detail-drawer__section-title {
  margin: 0;
  font-size: var(--section-title-size);
  font-weight: 600;
  color: var(--color-text);
}

.recipe-detail-drawer__description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.recipe-detail-drawer__ingredients {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.recipe-detail-drawer__ingredient {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--btn-radius);
  background: var(--color-surface-muted);
}

.recipe-detail-drawer__ingredient-name {
  font-weight: 500;
  color: var(--color-text);
}

.recipe-detail-drawer__ingredient-quantity {
  color: var(--color-text-muted);
}

.recipe-detail-drawer__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-left: var(--space-2);
}

.recipe-detail-drawer__step {
  display: flex;
  gap: var(--space-4);
  position: relative;
}

.recipe-detail-drawer__step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(1rem - 1px);
  top: 2rem;
  bottom: calc(-1 * var(--space-4));
  width: 2px;
  background: var(--color-border-strong);
}

.recipe-detail-drawer__step-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-success);
  color: #fff;
  font-weight: 600;
  font-size: var(--text-sm);
  z-index: 1;
}

.recipe-detail-drawer__step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: 4px;
}

.recipe-detail-drawer__step-description {
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
}

.recipe-detail-drawer__step-image {
  width: 100%;
  max-width: 400px;
  border-radius: var(--btn-radius);
}
</style>
