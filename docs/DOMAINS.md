---
updated: 2026-05-26
---

# 业务领域划分

<!--
  本文件记录项目的业务领域划分，随业务演进持续更新。
  智能体据此判断代码应该放在哪里、新功能属于哪个领域。

  与 ARCHITECTURE.md 的区别：
  - ARCHITECTURE.md = 技术架构（分层、依赖方向、技术栈），相对稳定
  - 本文件 = 业务领域（领域边界、职责、实体），随业务演进变化
-->

## 领域清单

| 领域 | 职责说明 | 代码位置 | 关键实体 |
|------|----------|----------|----------|
| Family | 家庭基本信息与成员画像管理 | `src/modules/family/` | Family, FamilyMember, MemberPreference |
| Recipe | 菜品库管理（浏览、创建、编辑、删除） | `src/modules/recipe/` | Recipe, RecipeIngredient, RecipeStep, RecipeNutrition |
| Shell | 应用壳层（布局、导航、Tabs、KeepAlive） | `src/app/`, `src/layouts/`, `src/stores/` | AppShell, Menu, Tab, KeepAlive |

## 领域间关系

```mermaid
flowchart LR
  Shell["Shell 壳层"] --> Family["Family 家庭画像"]
  Shell --> Recipe["Recipe 菜品库"]
  Family -.->|"未来: 偏好影响推荐"| Recipe
```

## 领域通信规则

- 领域之间不允许循环依赖
- `Shell` 通过路由 schema 承载各领域页面，不直接调用业务模块 API
- `Family` 与 `Recipe` 当前独立，未来如需交互须通过 composable 或 store 中转，不直接 import 对方内部实现
- 新增领域时，先在本文件登记，再建 `src/modules/{domain}/` 目录

## 待规划领域

以下领域已在产品规格中提及，但尚未进入实现：

| 领域 | 预期职责 | 状态 |
|------|----------|------|
| MealPlan | 周餐计划编排与排期 | 未开始 |
| ShoppingList | 采购清单生成与管理 | 未开始 |
| MealRecord | 用餐记录与反馈 | 未开始 |
| NutritionReport | 营养报告与复盘 | 未开始 |
| NotifyTask | 提醒与通知任务 | 未开始 |
