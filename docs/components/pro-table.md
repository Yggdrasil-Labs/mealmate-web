# ProTable 组件说明

基于 **Schema（meta / ui / runtime）** 驱动的列表组件，内置常用列渲染器，支持分页、排序、行选、工具栏与空/错/加载态；与 Element Plus `ElTable` 体系兼容。

---

## 概述

- **位置**：`src/components/pro-table`
- **依赖**：Vue 3、Element Plus 2.x、类型 `@/types/pro-table`
- **设计文档**：[Spec](../superpowers/specs/2026-03-22-pro-table-design.md)
- **API 约定**：slot / 事件 / expose 命名规范见 [组件 API 约定](./component-api-conventions.md)

---

## 注册列组件（按需）

使用 **`ui.component`** 为 `Tag`、`Link` 等时，需先注册内置映射（与 ProForm 字段注册方式一致）：

```ts
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'

registerDefaultColumnComponents()
```

自定义列类型：`registerColumnComponent('MyCell', MyCellVue)`。未知名称时回落为 **`Text`**。

---

## 基本用法

```vue
<script setup lang="ts">
import type { TableColumnSchema } from '@/types/pro-table'
import { ref } from 'vue'
import { ProTable, registerDefaultColumnComponents } from '@/components/pro-table'

registerDefaultColumnComponents()

const pagination = ref({ page: 1, pageSize: 10, total: 0 })
const sort = ref({ field: null as string | null, order: null as 'asc' | 'desc' | null })
const selection = ref({ enabled: true, selectedRowKeys: [] as (string | number)[] })
const data = ref<Record<string, unknown>[]>([])

const columns: TableColumnSchema[] = [
  {
    meta: { field: 'name', label: '名称', valueType: 'string' },
    ui: { component: 'Text', minWidth: 120, ellipsis: true },
  },
]
</script>

<template>
  <ProTable
    v-model:pagination="pagination"
    v-model:sort="sort"
    v-model:selection="selection"
    :columns="columns"
    :data="data"
    row-key="id"
  />
</template>
```

---

## 受控与 `v-model`

| 绑定 | 说明 |
|------|------|
| `v-model:pagination` | `{ page, pageSize, total }`；传 `pagination:false` 可关闭分页区 |
| `v-model:sort` | `{ field, order }`，`order` 为 `asc` / `desc` / `null`（与 `sort-change` 映射一致） |
| `v-model:selection` | `{ enabled, selectedRowKeys }`，`selectedRowKeys` 为 **`(string \| number)[]`**；与行键比较时统一按 **`String()`** 对齐 |

`update:selection` 传出键为 **`resolveRowKey` 的字符串结果**（与 `ElTable` 行为一致）；若父层需要数值型可自行 `Number()`。

| Prop | 说明 |
|------|------|
| `reserveSelection` | 多选翻页是否保留已选行，默认 **`true`**；不需要时可设 `false` |

父组件负责在 **搜索条件变化时重置 `page`**；ProTable 不隐式改分页。  
**排序**：表格触发 `update:sort` 后，由父层合并 `pagination` / 筛选参数请求列表；若列上配置了 `runtime.sorter`，可在父层结合后端约定拼排序参数（Spec §3.4）。

**表头 `tooltip.icon`**：支持部分与项目 **`AppIcon`** 一致的语义名（如 `info`、`warning`、`error`、`success`）；未识别时仍显示 `?` 占位。

**列 key**：默认同 `meta.field`；若存在多列相同 `field`，请设置 **`ui.columnKey`** 以保证 Vue 列表稳定。

---

## `#cell`、`defaultRender` 与 `builtinCellRender`

统一插槽 **`cell`**，作用域参数包含：`field`、`row`、`columnSchema`、`value`、`context`、**`defaultRender`**（模块级 **`ProTableDynamicCellHost`**）、**`builtinCellRender`**（`() => VNode`，对应当前行/列的内置渲染）。

自定义部分列时：对目标列 `v-if`，其余列：

```vue
<template #cell="{ field, row, defaultRender, builtinCellRender }">
  <template v-if="field === 'name'">
    {{ row.name }}（自定义）
  </template>
  <component
    v-else
    :is="defaultRender"
    :render-fn="builtinCellRender"
  />
</template>
```

**`runtime.formatter`** 返回值若非字符串会 **`String()`** 后再展示。

---

## 错误态

有 **`error`** 且非 **`loading`** 时，在表格上方展示 **`ElAlert` 错误条**，**不卸载** `ElTable`，便于保留父组件传入的当前 `data`（如失败时仍展示上次成功数据）。表格区域带轻微透明度区分状态。点击重试触发 **`retry`**。

---

## 插槽一览

| 插槽 | 说明 |
|------|------|
| `toolbar-prefix` | 工具栏左侧（如批量操作） |
| `toolbar-extra` | 工具栏右侧 |
| `cell` | 见上 |
| `row-actions-extra` | 操作列末尾追加，作用域：`{ row }` |
| `empty` | 覆盖空态内容 |
| `error` | 覆盖错误条内操作区（非整条 Alert），作用域：`{ message, retry }` |

仅当 `toolbar-prefix` / `toolbar-extra` 有内容时渲染工具栏容器。

---

## 与 SearchBar 协作

- SearchBar（或筛选表单）只负责条件；**ProTable 只展示 `data`**。  
- 条件变化后：父组件将 **`pagination.page` 置为 1**，再发起列表请求并更新 `data` / `total`。  
- 请求失败：设置 `error`，由 ProTable 展示错误条并 `emit('retry')`。

---

## 事件与模板写法

`defineEmits` 使用 **camelCase**（`rowClick`、`rowDblclick`、`retry`）。在 Vue 模板中可写 **`@row-click`** / **`@rowClick`**，二者等价。

- **`rowClick`、`rowDblclick`**：行点击 / 双击（与操作列区分）  
- **`retry`**：错误区重试

---

## Link 列与安全

内置 **`Link`** 对外链 `href` 会拒绝 **`javascript:`、`data:`、`vbscript:`** 等协议（大小写不敏感），此时退化为纯文本。路由跳转请使用 **`to`**，与 **`href`** 互斥。业务上仍应避免把不可信字符串直接写入 `href`/`to`。

---

## 排序与表头状态

受控排序通过 **`ElTable` 的 `default-sort` 与列 `sortable="custom"`** 配合；为对齐父层 `sort` 与表头箭头，根表格使用 **`:key="sort.field + sort.order"`** 做同步，**可能导致排序变化时表格内部滚动位置重置**，请在长列表场景自行权衡。

---

## 参考示例页

`src/pages/pro-table-demo.vue`：列类型、分页、排序、选择、空态、`emptyMode`、错误重试、`cell` / `row-actions-extra`、表头 `tooltip.icon` 示例。

---

## 相关文档

- [ProForm](./pro-form.md)
- [ProDetail](./pro-detail.md)
