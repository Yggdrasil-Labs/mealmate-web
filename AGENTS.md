# MealMate Web Agent Guide

本文件面向进入本仓库协作的 AI Agent、自动化脚本与开发者，目标是在第一时间说明本项目的真实技术事实、分层边界、编码规范与验证约束，避免写出“能跑但不符合 MealMate Web 约定”的代码。

## 1. 项目事实

### 1.1 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Element Plus
- VueUse
- Vue I18n
- Axios
- Sass
- Vitest + Playwright
- `@antfu/eslint-config`

### 1.2 仓库结构

当前仓库主要模块如下：

- `src/app`：应用壳层与页面承载
- `src/components`：通用组件
- `src/composables`：组合式函数
- `src/config`：环境与运行时配置
- `src/constants`：常量定义
- `src/layouts`：布局骨架与布局组件
- `src/locales`：国际化资源
- `src/pages`：页面组件，由路由 schema 承载
- `src/router`：路由 schema、标准化与注册
- `src/stores`：Pinia 状态管理
- `src/types`：TypeScript 类型定义
- `src/utils`：工具函数
- `tests/e2e`：Playwright 端到端测试
- `tests/unit`：单元测试

### 1.3 本地环境事实

- WSL 环境下如需使用 Node，请先执行 `source ~/.nvm/nvm.sh`
- Node.js 版本要求：`>= 22.14.0`
- 包管理器：`pnpm@10.32.1`
- 优先使用 `pnpm` 与仓库脚本，不要手工拼接不必要的命令

## 2. 第一原则

Agent 在本仓库工作时，必须优先服从以下原则：

1. 先尊重现有架构，再实现功能。
2. 先维护路由、布局、状态与页面边界，再追求编码速度。
3. 先沿用仓库已有命名与目录结构，再新增抽象。
4. 先使用仓库已有能力，再引入新框架或新风格。
5. 先保证提交信息、版本语义和测试结果可被流水线识别，再考虑“看起来更完整”。

如果实现方案与这些原则冲突，应主动调整方案，而不是绕开规范。

## 3. 前端架构风格

本项目是一个 schema 驱动的 Vue 3 Web 前端，不是零散页面拼装工程。任何改动都应保持以下边界。

### 3.1 各层职责

#### `app`

- 负责应用壳层、路由承载与页面渲染组织
- 只做装配与上下文协调，不承载业务规则

#### `components`

- 放通用 UI 组件、业务通用组件和可复用渲染单元
- 组件应尽量可组合、可测试、可复用

#### `composables`

- 放组合式逻辑
- 负责抽取跨页面可复用的状态与行为

#### `layouts`

- 放布局骨架、导航、页签、侧边栏、头部等壳层组件
- 不直接写页面业务逻辑

#### `pages`

- 放页面级组件
- 页面应保持瘦，优先通过 schema、组件和 composables 组合能力

#### `router`

- 放路由 schema、标准化、注册与相关类型
- 路由入口应保持统一，不要在页面里私自绕开 schema

#### `stores`

- 放全局或壳层状态
- 例如菜单、页签、缓存、响应式状态

#### `utils`

- 放纯工具函数
- 不要把业务规则塞进工具层

### 3.2 依赖方向

允许的主要依赖关系：

- `app -> layouts, router, stores, components`
- `layouts -> stores, components`
- `pages -> components, composables, stores, utils`
- `router -> pages, layouts, stores`
- `components -> composables, utils`
- `stores -> utils`

默认禁止：

- 页面直接绕开路由 schema 手工装配壳层
- 组件直接硬编码业务常量，除非它就是该业务组件
- `stores` 里写页面级临时逻辑
- `utils` 里写依赖具体页面上下文的流程逻辑

除非是非常明确且经过设计确认的框架级装配，否则不要打破以上依赖方向。

## 4. 命名与目录规范

命名必须与仓库 README、现有页面、路由和测试风格保持一致。

### 4.1 页面与路由

- 页面组件放在 `src/pages`
- 路由通过 `src/router/app-route-schema.ts` 声明
- 路由注册与页面解析通过 `src/router/app-routes.ts` 统一处理
- 页面标题优先通过路由 meta 统一管理

命名建议：

- 页面文件：`kebab-case.vue`
- 路由 name：`PascalCase`
- 路由 path：`kebab-case`
- 页面标题：简洁、可读、面向用户，不要带“Demo/示例/演示”字样

### 4.2 组件与组合函数

