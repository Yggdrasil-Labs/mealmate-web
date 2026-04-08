<script setup lang="ts">
import type { FormFieldSchema, ProFormEmits, ProFormModelValue, ProFormProps } from '@/types/pro-form'
import { ElCol, ElCollapse, ElCollapseItem, ElForm, ElRow } from 'element-plus'
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'
import { useAppBreakpoint } from '@/composables'
import { toFormRecord } from './model-value'
import ProFormField from './ProFormField.vue'
import { buildElFormRules } from './validation'

defineOptions({ name: 'ProForm' })

const props = defineProps<ProFormProps>()

const emit = defineEmits<ProFormEmits>()

const slots = useSlots()
const { isMobile } = useAppBreakpoint()

const formRef = ref<InstanceType<typeof ElForm> | null>(null)

/** 用于 resetFields 的初始值（仅首次合并时快照，后续不随 modelValue 覆盖） */
const initialValues = ref<Record<string, unknown>>({})
let hasSetInitialValues = false

/** reset 进行中标志：reset 期间跳过依赖重校验，避免 clearValidate 后又立刻产生新的校验错误 */
let isResetting = false

const isReadonly = computed(() => props.mode === 'readonly')

const isDisabled = computed(() => isReadonly.value || props.loading === true)

const labelWidth = computed(() => props.layout?.labelWidth ?? '120px')

const labelPosition = computed(() => isMobile.value ? 'top' : props.layout?.labelPosition)

/** 根据 schema 与当前 modelValue 生成 ElForm rules */
const formRules = computed(() =>
  buildElFormRules(
    props.schema,
    () => ({ ...props.modelValue }),
    props.context ?? {},
  ),
)

interface FormGroup {
  key: string
  label: string | undefined
  fields: FormFieldSchema[]
}

const DEFAULT_GROUP_KEY = '__default__'

/** 字段是否可见：与 ProFormField 一致，runtime.visible !== false 即显示 */
function isFieldVisible(field: FormFieldSchema): boolean {
  return field.runtime?.visible !== false
}

const groupedSchema = computed<FormGroup[]>(() => {
  const order: string[] = []
  const map = new Map<string, FormFieldSchema[]>()

  for (const field of props.schema) {
    const groupKey = field.ui.layout?.group ?? DEFAULT_GROUP_KEY
    if (!map.has(groupKey)) {
      map.set(groupKey, [])
      order.push(groupKey)
    }
    map.get(groupKey)!.push(field)
  }

  return order
    .map(groupKey => ({
      key: groupKey,
      label: groupKey === DEFAULT_GROUP_KEY ? undefined : groupKey,
      fields: (map.get(groupKey) ?? []).filter(isFieldVisible),
    }))
    .filter(group => group.fields.length > 0)
})

/** 折叠面板当前展开项，默认全部展开；随分组变化自动包含新分组 */
const expandedGroupKeys = ref<string[]>([])

/** 根据字段 key 取所在分组 key（用于校验失败时展开对应面板） */
function getGroupKeyByFieldKey(fieldKey: string): string | undefined {
  const field = props.schema.find(f => f.meta.field === fieldKey)
  if (!field)
    return undefined
  return field.ui.layout?.group ?? DEFAULT_GROUP_KEY
}

/** 展开所有包含错误字段的折叠面板（保证任意错误所在面板都会展开） */
function expandGroupsContainingInvalidFields(invalidFields: Record<string, unknown>) {
  const keys = Object.keys(invalidFields)
  const toExpand = new Set(expandedGroupKeys.value)
  for (const fieldKey of keys) {
    const groupKey = getGroupKeyByFieldKey(fieldKey)
    if (groupKey)
      toExpand.add(groupKey)
  }
  expandedGroupKeys.value = [...toExpand]
}

watch(
  groupedSchema,
  (groups) => {
    const keys = groups.map(g => g.key)
    expandedGroupKeys.value = [...new Set([...expandedGroupKeys.value, ...keys])]
  },
  { immediate: true },
)

function getFieldSpan(field: FormFieldSchema) {
  if (isMobile.value)
    return 24
  return field.ui.layout?.span ?? 24
}

function getFieldBreakpoints(field: FormFieldSchema) {
  if (isMobile.value)
    return {}
  return field.ui.layout?.breakpoints ?? {}
}

const GRID_TOTAL = 24

/** 按栅格将字段拆成多行：同行内 span 累加不超过 24，满则换行 */
function groupFieldsIntoRows(fields: FormFieldSchema[]): FormFieldSchema[][] {
  const rows: FormFieldSchema[][] = []
  let currentRow: FormFieldSchema[] = []
  let currentSpan = 0

  for (const field of fields) {
    const span = getFieldSpan(field)
    if (currentSpan + span > GRID_TOTAL && currentRow.length > 0) {
      rows.push(currentRow)
      currentRow = []
      currentSpan = 0
    }
    currentRow.push(field)
    currentSpan += span
  }
  if (currentRow.length > 0)
    rows.push(currentRow)

  return rows
}

