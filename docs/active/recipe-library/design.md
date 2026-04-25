---
id: design-recipe-library
status: draft
owner: codex
created: 2026-04-16
verified: 2026-04-25
---

# UC2 菜品库前端设计

## 背景

本设计面向 UC2「管理菜品库」的前端实现，目标是在当前 `mealmate-web` 仓库中落地一个符合 schema 路由体系、统一 shell 协议、移动端可用、并支持真实接口与 mock 双通路的正式业务页面。

需求输入主要来自：

- Notion 文档《UC2 管理菜品库 — 领域详细设计》
- 当前仓库的 `AGENTS.md`、`ARCHITECTURE.md`、`docs/FRONTEND.md`
- 当前仓库已有的 UC1 家庭画像前端实现模式

## 目标

- 新增正式页面 `/recipes`，用于浏览、筛选、查看、创建、编辑和删除菜品
- 支持多维筛选、菜品详情、完整新增流程、完整编辑流程、删除确认流程
- 支持步骤图片上传与食材排序，并兼顾桌面端与移动端体验
- 在后端接口未完整就绪时，通过模块内 mock 维持前端可开发、可验证
- 保持页面标题、菜单标题、页签标题一致，并遵守现有 schema 驱动路由模式

## 非目标

- 不在本阶段引入新的全局状态管理模式
- 不在本阶段重构现有页面目录结构或改造统一 shell
- 不在本阶段接入新的上传服务 SDK；上传统一沿用当前项目 `http.upload()` 封装
- 不在本阶段抽象通用 Recipe CRUD 框架；优先先把业务页面做对

## 设计原则

- 页面保持薄壳，业务逻辑内聚在 `src/modules/recipe`
- 复用现有 `SearchBar`、Element Plus Drawer、模块内 `api/mock/store/composable` 组织方式
- mock 与真实接口共用同一组前端类型和函数签名，降低切换成本
- 优先移动端可用性，不把 hover 作为唯一交互方式
- 列表、详情、表单使用分层类型，避免响应对象与提交对象互相污染

## 技术方案

菜品库以 `src/pages/recipe-library.vue` 作为薄页面入口，业务类型、API、mock、store、composable 和组件内聚到 `src/modules/recipe/`。路由通过 `src/router/app-route-schema.ts` 注册，图标通过现有语义图标映射接入，列表、详情、表单和删除流程在模块内拆分。

## 影响范围

- `src/router/app-route-schema.ts` 与路由测试
- `src/pages/recipe-library.vue`
- `src/modules/recipe/`
- `src/locales/*/recipe.json`
- `tests/unit/modules/recipe/`

## 约束

- 不绕开 schema 驱动路由和 shell。
- 不新增全局 mock 框架。
- 不把响应对象直接复用为提交对象。
- 不把 Recipe CRUD 抽象成仓库级通用框架。

## 验证方式

- 路由 schema 与 route record 单测。
- Recipe 类型、API、store、composable 单测。
- 必要时补充页面级 Playwright 验证。

## 页面与路由设计

### 路由落点

在 `src/router/app-route-schema.ts` 新增路由：

- `name: 'RecipeLibrary'`
- `path: '/recipes'`
- `component: 'recipe-library'`
- `meta.title: '菜品库'`
- `meta.icon: 'menu-recipe'`
- 使用现有 `default` layout

这样可以保持当前仓库的 schema 驱动路由方式，不绕开 `app-route-schema -> app-routes -> router` 的既有链路。

由于当前仓库的菜单路由测试要求每个 route 都声明非空 `meta.icon`，实现时还需要同步补齐：

- `src/components/icon/icon.types.ts` 中的语义图标类型
- `src/components/icon/providers/iconify.ts` 中的图标映射

### 页面入口

新增 `src/pages/recipe-library.vue` 作为页面薄壳，仅负责：

- 触发页面级首次加载
- 编排筛选栏、列表网格、详情抽屉、表单抽屉、删除确认弹窗
- 承载页面级错误态与重试入口

页面不直接写请求细节，也不直接承载复杂业务规则。

## 模块结构设计

新增 `src/modules/recipe`，结构如下：

