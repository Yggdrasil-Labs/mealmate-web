<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { computed, ref, watch } from 'vue'
import {
  ProForm,
  registerDefaultFieldComponents,
} from '@/components/pro-form'
import { showSuccess } from '@/utils/message'

// 在首屏渲染前注册默认字段组件，否则 ProFormField 会提示「未找到字段组件」
registerDefaultFieldComponents()

definePage({
  name: 'ProFormDemo',
  meta: { title: 'ProForm 示例' },
})

const formRef = ref<InstanceType<typeof ProForm> | null>(null)
const form = ref<Record<string, unknown>>({})
const lastSubmit = ref<Record<string, unknown> | null>(null)
const mode = ref<'edit' | 'readonly'>('edit')
const labelPosition = ref<'right' | 'top'>('right')
const loading = ref(false)
const lastChangedFields = ref<string[]>([])

/** 透传上下文：校验/动态 options 可从 context 读取配置，实现“动态计算” */
const formContext = computed(() => ({
  maxRemarkLength: 500,
  minQuantityWhenPublished: 1,
}))

/** 状态变化时清空依赖字段，避免「子状态」等显示旧值或校验报未捕获的 promise */
watch(
  () => form.value.status,
  () => {
    form.value = {
      ...form.value,
      subStatus: undefined,
      publishChannel: undefined,
    }
  },
)