/** 用 schema meta.defaultValue 填充缺失项；键已存在时保留当前值（含 undefined，即用户清空） */
function mergeDefaultsWithModelValue(): Record<string, unknown> {
  const currentModelValue = toFormRecord(props.modelValue)
  const base: Record<string, unknown> = {}
  for (const field of props.schema) {
    const key = field.meta.field
    if (key in currentModelValue) {
      base[key] = currentModelValue[key]
    }
    else {
      base[key] = field.meta.defaultValue
    }
  }
  return { ...currentModelValue, ...base }
}

function ensureInitialValuesAndEmitIfNeeded() {
  const merged = mergeDefaultsWithModelValue()
  const hasMissing = props.schema.some(
    f => !(f.meta.field in props.modelValue) && f.meta.defaultValue !== undefined,
  )
  if (hasMissing)
    emit('update:modelValue', merged)
  if (!hasSetInitialValues) {
    initialValues.value = { ...merged }
    hasSetInitialValues = true
  }
}

function handleFieldModelUpdate(nextValue: ProFormModelValue) {
  emit('update:modelValue', nextValue)
  const nextValues = toFormRecord(nextValue)
  const prev = toFormRecord(props.modelValue)
  const changedValues: Record<string, unknown> = {}
  for (const key of Object.keys(nextValues)) {
    if (nextValues[key] !== prev[key])
      changedValues[key] = nextValues[key]
  }
  if (Object.keys(changedValues).length > 0)
    emit('valuesChange', changedValues, nextValues)
}

// ---------- 暴露方法 ----------

function setFieldsValue(values: Record<string, unknown>) {
  emit('update:modelValue', { ...toFormRecord(props.modelValue), ...values })
}

function getFieldsValue(): Record<string, unknown> {
  return { ...toFormRecord(props.modelValue) }
}

function resetFields() {
  isResetting = true
  const values = { ...initialValues.value }
  emit('update:modelValue', values)
  formRef.value?.clearValidate()
  emit('reset', values)
  nextTick(() => {
    isResetting = false
  })
}

async function validate(): Promise<boolean> {
  try {
    await formRef.value?.validate()
    return true
  }
  catch (err: unknown) {
    // Element Plus Form 校验失败时 reject 的是 invalidFields 对象本身（键为字段名），不是 { fields: ... }
    const invalidFields = err && typeof err === 'object' && !(err instanceof Error)
      ? (err as Record<string, unknown>)
      : undefined
    if (invalidFields && Object.keys(invalidFields).length > 0) {
      expandGroupsContainingInvalidFields(invalidFields)
      await nextTick()
      // 等待折叠面板展开（含动画）后再滚动，否则面板可能仍为折叠态
      await new Promise(resolve => setTimeout(resolve, 350))
      const firstProp = Object.keys(invalidFields)[0]
      formRef.value?.scrollToField(firstProp)
    }
    return false
  }
}

function validateField(field?: string | string[]) {
  return formRef.value?.validateField(field) ?? Promise.resolve()
}

function clearValidate(field?: string | string[]) {
  formRef.value?.clearValidate(field)
}

/** 先校验，通过后 emit('submit', getFieldsValue())，失败则滚动到首个错误 */
async function submit() {
  const ok = await validate()
  if (ok) {
    emit('submit', getFieldsValue())
  }
}

defineExpose({
  setFieldsValue,
  getFieldsValue,
  resetFields,
  validate,
  validateField,
  clearValidate,
  submit,
})

// ---------- 默认值与时序：初始化时用 schema 默认值填充缺失，modelValue 优先 ----------

onMounted(() => {
  ensureInitialValuesAndEmitIfNeeded()
})

watch(
  () => [props.schema, props.modelValue] as const,
  () => {
    ensureInitialValuesAndEmitIfNeeded()
  },
  { deep: true },
)

// ---------- 依赖变化：依赖字段变更时触发对应字段的 validateField ----------

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!oldVal || isResetting)
      return
    const nextValues = toFormRecord(newVal)
    const prevValues = toFormRecord(oldVal)
    const changedKeys = new Set<string>()
    for (const key of Object.keys({ ...nextValues, ...prevValues })) {
      if (nextValues[key] !== prevValues[key])
        changedKeys.add(key)
    }
    if (changedKeys.size === 0)
      return
    const fieldsToRevalidate = props.schema.filter(
      field =>
        field.runtime?.dependencies?.some(dep => changedKeys.has(dep))
        && (field.runtime?.validation?.revalidateOnDependencyChange !== false),
    )
    for (const field of fieldsToRevalidate) {
      formRef.value?.validateField(field.meta.field)?.catch(() => {
        // 依赖变化触发的重校验仅用于更新错误展示，不向外抛出，避免 Uncaught (in promise)
      })
    }
  },
  { deep: true },
)
</script>