```text
src/modules/recipe/
├── api.ts
├── constants.ts
├── mock.ts
├── store.ts
├── types.ts
├── components/
│   ├── RecipeFilterBar.vue
│   ├── RecipeGrid.vue
│   ├── RecipeCard.vue
│   ├── RecipeDetailDrawer.vue
│   ├── RecipeFormDrawer.vue
│   ├── IngredientEditor.vue
│   ├── StepEditor.vue
│   ├── NutritionForm.vue
│   └── RecipeDeleteDialog.vue
└── composables/
    ├── useRecipeList.ts
    └── useRecipeForm.ts
```

这里延续 UC1 的业务模块内聚实践，用来承接 Recipe 领域的 API、类型、状态与组件，不改变仓库整体目录职责。页面入口仍保留在 `src/pages/recipe-library.vue`。

### 分层职责

- `types.ts`
  - 定义列表、详情、筛选、表单、上传等类型
- `constants.ts`
  - 定义枚举选项、标签映射、默认值与字段约束
- `api.ts`
  - 提供模块 API 函数与真实 / mock 切换逻辑
- `mock.ts`
  - 提供与正式接口同名、同返回语义的本地模拟实现
- `store.ts`
  - 保存当前活动 recipeId、详情缓存、最近一次列表快照
- `useRecipeList.ts`
  - 页面列表加载、筛选联动、分页、详情入口编排
- `useRecipeForm.ts`
  - 新增 / 编辑模式、表单状态、上传、保存、删除逻辑
- `components/*`
  - 拆分展示与编辑组件，控制单文件复杂度

## 数据模型设计

### 前端核心类型

- `RecipeSummary`
  - 列表卡片需要的最小字段
  - 包含 `recipeId`、`name`、`recipeType`、`sourceType`、`crowdTag`、`seasonTag`、`difficultyLevel`、`cookingTimeMin`、`coverImageUrl`、`isBabyFriendly`、`isWeightLossFriendly`、`status`

- `RecipeDetail`
  - 详情抽屉与编辑初始化需要的完整字段
  - 在 `RecipeSummary` 基础上增加 `tasteTags`、`ingredients`、`steps`、`nutrition`

- `RecipeFilters`
  - 与筛选栏一一对应
  - 包含 `keyword`、`recipeType`、`seasonTag`、`crowdTag`、`isBabyFriendly`、`isWeightLossFriendly`、`difficultyLevel`、`maxCookingTime`、`pageNum`、`pageSize`

- `RecipeIngredientItem`
  - `ingredientId?`、`ingredientName`、`ingredientType`、`quantity`、`unit`、`isMain`、`sortNo`

- `RecipeStepItem`
  - `stepId?`、`stepNo`、`content`、`imageUrl`

- `RecipeNutrition`
  - `calories`、`protein`、`fat`、`carbohydrate`、`fiber`、`calcium`、`sodium`

- `CreateRecipePayload` / `UpdateRecipePayload`
  - 表单提交对象，不直接复用响应对象

### 类型边界

- 列表只依赖 `RecipeSummary`
- 详情与编辑初始化依赖 `RecipeDetail`
- 筛选状态只依赖 `RecipeFilters`
- 提交动作依赖独立 payload 类型，避免组件直接拼装后端 DTO

## 页面结构与交互设计

### 页面结构

页面分为四部分：

1. 顶部页面头部
   - 展示标题与“新增菜品”主按钮
2. `RecipeFilterBar`
   - 承担筛选输入、路由 query 同步与重置
3. `RecipeGrid`
   - 承担卡片列表、分页、空状态
4. 浮层区
   - `RecipeDetailDrawer`
   - `RecipeFormDrawer`
   - `RecipeDeleteDialog`

### 筛选栏

筛选栏基于现有 `src/components/search-bar/SearchBar.vue` 实现 schema 驱动查询。

筛选字段包括：

- 菜名关键字
- 菜品类型
- 季节标签
- 适配人群
- 宝宝友好
- 减脂友好
- 难度
- 最大烹饪时长

交互规则：

- 筛选条件变更后 `debounce 300ms` 自动查询
- 查询参数同步到路由 query，支持刷新保留与分享链接
- 筛选变更时页码重置为 1
- 移动端保留“筛选”入口，并以底部抽屉承载字段编辑

### 菜品卡片

每张卡片展示：

