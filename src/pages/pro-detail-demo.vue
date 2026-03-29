<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { computed, ref } from 'vue'
import { ProDetail } from '@/components/pro-detail'
import {
  ProForm,
  registerDefaultFieldComponents,
} from '@/components/pro-form'

registerDefaultFieldComponents()

definePage({
  name: 'ProDetailDemo',
  meta: { title: 'ProDetail 示例' },
})

const formRef = ref<InstanceType<typeof ProForm> | null>(null)
const form = ref<Record<string, unknown>>({
  name: '示例商品',
  status: 'published',
  remark: '这是一个 ProDetail 的演示示例。',
  quantity: 10,
  publishDate: '2026-03-16',
  amount: 199.99,
  expiryDate: '2026-12-31',
  publishChannel: 'web',
  enabled: true,
})

const detailContext = computed(() => ({
  statusTextMap: {
    draft: '草稿',
    published: '已发布',
  },
}))

const schema = computed<FormFieldSchema[]>(() => [
  {
    meta: {
      field: 'name',
      label: '名称',
      valueType: 'string',
      required: true,
      defaultValue: '',
      // 仅详情使用的空值占位
      // 由 DetailFieldMeta 扩展，Form 不消费
      emptyText: '未填写名称',
    },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入名称' },
      layout: { group: '基本信息', span: 12 },
      tooltip: {
        content: '用于展示和检索的显示名称',
        placement: 'top',
      },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      required: true,
      defaultValue: 'draft',
      // 仅 Detail 使用
      emptyText: '未知状态',
    },
    ui: {
      component: 'Tag',
      layout: { group: '基本信息', span: 12 },
      // 仅 Detail 使用
      copyable: true,
      tooltip: {
        content: '状态由流程流转自动维护',
        placement: 'top',
      },
    },
    runtime: {
      transform: {
        display: (value: unknown) => {
          const map = detailContext.value.statusTextMap as Record<string, string>
          return map[String(value)] ?? value
        },
      },
    },
  },
  {
    meta: {
      field: 'remark',
      label: '备注',
      valueType: 'string',
      required: false,
    },
    ui: {
      component: 'Input',
      props: { type: 'textarea', rows: 2 },
      layout: { group: '基本信息', span: 24 },
      tooltip: {
        content: '可用于补充说明、备注等信息',
        placement: 'top',
      },
    },
  },
  {
    meta: {
      field: 'amount',
      label: '金额',
      valueType: 'number',
      required: false,
    },
    ui: {
      component: 'InputNumber',
      props: {
        min: 0,
        precision: 2,
        placeholder: '0.00',
      },
      layout: {
        group: '扩展信息',
        span: 8,
      },
      tooltip: { content: '金额仅用于展示', placement: 'top' },
    },
  },
  {
    meta: {
      field: 'publishDate',
      label: '发布日期',
      valueType: 'date',
      required: false,
    },
    ui: {
      component: 'DatePicker',
      props: {
        type: 'date',
        placeholder: '选择日期',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: '扩展信息', span: 8 },
    },
  },
  {
    meta: {
      field: 'expiryDate',
      label: '有效期至',
      valueType: 'date',
      required: false,
    },
    ui: {
      component: 'DatePicker',
      props: {
        type: 'date',
        placeholder: '有效期',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: '扩展信息', span: 8 },
    },
  },
])
</script>

<template>
  <div class="pro-detail-demo">
    <section class="pro-detail-demo__left">
      <h2 class="pro-detail-demo__title">
        表单编辑（ProForm）
      </h2>
      <ProForm
        ref="formRef"
        v-model="form"
        :schema="schema"
        :context="detailContext"
        mode="edit"
        :layout="{ labelWidth: 120 }"
      />
    </section>

    <section class="pro-detail-demo__right">
      <h2 class="pro-detail-demo__title">
        详情展示（ProDetail）
      </h2>
      <ProDetail
        :schema="schema"
        :data="form"
        :context="detailContext"
        :layout="{ column: 3, border: true, labelWidth: 120 }"
      >
        <template #detail-header>
          <div class="pro-detail-demo__header">
            <h3>示例详情：{{ form.name || '未命名' }}</h3>
            <p class="pro-detail-demo__sub-title">
              使用与 ProForm 共用的 Schema 渲染详情。
            </p>
          </div>
        </template>
      </ProDetail>
    </section>
  </div>
</template>

<style scoped>
.pro-detail-demo {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.2fr);
  gap: 24px;
  padding: 24px;
  align-items: flex-start;
}

.pro-detail-demo__left,
.pro-detail-demo__right {
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pro-detail-demo__title {
  margin: 0;
  padding: 16px 24px 0;
  font-size: 16px;
  font-weight: 600;
}

.pro-detail-demo__header {
  margin-bottom: 8px;
}

.pro-detail-demo__sub-title {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
}

@media (max-width: 1200px) {
  .pro-detail-demo {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
