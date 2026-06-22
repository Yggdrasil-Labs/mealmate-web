# 前端代码质量深度分析报告

日期：2026-06-22

## 概述

本报告基于对 mealmate-web 全量源码的逐文件审查，聚焦已确认成立的架构和实现问题。每条结论附有代码路径、行为证据和修复方案。

---

## P1-1：前端错误处理全链路断裂

### 证据

**请求层** — `src/utils/api/request.ts` L143：
```typescript
// 可以在这里添加全局错误提示
// ElMessage.error(errorMessage)
```
全局 UI 错误提示被注释，错误只 reject 但用户看不到。

**Store 层** — `src/modules/meal-plan/store.ts`：
```typescript
async function loadCurrentPlan() {
  loading.value = true
  try {
    currentPlan.value = await getCurrentWeekPlan(...)
  } finally {
    loading.value = false  // 错误被默默吞掉
  }
}
```
所有 async action（`fetchCurrentWeekPlan`、`loadCurrentPlan`、`generate`、`confirmPlan`）均为 `try/finally`，无 catch。

**Composable 层** — `src/modules/prep/composables/usePrepPlan.ts`、`useShoppingList.ts`：
同样无 `error` ref 暴露。

### 用户实际体验

| 操作 | 失败时用户看到的 | 应该看到的 |
|------|-----------------|-----------|
| 打开周计划（后端 500） | loading 消失，页面空白 | "加载失败，请重试" |
| 生成计划（重复确认） | loading 消失，无变化 | "计划已确认，无法重新生成" |
| 删除最后一项 | 无反应 | "每餐至少保留一道菜品" |
| 勾选采购项（网络超时） | loading 消失 | "网络异常，请重试" |

### 修复方案

1. **立即**：取消 `request.ts` L143 的 `ElMessage.error` 注释（全局兜底）
2. **Store/Composable**：添加 `error` ref + 页面渲染 error state
3. **分层策略**：全局拦截器管通用错误、Store 暴露 error state、业务组件处理特定错误码

工作量预估：4h

---

## P1-2：types.ts 字段名与后端 JSON 不匹配

### 证据

**后端 `MealPlanItemCO.java`**：
```java
private boolean isWeightLoss;   // Lombok @Data → getter: isWeightLoss()
private boolean isBabyMeal;     // Lombok @Data → getter: isBabyMeal()
```

**Jackson 序列化行为**：`boolean isXxx` + Lombok getter `isWeightLoss()` → JSON key **`"weightLoss"`**（去掉 `is` 前缀）。

**前端 `src/modules/meal-plan/types.ts` L28-30**：
```typescript
isWeightLoss: boolean    // ← 期望 key 为 "isWeightLoss"，实际后端返回 "weightLoss"
isBabyMeal: boolean      // ← 期望 key 为 "isBabyMeal"，实际后端返回 "babyMeal"
duplicateFlag: boolean
```

**前端 `src/modules/meal-plan/mock.ts` L7**：
```typescript
weightLoss: false,  // 与后端一致，但与 types.ts 定义不一致
// 缺少 babyMeal、duplicateFlag 字段
```

### 运行时行为

对接真实后端时，`item.isWeightLoss` 和 `item.isBabyMeal` 始终为 `undefined`，导致"宝"和"轻"标签**永远不显示**。

### 修复方案

前端 `types.ts` 改为：
```typescript
weightLoss: boolean
babyMeal: boolean
duplicateFlag: boolean
```
同步修改所有使用处（`MealItemCard.vue`、`index.vue`）。Mock 补齐 `babyMeal`、`duplicateFlag` 字段。

工作量预估：1h

---

## P1-3：navigateWeek 三处逐行重复

### 证据

`src/pages/prep-plan.vue` L20-28 和 `src/pages/shopping-list.vue` L20-28 **完全相同**：
```typescript
function navigateWeek(offset: number) {
  const current = store.selectedWeekStart || store.currentPlan?.weekStartDate || ''
  if (!current) return
  const date = new Date(`${current}T00:00:00`)
  date.setDate(date.getDate() + offset * 7)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  store.selectedWeekStart = `${y}-${m}-${d}`
  store.loadCurrentPlan()
}
```

`weekly-meal-plan.vue` 通过 `useWeeklyPlan` composable 间接实现相同逻辑。
两页面的 `onMounted`、`watch`、`computed` 逻辑也完全相同。

### 修复方案