/** 根据当前表单值动态计算 schema，用于展示 runtime.visible / runtime.disabled 等级联能力 */
const schema = computed<FormFieldSchema[]>(() => {
  const status = form.value.status as string | undefined
  const enabled = form.value.enabled as boolean | undefined
  const isPublished = status === 'published'
  const isEnabled = enabled !== false

  return [
    // ---------- 基本信息（分组 + 栅格 12+12、24 + tooltip）----------
    {
      meta: {
        field: 'name',
        label: '名称',
        valueType: 'string',
        required: true,
        defaultValue: '',
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
      },
      ui: {
        component: 'Select',
        props: { clearable: true, placeholder: '请选择' },
        layout: { group: '基本信息', span: 12 },
        options: [
          { label: '草稿', value: 'draft' },
          { label: '已发布', value: 'published' },
        ],
      },
      runtime: {
        validation: {
          rules: [
            {
              trigger: ['change', 'blur'],
              message: '请选择状态',
              validator: (v: unknown) => v != null && v !== '',
            },
          ],
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
        props: { type: 'textarea', rows: 2, placeholder: '选填；状态为已发布时必填；最多 500 字（来自 context）' },
        layout: { group: '基本信息', span: 24 },
      },
      runtime: {
        validation: {
          rules: [
            {
              trigger: ['blur', 'change'],
              message: '已发布时请填写备注',
              when: (formValues: Record<string, unknown>) => formValues.status === 'published',
              validator: (v: unknown) => (v != null && String(v).trim() !== '') as boolean,
            },
            {
              trigger: 'blur',
              message: '备注最多 500 字（context.maxRemarkLength）',
              validator: (v: unknown, _formValues: Record<string, unknown>, context: Record<string, unknown>) => {
                const max = (context?.maxRemarkLength as number) ?? 500
                return (v == null || String(v).length <= max) as boolean
              },
            },
          ],
        },
      },
    },
    // ---------- 扩展信息（InputNumber、DatePicker、多列 8+8+8 + 条件必填）----------
    {
      meta: {
        field: 'quantity',
        label: '数量',
        valueType: 'number',
        required: false,
        defaultValue: 0,
      },
      ui: {
        component: 'InputNumber',
        props: { min: 0, max: 9999, step: 1, placeholder: '数量' },
        layout: { group: '扩展信息', span: 8 },
      },
      runtime: {
        validation: {
          rules: [
            {
              trigger: 'blur',
              message: '数量不能为负数',
              validator: (v: unknown) => typeof v === 'number' && v >= 0,
            },
            {
              trigger: 'blur',
              message: '已发布时数量至少为 1（context）',
              when: (formValues: Record<string, unknown>) => formValues.status === 'published',
              validator: (v: unknown, _formValues: Record<string, unknown>, context: Record<string, unknown>) => {
                const min = (context?.minQuantityWhenPublished as number) ?? 1
                return (typeof v === 'number' && v >= min) as boolean
              },
            },
          ],
        },
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
          breakpoints: { xs: 24, sm: 12, md: 8 },
        },
        tooltip: { content: '保留两位小数；小屏占满宽', placement: 'top' },
      },
    },
    {
      meta: {
        field: 'expiryDate',
        label: '有效期至',
        valueType: 'date',
        required: Boolean(form.value.publishDate),
      },
      ui: {
        component: 'DatePicker',
        props: {
          type: 'date',
          placeholder: '填写发布日期后必填',
          valueFormat: 'YYYY-MM-DD',
        },
        layout: { group: '扩展信息', span: 24 },
      },
      runtime: {
        dependencies: ['publishDate'],
        validation: {
          revalidateOnDependencyChange: true,
          rules: [],
        },
      },
    },
    // ---------- runtime.visible 级联展示：仅「已发布」时显示「发布渠道」----------
    {
      meta: {
        field: 'publishChannel',
        label: '发布渠道',
        valueType: 'string',
        required: false,
      },
      ui: {
        component: 'Select',
        props: { clearable: true, placeholder: '仅状态=已发布时显示' },
        layout: { group: '扩展信息', span: 12 },
      },
      runtime: {
        visible: isPublished,
        options: () => [
          { label: '官网', value: 'web' },
          { label: 'App', value: 'app' },
          { label: '小程序', value: 'miniapp' },
        ],
      },
    },
    // ---------- 高级选项（Switch + 动态 options + runtime.disabled 级联禁用）----------
    {
      meta: {
        field: 'enabled',
        label: '启用',
        valueType: 'boolean',
        required: false,
        defaultValue: true,
      },
      ui: {
        component: 'Switch',
        layout: { group: '高级选项', span: 12 },
      },
    },
    {
      meta: {
        field: 'subStatus',
        label: '子状态',
        valueType: 'string',
        required: false,
      },
      ui: {
        component: 'Select',
        props: { clearable: true, placeholder: '依赖主状态；关闭启用时禁用' },
        layout: { group: '高级选项', span: 12, labelWidth: '120px' },
      },
      runtime: {
        dependencies: ['status'],
        disabled: !isEnabled,
        validation: {
          revalidateOnDependencyChange: true,
          rules: [
            {
              trigger: ['change', 'blur'],
              message: '选择了主状态后请选择子状态（依赖变化会触发重校验）',
              when: (formValues: Record<string, unknown>) => {
                const s = formValues.status as string | undefined
                return s === 'draft' || s === 'published'
              },
              validator: (v: unknown) => v != null && v !== '',
            },
          ],
        },
        options: (formValues: Record<string, unknown>) => {
          const s = formValues.status as string | undefined
          if (s === 'draft')
            return [{ label: '待提交', value: 'pending' }, { label: '已归档', value: 'archived' }]
          if (s === 'published')
            return [{ label: '正常', value: 'normal' }, { label: '已下架', value: 'offline' }]
          return []
        },
      },
    },
    // ---------- 其他（栅格 16+8、字段只读、Tooltip 多位置）----------
    {
      meta: {
        field: 'code',
        label: '编码',
        valueType: 'string',
        required: false,
        defaultValue: '',
      },
      ui: {
        component: 'Input',
        props: { placeholder: '选填，占 16 列' },
        layout: { group: '其他', span: 16 },
        tooltip: { content: '左侧标签悬停可看说明', placement: 'left' },
      },
    },
    {
      meta: {
        field: 'readonlyDemo',
        label: '只读示例',
        valueType: 'string',
        required: false,
        defaultValue: '编辑模式下此处也仅读',
      },
      ui: {
        component: 'Input',
        props: { placeholder: '' },
        layout: { group: '其他', span: 8 },
        readonly: true,
      },
    },
  ]
})

