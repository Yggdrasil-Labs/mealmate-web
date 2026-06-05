<script setup lang="ts">
import type { FormFieldOption, ProFormContext } from '@/types/pro-form'
import type { SearchFieldSchema } from '@/types/search-bar'
import { ElFormItem, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed, ref, useSlots, watch } from 'vue'
import {
  resolveSearchFieldOptions,
  shouldResetDependentFieldValue,
} from './search-bar-field.utils'
import { getSearchFieldComponent } from './search-bar-registry'

defineOptions({ name: 'SearchBarField' })

const props = defineProps<{
  schema: SearchFieldSchema
  modelValue: Record<string, unknown>
  disabled?: boolean
  context?: ProFormContext
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'enter'): void
}>()

const slots = useSlots()

const fieldKey = computed(() => props.schema.meta.field)
const fieldLabel = computed(() => props.schema.meta.label)
const fieldTooltip = computed(() => props.schema.ui.tooltip)
const fieldLabelWidth = computed(() => props.schema.ui.layout?.labelWidth)
const isVisible = computed(() => props.schema.runtime?.visible !== false)
const effectiveDisabled = computed(() => props.disabled || props.schema.runtime?.disabled || false)
const fieldComponent = computed(() => getSearchFieldComponent(props.schema.ui.component))
const isSelect = computed(() => props.schema.ui.component === 'Select')
const staticOptions = computed<FormFieldOption[]>(() => props.schema.ui.options ?? [])
const dynamicOptions = ref<FormFieldOption[]>(staticOptions.value)
const optionsLoading = ref(false)
let loadToken = 0

const dependencySignature = computed(() =>
  JSON.stringify(
    (props.schema.runtime?.dependencies ?? []).map(key => props.modelValue[key]),
  ),
)

const fieldValue = computed({
  get() {
    return props.modelValue[fieldKey.value]
  },
  set(value: unknown) {
    const transform = props.schema.runtime?.transform?.input
    const nextFieldValue = transform
      ? transform(value, props.modelValue, props.context ?? {})
      : value

    emit('update:modelValue', {
      ...props.modelValue,
      [fieldKey.value]: nextFieldValue,
    })
  },
})

const mergedFieldProps = computed(() => ({
  ...(props.schema.ui.props ?? {}),
  'disabled': effectiveDisabled.value,
  'aria-label': props.schema.meta.label,
}))

const hasCustomRender = computed(() => Boolean(slots['custom-render']))
const resolvedOptions = computed(() => dynamicOptions.value)
const selectValue = computed(() => fieldValue.value as string | number | boolean | undefined)

function optionValue(opt: FormFieldOption): string | number | boolean {
  return opt.value as string | number | boolean
}

function resetFieldValue() {
  emit('update:modelValue', {
    ...props.modelValue,
    [fieldKey.value]: props.schema.meta.defaultValue,
  })
}

async function loadOptions() {
  const runtimeOptions = props.schema.runtime?.options
  if (typeof runtimeOptions !== 'function') {
    dynamicOptions.value = staticOptions.value
    return
  }

  const currentToken = ++loadToken
  optionsLoading.value = true

  try {
    const result = await runtimeOptions(props.modelValue, props.context ?? {})
    // 依赖字段频繁变化时，只保留最后一次异步返回，避免旧请求覆盖新选项。
    if (currentToken !== loadToken)
      return
    dynamicOptions.value = resolveSearchFieldOptions(result, staticOptions.value)
  }
  finally {
    if (currentToken === loadToken)
      optionsLoading.value = false
  }
}

watch(
  () => [dependencySignature.value, staticOptions.value] as const,
  (nextValue, previousValue) => {
    const nextDependencySignature = nextValue[0]
    const previousDependencySignature = previousValue?.[0]

    if (shouldResetDependentFieldValue(fieldValue.value, previousDependencySignature, nextDependencySignature))
      resetFieldValue()
    void loadOptions()
  },
  { immediate: true },
)
</script>

<template>
  <ElFormItem
    v-if="isVisible"
    :label="fieldLabel"
    :label-width="fieldLabelWidth"
    class="search-bar-field"
  >
    <template #label>
      <span class="search-bar-field__label">
        <ElTooltip
          v-if="fieldTooltip"
          :content="fieldTooltip.content"
          :placement="fieldTooltip.placement || 'top'"
        >
          <span class="search-bar-field__label-text">{{ fieldLabel }}</span>
        </ElTooltip>
        <span v-else>{{ fieldLabel }}</span>
      </span>
    </template>

    <div class="search-bar-field__control" @keyup.enter.capture="emit('enter')">
      <template v-if="hasCustomRender">
        <slot
          name="custom-render"
          :field="schema.meta.field"
          :schema="schema"
          :value="fieldValue"
          :disabled="effectiveDisabled"
          :on-update="(value: unknown) => { fieldValue = value }"
        />
      </template>
      <template v-else>
        <ElSelect
          v-if="isSelect"
          v-bind="mergedFieldProps"
          :model-value="selectValue"
          :loading="optionsLoading"
          @update:model-value="(value) => { fieldValue = value }"
        >
          <ElOption
            v-for="opt in resolvedOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="optionValue(opt)"
          />
        </ElSelect>
        <component
          :is="fieldComponent"
          v-else-if="fieldComponent"
          v-bind="mergedFieldProps"
          v-model="fieldValue"
        />
        <span v-else class="search-bar-field__missing-component">
          未找到字段组件：{{ schema.ui.component }}
        </span>

        <slot
          name="field-suffix"
          :field="schema.meta.field"
          :schema="schema"
          :value="fieldValue"
          :disabled="effectiveDisabled"
        />
      </template>
    </div>
  </ElFormItem>
</template>

<style scoped lang="scss">
.search-bar-field {
  width: 100%;
}

.search-bar-field__label {
  display: inline-flex;
  align-items: center;
}

.search-bar-field__label-text {
  cursor: help;
}

.search-bar-field__control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-editor),
  :deep(.el-input-number) {
    width: 100%;
  }
}

.search-bar-field__missing-component {
  color: var(--el-color-danger, #f56c6c);
  font-size: 12px;
}
</style>
