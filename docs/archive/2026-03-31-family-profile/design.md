---
id: design-family-profile
status: verified
owner: codex
created: 2026-03-31
verified: 2026-04-25
---

# UC1 家庭画像前端设计

## 背景

本设计面向 UC1「维护家庭画像」的前端实现，目标是在当前 `mealmate-web` 仓库中落地一个符合现有 schema 路由体系、支持移动端、并可在后端接口未完成阶段继续开发与测试的正式业务页面。

需求输入主要来自：

- Notion 文档《UC1 维护家庭画像 — 领域详细设计》
- Notion 文档《Mealmate项目开发规范》
- 当前仓库的 `AGENTS.md` 与既有路由 / 布局 / 测试结构

## 目标

- 新增正式页面 `/family/profile`，用于查看和维护家庭画像
- 支持查看家庭基础信息、查看成员列表、查看成员详情
- 支持新增成员、编辑成员基本信息、编辑成员偏好、删除成员
- 在后端接口未完成时，通过本地 mock 保持前端可开发、可验证
- 保持页面、菜单、页签标题一致，并遵守现有 schema 驱动路由模式

## 非目标

- 不在本阶段引入新的全局 mock 框架
- 不重构现有 `src/pages` 到 `src/views`
- 不在本阶段实现头像上传能力，仅预留 `avatarUrl` 字段
- 不接入新的鉴权体系或发布流程

## 设计原则

- 页面保持薄壳，业务逻辑内聚在 `src/modules/family`
- 共享业务数据进入模块 store，局部交互状态保留在 composable / 页面内部
- API 契约尽量贴近后端设计，不在组件中拼装请求细节
- 优先移动端可用性，避免将 hover 作为唯一交互方式
- mock 与真实接口共用同一组前端类型和函数签名，降低切换成本

## 页面与路由设计

### 路由落点

在 `src/router/app-route-schema.ts` 新增路由：

- `name: 'FamilyProfile'`
- `path: '/family/profile'`
- `component: 'family-profile'`
- `meta.title: '家庭画像'`
- 使用现有 `default` layout

这样可以保持当前仓库的 schema 驱动路由方式，不绕开 `app-route-schema -> app-routes -> router` 这一既有链路。

### 页面入口

新增 `src/pages/family-profile.vue` 作为页面薄壳，仅负责：

- 触发页面级加载
- 组合模块内组件
- 承载抽屉与删除确认弹窗

页面不直接写请求逻辑，也不直接维护复杂业务规则。

## 模块结构设计

新增 `src/modules/family`，结构如下：

```text
src/modules/family/
├── api.ts
├── constants.ts
├── mock.ts
├── store.ts
├── types.ts
├── components/
│   ├── FamilyProfileHeader.vue
│   ├── FamilyMemberGrid.vue
│   ├── FamilyMemberCard.vue
│   ├── FamilyMemberDrawer.vue
│   ├── FamilyMemberForm.vue
│   ├── MemberPreferenceForm.vue
│   └── FamilyMemberDeleteDialog.vue
└── composables/
    ├── useFamilyProfile.ts
    └── useFamilyMemberEditor.ts
```

这里的 `src/modules/family` 是针对 UC1 的定向模块内聚实践，用来承接 Family 领域新增的 API、类型、状态与组件，不代表当前仓库需要立刻整体迁移到 `modules/*` 目录形态。现有 `src/pages`、`src/components`、`src/composables`、`src/stores` 仍然保持有效；本次只是为家庭画像功能新增一块边界清晰、方便后续扩展的业务模块，页面入口也仍然保留在 `src/pages/family-profile.vue`。

### 分层职责

- `types.ts`
  - 定义家庭基础信息、成员摘要、成员详情、请求参数等类型
- `api.ts`
  - 定义模块 API 函数与真实 / mock 切换逻辑
- `mock.ts`
  - 提供与正式接口同名、同返回结构的本地模拟实现
- `store.ts`
  - 保存家庭基础信息和成员摘要列表
