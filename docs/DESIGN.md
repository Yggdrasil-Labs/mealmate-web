# Design Docs Guide

本文件说明长期设计决策应该放在哪里，以及它与执行计划的区别。

## 1. `docs/design-docs/` 放什么

适合进入 `docs/design-docs/` 的内容：

- 跨模块的长期设计决策
- 稳定的设计原则与权衡记录
- 会影响多个后续实现的协议或结构决策

## 2. 不放什么

以下内容不应优先进入 `docs/design-docs/`：

- 一次性功能实施计划
- 只服务当前迭代的任务清单
- 组件使用说明
- 业务背景介绍

它们更适合进入 `docs/exec-plans/`、`docs/components/` 或 `docs/business/`。

## 3. 命名约定

- 长期设计决策：使用 `*-design.md`
- 活跃工作提案：使用 `docs/exec-plans/active/*-proposal.md`
- 可执行实施计划：使用 `docs/exec-plans/active/*-implementation-plan.md`

不要把任务级提案也命名成长期设计文档，否则 AI 很难仅凭文件名判断应该落在哪个目录。

## 4. 入口

- 设计索引：[docs/design-docs/index.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/index.md)
- 核心设计信念：[docs/design-docs/core-beliefs.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/core-beliefs.md)
