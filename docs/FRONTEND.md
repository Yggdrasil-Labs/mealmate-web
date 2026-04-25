# Frontend Handbook

本手册用于说明 MealMate Web 的前端实现约束。它关注“日常如何实现”，而不是顶层架构定位。

## 1. 技术基线

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

默认使用 Composition API + `<script setup lang="ts">`。

## 2. 命名与目录规则

### 页面与路由

- 页面组件放在 `src/pages`
- 路由通过 `src/router/app-route-schema.ts` 声明
- 路由记录通过 `src/router/app-routes.ts` 统一生成
- 页面标题优先通过 route meta 管理

命名建议：

- 页面文件：`kebab-case.vue`
- 路由 name：`PascalCase`
- 路由 path：`kebab-case`
- 页面标题：简洁、可读、面向用户，不带“Demo/示例/演示”

### 组件、Composable 与 Store

- 组件：`PascalCase`
- composable：`useXxx`
- store：`useXxxStore`
- 工具函数：动词或语义明确的名称，避免 `manager`、`temp`、`data` 这类泛化命名

## 3. 业务语义约束

页面标题、路由名、组件名、接口字段和测试描述应尽量与 [docs/design-docs/mealmate-domain-language-design.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/mealmate-domain-language-design.md) 保持一致。

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

- `Dish`
- `Food`
- `Menu`
- `Schedule`
- `WeekMenu`
- `BuyList`
- `PurchaseList`
- `Reminder`

## 4. 页面、组件与状态边界

### 页面

页面负责编排，不在模板中塞入大段计算、请求编排或副作用逻辑。

### 组件

组件优先可组合、可测试、可复用。通用协议组件的权威说明维护在 [docs/components](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)。

### Composable

适合：

- 单页面内部的列表加载、筛选、表单提交与交互逻辑
- 只服务当前页面或组件树的 loading、error、dialog 状态
- 不需要跨页面同步的数据组织

### Store

适合：

- 跨页面、跨布局区域共享的数据
- 页面切换后仍需保留的状态
- 菜单、Tabs、KeepAlive、响应式壳层状态
- 一个页面操作后，另一个页面需要立即感知变化的数据

## 5. 异步、校验与异常

### 参数校验

- 页面入口或表单组件通过 `defineProps`、`emits`、表单校验与类型约束完成入参限制
- 不依赖运行时“碰运气”式处理

### 异步请求

- 异步请求尽量收口到 composable、store 或 API 层
- 页面中的 loading、error、retry 状态应清晰可测

### 异常处理

- 技术异常在合适边界转换为可理解提示
- 不使用大段 `try/catch` 充当业务流程控制
- 错误提示应可理解、可定位、可重试

## 6. 移动端底线

MealMate 面向家庭日常使用场景，默认需要保证移动端可用。

- 页面主体布局不要依赖固定像素宽度
- 优先使用弹性布局、栅格和媒体查询
- 交互元素要考虑触控场景，不把 `hover` 作为唯一触发方式
- 周计划、菜品库、饮食记录等核心页面实现后至少做一次移动端视口检查

## 7. 测试与验证

- 单测文件：`*.spec.ts`
- E2E 文件：按页面对象与测试场景拆分
- 测试用例名描述行为，不把“demo”写进正式断言
- 对新增或显著修改的实现，关键注释占比应至少达到 25%，并在人工检查中确认关键流程、关键分支与重要约束已有注释支撑

常用验证命令：

```bash
source ~/.nvm/nvm.sh
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm vitest
pnpm test:e2e
```

若改动涉及路由、布局、壳层状态、组件协议或测试公共对象，应优先补充对应单测或 E2E 断言。
质量检查时，也应把“关键注释占比至少 25%”作为显式验收项，而不是仅检查功能是否可运行。

## 8. 相关文档

- 架构事实：[ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md)
- 产品与业务语义：[docs/PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
- 组件协议：[docs/components](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