<template>
  <ElForm
    ref="formRef"
    class="pro-form"
    :model="modelValue"
    :rules="formRules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :disabled="isDisabled"
    :validate-on-rule-change="false"
  >
    <template v-if="slots['form-header']">
      <section class="pro-form__header">
        <slot name="form-header" />
      </section>
    </template>

    <ElCollapse
      v-model="expandedGroupKeys"
      class="pro-form__collapse"
      expand-icon-position="left"
    >
      <ElCollapseItem
        v-for="group in groupedSchema"
        :key="group.key"
        :name="group.key"
      >
        <template #title>
          <header class="pro-form__group-header">
            <span class="pro-form__group-title">
              {{ group.label ?? '基本信息' }}
            </span>
            <div
              v-if="slots['group-extra']"
              class="pro-form__group-extra"
              @click.stop
            >
              <slot
                name="group-extra"
                :group="group.key === DEFAULT_GROUP_KEY ? undefined : group.key"
              />
            </div>
          </header>
        </template>
        <template
          v-for="(rowFields, rowIndex) in groupFieldsIntoRows(group.fields)"
          :key="rowIndex"
        >
          <ElRow
            class="pro-form__row"
            :gutter="24"
          >
            <ElCol
              v-for="field in rowFields"
              :key="field.meta.field"
              class="pro-form__field-col"
              :span="getFieldSpan(field)"
              v-bind="getFieldBreakpoints(field)"
            >
              <ProFormField
                :schema="field"
                :model-value="modelValue"
                :disabled="isDisabled"
                :readonly="isReadonly"
                :context="context"
                @update:model-value="handleFieldModelUpdate"
              >
                <template
                  v-if="slots['field-prefix']"
                  #field-prefix="slotProps"
                >
                  <slot
                    name="field-prefix"
                    v-bind="slotProps"
                  />
                </template>
                <template
                  v-if="slots['field-suffix']"
                  #field-suffix="slotProps"
                >
                  <slot
                    name="field-suffix"
                    v-bind="slotProps"
                  />
                </template>
                <template
                  v-if="slots['field-help']"
                  #field-help="slotProps"
                >
                  <slot
                    name="field-help"
                    v-bind="slotProps"
                  />
                </template>
                <template
                  v-if="slots['custom-render']"
                  #custom-render="slotProps"
                >
                  <slot
                    name="custom-render"
                    v-bind="slotProps"
                  />
                </template>
              </ProFormField>
            </ElCol>
          </ElRow>
        </template>
      </ElCollapseItem>
    </ElCollapse>

    <template v-if="slots['form-footer']">
      <section class="pro-form__footer">
        <slot
          name="form-footer"
          :submit="submit"
          :reset="resetFields"
          :validate="validate"
        />
      </section>
    </template>
  </ElForm>
</template>

<style scoped>
/* 表单内边距，符合常见 UI 规范（20–24px） */
.pro-form {
  padding: 24px;
}

.pro-form__header {
  margin-bottom: 16px;
}

.pro-form__collapse {
  margin-bottom: 0;
}

.pro-form__collapse :deep(.el-collapse-item__header) {
  height: auto;
  min-height: 48px;
  padding: 0 4px;
}

.pro-form__collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.pro-form__collapse :deep(.el-collapse-item__content) {
  padding: 20px 24px 24px;
  background-color: var(--el-fill-color-lighter, #f5f7fa);
  border-radius: 8px;
  margin-top: 4px;
}

.pro-form__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px 0 0;
}

.pro-form__group-title {
  font-size: 14px;
  font-weight: 600;
}

.pro-form__group-extra {
  margin-left: 16px;
}

/* 行内多列时，ElRow gutter 已提供水平间距，此处保证表单项底部间距 */
.pro-form__row {
  margin-bottom: 0;
}

.pro-form__row :deep(.el-col) {
  margin-bottom: 0;
}

.pro-form__row :deep(.el-form-item) {
  margin-bottom: 18px;
}

.pro-form__row :deep(.el-col:last-child .el-form-item) {
  margin-bottom: 18px;
}

.pro-form__footer {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .pro-form {
    padding: 16px;
  }

  .pro-form__collapse :deep(.el-collapse-item__content) {
    padding: 16px 16px 20px;
  }

  .pro-form__row {
    --el-row-gutter: 0 !important;
  }

  .pro-form__row :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .pro-form__footer {
    margin-top: 20px;
  }

  .pro-form__footer :deep(.el-button) {
    min-height: 40px;
  }
}
</style>