- 组件：`PascalCase`
- composable：`useXxx`
- store：`useXxxStore`
- 工具函数：动词/语义明确，避免泛化命名

### 4.3 业务语义与禁用别名

命名不仅要统一风格，也要统一业务语义。页面标题、路由名、组件名、接口字段、测试描述应尽量与 `docs/business/mealmate-domain-context.md` 中的统一语言保持一致。

优先使用：

- `Family` / `FamilyMember`
- `Recipe`
- `MealType`
- `WeeklyMealPlan`
- `MealPlanItem`
- `PrepPlan`
- `ShoppingList`
- `MealRecord`
- `NutritionReport`
- `NotifyTask`

默认避免：

- `Dish`、`Food`、`Menu`
- `Schedule`、`WeekMenu`
- `BuyList`、`PurchaseList`
- `Reminder`
- 语义模糊且脱离业务的 `data`、`info`、`manager`、`temp`

### 4.4 测试命名

- 单测文件：`*.spec.ts`
- E2E 文件：按页面对象与测试场景拆分
- 测试用例名应描述行为，不要把“demo”写进正式断言

## 5. 对象与数据流规范

默认数据链路：

`Route schema -> Page component -> Composable/Store -> API/Backend -> UI`

职责要求：

- 路由 schema 负责页面入口、标题、布局与缓存策略
- Page component 负责页面编排，不要把业务细节散落在模板里
- Composable 负责可复用交互与数据组织
- Store 负责跨页面共享状态
- API 层负责与后端通信
- 测试对象优先验证行为与状态，不要只验证表面文字

当前仓库中，请求基础设施应优先复用 `src/utils/api/request.ts`、`src/utils/api/http.ts` 等已有封装；业务请求逻辑应按业务域组织，不要把请求细节散落到页面模板、布局组件或通用展示组件中。

禁止做法：

- 页面直接绕过路由或 store 自己管理壳层状态
- 组件直接耦合后端返回结构而不做适配
- 页面、布局组件或通用组件直接内嵌大段请求编排
- 在模板里写大段复杂计算或副作用
- 让页面标题、菜单标题、页签标题彼此不一致

## 6. 校验、异步与异常

### 6.1 参数校验

- 页面入口或表单组件使用 `defineProps`、`emits`、表单校验和类型定义完成入参约束
- 不要只依赖运行时“碰运气”式处理

### 6.2 异步与请求

- 异步请求应尽量收口到 composable、store 或 API 层
- 页面中如果需要处理 loading、error、retry，应保持状态清晰可测试

### 6.3 Composable 与 Store 的边界

优先用 composable 的场景：

- 单页面内部的列表加载、筛选、表单提交与交互逻辑
- 只服务当前页面或当前组件树的 loading、error、dialog 状态
- 可复用但不需要跨页面同步的数据组织逻辑

优先用 store 的场景：

- 需要跨页面、跨布局区域共享的数据
- 页面切换后仍需保留的状态
- 菜单、tabs、keep-alive、响应式壳层状态
- 一个页面操作后，另一个页面需要立即感知变化的数据

如果两个组件分别调用同一个 composable 后却需要共享同一份状态，通常说明这部分逻辑更适合进入 store。

### 6.4 异常处理

- 技术异常应在合适边界转换，不要把底层实现细节直接暴露到页面
- 不要用大段 `try/catch` 充当业务流程控制
- 错误提示应可理解、可定位、可重试

## 7. 代码风格

### 7.1 Vue / TypeScript 风格

- 优先使用 Composition API + `<script setup lang="ts">`
- 遵循现有的自动导入、组件自动注册和路由 schema 约定
- 清理未使用的 import、变量和临时代码
- 不要为了“更短”而牺牲可读性

### 7.2 设计风格

- 优先小而清晰的类、函数与组件
- 避免“万能组件”侵蚀边界
- 避免把一页所有逻辑塞进一个巨大 SFC
- 不要为了个人偏好改写仓库已有风格

### 7.3 移动端适配底线

- MealMate 面向家庭日常使用场景，默认需要保证移动端可用性，而不只是桌面端可用。
- 页面主体布局不要依赖固定像素宽度，优先使用弹性布局、栅格和媒体查询。
- 交互元素应考虑触控场景，避免把 `hover` 作为唯一触发方式。
- 周计划、菜品库、饮食记录等核心页面在实现后应至少做一次移动端视口检查，避免溢出、遮挡和难以点击的问题。

### 7.4 注释风格

- 注释解释“为什么”，少解释“代码正在做什么”
- 对路由、布局、缓存、测试约束等公共边界可以写少量说明
- 不写陈旧、口号式或与代码事实不一致的注释

