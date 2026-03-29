<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { computed, ref } from 'vue'
import {
  ProDetail,
} from '@/components/pro-detail'
import { ProDialog } from '@/components/pro-dialog'
import {
  ProForm,
  registerDefaultFieldComponents,
} from '@/components/pro-form'
import { showSuccess } from '@/utils/message'

registerDefaultFieldComponents()

definePage({
  name: 'ProDialogDemo',
  meta: { title: 'ProDialog 示例' },
})

const formRef = ref<InstanceType<typeof ProForm> | null>(null)

const simpleVisible = ref(false)
const confirmVisible = ref(false)
const formVisible = ref(false)
const detailVisible = ref(false)

const formValues = ref<Record<string, unknown>>({
  name: 'ProDialog 组件',
  status: 'draft',
  remark: 'ProDialog 支持受控、确认和组合场景。',
  quantity: 3,
  publishDate: '2026-03-28',
  amount: 288.88,
  expiryDate: '2026-12-31',
})

const detailData = computed(() => ({
  ...formValues.value,
  status: formValues.value.status,
}))

const detailTitle = computed(() =>
  String(formValues.value.name ?? '未命名记录'),
)

const schema: FormFieldSchema[] = [
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
      props: {
        placeholder: '请输入名称',
        clearable: true,
      },
      layout: { group: '基本信息', span: 12 },
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
      props: { clearable: true, placeholder: '请选择状态' },
      layout: { group: '基本信息', span: 12 },
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
        { label: '已归档', value: 'archived' },
      ],
    },
    runtime: {
      transform: {
        display(value) {
          const map: Record<string, string> = {
            draft: '草稿',
            published: '已发布',
            archived: '已归档',
          }
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
      props: { type: 'textarea', rows: 3, placeholder: '写点补充说明' },
      layout: { group: '基本信息', span: 24 },
    },
  },
  {
    meta: {
      field: 'quantity',
      label: '数量',
      valueType: 'number',
      required: false,
    },
    ui: {
      component: 'InputNumber',
      props: {
        min: 0,
        max: 9999,
        step: 1,
        placeholder: '数量',
      },
      layout: { group: '扩展信息', span: 8 },
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
        placeholder: '选择日期',
        valueFormat: 'YYYY-MM-DD',
      },
      layout: { group: '扩展信息', span: 8 },
    },
  },
]

function openSimpleDialog() {
  simpleVisible.value = true
}

function openConfirmDialog() {
  confirmVisible.value = true
}

function openFormDialog() {
  formVisible.value = true
}

function openDetailDialog() {
  detailVisible.value = true
}

function handleConfirmAction() {
  showSuccess('确认动作已触发')
  confirmVisible.value = false
}

function handleFormConfirm() {
  formRef.value?.submit()
}

function handleFormSubmit(values: Record<string, unknown>) {
  formValues.value = { ...values }
  showSuccess('表单已保存')
  formVisible.value = false
}
</script>