function handleSubmit(values: Record<string, unknown>) {
  lastSubmit.value = { ...values }
  showSuccess('提交成功')
}

function handleReset(_values: Record<string, unknown>) {
  lastSubmit.value = null
  // ProForm 已通过 update:modelValue 同步回 form，此处无需重复赋值
}

function handleValuesChange(changed: Record<string, unknown>) {
  lastChangedFields.value = Object.keys(changed)
}

function triggerLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSuccess('加载完成')
  }, 2000)
}
</script>

<template>
  <div class="pro-form-demo-page">
    <h1 class="page-title">
      ProForm 示例
    </h1>
    <p class="page-desc">
      分组折叠、栅格与响应式 breakpoints、多种控件、Tooltip、字段级 labelWidth、ui.readonly。
      <strong>Runtime 能力</strong>：级联展示（<code>runtime.visible</code> 随表单值计算）、级联禁用（<code>runtime.disabled</code>）、
      动态选项（<code>dependencies</code> + <code>runtime.options</code>）、条件校验（<code>when</code>）、
      依赖变化重校验（<code>revalidateOnDependencyChange</code>）、<code>context</code> 透传（校验/options 中读取配置）。
    </p>

    <div class="demo-toolbar">
      <el-button
        :type="mode === 'edit' ? 'primary' : undefined"
        @click="mode = 'edit'"
      >
        编辑
      </el-button>
      <el-button
        :type="mode === 'readonly' ? 'primary' : undefined"
        @click="mode = 'readonly'"
      >
        只读
      </el-button>
      <el-button
        :type="labelPosition === 'right' ? 'primary' : undefined"
        @click="labelPosition = 'right'"
      >
        标签右
      </el-button>
      <el-button
        :type="labelPosition === 'top' ? 'primary' : undefined"
        @click="labelPosition = 'top'"
      >
        标签上
      </el-button>
      <el-button :loading="loading" @click="triggerLoading">
        模拟加载 2s
      </el-button>
    </div>

    <p v-if="lastChangedFields.length" class="changed-tip">
      最近变更字段：<code>{{ lastChangedFields.join(', ') }}</code>
    </p>

    <ProForm
      ref="formRef"
      v-model="form"
      :schema="schema"
      :context="formContext"
      :mode="mode"
      :layout="{ labelPosition }"
      :loading="loading"
      @submit="handleSubmit"
      @reset="handleReset"
      @values-change="handleValuesChange"
    >
      <template #form-header>
        <p class="form-header-tip">
          填写下方表单后点击「提交」会先校验，通过后触发 submit 事件。
          可切换「编辑/只读」；改「状态」观察「子状态」选项联动与「发布渠道」显隐（runtime.visible）；
          关闭「启用」后「子状态」禁用（runtime.disabled）；状态=已发布时备注/有效期必填、数量≥1（when + context）；
          依赖变化会触发子状态重校验（revalidateOnDependencyChange）。
        </p>
      </template>
      <template #form-footer="{ submit, reset }">
        <el-button
          v-if="mode === 'edit'"
          type="primary"
          @click="submit()"
        >
          提交
        </el-button>
        <el-button @click="reset()">
          重置
        </el-button>
      </template>
    </ProForm>

    <section v-if="lastSubmit" class="submit-result">
      <h3>最近一次提交结果</h3>
      <pre>{{ JSON.stringify(lastSubmit, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.pro-form-demo-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 20px;
}

.page-desc {
  margin: 0 0 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.demo-toolbar {
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.demo-toolbar .el-button + .el-button {
  margin-left: 0;
}

.changed-tip {
  margin: -8px 0 16px;
  font-size: 12px;
  color: var(--el-color-primary);
}

.changed-tip code {
  padding: 2px 6px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.form-header-tip {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.submit-result {
  margin-top: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.submit-result h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.submit-result pre {
  margin: 0;
  font-size: 12px;
  overflow: auto;
}
</style>
