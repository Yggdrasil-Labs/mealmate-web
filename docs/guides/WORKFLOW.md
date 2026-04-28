# Workflow Guide

Last updated: 2026-04-28

本文件说明 MealMate Web 的 Harness 工作流入口。

## 标准流程

1. 先读 `AGENTS.md`，判断任务类型。
2. 按改动范围读取最小事实来源（见 `ARCHITECTURE.md` §12 任务前阅读路径）。
3. 多步骤改动在 `docs/active/{requirement}/` 更新或创建计划。
4. 实现时遵守架构、前端、业务语义和组件协议边界。
5. 完成前运行匹配风险的验证命令。
6. 同步文档、测试和遗留项。

## 创建新需求目录

```bash
mkdir docs/active/{requirement}
# 至少创建 design.md 和 plan.md，frontmatter 包含 id、status、owner、created
```

## 归档已完成工作

```bash
mv docs/active/{requirement} docs/archive/{date}-{requirement}
# 更新 docs/active/index.md 和 docs/archive/index.md
```

## 处理阻塞

阻塞项更新 plan.md 的 `status: blocked`，并在 `docs/active/tech-debt-tracker.md` 登记未解决问题。

更完整的分层、落点和验收清单见 [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md) §12。
