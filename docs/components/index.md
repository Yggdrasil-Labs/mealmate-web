# Components Index

Last updated: 2026-05-08

本目录维护通用组件的协议文档，包括字段、事件、插槽和运行时行为说明。

## 协议约定

- [component-api-conventions.md](./component-api-conventions.md) - 组件 API 统一约定
- [shared-field-protocol.md](./shared-field-protocol.md) - 跨组件共享字段协议

## 通用组件

- [ProForm](./pro-form.md) - Schema 驱动的表单组件
- [ProDetail](./pro-detail.md) - Schema 驱动的详情展示组件
- [ProTable](./pro-table.md) - Schema 驱动的列表组件
- [ProDialog](./pro-dialog.md) - 标准化对话框组件
- [SearchBar](./search-bar.md) - 筛选条件组件

## 维护规则

- 组件协议变化必须同步更新对应文档
- 新增通用组件应在本目录补充协议文档
- 组件私有能力不应混入共享字段协议