- `useFamilyProfile.ts`
  - 页面初始化加载、重试、刷新等页面级数据编排
- `useFamilyMemberEditor.ts`
  - 抽屉模式、详情加载、表单默认值、保存逻辑、删除逻辑
- `components/*`
  - 分离展示组件与承载组件，保证单文件复杂度可控

## 接口契约对齐

前端实现以以下接口为准：

- `GET /api/families/{familyId}`
  - 查询家庭基础信息
- `GET /api/families/{familyId}/members`
  - 查询成员列表（基础信息 + 偏好摘要）
- `GET /api/families/{familyId}/members/{memberId}`
  - 查询成员详情（基础信息 + 完整偏好）
- `POST /api/families/{familyId}/members`
  - 新增成员
- `PUT /api/families/{familyId}/members/{memberId}`
  - 更新成员基本信息
- `PUT /api/families/{familyId}/members/{memberId}/preference`
  - 更新成员偏好
- `DELETE /api/families/{familyId}/members/{memberId}`
  - 删除成员

Controller 统一返回 COLA 标准结构，前端仍通过现有 `src/utils/api/request.ts` / `src/utils/api/http.ts` 读取 `success / errCode / errMessage / data`。

## 数据模型设计

### 前端核心类型

- `FamilySummary`
  - `familyId`
  - `familyName`
  - `region`
  - `mealGoal`

- `FamilyMemberSummary`
  - `memberId`
  - `name`
  - `roleType`
  - `gender`
  - `birthday`
  - `region`
  - `targetType`
  - `avatarUrl`
  - `sortNo`
  - `preferenceSummary`

- `FamilyMemberDetail`
  - 继承成员基本信息
  - 包含完整 `preference`

- `MemberPreference`
  - `tasteTags`
  - `avoidIngredients`
  - `allergyIngredients`
  - `spicyLevel`
  - `sweetLevel`
  - `oilLevel`
  - `saltLevel`
  - `nutritionGoal`
  - `extraRule`

### 类型边界

- 列表页只依赖 `FamilyMemberSummary`
- 编辑抽屉打开后才拉 `FamilyMemberDetail`
- 表单提交使用独立 payload 类型，避免把服务端响应对象直接拿来回填请求

## 页面结构与交互设计

### 页面结构

页面分为三部分：

1. 顶部 `FamilyProfileHeader`
   - 展示家庭名称、地区、饮食目标摘要、成员数量
   - 提供“添加成员”主按钮
2. 主体 `FamilyMemberGrid`
   - 展示成员卡片列表
   - 空状态下提供引导文案与添加入口
3. 浮层区
   - `FamilyMemberDrawer`：新增 / 编辑
   - `FamilyMemberDeleteDialog`：删除确认

### 成员卡片

每张卡片展示：

- 头像或头像占位
- 姓名
- 角色标签
- 地区 / 目标类型 / 生日或年龄摘要
- 偏好摘要：口味标签、忌口数、过敏数、辣度 / 油盐甜等级
- 常驻按钮：编辑、删除

不使用 hover-only 交互；移动端直接展示按钮，保证可触达。

### 抽屉交互

抽屉统一承载新增和编辑两种模式：

- 新增模式
  - 默认空表单
  - 使用安全偏好默认值
  - 保存时仅调用新增成员接口
- 编辑模式
  - 进入时先拉成员详情
  - 支持同时修改基本信息和偏好
  - 底部保留单一“保存全部”按钮
  - 内部根据变更情况调用更新基本信息接口和 / 或更新偏好接口

### 角色联动

为匹配业务规则，当前端识别角色为 `BABY` 时：

- `spicyLevel` 自动限制为 `NONE`
- `saltLevel` 自动限制为 `LIGHT`
- 相关输入控件禁用
- 给出清晰提示文案

这样可以在前端预防明显非法输入，并与后端 `PREFERENCE_INVALID_FOR_BABY` 规则保持一致。

### 删除逻辑

- 点击删除后弹出确认框
- 确认后调用删除接口
- 成功后刷新成员列表
- 若页面头部展示成员数，则同步刷新家庭基础信息