<template>
  <div class="dialog-demo">
    <section class="dialog-demo__hero">
      <div class="dialog-demo__hero-inner">
        <p class="dialog-demo__eyebrow">
          公共弹层容器
        </p>
        <h1 class="dialog-demo__title">
          ProDialog
        </h1>
        <p class="dialog-demo__subtitle">
          统一容器、确认语义、关闭拦截和组合式内容都放在一个 ProDialog 入口里。
        </p>
        <div class="dialog-demo__hero-actions">
          <el-button type="primary" @click="openSimpleDialog">
            打开基础弹窗
          </el-button>
          <el-button @click="openDetailDialog">
            预览详情组合
          </el-button>
        </div>
      </div>
    </section>

    <section class="dialog-demo__cards">
      <el-card class="dialog-demo__card" shadow="hover">
        <template #header>
          <div class="dialog-demo__card-header">
            <div>
              <h2>基础弹窗</h2>
              <p>演示受控开关、默认 footer、body-prefix/body-suffix。</p>
            </div>
            <el-button @click="openSimpleDialog">
              打开
            </el-button>
          </div>
        </template>
        <p class="dialog-demo__card-copy">
          适合轻量说明、临时提示和小型流程中断。
        </p>
      </el-card>

      <el-card class="dialog-demo__card" shadow="hover">
        <template #header>
          <div class="dialog-demo__card-header">
            <div>
              <h2>确认弹窗</h2>
              <p>演示 <code class="dialog-demo__inline-code">mode="confirm"</code>、危险按钮和确认后关闭。</p>
            </div>
            <el-button type="danger" @click="openConfirmDialog">
              打开
            </el-button>
          </div>
        </template>
        <p class="dialog-demo__card-copy">
          用于删除、撤回、离开页面等单一决策。
        </p>
      </el-card>

      <el-card class="dialog-demo__card" shadow="hover">
        <template #header>
          <div class="dialog-demo__card-header">
            <div>
              <h2>表单组合</h2>
              <p>演示 <code class="dialog-demo__inline-code">ProDialog + ProForm</code>，确认按钮转成保存动作。</p>
            </div>
            <el-button @click="openFormDialog">
              编辑
            </el-button>
          </div>
        </template>
        <p class="dialog-demo__card-copy">
          表单提交成功后关闭弹窗，失败时保持当前上下文。
        </p>
      </el-card>

      <el-card class="dialog-demo__card" shadow="hover">
        <template #header>
          <div class="dialog-demo__card-header">
            <div>
              <h2>详情组合</h2>
              <p>演示 <code class="dialog-demo__inline-code">ProDialog + ProDetail</code>，footer 由插槽完全控制。</p>
            </div>
            <el-button @click="openDetailDialog">
              查看
            </el-button>
          </div>
        </template>
        <p class="dialog-demo__card-copy">
          适合只读预览、日志、状态说明和轻量信息展示。
        </p>
      </el-card>
    </section>

    <ProDialog
      v-model="simpleVisible"
      title="基础弹窗"
      :width="560"
    >
      <template #body-prefix>
        <el-alert
          title="这里展示的是 ProDialog 的容器能力。"
          type="info"
          :closable="false"
          show-icon
        />
      </template>

      <p>
        它可以承载很轻的说明、校验提示或一步到位的确认行为。
      </p>

      <template #body-suffix>
        <p class="dialog-demo__muted">
          关闭按钮、遮罩关闭和 ESC 关闭都遵循统一协议。
        </p>
      </template>
    </ProDialog>

    <ProDialog
      v-model="confirmVisible"
      mode="confirm"
      title="删除记录"
      :width="520"
      confirm-type="danger"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="handleConfirmAction"
    >
      <p>
        删除后将无法恢复，请确认是否继续。
      </p>
    </ProDialog>

    <ProDialog
      v-model="formVisible"
      title="编辑信息"
      :width="760"
      confirm-text="保存"
      :close-on-confirm="false"
      @confirm="handleFormConfirm"
    >
      <template #body-prefix>
        <el-alert
          title="保存前会先调用 ProForm.submit() 做校验。"
          type="warning"
          :closable="false"
          show-icon
        />
      </template>

      <ProForm
        ref="formRef"
        v-model="formValues"
        :schema="schema"
        mode="edit"
        :layout="{ labelWidth: '96px' }"
        @submit="handleFormSubmit"
      />

      <template #footer-extra>
        <span class="dialog-demo__footer-hint">保存后会同步更新详情预览。</span>
      </template>
    </ProDialog>

    <ProDialog
      v-model="detailVisible"
      title="详情预览"
      :width="880"
      :show-footer="true"
      footer-align="right"
    >
      <template #header-extra>
        <el-tag type="success">
          只读
        </el-tag>
      </template>

      <ProDetail
        :schema="schema"
        :data="detailData"
        :layout="{ column: 3, border: true, labelWidth: 120 }"
      >
        <template #detail-header>
          <div class="dialog-demo__detail-header">
            <h3>{{ detailTitle }}</h3>
            <p>对话框只是容器，详情内容仍然复用现有 ProDetail 协议。</p>
          </div>
        </template>
      </ProDetail>

      <template #footer="{ close }">
        <div class="dialog-demo__detail-footer">
          <el-button @click="close">
            关闭
          </el-button>
          <el-button type="primary" @click="showSuccess('这里可以放额外动作')">
            额外动作
          </el-button>
        </div>
      </template>
    </ProDialog>
  </div>
</template>

<style scoped lang="scss">
.dialog-demo {
  position: relative;
  padding: 28px 24px 40px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(102, 126, 234, 0.18), transparent 34%),
    radial-gradient(circle at top right, rgba(118, 75, 162, 0.16), transparent 30%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.98));
}

.dialog-demo::before {
  content: '';
  position: absolute;
  inset: 80px auto auto -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.18);
  filter: blur(4px);
}

.dialog-demo__hero {
  position: relative;
  z-index: 1;
  margin: 0 auto 24px;
  max-width: 1200px;
  padding: 28px 28px 26px;
  border-radius: 24px;
  color: #fff;
  background: linear-gradient(135deg, #2f3a8f 0%, #5b4b8a 45%, #6b5ca5 100%);
  box-shadow: 0 24px 60px rgba(47, 58, 143, 0.22);
}

.dialog-demo__hero-inner {
  max-width: 760px;
}

.dialog-demo__eyebrow {
  margin: 0 0 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.78;
}

.dialog-demo__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.1;
}

.dialog-demo__subtitle {
  margin: 14px 0 0;
  max-width: 700px;
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.92;
}

.dialog-demo__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.dialog-demo__cards {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  max-width: 1200px;
  margin: 0 auto;
}

.dialog-demo__card {
  border: 0;
  border-radius: 20px;
  overflow: hidden;
}

.dialog-demo__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0 0 6px;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.dialog-demo__inline-code {
  padding: 0 0.35rem;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.12);
  color: #3949ab;
  font-size: 0.92em;
}

.dialog-demo__card-copy {
  margin: 0;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.dialog-demo__muted {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.dialog-demo__footer-hint {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.dialog-demo__detail-header h3 {
  margin: 0;
  font-size: 18px;
}

.dialog-demo__detail-header p {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
}

.dialog-demo__detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 960px) {
  .dialog-demo__cards {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .dialog-demo {
    padding: 18px 14px 28px;
  }

  .dialog-demo__hero {
    padding: 22px 18px 20px;
    border-radius: 20px;
  }
}
</style>
