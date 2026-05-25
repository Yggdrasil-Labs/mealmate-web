# MealMate Web Architecture

Last updated: 2026-04-25

本文件记录 `mealmate-web` 的当前架构事实、分层边界与依赖方向。它回答“仓库如何组织、长期边界是什么”，不记录单次功能计划。

## 1. 系统定位

MealMate Web 是一个 schema 驱动的 Vue 3 前端应用。它负责 MealMate 家庭饮食规划场景的 Web 页面承载、交互编排、布局 shell、前端状态与 API 调用入口。

当前架构目标是让页面、菜单、Tabs、KeepAlive、响应式布局和业务模块围绕同一套路由与组件协议协同演进，而不是在页面组件中各自实现壳层逻辑。

不属于本仓库职责：

- 后端服务、数据库迁移、任务调度和认证服务实现
- MealMate 业务算法的服务端编排
- 与当前 Web 壳层无关的独立页面集合

## 2. 技术基线

| 领域       | 当前选择                                           |
| ---------- | -------------------------------------------------- |
| 应用框架   | Vue 3, Composition API, `<script setup lang="ts">` |
| 构建与类型 | Vite, TypeScript, vue-tsc                          |
| 路由与状态 | Vue Router, Pinia, pinia-plugin-persistedstate     |
| UI 与交互  | Element Plus, VueUse, Sass                         |
| 国际化     | Vue I18n, Element Plus locale                      |
| 请求       | Axios, `src/utils/api/*`                           |
| 验证       | ESLint, Vitest, Playwright                         |

## 3. 目录职责

| 路径                            | 职责                                                        |
| ------------------------------- | ----------------------------------------------------------- |
| `src/main.ts`, `src/App.vue`    | 应用启动、插件注册与根组件挂载                              |
| `src/app/`                      | 应用壳层渲染编排，如 layout 解析、页面承载、缓存 key        |
| `src/layouts/`                  | 布局骨架、头部、侧边栏、页签与响应式 shell                  |
| `src/router/`                   | 路由 schema、标准化、树结构、Vue Router records 与类型协议  |
| `src/stores/`                   | 跨页面壳层状态，如菜单、Tabs、KeepAlive、响应式布局         |
| `src/pages/`                    | 页面级组件，由路由 schema 承载，负责页面编排                |
| `src/modules/`                  | 业务模块边界，按领域组织 API、store、types、constants、mock |
| `src/components/`               | 通用组件、业务复用组件与协议化渲染单元                      |
| `src/composables/`              | 可复用组合式逻辑与局部交互状态                              |
| `src/utils/`                    | API 基础设施、消息、初始化与纯工具函数                      |
| `src/config/`, `src/constants/` | 环境配置与跨层常量                                          |
| `src/locales/`                  | i18n 配置与语言资源                                         |
| `src/types/`                    | 全局类型、自动导入类型和跨模块共享类型                      |
| `tests/`                        | 单元测试、E2E 测试、页面对象与测试 setup                    |
| `docs/`                         | Harness、产品语义、组件协议、计划和运行质量文档             |

## 4. 路由与 Shell 协议

页面入口由 `src/router/app-route-schema.ts` 统一声明。`src/router/route-normalizer.ts` 为每个 route 补齐默认的 layout、menu、tab、keepAlive 元信息，`src/router/app-routes.ts` 再把 schema 转成 Vue Router records。

当前关键事实：

- 页面组件文件位于 `src/pages/*.vue`，并通过 schema 的 `component` 字段解析。
- 页面标题优先通过 `route.meta.title` 管理，菜单和页签复用同一份 route meta。
- layout 选择由 `src/app/shell/AppLayoutRenderer.vue` 根据 `route.meta.layout` 决定。
- 页面承载、KeepAlive include 列表、刷新 key 和缓存失效由 `src/app/shell/AppPageRenderer.vue` 与相关 store 统一组织。
- 新增页面时，先判断菜单可见性、页签行为、缓存策略和移动端壳层表现，再补 schema、页面与测试。

这套协议的目的，是让导航、Tabs、缓存和响应式布局围绕同一份路由事实工作。

## 5. 分层模型

```mermaid
flowchart TD
  bootstrap["main.ts / App.vue"]
  shell["src/app + src/layouts"]
  router["src/router schema + normalizer"]
  shellStores["src/stores shell state"]
  pages["src/pages"]
  modules["src/modules feature APIs/stores/types"]
  components["src/components"]
  composables["src/composables"]
  utils["src/utils / src/types / src/config / src/locales"]

  bootstrap --> shell
  shell --> router
  shell --> shellStores
  shell --> components
  router --> pages
  pages --> modules
  pages --> components
  pages --> composables
  pages --> shellStores
  modules --> utils
  components --> composables
  components --> utils
  composables --> utils
  shellStores --> utils
```

## 6. 依赖方向

允许的主要依赖关系：

- `main/App -> app, router, stores, locales, assets`
- `app -> layouts, router, stores`
- `layouts -> stores, components, composables`
- `router -> pages`，仅通过 route schema 与 `import.meta.glob` 解析页面入口
- `pages -> modules, components, composables, stores, utils`
- `modules -> utils/api, types, constants`
- `components -> composables, utils, types`
- `stores -> utils, constants, types`