提取 `src/modules/meal-plan/composables/useWeekNavigation.ts`：
```typescript
export function useWeekNavigation(store: ReturnType<typeof useMealPlanStore>) {
  const weekStart = computed(() => store.currentPlan?.weekStartDate || store.selectedWeekStart)
  const isConfirmed = computed(() => store.currentPlan?.status === 'CONFIRMED')

  function navigateWeek(offset: number) { /* ... */ }

  onMounted(() => { if (!store.currentPlan) store.loadCurrentPlan(); else load() })

  return { weekStart, isConfirmed, navigateWeek }
}
```

工作量预估：0.5h

---

## P2-1：KeepAlive store 反向依赖 app/shell

### 证据

`src/stores/keep-alive.ts` L3：
```typescript
import { getKeepAliveIncludeName } from '@/app/shell/route-cache'
```

ARCHITECTURE.md §6 允许 `stores -> utils`，禁止 `stores -> app`。

`getKeepAliveIncludeName` 实际为纯字符串处理函数：
```typescript
// src/app/shell/route-cache.ts
export function getKeepAliveIncludeName(cacheKey: string) {
  return cacheKey.split(':', 1)[0] ?? cacheKey
}
```

### 影响

当前无运行时风险（纯函数），但违反架构约定。若 `route-cache.ts` 未来引入 store 依赖则形成循环。

### 修复方案

将 `getKeepAliveIncludeName` 移到 `src/utils/cache-key.ts`，`route-cache.ts` 和 `keep-alive.ts` 均从 utils 导入。

工作量预估：0.5h

---

## P2-2：双路由系统共存

### 证据

`vite.config.ts` 和 `vitest.config.ts` 均配置了 `vue-router/vite` 文件路由插件：
```typescript
VueRouter({
  dts: 'src/types/route-map.d.ts',
  routesFolder: 'src/pages',
})
```

但 `src/router/index.ts` 使用标准 `vue-router` + 手动 schema：
```typescript
import { createRouter, createWebHistory } from 'vue-router'
routes: createRouteRecords()  // 来自 app-route-schema.ts
```

项目架构明确选择 schema 驱动路由（ARCHITECTURE.md §4），从未使用 file-based routing 功能。

### 影响

- 运行时无冲突（未使用 `vue-router/auto`）
- Dev server 启动时插件会扫描 `src/pages/` 做无用工作
- 自动生成的 `route-map.d.ts` 可能与手动路由类型增强冲突
- 开发者认知负担

### 修复方案

- 从 `vite.config.ts` 和 `vitest.config.ts` 移除 `VueRouter` 插件
- `AutoImport` 中的 `VueRouterAutoImports` 替换为手动列出 `useRoute`/`useRouter`
- 删除 `src/types/route-map.d.ts`

工作量预估：0.5h

---

## P2-3：resetStores 空实现

### 证据

`src/stores/pinia.ts`：
```typescript
export async function resetStores(): Promise<void> {
  return Promise.resolve()
}
```

永远不做任何事，登出时无法清理跨页面状态。

### 影响

认证接入后，切换用户时旧用户的 `currentPlan`、`selectedWeekStart` 等数据会残留。

### 修复方案

遍历已注册 store 调用 `$reset()`（`useAppShellStore` 已实现 `$reset`）。

---

## P2-4：缺少 404 路由和全局错误边界

### 证据

`src/router/app-route-schema.ts` 无 catch-all 路由。用户访问不存在路径时无友好提示。
无全局 `ErrorBoundary` 组件。

### 修复方案

Schema 新增 `{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }`。

---

## 综合优先级

| 编号 | 问题 | 修复工作量 | 建议阶段 |
|------|------|-----------|---------|
| P1-1 | 错误处理全链路断裂 | 4h | Sprint 1 |
| P1-2 | types.ts 字段名错误 | 1h | Sprint 1 |
| P1-3 | navigateWeek 重复 | 0.5h | Sprint 1 |
| P2-1 | KeepAlive 反向依赖 | 0.5h | Sprint 2 |
| P2-2 | 双路由系统 | 0.5h | Sprint 2 |
| P2-3 | resetStores 空实现 | 0.5h | Sprint 2 |
| P2-4 | 缺少 404 路由 | 1h | Sprint 2 |

---

## 审查方法论说明

### 自我质疑修正

1. ~~"API unwrap 模式三种实现各异"~~ — 实际为两种：meal-plan 的 `unwrap` 不校验空值、recipe/family 的 `unwrapResponseData` 校验空值。仍是复用问题，但没有三种那么混乱
2. ~~"pro-* 组件完全未使用"~~ — 可能通过 auto-import 插件隐式使用，或为后续页面预建基础设施，需进一步验证