## 状态管理设计

### Store 职责

`useFamilyStore` 仅管理共享业务状态：

- `activeFamilyId`
- `familySummary`
- `memberList`
- `loading`
- `fetchFamilySummary`
- `fetchFamilyMembers`
- `refreshFamilyProfile`

### 局部状态

以下状态不进入 store：

- 当前抽屉是否打开
- 当前编辑模式
- 当前选中的成员 ID
- 删除确认弹窗开关
- 表单临时值
- 提交中的 loading / error

这些更适合放入 `useFamilyMemberEditor.ts` 和页面局部状态，避免 store 膨胀。

## Mock 策略

由于后端接口尚未完成，本阶段采用模块内 mock：

- `api.ts` 对外暴露正式函数签名
- 内部通过配置开关选择真实请求或 `mock.ts`
- `mock.ts` 在内存中维护家庭基础信息、成员列表和成员详情数据

### 选择原因

- 不引入额外全局依赖
- 不污染现有路由与请求基础设施
- 单元测试中更容易 stub 或替换
- 后端完成后可以最小代价切换到真实接口

## 错误处理设计

### 页面加载错误

- 家庭基础信息或成员列表加载失败时，页面显示错误状态与重试按钮
- 不因其中一个请求失败而让页面完全不可恢复

### 抽屉提交错误

- 提交失败时保留用户输入
- 在抽屉内显示业务错误提示
- 优先映射这些错误码：
  - `FAMILY_NOT_FOUND`
  - `FAMILY_MEMBER_NOT_FOUND`
  - `FAMILY_BABY_ALREADY_EXISTS`
  - `PREFERENCE_INVALID_FOR_BABY`

### 一致性处理

- 编辑保存成功后，统一刷新 store 中的数据，避免头部信息与列表卡片不一致
- 如果详情接口和列表摘要字段存在差异，以刷新后的列表结果为准更新页面展示

## 响应式与样式设计

- 桌面端成员卡片使用 2-3 列网格
- 手机端使用单列流式布局
- 抽屉在 `xs` 断点下全屏展示
- 所有可点击控件最小高度不低于 `44px`
- 标签输入区域允许自动换行，不做横向滚动
- 样式使用 SCSS，组件样式默认 `scoped`

## 测试设计

### 单元测试

- `useFamilyProfile`
  - 初始化加载
  - 重试
  - 刷新行为
- `useFamilyMemberEditor`
  - 新增 / 编辑模式切换
  - `BABY` 角色联动
  - 保存时的接口编排
- 关键组件
  - 抽屉表单渲染
  - 删除确认流程

### 路由与壳层测试

- `/family/profile` 路由是否正确注册
- 菜单、页签、标题是否一致

### E2E

- 新增成员完整流程
- 编辑成员基本信息和偏好
- 删除成员
- 移动端视口下卡片单列与抽屉全屏

## 实施建议

- 先补模块类型、mock 和 API 层，避免 UI 提前耦合假数据结构
- 先建路由和页面壳，再逐步接入卡片区与抽屉
- 先做单元测试与最小 E2E 骨架，再继续扩展实现

## 风险与缓解

### 风险 1：后端详情接口字段与列表摘要不完全一致

缓解：

- 摘要类型与详情类型分离
- UI 层显式区分列表展示与详情编辑

### 风险 2：前端过早把局部状态做成全局共享

缓解：

- 仅把家庭摘要和成员列表放入 store
- 抽屉和表单状态留在 composable

### 风险 3：mock 与真实接口切换时出现返回结构偏差

缓解：

- mock 函数直接复用同一组 TypeScript 类型
- 返回结构保持 COLA 标准包装

## 结论

本设计选择以 `/family/profile` 为正式业务入口，采用 `src/modules/family` 模块内聚结构，按“家庭基础信息 / 成员列表 / 成员详情”拆分接口加载，并通过轻量本地 mock 支撑前端先行开发。这样既符合当前仓库架构，也能为后续真实联调留下稳定接口边界。