默认避免：

- 页面绕开路由 schema 手工装配菜单、Tabs、KeepAlive 或 layout。
- `layouts` 承载页面业务流程或直接调用业务模块 API。
- `router` 依赖具体业务模块内部实现。
- `src/stores` 写页面级临时逻辑；页面局部状态优先放在页面或 composable。
- `src/modules` 依赖 `pages`、`layouts` 或 `router`。
- `utils` 依赖页面上下文、组件实例或业务模块状态。

## 7. 层级边界

### `app`

负责应用 shell 的渲染编排和上下文协调，不承载业务规则。

### `layouts`

负责导航、页签、头部、侧边栏与响应式布局骨架，不直接写页面业务流程。

### `router`

负责页面入口、route meta 默认值、菜单树输入和 Vue Router records。新增页面必须从 schema 进入系统。

### `pages`

负责页面编排，保持相对瘦身；复杂加载、表单、筛选和提交流程优先下沉到模块、组件、composable 或 store。

### `modules`

负责业务领域内聚。一个模块可以包含 `api.ts`、`store.ts`、`types.ts`、`constants.ts`、`mock.ts` 等文件，但不拥有全局 shell 规则。

### `components`

负责可复用展示与交互单元。通用协议组件的字段、事件和插槽契约维护在 `docs/components/`。

### `composables`

负责页面内或跨组件可复用的交互逻辑与局部状态组织；若状态需要跨页面长期同步，应考虑提升到 store 或业务模块。

### `stores`

负责菜单、Tabs、KeepAlive、响应式壳层状态与真正跨页面共享的数据。业务模块私有 store 优先放在对应 `src/modules/{domain}/` 下。

### `utils`

负责纯函数、API 请求基础设施和通用工具，不承载依赖具体页面上下文的流程逻辑。

## 8. 数据流

默认页面数据链路：

```text
Route schema -> Shell renderer -> Page -> Module API/Store or Composable -> utils/api -> Backend -> UI
```

职责要求：

- route schema 负责页面入口、标题、布局、菜单、页签与缓存策略。
- shell renderer 负责 layout 和页面承载，不关心具体业务。
- page 负责业务页面编排和用户交互入口。
- module API/store 负责业务数据读写、mock 数据和领域类型。
- composable 负责可复用交互与局部状态组织。
- API 请求基础设施优先复用 `src/utils/api/request.ts`、`src/utils/api/http.ts`。

## 9. 测试边界

- 路由 schema、normalizer、路由树和 shell 同步规则应有单元测试覆盖。
- layout、Tabs、KeepAlive、响应式壳层状态变化应优先补单元测试。
- 通用组件协议变化必须同步 `docs/components/` 与对应组件单测。
- 新增页面或关键用户路径至少补充与风险匹配的 E2E 或页面对象断言。
- 业务模块 API、store、类型转换或 mock 约定变化时，优先补模块级单测。

## 10. 关键约束

- 页面标题、菜单标题、页签标题必须围绕统一 route meta 保持一致。
- 新增页面先注册 schema，再处理页面组件、业务模块、导航语义和测试。
- 路由、layout、Tabs、KeepAlive 和响应式逻辑优先走现有 normalizer、shell 与 store，不另起约定。
- 组件不直接硬编码业务常量，除非它本身就是该领域的业务组件。
- 长期架构变化应同步本文件；单次实现方案和阶段计划放入 `docs/active/{requirement}/`。

## 11. 前端实现约束

本节记录日常前端代码的实现规则，是 ARCHITECTURE.md 的组成部分，不单独维护外部文件。

### 命名规则

- 页面文件：`kebab-case.vue`，放在 `src/pages/`
- 路由 name：`PascalCase`；路由 path：`kebab-case`
- 组件：`PascalCase`；composable：`useXxx`；store：`useXxxStore`
- 工具函数：动词或语义明确的名称，避免 `manager`、`temp`、`data` 等泛化命名
- 页面标题简洁、面向用户，不带"Demo/示例/演示"

### 业务语义约束

页面标题、路由名、组件名、接口字段和测试描述应与 `docs/design-docs/mealmate-domain-language-design.md` 保持一致。

优先使用：`Family`、`FamilyMember`、`Recipe`、`MealType`、`WeeklyMealPlan`、`MealPlanItem`、`PrepPlan`、`ShoppingList`、`MealRecord`、`NutritionReport`、`NotifyTask`

默认避免：`Dish`、`Food`、`Menu`、`Schedule`、`WeekMenu`、`BuyList`、`PurchaseList`、`Reminder`

### 页面、组件与状态边界

- 页面负责编排，不在模板中塞入大段计算、请求编排或副作用逻辑
- 组件优先可组合、可测试、可复用；通用协议组件的权威说明维护在 `docs/components/`
- Composable 适合：单页面内部的列表加载、筛选、表单提交与交互逻辑；不需要跨页面同步的数据组织
- Store 适合：跨页面共享数据、页面切换后仍需保留的状态、菜单/Tabs/KeepAlive/响应式壳层状态

