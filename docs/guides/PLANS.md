# Plans Guide

Last updated: 2026-04-25

本文件说明 MealMate 的计划文档如何分类、何时创建、以及如何从进行中进入已完成状态。

## 1. 什么时候需要计划

以下情况应创建或更新计划：

- 改动跨越多个文件、模块或测试层级
- 需要分阶段交付，且中途可能留下风险或技术债
- 需要先明确验证方式再实现
- 会修改路由、shell、组件协议、业务语义或长期文档结构

以下情况通常不需要单独计划：

- 单个文案、样式或测试断言的小修
- 不改变行为的局部重命名
- 已经由现有活跃计划覆盖的微小跟进

## 2. 目录规则

- 活跃计划放在 `docs/active/{requirement}/`。
- 已完成计划放在 `docs/archive/{snapshot}/`。
- 未排期技术债放在 `docs/active/tech-debt-tracker.md`。

## 3. 什么应该写进计划

适合进入计划目录的内容：

- 多步骤的功能实施计划
- 跨文件的重构计划
- 需要明确阶段、风险与验证方式的工作

不适合放在这里的内容：

- 长期架构原则
- 组件 API 权威说明
- 业务背景与统一术语

这些内容分别应进入 `ARCHITECTURE.md`、`docs/components/` 与 `docs/design-docs/`。

## 4. 命名约定

- 活跃需求：`docs/active/{requirement}/`
- 产品规格：`docs/active/{requirement}/spec.md`
- 技术设计：`docs/active/{requirement}/design.md`
- 实施计划：`docs/active/{requirement}/plan.md`
- 已完成记录：保留原始语义，但迁入 `docs/archive/{snapshot}/`

如果某份文档只是为了说明“这次工作准备怎么做”，它应进入 `docs/active/{requirement}/plan.md`，而不是长期 design doc。

## 5. 生命周期

1. 开始重要工作前，在 `docs/active/{requirement}/` 建立计划。
2. 工作推进时，持续更新状态、风险与验证记录。
3. 工作结束后，将计划移入 `docs/archive/`。
4. 仍未解决但已确认的问题，沉淀到 `docs/active/tech-debt-tracker.md`。

## 6. 计划最小结构

活跃计划至少应包含：

- 目标：本次工作完成后系统有什么变化
- 范围：会改哪些目录、页面、组件或文档
- 步骤：可验证的分段任务
- 风险：可能破坏的路由、状态、测试或业务语义
- 验证：预期运行哪些命令，哪些场景需要手动检查
- 状态：已完成、进行中、阻塞和遗留项

## 7. 完成与归档

计划进入 `docs/archive/` 前，应确认：

- 计划中的状态和验证记录已经更新
- 未完成事项已经转入新的活跃计划或 `docs/active/tech-debt-tracker.md`
- 相关入口页、架构文档、组件文档或业务设计文档已经同步
- `docs/index.md` 或其他索引没有指向错误位置
