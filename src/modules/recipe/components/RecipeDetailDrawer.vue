<script setup lang="ts">
import type { RecipeDetail } from '../types'
import { ElButton, ElDescriptions, ElDescriptionsItem, ElDrawer, ElEmpty, ElImage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { fetchRecipeDetail } from '../api'
import { getRecipeCrowdTagLabel, getRecipeDifficultyLabel, getRecipeTypeLabel } from '../constants'

/**
 * RecipeDetailDrawer 组件
 *
 * 只读展示菜品详情，包括基础信息、食材列表、步骤和营养信息。
 * 支持加载状态、错误重试和移动端全屏显示。
 */

interface Props {
  visible: boolean
  recipeId: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const detail = ref<RecipeDetail | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

const drawerSize = computed(() => {
  // 移动端全屏，桌面端 60%
  return window.innerWidth < 768 ? '100%' : '60%'
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

function retry() {
  void loadDetail()
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.recipeId) {
      void loadDetail()
    }
  },
  { immediate: true },
)
</script>

<template>
  <ElDrawer
    :model-value="visible"
    :size="drawerSize"
    direction="rtl"
    @close="handleClose"
  >
    <template #header>
      <h3>菜品详情</h3>
    </template>

    <div
      v-if="loading"
      class="recipe-detail-drawer__loading"
    >
      <p>加载中...</p>
    </div>

    <div
      v-else-if="error"
      class="recipe-detail-drawer__error"
    >
      <p>{{ error.message }}</p>
      <ElButton
        type="primary"
        data-testid="recipe-detail-retry"
        @click="retry"
      >
        重试
      </ElButton>
    </div>

    <div
      v-else-if="detail"
      class="recipe-detail-drawer__content"
    >
      <!-- 基础信息 -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          {{ detail.name }}
        </h4>
        <p
          v-if="detail.description"
          class="recipe-detail-drawer__description"
        >
          {{ detail.description }}
        </p>

        <ElDescriptions
          :column="2"
          border
        >
          <ElDescriptionsItem label="类型">
            {{ getRecipeTypeLabel(detail.recipeType, (key) => key) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="难度">
            {{ getRecipeDifficultyLabel(detail.difficultyLevel, (key) => key) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="人群">
            {{ getRecipeCrowdTagLabel(detail.crowdTag, (key) => key) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="耗时">
            {{ detail.cookingTimeMin }} 分钟
          </ElDescriptionsItem>
          <ElDescriptionsItem label="宝宝友好">
            {{ detail.isBabyFriendly ? '是' : '否' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="控脂友好">
            {{ detail.isWeightLossFriendly ? '是' : '否' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </section>

      <!-- 食材列表 -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          食材
        </h4>
        <div
          v-if="detail.ingredients && detail.ingredients.length > 0"
          class="recipe-detail-drawer__ingredients"
        >
          <div
            v-for="ingredient in detail.ingredients"
            :key="ingredient.ingredientId"
            class="recipe-detail-drawer__ingredient"
          >
            <span class="recipe-detail-drawer__ingredient-name">{{ ingredient.ingredientName }}</span>
            <span class="recipe-detail-drawer__ingredient-quantity">
              {{ ingredient.quantity }} {{ ingredient.unit }}
            </span>
          </div>
        </div>
        <ElEmpty
          v-else
          description="暂无食材"
        />
      </section>

      <!-- 步骤 -->
      <section class="recipe-detail-drawer__section">
        <h4 class="recipe-detail-drawer__section-title">
          步骤
        </h4>
        <div
          v-if="detail.steps && detail.steps.length > 0"
          class="recipe-detail-drawer__steps"
        >
          <div
            v-for="step in detail.steps"
            :key="step.stepNo"
            class="recipe-detail-drawer__step"
          >
            <div class="recipe-detail-drawer__step-number">
              {{ step.stepNo }}
            </div>
            <div class="recipe-detail-drawer__step-content">
              <p class="recipe-detail-drawer__step-description">
                {{ step.content }}
              </p>
              <ElImage
                v-if="step.imageUrl"
                :src="step.imageUrl"
                fit="cover"
                class="recipe-detail-drawer__step-image"
              />
            </div>
          </div>
        </div>
        <ElEmpty
          v-else
          description="暂无步骤"
        />
      </section>

      <!-- 营养信息 -->
      <section
        v-if="detail.nutrition"
        class="recipe-detail-drawer__section"
      >
        <h4 class="recipe-detail-drawer__section-title">
          营养信息（每份）
        </h4>
        <ElDescriptions
          :column="2"
          border
        >
          <ElDescriptionsItem
            v-if="detail.nutrition.calories"
            label="热量"
          >
            {{ detail.nutrition.calories }} 千卡
          </ElDescriptionsItem>
          <ElDescriptionsItem
            v-if="detail.nutrition.protein"
            label="蛋白质"
          >
            {{ detail.nutrition.protein }} 克
          </ElDescriptionsItem>
          <ElDescriptionsItem
            v-if="detail.nutrition.fat"
            label="脂肪"
          >
            {{ detail.nutrition.fat }} 克
          </ElDescriptionsItem>
          <ElDescriptionsItem
            v-if="detail.nutrition.carbohydrate"
            label="碳水"
          >
            {{ detail.nutrition.carbohydrate }} 克
          </ElDescriptionsItem>
        </ElDescriptions>
      </section>
    </div>

    <ElEmpty
      v-else
      description="暂无数据"
    />
  </ElDrawer>
</template>

<style scoped>
.recipe-detail-drawer__loading,
.recipe-detail-drawer__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.recipe-detail-drawer__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recipe-detail-drawer__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recipe-detail-drawer__section-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.recipe-detail-drawer__description {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.recipe-detail-drawer__ingredients {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recipe-detail-drawer__ingredient {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
}

.recipe-detail-drawer__ingredient-name {
  font-weight: 500;
  color: #0f172a;
}

.recipe-detail-drawer__ingredient-quantity {
  color: #64748b;
}

.recipe-detail-drawer__steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recipe-detail-drawer__step {
  display: flex;
  gap: 1rem;
}

.recipe-detail-drawer__step-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
}

.recipe-detail-drawer__step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recipe-detail-drawer__step-description {
  margin: 0;
  color: #0f172a;
  line-height: 1.6;
}

.recipe-detail-drawer__step-image {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}
</style>
