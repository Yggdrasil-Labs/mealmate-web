# ProDetail 组件说明

基于与 ProForm 相同的 **Schema** 描述字段，用 `ElDescriptions` + 分组折叠做只读详情展示；支持展示转换、空值占位、标签 Tooltip、复制与自定义渲染。

---

## 概述

- **位置**：`src/components/pro-detail`
- **依赖**：Vue 3 Composition API、Element Plus 2.x、项目内类型 `@/types/pro-form` 与 `src/components/pro-detail/types.ts`
- **能力**：`schema` 分组与 `runtime.visible` 过滤、`data` 按 `meta.field` 取值、`runtime.transform.display` 格式化展示、`ui.component === 'Tag'` 时用标签样式、`ui.copyable` 一键复制
- **共享协议**：基础字段语义见 [共享字段协议](./shared-field-protocol.md)
- **API 约定**：slot / 事件 / expose 命名规范见 [组件 API 约定](./component-api-conventions.md)

---

## 与 ProForm 的关系

- 可直接复用编辑页的 `FormFieldSchema[]`，在 **详情扩展字段** 上增加 ProDetail 专用配置即可（见 [Schema 扩展](#schema-扩展detailfieldschema)）。
- ProForm 不读取 `meta.emptyText`、`ui.copyable` 等扩展，互不影响。
- 更完整的表单能力见 [ProForm 组件说明](./pro-form.md)。

边界建议：

- 需要编辑、校验、提交时，使用 `ProForm`
- 需要稳定的只读展示时，使用 `ProDetail`
- `ProForm mode="readonly"` 只适合编辑表单流程中的临时只读态，不替代正式详情页

---

## 基本用法

```vue
<script setup lang="ts">
import type { FormFieldSchema } from '@/types/pro-form'
import { ProDetail } from '@/components/pro-detail'

const data: Record<string, unknown> = {
  name: '示例',
  status: 'published',
}

const schema: FormFieldSchema[] = [
  {
    meta: {
      field: 'name',
      label: '名称',
      valueType: 'string',
      required: true,
      emptyText: '未填写',
    },
    ui: {
      component: 'Input',
      layout: { group: '基本信息', span: 12 },
    },
  },
  {
    meta: {
      field: 'status',
      label: '状态',
      valueType: 'string',
      required: true,
    },
    ui: {
      component: 'Tag',
      layout: { group: '基本信息', span: 12 },
      copyable: true,
    },
    runtime: {
      transform: {
        display: (v) => (v === 'published' ? '已发布' : String(v)),
      },
    },
  },
]
</script>

<template>
  <ProDetail
    :schema="schema"
    :data="data"
    :layout="{ column: 3, border: true, size: 'default' }"
  />
</template>
```

- `data` 为展示数据源，键与 `meta.field` 对应；缺键时按「空值」处理（见 [空值与展示](#空值与展示)）。

---

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `schema` | `FormFieldSchema[]` | 必填 | 字段 Schema（可与 ProForm 共用，扩展字段见下） |
| `data` | `Record<string, unknown>` | 必填 | 详情数据对象 |
| `context` | `ProDetailContext` | — | 透传上下文；类型同 `ProFormContext`，供插槽或后续扩展使用 |
| `layout` | `ProDetailLayout` | — | 描述列表与外观，见下表 |

### ProDetailLayout

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `column` | `number` | `3` | `ElDescriptions` 列数 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 描述列表尺寸 |
| `border` | `boolean` | `true` | 是否带边框 |
| `labelWidth` | `string \| number` | `120` | 标签宽度（传给 `ElDescriptions`） |

---

## 插槽

| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| `detail-header` | — | 顶部主区域（标题、说明等） |
| `detail-header-extra` | — | 顶部右侧扩展（操作按钮等） |
| `group-extra` | `{ group?: string }` | 分组标题右侧；无分组名时 `group` 为 `undefined`（默认组） |
| `field-suffix` | 见下表 | 字段内容后追加 |
| `field-help` | 见下表 | 帮助说明区域 |
| `custom-render` | 见下表 | 完全自定义该字段整块内容 |

### 字段类插槽作用域（`field-suffix` / `field-help` / `custom-render`）

由 `ProDetailField` 透出，写在 `<ProDetail>` 上即可逐字段匹配。

| 属性 | 类型 | 说明 |
|------|------|------|
| `schema` | `DetailFieldSchema` | 当前字段 Schema（含详情扩展类型） |
| `value` | `unknown` | **展示用**值（已走 `transform.display`，空值时已替换为 `emptyText` 或 `'-'`） |
| `raw-value` | `unknown` | `data[field]` 原始值 |
| `data` | `Record<string, unknown>` | 完整详情数据 |
| `context` | `ProDetailContext \| undefined` | 与 Props `context` 一致 |

**`custom-render` 行为**：未在 `<ProDetail>` 上提供该插槽时，各字段使用 `ProDetailField` 内置结构（文本或 `Tag`、`field-suffix`、`field-help`、`copyable` 复制按钮）。一旦提供 `#custom-render`，会**转发给每一个字段**；页面插槽内容会**整体替换**单字段的默认区（不再自动出现内置 Tag/复制等），须在插槽内按 `schema` / `field` 分支，对未自定义的字段自行渲染与默认等价的内容。

---

## Schema 扩展（DetailFieldSchema）

类型定义见 `src/components/pro-detail/types.ts`，在 `FormFieldSchema` 基础上扩展：

### meta（DetailFieldMeta）

| 属性 | 类型 | 说明 |
|------|------|------|
| `emptyText` | `string` | 空值（`null` / `undefined` / `''`）时的占位文案，默认 `'-'` |

其余与 `FormFieldMeta` 一致（`field`、`label`、`valueType`、`required`、`defaultValue` 等）；**详情页不跑校验**，`required` 仅作语义保留。

### ui（DetailFieldUi）

| 属性 | 类型 | 说明 |
|------|------|------|
| `copyable` | `boolean` | 为 `true` 时在值旁显示复制按钮，写入剪贴板并 `ElMessage` 提示 |

其余与 `FormFieldUi` 一致。详情内置展示：

- `component === 'Tag'`：使用 `ElTag` 包裹展示文案。
- 其他 `component`：纯文本展示（**不**走 ProForm 的字段组件注册表，无需 `registerDefaultFieldComponents`）。

### runtime

- `visible === false`：该字段不渲染。
- `transform.display`：在判断空值**之前**对原始值做转换；转换抛错时回退为原始值。

---

## 布局与分组

### 分组

与 ProForm 相同：使用 `ui.layout.group`；未设置的分组归入默认组，折叠标题为「基本信息」。

### Descriptions 项 `span`（列占位）

根据表单 Schema 中的 `ui.layout.span`（24 栅格语义）映射到 `ElDescriptionsItem` 的 `span`：

| `layout.span` | 在 `column = n` 下的描述项 span |
|---------------|----------------------------------|
| `≥ 24` | `n`（占满一行） |
| `≥ 12` | `min(2, n)` |
| 其他 | `1` |

用于与 ProForm 两列/三列字段宽度习惯大致对齐，而非再套一层 `ElRow`。

---

## 空值与展示

- 空值判定：`null`、`undefined`、空字符串 `''`。
- 展示顺序：取 `data[field]` → 若有 `runtime.transform.display` 则转换 → 若仍为空则显示 `meta.emptyText ?? '-'`。

---

## 空 Schema / 无可见字段

当 `schema` 为空，或所有字段 `runtime.visible === false` 时，渲染「暂无可展示字段」占位，不展示折叠面板。

---

## 示例页面

- **页面**：`src/pages/pro-detail-demo.vue`
- **路由**：`src/router/index.ts` 中一般为 `/pro-detail-demo`（以仓库内配置为准）

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/components/pro-detail/types.ts` | `DetailFieldSchema`、`ProDetailContext` |
| `src/components/pro-detail/ProDetail.vue` | 根组件 |
| `src/components/pro-detail/ProDetailField.vue` | 单字段展示、复制、`custom-render` |
| `src/components/pro-detail/index.ts` | 导出 |
| `src/types/pro-form.ts` | 基础 `FormFieldSchema` 类型 |

展示 renderer 的后续收敛预研见 [Renderer Layer Spike](../plans/2026-03-28-renderer-layer-spike.md)。
