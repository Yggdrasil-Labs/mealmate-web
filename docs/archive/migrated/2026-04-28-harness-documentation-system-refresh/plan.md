---
id: plan-harness-documentation-system-refresh
status: completed
owner: codex
created: 2026-04-25
updated: 2026-04-28
---

# Harness Documentation System Refresh Plan

## Goal

把 MealMate Web 的 Harness 文档从“入口补齐”推进到“目录结构、索引、方法论、生命周期都一致”的状态。

## Scope

- 迁移旧平铺计划目录中的活跃和历史计划。
- 重写 `docs/active/` 与 `docs/archive/` 索引。
- 统一 `docs/guides/` 与根级指南页面的职责。
- 更新导航和质量、安全、可靠性文档中的生命周期引用。

## Steps

1. 审计当前文档目录和历史计划文件。
2. 将历史计划迁移到 `docs/archive/`。
3. 将当前仍在推进的工作迁移到 `docs/active/{requirement}/`。
4. 重写索引、指南和 Harness 总纲。
5. 运行文档结构检查和仓库 lint。

## Risks

- 迁移后旧链接可能失效。
- `docs/guides/` 与旧根级指南可能重复定义规则。
- 当前工作区已有非文档改动，验证结果需要区分来源。

## Verification

- `node /home/yangyang/.codex/skills/harness-engineering/scripts/lint-docs.ts`
- `pnpm lint`
- 搜索旧计划目录引用，并排除 `docs/archive/**` 下的历史上下文。
