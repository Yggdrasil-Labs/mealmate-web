# Harness Engineering

Last updated: 2026-04-25

本文件说明 MealMate Web 的文档 Harness 如何工作。它面向人类开发者、AI Agent 与自动化脚本，目标是让一次改动能快速定位事实来源、写入正确文档，并留下可验证的状态。

## 1. Harness 目标

MealMate Web 的 Harness 不是文档数量清单，而是一套仓库内的工作约束：

- 入口要短：`AGENTS.md` 和 `docs/index.md` 只负责导航。
- 事实要集中：架构、前端规则、业务语义、组件协议和计划状态各有权威位置。
- 变更要可追踪：新增页面、组件协议、业务范围或长期约束时，同步更新对应文档。
- 质量要可验证：每次完成前都能说清楚读了什么、改了什么、跑了什么检查。

如果某条重要规则反复靠人工提醒才能执行，优先考虑把它沉淀为测试、lint 规则或结构化检查。

## 2. 文档分层

| 层级 | 文档或目录 | 负责回答 |
| --- | --- | --- |
| 仓库入口 | [AGENTS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/AGENTS.md), [docs/index.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/index.md) | 我应该先读什么 |
| 长期架构 | [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md), [docs/design-docs/core-beliefs.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/core-beliefs.md) | 仓库边界、依赖方向与长期约束是什么 |
| 实现规则 | [docs/FRONTEND.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/FRONTEND.md), [docs/components/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components) | 日常前端代码和组件协议怎么写 |
| 产品语义 | [docs/PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md), [docs/design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs) | 业务范围、统一术语和页面边界是什么 |
| 工作流转 | [docs/guides/PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/guides/PLANS.md), [docs/active/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/active), [docs/archive/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/archive) | 当前工作如何计划、推进和归档 |
| 运行质量 | [docs/QUALITY_SCORE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/QUALITY_SCORE.md), [docs/RELIABILITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/RELIABILITY.md), [docs/SECURITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/SECURITY.md) | 如何判断质量、可靠性和安全边界是否被照顾 |

## 3. 标准目录结构

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── active/
│   ├── index.md
│   ├── tech-debt-tracker.md
│   └── {requirement}/
│       ├── spec.md      # 可选：功能规格
│       ├── design.md    # 必需：技术设计
│       └── plan.md      # 必需：实施计划
├── archive/
│   ├── index.md
│   └── {snapshot}/
├── components/
├── design-docs/
├── generated/
├── guides/
├── product-specs/
└── references/
```

根级 `docs/*.md` 只保留高层入口和稳定事实，不再承载单次任务计划。计划文件必须进入 `docs/active/{requirement}/`，完成后迁入 `docs/archive/{snapshot}/`。

## 4. 命名与格式

- Requirement slug 使用小写 kebab-case，例如 `recipe-library`。
- 活跃需求目录必须包含 `design.md` 和 `plan.md`；大型功能可额外包含 `spec.md`。
- 活跃流转文档必须有 YAML frontmatter，并包含 `id`、`status`、`owner`、`created` 以及对应更新时间字段。
- `spec.md` 的 `id` 使用 `spec-{slug}`；`design.md` 使用 `design-{slug}`；`plan.md` 使用 `plan-{slug}`。
- `status` 只使用 `draft`、`verified`、`stale`、`in-progress`、`completed`、`blocked` 等 Harness 已知状态。
- 归档目录命名使用日期加 slug，例如 `2026-03-31-family-profile`。
- 索引页必须使用表格列出条目，不用散落段落堆链接。

## 5. 任务前阅读路径

按改动范围选择最小阅读集合：

| 改动类型 | 必读文档 |
| --- | --- |
| 新增或删除页面 | `ARCHITECTURE.md`, `docs/FRONTEND.md`, `src/router/app-route-schema.ts`, 相关业务设计文档 |
| 调整路由、菜单、Tabs 或 shell | `ARCHITECTURE.md`, `docs/FRONTEND.md`, 相关 router / store 测试 |
| 新增或修改通用组件协议 | `docs/FRONTEND.md`, `docs/components/component-api-conventions.md`, 对应组件文档 |
| 修改业务术语、页面范围或产品边界 | `docs/PRODUCT_SENSE.md`, `docs/design-docs/mealmate-domain-language-design.md`, `docs/design-docs/mealmate-web-scope-design.md` |
| 多步骤功能或重构 | `docs/guides/PLANS.md`, `docs/active/`, 相关架构和业务文档 |
| 修改安全、可靠性或质量规则 | `docs/SECURITY.md`, `docs/RELIABILITY.md`, `docs/QUALITY_SCORE.md`, 相关测试或 lint 配置 |

## 6. 文档落点规则

- 长期稳定、跨功能生效的约束放到 `ARCHITECTURE.md` 或 `docs/design-docs/`。
- 日常前端实现规则放到 `docs/FRONTEND.md`。
- 组件字段、事件、插槽、运行时协议放到 `docs/components/`。
- 业务模型、统一语言和 Web 范围放到 `docs/design-docs/`，入口只从 `docs/PRODUCT_SENSE.md` 指过去。
- 一次性 spec、design、plan 和阶段记录放到 `docs/active/{requirement}/`，完成后归档到 `docs/archive/`。
- 自动生成内容只放到 `docs/generated/`，人工不要直接维护生成结果。
- 外部资料摘要或项目级速查放到 `docs/references/`，不要让它替代仓库内事实来源。

如果一个内容看起来能放进多个位置，优先选择“最具体、最接近代码实现、最少重复”的位置，并在入口页只保留链接。

## 7. Agent 工作流

1. 先读 `AGENTS.md` 和本页，确认当前任务属于哪类改动。
2. 按“任务前阅读路径”读取最小上下文，不扩大到无关文档。
3. 涉及多文件或多阶段工作时，在 `docs/active/{requirement}/` 更新或创建计划。
4. 实现时遵守 schema 路由、shell、store、组件协议和统一业务语言。
5. 行为、路由、组件协议或错误路径发生变化时，同步补测试。
6. 改动完成前同步相关文档，避免代码和 Harness 分叉。
7. 运行与改动风险匹配的验证命令，并把未验证项明确留下。

## 8. 验收清单

完成一次非平凡改动前，至少确认：

- 入口导航仍能把读者带到正确事实来源。
- 页面标题、菜单标题、页签标题仍围绕 route meta 保持一致。
- 新增或显著修改代码的关键注释覆盖核心流程、关键分支与重要约束。
- 组件协议变化已同步到 `docs/components/`。
- 业务术语变化已同步到 `docs/design-docs/` 或对应产品规格。
- 已运行 `pnpm lint`、`pnpm type-check`、相关 Vitest 或 Playwright 检查；无法运行时说明原因。

## 9. 维护节奏

- 每次功能或重构结束：把活跃计划状态、验证记录和遗留问题更新到 `docs/active/`。
- 每次新增长期约束：确认是否需要更新 `ARCHITECTURE.md`、`docs/guides/DESIGN.md` 或 `docs/design-docs/core-beliefs.md`。
- 每月或重要里程碑后：检查 `docs/index.md`、`docs/design-docs/index.md`、`docs/active/`、`docs/archive/` 与实际文件是否一致。
- 同类问题连续出现时：优先把规则升级为测试、lint 或结构化检查，再补文档说明。