- 封面图或占位图
- 菜名
- 菜品类型、人群标签、难度标签
- 烹饪时长
- 宝宝友好 / 减脂友好标记
- 来源类型标识
- 常驻操作按钮：查看详情、编辑、删除

权限规则：

- `sourceType = SYSTEM` 时，仅保留“查看详情”
- `sourceType = MANUAL` 时，可编辑、可删除
- `sourceType = AI_GENERATED` 时，可查看、可编辑、不可删除

不使用 hover-only 交互；桌面与移动端都直接展示可点击入口。

### 详情抽屉

`RecipeDetailDrawer` 为只读抽屉，职责是展示：

- 基础信息
- 食材列表
- 步骤列表
- 营养信息

详情抽屉与编辑抽屉分离，避免一个抽屉同时承担只读与编辑两种心智，也便于系统菜品只开放查看入口。

### 新增 / 编辑抽屉

`RecipeFormDrawer` 统一承载新增与编辑两种模式，顶部使用三个 Tab：

1. 基础信息
2. 食材
3. 步骤与营养

交互规则：

- 桌面端使用固定宽度抽屉
- 移动端使用全屏抽屉
- 顶部 Tab 固定，内容区独立滚动
- 底部保留单一“保存全部”按钮
- 保存失败时保留用户输入，不清空表单

### 保存编排与部分成功处理

“保存全部”在 UI 上是一次动作，但实现上按以下顺序拆分：

1. 创建或更新菜品基础信息
2. 全量同步食材
3. 全量同步步骤
4. 同步营养信息

为避免部分成功后界面与服务端状态失真，需要定义统一恢复策略：

- 每次保存前，记录当前的“已持久化快照”
- 若某个后续请求失败，而前序请求已经成功：
  - 不关闭抽屉
  - 保留用户当前编辑值
  - 立即重新拉取最新详情，刷新“已持久化快照”
  - 明确提示“菜品已部分保存，请继续完成剩余内容后再次保存”
- 下一次点击“保存全部”时，仍以当前表单值为准，对比最新快照重新提交脏区块

这样可以避免用户误以为“完全没保存”，也避免在客户端继续基于过期快照做增量判断。

### 食材编辑器

`IngredientEditor` 维护动态食材列表。

每行包含：

- 食材名称
- 食材分类
- 数量
- 单位
- 是否主料
- 排序操作

排序规则：

- 桌面端支持基于原生 HTML5 Drag and Drop 的拖拽排序
- 同时提供“上移 / 下移”按钮作为辅助操作
- 移动端仍保留上移 / 下移按钮，避免仅依赖触摸拖拽
- 提交前统一按当前顺序重算 `sortNo`

### 步骤编辑器与图片上传

`StepEditor` 维护动态步骤列表。

每步包含：

- 步骤内容
- 可选图片
- 删除、上移、下移、拖拽排序操作

上传规则：

- 图片上传统一通过 `http.upload()` 封装
- 模块内暴露 `uploadRecipeStepImage(file)` 作为唯一上传入口
- mock 模式返回假图 URL，保证流程可验证
- 上传失败只影响当前步骤图片，不阻断整张表单继续编辑
- 步骤排序与食材排序保持同一策略：桌面端原生拖拽，移动端保留上移 / 下移按钮作为稳定入口

### 营养表单

`NutritionForm` 承担营养字段录入，只做轻量输入与校验：

- 非负数校验
- 小数字段格式化
- 可选字段允许留空

不在本阶段承担营养自动计算或复杂建议逻辑。

## 状态管理设计

### Store 职责

`useRecipeStore` 仅管理共享业务状态：

- `activeRecipeId`
- `recipeDetailMap`
- `lastListSnapshot`
- `setActiveRecipe`
- `cacheRecipeDetail`
- `clearRecipeDetail`

### 局部状态

以下状态不进入 store：

- 当前筛选展开状态
- 当前详情抽屉 / 表单抽屉 / 删除弹窗开关
- 当前表单模式
- 当前表单临时值
- 上传中的局部状态
- 表单提交态与页面瞬时错误态

这些更适合保留在 `useRecipeList.ts`、`useRecipeForm.ts` 与页面局部状态中，避免 store 膨胀。

## 接口契约与前端映射

前端页面只依赖 `src/modules/recipe/api.ts` 暴露的统一函数，不直接感知后端 DTO 结构。

建议收口为以下函数：

