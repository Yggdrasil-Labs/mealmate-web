# Design Guide

Last updated: 2026-04-25

本文件说明长期设计决策应该放在哪里，以及它与执行计划、组件协议和业务规格的区别。

## 1. 判断是否需要设计文档

只有当内容会长期影响多个后续实现时，才应进入 `docs/design-docs/`。如果它只是一次功能拆解、阶段计划或验收记录，应进入 `docs/active/{requirement}/`；如果它描述组件字段、事件或插槽，应进入 `docs/components/`。

判断问题：

- 这个决策在当前功能结束后仍会约束后续工作吗？
- 它会影响路由、shell、组件协议、业务术语或跨页面数据流吗？
- 后续 Agent 如果不知道这条规则，是否容易写出架构偏离的实现？

三个问题只要有两个答案为“是”，通常就应该沉淀为 design doc 或更新已有 design doc。

## 2. `docs/design-docs/` 放什么

- 长期、跨功能的设计决策进入 `docs/design-docs/`。
- 稳定的设计原则与权衡记录进入 `docs/design-docs/`。
- 会影响多个后续实现的协议或结构决策进入 `docs/design-docs/`。
- 稳定的业务模型、领域语言与产品范围设计进入 `docs/design-docs/`。
- 需要先讨论权衡再进入执行计划的架构 RFC 使用 `arch-*-design.md`。

## 3. 不放什么

- 一次性功能实施计划
- 只服务当前迭代的任务清单
- 组件使用说明
- 测试运行记录或阶段性验收日志

它们更适合进入 `docs/active/`、`docs/archive/` 或 `docs/components/`。

## 4. 命名约定

- 长期设计决策：使用 `*-design.md`
- 架构 RFC：使用 `arch-*-design.md`
- 活跃需求设计：使用 `docs/active/{requirement}/design.md`
- 可执行实施计划：使用 `docs/active/{requirement}/plan.md`

不要把任务级提案也命名成长期设计文档，否则 AI 很难仅凭文件名判断应该落在哪个目录。

## 5. 最小内容

新增或显著修改设计文档时，至少写清：

- 背景：为什么需要这个长期约束
- 决策：当前采用什么规则或结构
- 影响范围：涉及哪些目录、路由、组件、store 或测试
- 权衡：明确放弃了什么替代方案
- 验证：后续如何发现它是否已经失效

## 6. 入口

- 设计索引：[docs/design-docs/index.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/index.md)
- 核心设计信念：[docs/design-docs/core-beliefs.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/core-beliefs.md)
- Harness 工作流：[docs/HARNESS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/HARNESS.md)
