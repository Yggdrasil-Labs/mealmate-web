# ProDialog

## 组件定位

`ProDialog` 是面向企业级页面交互的统一弹层容器，基于 `Element Plus` `ElDialog` 封装。它负责：

- 统一打开 / 关闭语义
- 统一遮罩、ESC、右上角关闭和编程式关闭策略
- 统一标题区、内容区、底部操作区
- 提供确认弹窗的默认语义
- 作为 `ProForm` / `ProDetail` 的外层容器

它不负责：

- 数据请求
- 业务提交流程
- 表单 schema 协议
- 详情数据装配

---

## 与其他组件的关系

- 与 `ProForm`
  - `ProDialog` 只提供容器与底部确认区
  - 表单校验与提交仍由 `ProForm` 负责
- 与 `ProDetail`
  - `ProDialog` 只提供容器与关闭语义
  - 详情展示仍由 `ProDetail` 负责

slot / 事件 / expose 命名规范见 [组件 API 约定](./component-api-conventions.md)。

---

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProDialog } from '@/components/pro-dialog'

const visible = ref(false)
</script>

<template>
  <el-button @click="visible = true">
    打开弹窗
  </el-button>

  <ProDialog
    v-model="visible"
    title="基础弹窗"
  >
    弹窗内容
  </ProDialog>
</template>
```

---

## Props

| 名称 | 说明 | 默认值 |
|------|------|--------|
| `modelValue` | 是否显示弹窗 | 必填 |
| `title` | 标题 | `''` |
| `mode` | `custom` 或 `confirm`，`confirm` 会使用更紧凑的默认宽度 | `custom` |
| `width` | 弹窗宽度 | `custom` 沿用 `ElDialog` 默认宽度，`confirm` 未传时默认 `480` |
| `placement` | 弹窗位置 | `center` |
| `showClose` | 是否显示右上角关闭按钮 | `true` |
| `maskClosable` | 是否允许点击遮罩关闭 | `true` |
| `escClosable` | 是否允许按 ESC 关闭 | `true` |
| `showFooter` | 是否显示底部区域 | `true` |
| `loading` | 内容区加载态 | `false` |
| `confirmLoading` | 确认按钮加载态 | `false` |
| `confirmDisabled` | 确认按钮禁用态 | `false` |
| `confirmText` | 确认按钮文案 | `确认` |
| `cancelText` | 取消按钮文案 | `取消` |
| `confirmType` | 确认按钮类型 | `primary` |
| `closeOnConfirm` | 点击确认后是否自动走关闭流程 | `true` |
| `destroyOnClose` | 关闭后是否销毁内容 | `true` |
| `bodyClass` | 内容区 class | `''` |
| `footerAlign` | 底部对齐方式 | `right` |
| `beforeClose` | 关闭前钩子 | `undefined` |

---

## 事件

| 事件 | 说明 |
|------|------|
| `update:modelValue` | 打开状态变化 |
| `open` | 开始打开时触发 |
| `opened` | 打开完成后触发 |
| `confirm` | 点击确认按钮时触发 |
| `cancel` | 点击取消按钮时触发 |
| `close` | 开始关闭时触发 |
| `closed` | 关闭完成后触发 |

`cancel` 只用于显式取消动作，不会替代右上角关闭、遮罩关闭或 ESC 关闭。

---

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 弹窗正文 |
| `header-extra` | 标题右侧扩展 |
| `body-prefix` | 正文前置说明 |
| `body-suffix` | 正文后置说明 |
| `footer` | 完全自定义底部 |
| `footer-extra` | 默认底部按钮区左侧附加内容 |

如果提供了 `footer` 插槽，默认取消 / 确认按钮不会渲染。

---

## 暴露方法

通过 `ref` 可以调用：

- `open()`
- `close()`
- `toggle(force?)`

---

## 使用建议

- 轻量提示用 `custom` 模式
- 删除、撤回、离开页等单一决策用 `confirm` 模式
- 表单弹窗优先让 `ProForm` 控制提交与校验
- 详情弹窗优先让 `ProDetail` 控制内容渲染

---

## 组合示例

### 1. 表单弹窗

```vue
<ProDialog
  v-model="visible"
  title="编辑信息"
  confirm-text="保存"
  :close-on-confirm="false"
  @confirm="formRef?.submit()"
>
  <ProForm
    ref="formRef"
    v-model="form"
    :schema="schema"
    mode="edit"
    @submit="handleSubmit"
  />
</ProDialog>
```

### 2. 详情弹窗

```vue
<ProDialog
  v-model="visible"
  title="详情预览"
>
  <ProDetail
    :schema="schema"
    :data="data"
  />

  <template #footer="{ close }">
    <el-button @click="close">
      关闭
    </el-button>
  </template>
</ProDialog>
```
