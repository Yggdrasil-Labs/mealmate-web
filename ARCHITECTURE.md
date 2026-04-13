# MealMate Web Architecture

本文件记录 `mealmate-web` 的当前架构事实、分层边界与依赖方向。它回答“仓库是如何组织的”，而不是“某个功能怎么做”。

## 1. 架构定位

MealMate Web 是一个 schema 驱动的 Vue 3 前端应用。页面入口、布局壳层、菜单、Tabs、缓存与响应式状态通过统一的路由与 store 体系协同，而不是在页面组件中各自实现。

当前目标不是堆叠独立页面，而是在同一套 shell 协议下逐步承接 MealMate 的业务模块。

## 2. 目录职责

- `src/app`
  应用壳层、页面承载与渲染编排。
- `src/components`
  通用 UI 组件、业务复用组件与协议化渲染单元。
- `src/composables`
  组合式逻辑与局部可复用交互组织。
- `src/config`
  环境与运行时配置。
- `src/constants`
  常量定义。
- `src/layouts`
  布局骨架、头部、侧边栏、页签等壳层组件。
- `src/locales`
  国际化资源。
- `src/pages`
  页面级组件，由路由 schema 承载。
- `src/router`
  路由 schema、标准化、注册与类型协议。
- `src/stores`
  全局状态与壳层状态。
- `src/types`
  TypeScript 类型定义。
- `src/utils`
  纯工具函数与通用基础设施。

## 3. 路由与 Shell

MealMate 当前的页面入口由 `src/router/app-route-schema.ts` 统一声明。`src/router/route-normalizer.ts` 为每个页面补齐默认的 layout、menu、tab、keepAlive 元信息，`src/router/app-routes.ts` 再将 schema 转成 Vue Router records。

关键事实如下：

- 页面组件文件位于 `src/pages/*.vue`
- 页面通过 schema 注册，不在页面中私自拼接路由入口
- 页面标题优先通过 `route.meta.title` 统一管理
- layout 选择由 `src/app/shell/AppLayoutRenderer.vue` 根据路由 meta 决定
- 页面承载与缓存由 `src/app/shell/AppPageRenderer.vue` 统一组织

这套结构的目的是让菜单、Tabs、KeepAlive 和响应式布局围绕同一份路由元信息工作。

## 4. 依赖方向

允许的主要依赖关系：

- `app -> layouts, router, stores, components`
- `layouts -> stores, components`
- `pages -> components, composables, stores, utils`
- `router -> pages, layouts, stores`
- `components -> composables, utils`
- `stores -> utils`

默认避免：

- 页面直接绕开路由 schema 手工装配壳层
- `layouts` 直接承载页面业务流程
- `stores` 写页面级临时逻辑
- `utils` 写依赖页面上下文的流程逻辑

## 5. 层级边界

### `app`

负责应用装配与上下文协调，不承载业务规则。

### `layouts`

负责导航、页签、头部、侧边栏与布局骨架，不直接写页面业务逻辑。

### `pages`

负责页面编排，保持瘦，优先通过组件、composable 和 store 组合能力。

### `components`

负责可复用展示与交互单元。通用组件应尽量协议化、可测试、可复用。

### `composables`

负责页面内或跨页面可复用的交互逻辑与状态组织；若需要跨页面长期同步，应考虑提升到 store。

### `stores`

负责菜单、Tabs、KeepAlive、响应式壳层状态与跨页面共享数据。

### `utils`

负责纯函数和基础工具，不承载依赖具体页面上下文的业务流程。

## 6. 数据流

默认数据链路为：

`Route schema -> Page component -> Composable/Store -> API/Backend -> UI`

职责要求：

- 路由 schema 负责页面入口、标题、布局与缓存策略
- Page component 负责页面编排
- Composable 负责可复用交互与状态组织
- Store 负责跨页面共享状态
- API 层负责与后端通信
- UI 层负责展示与用户交互

请求基础设施优先复用 `src/utils/api/request.ts`、`src/utils/api/http.ts` 等已有封装。

## 7. 关键架构约束

- 页面标题、菜单标题、页签标题必须围绕统一 route meta 保持一致。
- 新增页面时，先确认是否要进入菜单、Tabs 或 KeepAlive，再确定 meta。
- 路由与 layout 逻辑优先走现有 normalizer 和 shell，而不是另起一套约定。
- 组件不直接硬编码业务常量，除非它本身就是业务组件。

## 8. 相关文档

- 前端实现约束：[docs/FRONTEND.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/FRONTEND.md)
- 业务语义与范围：[docs/PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
- 组件协议：[docs/components](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
- 计划机制：[docs/PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PLANS.md)
