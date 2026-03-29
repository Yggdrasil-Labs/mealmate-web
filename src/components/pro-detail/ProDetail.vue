<script setup lang="ts">
import type { ProDetailContext } from './types'
import type { FormFieldSchema } from '@/types/pro-form'
import { ElCollapse, ElCollapseItem, ElDescriptions, ElDescriptionsItem, ElTooltip } from 'element-plus'
import { computed, ref, useSlots, watch } from 'vue'
import { useAppBreakpoint } from '@/composables'
import ProDetailField from './ProDetailField.vue'

defineOptions({ name: 'ProDetail' })

const props = defineProps<{
  schema: FormFieldSchema[]
  data: Record<string, unknown>
  context?: ProDetailContext
  layout?: ProDetailLayout
}>()

interface ProDetailLayout {
  column?: number
  size?: 'large' | 'default' | 'small'
  border?: boolean
  labelWidth?: string | number
}

const slots = useSlots()
const { isMobile } = useAppBreakpoint()

interface DetailGroup {
  key: string
  label?: string
  fields: FormFieldSchema[]
}

const DEFAULT_GROUP_KEY = '__default__'

function isFieldVisible(field: FormFieldSchema): boolean {
  return field.runtime?.visible !== false
}

function getDescSpan(field: FormFieldSchema, col: number): number {
  const span = field.ui.layout?.span ?? 24
  if (span >= 24)
    return col
  if (span >= 12)
    return Math.min(2, col)
  return 1
}

const groupedSchema = computed<DetailGroup[]>(() => {
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

const expandedGroupKeys = ref<string[]>([])

watch(
  groupedSchema,
  (groups) => {
    const keys = groups.map(g => g.key)
    expandedGroupKeys.value = [...new Set([...expandedGroupKeys.value, ...keys])]
  },
  { immediate: true },
)

const column = computed(() => isMobile.value ? 1 : (props.layout?.column ?? 3))
const size = computed(() => props.layout?.size ?? 'default')
const border = computed(() => props.layout?.border ?? true)
const labelWidth = computed(() => props.layout?.labelWidth ?? 120)
</script>

<template>
  <section class="pro-detail">
    <header
      v-if="slots['detail-header'] || slots['detail-header-extra']"
      class="pro-detail__header"
    >
      <div class="pro-detail__header-main">
        <slot name="detail-header" />
      </div>
      <div class="pro-detail__header-extra">
        <slot name="detail-header-extra" />
      </div>
    </header>

    <ElCollapse
      v-if="groupedSchema.length > 0"
      v-model="expandedGroupKeys"
      class="pro-detail__collapse"
      expand-icon-position="left"
    >
      <ElCollapseItem
        v-for="group in groupedSchema"
        :key="group.key"
        :name="group.key"
      >
        <template #title>
          <header class="pro-detail__group-header">
            <span class="pro-detail__group-title">
              {{ group.label ?? '基本信息' }}
            </span>
            <div
              v-if="slots['group-extra']"
              class="pro-detail__group-extra"
              @click.stop
            >
              <slot
                name="group-extra"
                :group="group.key === DEFAULT_GROUP_KEY ? undefined : group.key"
              />
            </div>
          </header>
        </template>

        <ElDescriptions
          :column="column"
          :border="border"
          :size="size"
          :label-width="labelWidth"
          class="pro-detail__descriptions"
        >
          <ElDescriptionsItem
            v-for="field in group.fields"
            :key="field.meta.field"
            :span="getDescSpan(field, column)"
          >
            <template #label>
              <span>
                {{ field.meta.label }}
                <ElTooltip
                  v-if="field.ui.tooltip"
                  :content="field.ui.tooltip.content"
                  :placement="field.ui.tooltip.placement ?? 'top'"
                >
                  <span class="pro-detail__label-tooltip">?</span>
                </ElTooltip>
              </span>
            </template>

            <ProDetailField
              :schema="field"
              :data="data"
              :context="context"
            >
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
            </ProDetailField>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCollapseItem>
    </ElCollapse>

    <div
      v-else
      class="pro-detail__empty"
    >
      暂无可展示字段
    </div>
  </section>
</template>

<style scoped>
.pro-detail {
  padding: 24px;
}

.pro-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pro-detail__header-main {
  flex: 1;
  min-width: 0;
}

.pro-detail__header-extra {
  margin-left: 16px;
}

.pro-detail__collapse {
  margin-bottom: 0;
}

.pro-detail__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px 0 0;
}

.pro-detail__group-title {
  font-size: 14px;
  font-weight: 600;
}

.pro-detail__group-extra {
  margin-left: 16px;
}

.pro-detail__descriptions {
  margin-top: 8px;
}

.pro-detail__label-tooltip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  border-radius: 50%;
  font-size: 12px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  color: var(--el-text-color-secondary, #909399);
  cursor: default;
}

.pro-detail__empty {
  padding: 16px 8px;
  color: var(--el-text-color-secondary, #909399);
}

@media (max-width: 768px) {
  .pro-detail {
    padding: 16px;
  }

  .pro-detail__header,
  .pro-detail__group-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .pro-detail__header-extra,
  .pro-detail__group-extra {
    margin-left: 0;
  }
}
</style>
