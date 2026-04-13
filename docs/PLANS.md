# Plans

本文件说明 MealMate 的计划文档如何分类、何时创建、以及如何从进行中进入已完成状态。

## 1. 目录规则

- `docs/exec-plans/active/`
  当前仍在推进的提案、实施计划或专题工作记录。
- `docs/exec-plans/completed/`
  已完成或已归档的历史计划。
- `docs/exec-plans/tech-debt-tracker.md`
  当前确认但尚未排期的技术债与结构改进项。

## 2. 什么应该写进计划

适合进入计划目录的内容：

- 多步骤的功能实施计划
- 跨文件的重构计划
- 需要明确阶段、风险与验证方式的工作

不适合放在这里的内容：

- 长期架构原则
- 组件 API 权威说明
- 业务背景与统一术语

这些内容分别应进入 `ARCHITECTURE.md`、`docs/components/` 与 `docs/business/`。

## 3. 命名约定

- 活跃工作提案：`docs/exec-plans/active/*-proposal.md`
- 活跃实施计划：`docs/exec-plans/active/*-implementation-plan.md`
- 已完成记录：保留原始语义，但继续存放在 `docs/exec-plans/completed/`

如果某份文档只是为了说明“这次工作准备怎么做”，它应是 proposal，而不是长期 design doc。

## 4. 生命周期

1. 开始重要工作前，在 `docs/exec-plans/active/` 建立计划。
2. 工作推进时，持续更新状态、风险与验证记录。
3. 工作结束后，将计划移入 `docs/exec-plans/completed/`。
4. 仍未解决但已确认的问题，沉淀到 `tech-debt-tracker.md`。

## 5. 当前历史计划

MealMate 的已完成计划记录位于 `docs/exec-plans/completed/`，新的活跃计划记录位于 `docs/exec-plans/active/`。
