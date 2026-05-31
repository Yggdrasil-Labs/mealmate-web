<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ElButton, ElDrawer, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect, ElSwitch } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRecipeForm } from '../composables/useRecipeForm'
import {
  getRecipeCrowdTagOptions,
  getRecipeDifficultyOptions,
  getRecipeTypeOptions,
} from '../constants'
import IngredientEditor from './IngredientEditor.vue'
import NutritionForm from './NutritionForm.vue'
import StepEditor from './StepEditor.vue'

/**
 * RecipeFormDrawer 组件
 *
 * 菜品表单抽屉，支持新增和编辑模式。
 * 集成所有子编辑器组件，处理保存逻辑。
 */

interface Props {
  visible: boolean
  mode: 'add' | 'edit'
  recipeId?: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'saved', recipeId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// 响应式状态集中声明
const ingredientError = ref('')
const ingredientSectionRef = ref<HTMLElement>()

const form = useRecipeForm({
  mode: props.mode,
  recipeId: props.recipeId,
})

const { width: windowWidth } = useWindowSize()

const drawerSize = computed(() => {
  return windowWidth.value < 768 ? '100%' : '70%'
})

const title = computed(() => {
  return props.mode === 'add' ? '新增菜品' : '编辑菜品'
})

function handleClose() {
  ingredientError.value = ''
  emit('update:visible', false)
}

async function handleSave() {
  if (form.formData.ingredients.length === 0) {
    ingredientError.value = t('recipe.form.validation.required', { field: t('recipe.form.fields.ingredients') })
    ingredientSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  ingredientError.value = ''
  try {
    await form.save()
    emit('saved', form.recipeId.value || '')
    emit('update:visible', false)
  }
  catch (error) {
    console.error('保存失败', error)
  }
}

// 当 drawer 重新打开时，通过 reset 切换模式（保持模板引用不变）
watch(
  () => [props.visible, props.mode, props.recipeId] as const,
  ([visible, mode, recipeId]) => {
    if (visible) {
      ingredientError.value = ''
      form.reset({ mode, recipeId })
    }
  },
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
      <h3>{{ title }}</h3>
    </template>

    <div
      v-if="form.loading.value"
      class="recipe-form-drawer__loading"
    >
      <p>加载中...</p>
    </div>

    <div
      v-else-if="form.error.value && !form.formData.name"
      class="recipe-form-drawer__error"
    >
      <p>{{ form.error.value.message }}</p>
    </div>

    <ElForm
      v-else
      :model="form.formData"
      label-width="120px"
      class="recipe-form-drawer__form"
    >
      <!-- 基础信息 -->
      <section class="recipe-form-drawer__section">
        <h4 class="recipe-form-drawer__section-title">
          基础信息
        </h4>

        <ElFormItem
          label="菜品名称"
          required
        >
          <ElInput
            v-model="form.formData.name"
            placeholder="请输入菜品名称"
          />
        </ElFormItem>

        <ElFormItem label="类型">
          <ElSelect v-model="form.formData.recipeType">
            <ElOption v-for="opt in getRecipeTypeOptions(t)" :key="opt.value" :value="opt.value" :label="opt.label" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="人群">
          <ElSelect v-model="form.formData.crowdTag">
            <ElOption v-for="opt in getRecipeCrowdTagOptions(t)" :key="opt.value" :value="opt.value" :label="opt.label" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="难度">
          <ElSelect v-model="form.formData.difficultyLevel">
            <ElOption v-for="opt in getRecipeDifficultyOptions(t)" :key="opt.value" :value="opt.value" :label="opt.label" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="耗时（分钟）">
          <ElInputNumber
            v-model="form.formData.cookingTimeMin"
            :min="1"
            :max="480"
          />
        </ElFormItem>

        <ElFormItem label="宝宝友好">
          <ElSwitch v-model="form.formData.isBabyFriendly" />
        </ElFormItem>

        <ElFormItem label="控脂友好">
          <ElSwitch v-model="form.formData.isWeightLossFriendly" />
        </ElFormItem>
      </section>

      <!-- 食材（必填） -->
      <section ref="ingredientSectionRef" class="recipe-form-drawer__section">
        <IngredientEditor v-model="form.formData.ingredients" />
        <p
          v-if="ingredientError"
          class="recipe-form-drawer__field-error"
        >
          {{ ingredientError }}
        </p>
      </section>

      <!-- 步骤 -->
      <section class="recipe-form-drawer__section">
        <StepEditor v-model="form.formData.steps" />
      </section>

      <!-- 营养信息 -->
      <section class="recipe-form-drawer__section">
        <NutritionForm v-model="form.formData.nutrition" />
      </section>

      <!-- 错误提示 -->
      <div
        v-if="form.error.value"
        class="recipe-form-drawer__error-message"
      >
        {{ form.error.value.message }}
      </div>
    </ElForm>

    <template #footer>
      <div class="recipe-form-drawer__footer">
        <ElButton @click="handleClose">
          取消
        </ElButton>
        <ElButton
          type="primary"
          :loading="form.saving.value"
          @click="handleSave"
        >
          保存
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<style scoped>
.recipe-form-drawer__loading,
.recipe-form-drawer__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.recipe-form-drawer__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.recipe-form-drawer__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
}

.recipe-form-drawer__section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.recipe-form-drawer__error-message {
  padding: 0.75rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.recipe-form-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.recipe-form-drawer__field-error {
  margin: 0.5rem 0 0;
  font-size: 12px;
  color: var(--el-color-danger, #f56c6c);
}
</style>