### 异步、校验与异常

- 页面入口或表单组件通过 `defineProps`、`emits`、表单校验与类型约束完成入参限制
- 异步请求收口到 composable、store 或 API 层；页面中的 loading、error、retry 状态应清晰可测
- 技术异常在合适边界转换为可理解提示；不使用大段 `try/catch` 充当业务流程控制

### 移动端底线

- 页面主体布局不依赖固定像素宽度，优先使用弹性布局、栅格和媒体查询
- 交互元素考虑触控场景，不把 `hover` 作为唯一触发方式
- 核心页面实现后至少做一次移动端视口检查

### 验证命令

```bash
source ~/.nvm/nvm.sh
pnpm lint
pnpm type-check
pnpm exec vitest run
pnpm test:e2e
```

## 12. 文档体系

### 分层

| 层级               | 文档或目录                                                               | 负责回答                               |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------- |
| 仓库入口           | `AGENTS.md`, `docs/index.md`                                             | 我应该先读什么                         |
| 长期架构与实现约束 | `ARCHITECTURE.md`（本文件）, `docs/design-docs/core-beliefs.md`          | 仓库边界、依赖方向、前端规则与长期约束 |
| 业务领域           | `docs/DOMAINS.md`                                                        | 代码放哪个领域、领域间关系             |
| 产品语义           | `docs/PRODUCT_SENSE.md`, `docs/design-docs/`                             | 业务范围、统一术语和页面边界           |
| 组件协议           | `docs/components/`                                                       | 组件字段、事件、插槽和运行时协议       |
| 工作流转           | `docs/skills/project-workflow/SKILL.md`, `docs/active/`, `docs/archive/` | 当前工作如何计划、推进和归档           |
| 运行质量           | `docs/QUALITY_SCORE.md`, `docs/RELIABILITY.md`, `docs/SECURITY.md`       | 质量、可靠性和安全边界                 |
| 自动生成           | `docs/generated/`                                                        | 由源码自动提取的文档产物               |

### 文档落点规则

- 长期稳定、跨功能生效的约束放到本文件或 `docs/design-docs/`
- 组件字段、事件、插槽、运行时协议放到 `docs/components/`
- 业务模型、统一语言和 Web 范围放到 `docs/design-docs/`，入口从 `docs/PRODUCT_SENSE.md` 指过去
- 一次性 spec、design、plan 和阶段记录放到 `docs/active/{requirement}/`，完成后归档到 `docs/archive/`
- 自动生成内容只放到 `docs/generated/`
- 外部资料摘要放到 `docs/references/`

### 任务前阅读路径

| 改动类型                         | 必读文档                                                           |
| -------------------------------- | ------------------------------------------------------------------ |
| 新增或删除页面                   | 本文件, `src/router/app-route-schema.ts`, 相关业务设计文档         |
| 调整路由、菜单、Tabs 或 shell    | 本文件, 相关 router / store 测试                                   |
| 新增或修改通用组件协议           | `docs/components/component-api-conventions.md`, 对应组件文档       |
| 修改业务术语、页面范围或产品边界 | `docs/PRODUCT_SENSE.md`, `docs/design-docs/`                       |
| 新增业务模块或判断代码归属       | `docs/DOMAINS.md`                                                  |
| 多步骤功能或重构                 | `docs/skills/project-workflow/SKILL.md`, `docs/active/`            |
| 修改安全、可靠性或质量规则       | `docs/SECURITY.md`, `docs/RELIABILITY.md`, `docs/QUALITY_SCORE.md` |

### Agent 工作流

1. 先读 `AGENTS.md`，确认当前任务属于哪类改动
2. 按"任务前阅读路径"读取最小上下文，不扩大到无关文档
3. 涉及多文件或多阶段工作时，在 `docs/active/{requirement}/` 更新或创建计划
4. 实现时遵守 schema 路由、shell、store、组件协议和统一业务语言
5. 行为、路由、组件协议或错误路径发生变化时，同步补测试
6. 改动完成前同步相关文档，避免代码和文档分叉
7. 运行与改动风险匹配的验证命令，并把未验证项明确留下

### 验收清单

完成一次非平凡改动前，至少确认：

- 入口导航仍能把读者带到正确事实来源
- 页面标题、菜单标题、页签标题仍围绕 route meta 保持一致
- 新增或显著修改代码的关键注释覆盖核心流程、关键分支与重要约束（占比至少 25%）
- 组件协议变化已同步到 `docs/components/`
- 业务术语变化已同步到 `docs/design-docs/` 或对应产品规格
- 已运行 `pnpm lint`、`pnpm type-check`、相关 Vitest 或 Playwright 检查；无法运行时说明原因

## 13. 相关文档

- 业务语义与范围：`docs/PRODUCT_SENSE.md`
- 组件协议：`docs/components/`
- 计划机制：`docs/skills/project-workflow/SKILL.md`, `docs/active/`, `docs/archive/`
