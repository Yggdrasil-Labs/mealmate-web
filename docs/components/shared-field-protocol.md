# 共享字段协议

## 组件定位

共享字段协议用于承载多个公共组件真正共用的字段语义，避免把 `ProForm`、`ProDetail`、`SearchBar` 的私有能力混在一套类型里长期膨胀。

当前第一版共享基础协议定义在 `src/types/shared-field.ts`，核心目标是提供一个稳定、克制、可扩展的共同基线。

---

## 当前包含的基础类型

### `BaseFieldMeta`

用于描述最基础的字段元信息：

- `field`
- `label`
- `valueType`
- `defaultValue`

### `BaseFieldLayout`

用于描述基础布局语义：

- `group`
- `span`

### `BaseFieldUi`

用于承载多个组件都会消费的基础 UI 语义：

- `tooltip`
- `layout`

### `BaseFieldRuntime`

当前只保留最基础的运行时能力：

- `visible`

---

## 哪些属于共享字段协议

可以进入共享层的能力应满足两个条件：

1. 至少被两个以上公共组件共同消费
2. 语义稳定，不依赖某个单独组件的交互流程

当前适合放进共享层的内容包括：

- 基础字段标识
- 基础展示标签
- 基础布局
- 基础可见性语义

---

## 哪些不属于共享字段协议

以下能力暂时不应该进入共享字段协议：

### `ProForm` 私有扩展

- `required`
- `validation`
- `transform.submit`
- `dependencies`
- 动态表单选项加载

### `ProDetail` 私有扩展

- `emptyText`
- `copyable`
- 展示 renderer 的特定语义

### `SearchBar` 私有扩展

- `serialize`
- `deserialize`
- `preserveOnReset`
- 路由 query 同步约定

---

## 扩展原则

后续新增字段能力时，优先按下面顺序判断：

1. 这是共享基础语义，还是组件私有语义？
2. 如果是共享语义，是否已经被至少两个组件共同使用？
3. 如果只是单组件阶段的需求，先放在组件私有层，不急着提升到共享协议

这样可以避免共享层过早膨胀，降低未来重构成本。

---

## 相关文档

- [ProForm](./pro-form.md)
- [ProDetail](./pro-detail.md)
- [SearchBar](./search-bar.md)
