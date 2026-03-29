<script setup lang="ts">
import type { FormFieldOption, FormFieldSchema, ProFormContext } from '@/types/pro-form'
import { ElFormItem, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed, useSlots } from 'vue'
import { getFieldComponent } from './form-registry'

defineOptions({ name: 'ProFormField' })

const props = defineProps<ProFormFieldProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void
}>()

interface ProFormFieldProps {
  schema: FormFieldSchema
  modelValue: Record<string, unknown>
  disabled?: boolean
  readonly?: boolean
  context?: ProFormContext
}

const slots = useSlots()

const fieldKey = computed(() => props.schema.meta.field)
const fieldLabel = computed(() => props.schema.meta.label)
const fieldRequired = computed(() => props.schema.meta.required)
const fieldTooltip = computed(() => props.schema.ui.tooltip)
/** 字段级标签宽度，有则覆盖表单级 */
const fieldLabelWidth = computed(() => props.schema.ui.layout?.labelWidth)

const isVisible = computed(() => props.schema.runtime?.visible !== false)

const effectiveDisabled = computed(
  () => props.disabled || props.schema.runtime?.disabled || false,
)

const effectiveReadonly = computed(
  () => props.readonly || props.schema.runtime?.readonly || props.schema.ui.readonly || false,
)

const fieldComponent = computed(() =>
  getFieldComponent(props.schema.ui.component),
)

const fieldValue = computed({
  get() {
    return props.modelValue[fieldKey.value]
  },
  set(value: unknown) {
    const nextValue: Record<string, unknown> = {
      ...props.modelValue,
      [fieldKey.value]: value,
    }
    emit('update:modelValue', nextValue)
  },
})

function handleValueUpdate(value: unknown) {
  fieldValue.value = value
}

const hasCustomRender = computed(() => Boolean(slots['custom-render']))

const isSelect = computed(() => props.schema.ui.component === 'Select')

const selectOptions = computed<FormFieldOption[]>(() => {
  const opts = props.schema.ui.options
  if (Array.isArray(opts))
    return opts
  const runtimeOpts = props.schema.runtime?.options
  if (typeof runtimeOpts !== 'function')
    return []
  const result = runtimeOpts(props.modelValue, props.context ?? {})
  return Array.isArray(result) ? result : []
})

function optionValue(opt: FormFieldOption): string | number | boolean {
  return opt.value as string | number | boolean
}

const selectModelValue = computed(() => {
  const v = fieldValue.value
  return v === undefined || v === null ? undefined : (v as string | number | boolean)
})

/** 合并 schema.ui.props，并保证 readonly/disabled 由 ProForm 控制，不被 schema 覆盖 */
const mergedFieldProps = computed(() => ({
  ...(props.schema.ui.props ?? {}),
  disabled: effectiveDisabled.value,
  readonly: effectiveReadonly.value,
}))
</script>

<template>
  <ElFormItem
    v-if="isVisible"
    :prop="schema.meta.field"
    :required="fieldRequired"
    :label-width="fieldLabelWidth"
  >
    <template #label>
      <span class="pro-form-field__label-inner">
        <ElTooltip
          v-if="fieldTooltip"
          :content="fieldTooltip.content"
          :placement="fieldTooltip.placement || 'top'"
        >
          <span class="pro-form-field__label-text">{{ fieldLabel }}</span>
        </ElTooltip>
        <template v-else>
          <span>{{ fieldLabel }}</span>
        </template>
      </span>
    </template>

    <template v-if="hasCustomRender">
      <slot
        name="custom-render"
        :field="schema.meta.field"
        :schema="schema"
        :value="fieldValue"
        :disabled="effectiveDisabled"
        :readonly="effectiveReadonly"
        :on-update="handleValueUpdate"
      />
    </template>
    <template v-else>
      <slot
        name="field-prefix"
        :field="schema.meta.field"
        :schema="schema"
        :value="fieldValue"
        :disabled="effectiveDisabled"
        :readonly="effectiveReadonly"
        :on-update="handleValueUpdate"
      />

      <ElSelect
        v-if="isSelect"
        v-bind="schema.ui.props"
        :model-value="selectModelValue"
        :disabled="effectiveDisabled"
        @update:model-value="handleValueUpdate"
      >
        <ElOption
          v-for="opt in selectOptions"
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

      <slot
        name="field-suffix"
        :field="schema.meta.field"
        :schema="schema"
        :value="fieldValue"
        :disabled="effectiveDisabled"
        :readonly="effectiveReadonly"
        :on-update="handleValueUpdate"
      />

      <slot
        name="field-help"
        :field="schema.meta.field"
        :schema="schema"
        :value="fieldValue"
        :disabled="effectiveDisabled"
        :readonly="effectiveReadonly"
        :on-update="handleValueUpdate"
      />
    </template>

    <template v-if="!fieldComponent">
      <span class="pro-form-field__missing-component">
        未找到字段组件：{{ schema.ui.component }}
      </span>
    </template>
  </ElFormItem>
</template>

<style scoped>
.pro-form-field__label-inner {
  display: inline-flex;
  align-items: center;
}

.pro-form-field__label-text {
  cursor: help;
}

.pro-form-field__missing-component {
  color: var(--el-color-danger, #f56c6c);
  font-size: 12px;
}
</style>