- `fetchRecipePage(filters)`
- `fetchRecipeDetail(recipeId)`
- `createRecipe(payload)`
- `updateRecipe(recipeId, payload)`
- `updateRecipeIngredients(recipeId, ingredients)`
- `updateRecipeSteps(recipeId, steps)`
- `updateRecipeNutrition(recipeId, nutrition)`
- `deleteRecipe(recipeId)`
- `uploadRecipeStepImage(file)`

说明：

- Notion 文档已给出新增、更新食材、更新营养、删除、搜索等核心接口
- 列表分页、详情查询、步骤更新、上传接口若与最终后端存在差异，统一在 `api.ts` 内适配，不把差异泄漏到页面与组件

### 接口前置假设与交付门槛

当前可以分成两类接口：

- 已有明确约束或文档输入的接口
  - 新增菜品
  - 更新食材
  - 更新营养
  - 删除菜品（仅 `MANUAL` 可删）
  - 搜索相关能力
- 仍需在联调前冻结的接口
  - 列表分页
  - 详情查询
  - 步骤全量更新
  - 步骤图片上传

因此本阶段的交付门槛需要拆成两层：

- 前端首版完成门槛
  - mock 路径完整可运行
  - 单测和 E2E 可验证主要流程
- 真实接口完成门槛
  - 上述未冻结接口完成契约确认
  - `api.ts` 完成正式适配
  - 关闭 mock 后核心流程仍可执行

在未冻结真实接口之前，不把“mock 流程已闭环”等同于“真实接口已完成接入”。

## 真实接口与 Mock 策略

本阶段延续 UC1 的模块内 mock 策略：

- `env.USE_MOCK = true` 时走 `mock.ts`
- 关闭 mock 后走真实接口

`mock.ts` 需要覆盖：

- 多维筛选与分页
- 系统菜与手工菜的权限差异
- 新增 / 编辑 / 删除后列表变化
- 详情读取与详情缓存
- 步骤图片上传

这样可以在后端尚未完全联调前，保证页面、单测与 E2E 都可执行。

## 异常处理设计

错误处理统一收口在 composable：

- 列表加载失败
  - 页面级错误态 + retry
- 详情加载失败
  - 详情抽屉内错误态 + retry
- 保存失败
  - 保留已填写表单，给出明确提示
- 上传失败
  - 标记当前步骤图片失败状态，不清空其他步骤内容
- 系统菜误编辑 / 误删除
  - 前端阻断并提示，不直接暴露技术异常

不依赖大段 `try/catch` 充当业务流程控制；组件仅消费已整理好的状态与错误消息。

## 测试设计

### 单元与组件测试

- 路由单测
  - 验证 `RecipeLibrary` route schema、route record、shell 集成
- composable 单测
  - `useRecipeList` 在筛选变化时重置分页并重新查询
  - `useRecipeForm` 在新增 / 编辑模式下正确拆分保存动作
  - 上传失败时仅标记当前步骤错误
- 组件测试
  - `RecipeCard` 对系统菜隐藏编辑 / 删除入口
  - `IngredientEditor` 排序后重算 `sortNo`
  - `RecipeFormDrawer` 在移动端全屏展示

### 页面与 E2E 测试

- 页面测试
  - 首次加载展示列表
  - 点击新增、编辑、详情、删除进入正确浮层
- E2E
  - 桌面端完整新增流程
  - 移动端打开编辑抽屉、操作步骤、上传图片的关键链路

测试组织与 `data-testid` 风格沿用当前 `family` 页面模式。

## 风险与约束

- 后端尚未明确给出步骤更新与图片上传的最终协议，前端需要在 `api.ts` 中保留适配层
- 食材与步骤排序明确采用原生 HTML5 拖拽，不新增第三方拖拽依赖；移动端以按钮重排作为稳定兜底
- 菜品表单字段较多，若不控制组件边界，单文件复杂度会迅速上升

## 成功标准

本设计落地成功时，应满足：

- `/recipes` 成为正式页面入口，并进入当前 schema 路由体系
- 页面支持浏览、筛选、详情、新增、编辑、删除完整首版流程
- 步骤图片上传与食材排序在桌面端和移动端都可用
- mock 与真实接口共用统一前端协议
- 至少补齐路由、composable、关键组件与主流程 E2E 验证
