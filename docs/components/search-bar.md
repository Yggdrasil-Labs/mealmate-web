# SearchBar

## 组件定位

`SearchBar` 用于列表页、查询页的条件组织与查询触发。它负责：

- 渲染查询字段
- 管理默认值
- 控制展开 / 收起
- 输出请求参数
- 同步路由参数

基础字段语义与共享字段边界见 [共享字段协议](./shared-field-protocol.md)。

其中 `serialize`、`deserialize`、`syncRoute` 共同构成 SearchBar 的“查询协议层”，用于统一查询值与路由 query 的映射方式，而不是承接页面业务请求逻辑。

slot / 事件 / expose 命名规范见 [组件 API 约定](./component-api-conventions.md)。

它不负责：

- 强校验
- 提交态管理
- 数据请求
- 表格结果展示

---

## 与其他组件的关系

- 与 `ProForm`
  - 复用字段协议心智，但不复用完整提交语义
- 与 `ProTable`
  - 平级协作，页面负责把查询、排序、分页合并成最终加载参数

---

## 基本示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SearchBar, registerDefaultSearchFieldComponents } from '@/components/search-bar'

registerDefaultSearchFieldComponents()

const values = ref({})

const schema = [
  {
    meta: { field: 'keyword', label: '关键词', valueType: 'string', defaultValue: '' },
    ui: {
      component: 'Input',
      props: { placeholder: '请输入关键词', clearable: true },
      layout: { group: 'basic', span: 8 },
    },
  },
]
</script>

<template>
  <SearchBar v-model="values" :schema="schema" @search="console.log" />
</template>
```

---

## Schema 结构

### meta

- `field`
- `label`
- `valueType`
- `defaultValue`

### ui

- `component`
- `props`
- `layout`
- `tooltip`
- `options`
- `slot`

### runtime

- `visible`
- `disabled`
- `dependencies`
- `options`
- `transform.input`
- `transform.serialize`
- `transform.deserialize`
- `preserveOnReset`

---

## Props

| 名称 | 说明 | 默认值 |
|------|------|--------|
| `schema` | 查询字段 schema | 必填 |
| `modelValue` | 当前查询值 | 必填 |
| `context` | 透传运行时上下文 | `{}` |
| `loading` | 加载态 | `false` |
| `defaultCollapsed` | 初始是否收起高级区 | `true` |
| `defaultVisibleCount` | 收起态默认展示的 basic 字段数量 | `3` |
| `syncRoute` | 是否同步路由 query | `false` |
| `routeKey` | 路由 query 命名空间前缀 | `''` |
| `autoSearchOnInit` | 初始化完成后是否自动查询 | `false` |
| `labelWidth` | 表单标签宽度 | `88px` |

---

## 事件

| 事件 | 说明 |
|------|------|
| `update:modelValue` | 字段值变化 |
| `search` | 点击查询或回车查询后触发 |
| `reset` | 点击重置后触发 |
| `valuesChange` | 任意字段变化时触发 |
| `toggleExpand` | 展开态切换时触发 |

`search` 与 `reset` 的 payload 结构一致：

```ts
{
  rawValues: Record<string, unknown>
  serializedValues: Record<string, unknown>
}
```

---

## Expose

- `setFieldsValue`
- `getFieldsValue`
- `search`
- `reset`
- `toggleExpand`
- `serialize`
- `deserialize`

---

## 路由同步约定

推荐开启 `routeKey`，例如：

```vue
<SearchBar
  v-model="values"
  :schema="schema"
  sync-route
  route-key="filters"
/>
```

这样 query 会写成：

```ts
{
  'filters.keyword': 'vue',
  'filters.status': 'published',
}
```

好处是不会和页面里的其他 query 参数冲突，也更容易清理。

---

## 当前能力边界

当前版本支持：

- 默认值初始化
- 动态 options
- 展开 / 收起
- 请求参数序列化
- 路由参数恢复
- 与 `ProTable` 的页面级组合

当前版本不支持：

- 强校验
- 通用远程数据源协议
- 页面级大容器封装