## 8. 路由、布局与壳层规范

- 路由由 `src/router/app-route-schema.ts` 统一声明
- `src/router/route-normalizer.ts` 负责补齐默认 layout、menu、tab、keepAlive 等元信息
- `src/router/app-routes.ts` 负责把 schema 转成 Vue Router records
- 布局与壳层状态由 `src/layouts` 与 `src/stores` 协调
- 菜单、页签、缓存、响应式状态应保持一致，不要出现一个地方改了、另一个地方没跟上的情况

如果你新增路由或页面：

1. 先确认是否需要显示在菜单、页签或缓存里
2. 再确认 title、icon、layout、tab、keepAlive 等 meta
3. 最后再补测试

## 9. 测试与验证

### 9.1 基本要求

- 改动后优先运行与改动范围匹配的最小验证命令
- 若修改了公共路由、布局、壳层状态、测试公共页对象，优先补单测或 E2E 断言
- 不要只改实现不补验证

### 9.2 常用命令

- 开发启动：`pnpm dev`
- 构建：`pnpm build`
- 类型检查：`pnpm type-check`
- 代码检查：`pnpm lint`
- 单元测试：`pnpm vitest`
- E2E 测试：`pnpm test:e2e`

### 9.3 Agent 约束

- 未经明确需要，不要擅自改动发布工作流和版本脚本
- 未经明确需要，不要自动执行 `git commit`、`git push`、打 tag 或发布动作
- 若改动涉及路由、页面、壳层或测试公共对象，优先做一次实际验证

## 10. Conventional Commits

本仓库的发布流程依赖 Conventional Commits 与 Release Please，因此提交信息不是“可选建议”，而是自动发布输入。

### 10.1 提交格式

推荐格式：

`type(scope): summary`

如果没有合适 scope，可使用：

`type: summary`

### 10.2 常用类型

- `feat`: 新功能
- `fix`: 缺陷修复
- `perf`: 性能优化
- `refactor`: 重构
- `docs`: 文档更新
- `test`: 测试相关
- `build`: 构建系统、依赖、打包逻辑
- `ci`: CI/CD 工作流
- `chore`: 杂项维护

### 10.3 Breaking Change

发生不兼容变更时，必须显式声明：

- 在 commit body 中包含 `BREAKING CHANGE: ...`
- 或使用带破坏性语义的 Conventional Commit 写法

## 11. 语义化版本

本仓库采用 SemVer，并通过 Release Please、`CHANGELOG.md`、GitHub Actions 和根版本号协同管理。

- `MAJOR`：不兼容变更
- `MINOR`：向后兼容的新功能
- `PATCH`：向后兼容的问题修复

Agent 注意事项：

- 不要随意手工修改版本语义
- 不要在没有发布语义的改动中擅自升级版本
- 若任务涉及版本或发布，只在明确理解工作流后再修改

## 12. AI Agent 工作守则

### 12.1 变更前

- 先确认改动落在哪一层
- 先确认是否已有同类命名或目录约定
- 先确认这是页面、路由、壳层、状态还是测试问题

### 12.2 实现时

- 优先沿用已有模块和风格
- 尽量最小化改动面
- 不跨层偷依赖
- 不为了省事把业务逻辑塞进页面模板、配置或测试壳里
- 默认在当前分支上开发
- 未经用户明确要求，不主动创建或切换到 Git Worktree

### 12.3 提交前

- 至少做编译/类型/测试级验证
- 确认格式化无问题
- 确认新增命名符合本文件约束
- 确认提交信息符合 Conventional Commits
- 确认改动语义与预期版本语义一致

## 13. 最重要的几条硬约束

如果你是第一次进入本仓库，请优先记住这几条：

1. 这是 Vue 3 + Vite 的 Web 前端工程，不是后端服务工程。
2. 页面、路由、布局和壳层状态要通过现有 schema / store 体系组织，不要绕开。
3. 页面标题、菜单标题、页签标题应保持一致。
4. 新增或删除页面时，要同步考虑路由、测试和导航入口。
5. 使用 `pnpm`、`vitest`、`playwright`、`eslint` 与 `vue-tsc` 做验证。
6. Commit 必须符合 Conventional Commits，因为发布系统依赖它生成版本与变更日志。
7. 默认不要自行提交代码，只有在用户明确要求时才执行提交、推送或发布相关动作。
8. 默认在当前分支工作，只有在用户明确要求时才使用 Git Worktree。
