---
id: design-harness-documentation-system-refresh
status: verified
owner: codex
created: 2026-04-25
verified: 2026-04-25
---

# Harness Documentation System Refresh Design

## 背景

上一轮 Harness 文档已经补齐了入口页和兼容目录，但目录语义仍然偏过渡态：旧的平铺计划目录继续承载一等计划，`docs/active/` 与 `docs/archive/` 只是兼容入口，方法论也同时散落在根级指南和 `docs/guides/`。

本次刷新把 MealMate 文档系统调整为更标准的 Harness 结构，让目录本身表达文档生命周期。

## 技术方案

- `AGENTS.md` 保持短入口，只做仓库导航。
- `docs/HARNESS.md` 作为 Harness 总纲，说明分层、落点、工作流和验收。
- `docs/guides/` 承接方法论：workflow、spec、design、plans。
- `docs/active/{requirement}/` 承接当前活跃需求，每个需求至少有 `design.md` 和 `plan.md`。
- `docs/archive/{snapshot}/` 承接历史计划和已完成迁移记录。
- 旧的平铺计划目录从一等入口降级并移除，避免同一生命周期有两套路由。

## 影响范围

- 文档入口：`AGENTS.md`、`README.md`、`docs/index.md`、`docs/HARNESS.md`
- 方法论：`docs/guides/`
- 生命周期目录：`docs/active/`、`docs/archive/`
- 质量与运行约束：`docs/QUALITY_SCORE.md`、`docs/RELIABILITY.md`、`docs/SECURITY.md`

## 约束

- 不改动业务代码。
- 不把技能本地脚本路径写入仓库文档。
- 不让 `docs/active/` 保留已完成历史。
- 不复制组件协议、业务术语或架构事实到多个权威入口。

## 验证方式

- 运行 Harness 文档结构检查。
- 运行 `pnpm lint` 确认 Markdown 与当前工作区仍满足 ESLint。
- 搜索旧计划目录引用，确保入口页不再指向旧生命周期目录。
