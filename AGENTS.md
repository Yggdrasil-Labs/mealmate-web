# AGENTS.md

本文件是 `mealmate-web` 的仓库入口，服务人类开发者、AI Agent 与自动化脚本。它只做导航、事实入口和协作底线；详细规则维护在对应权威文档中。

## 仓库定位

`mealmate-web` 是 MealMate 的 Web 前端仓库，负责家庭饮食规划与执行场景中的页面承载、交互编排与壳层体验。

它不是后端服务，也不是零散页面集合。默认围绕 schema 驱动路由、统一 shell、业务模块与可复用组件协议演进。

## 先读什么

按任务选择最小阅读集合：

| 任务                                           | 入口                                    |
| ---------------------------------------------- | --------------------------------------- |
| 理解仓库结构、分层、路由、shell 和前端实现规则 | `ARCHITECTURE.md`                       |
| 判断文档该写在哪里、Agent 如何验收             | `ARCHITECTURE.md` §12                   |
| 确认业务术语、页面范围和产品边界               | `docs/PRODUCT_SENSE.md`                 |
| 判断代码应该放在哪个业务领域                   | `docs/DOMAINS.md`                       |
| 创建需求、写计划或归档                         | `docs/skills/project-workflow/SKILL.md` |
| 查找活跃计划或历史记录                         | `docs/active/`, `docs/archive/`         |
| 不确定该读哪篇 docs                            | `docs/index.md`                         |

## 事实来源优先级

- 架构、依赖边界与前端实施规则：`ARCHITECTURE.md`
- 业务领域划分：`docs/DOMAINS.md`
- 业务语义与范围：`docs/PRODUCT_SENSE.md`, `docs/design-docs/`
- 组件协议：`docs/components/`
- 需求生命周期：`docs/skills/project-workflow/SKILL.md`
- 执行状态与计划：`docs/active/`, `docs/archive/`

如果文档冲突，优先采用更具体、且更贴近当前代码实现的那一份；仍不确定时，以代码和测试为准。

## 项目事实

- 技术栈：Vue 3、Vite、TypeScript、Vue Router、Pinia、Element Plus、VueUse、Vue I18n、Axios、Sass、Vitest、Playwright
- 运行时：Node.js `>= 22.14.0`
- 包管理器：`pnpm@10.32.1`
- WSL 环境下如需使用 Node，先执行 `source ~/.nvm/nvm.sh`
- OpenJDK 17 在当前机器可用，但不是本仓库主运行时

## 常用命令

```bash
source ~/.nvm/nvm.sh
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm exec vitest run
pnpm test:e2e
```

## Agent 工作约定

- 先尊重现有架构，再实现功能。
- 页面、路由、布局和壳层状态通过现有 schema / store 体系组织，不要绕开。
- 页面标题、菜单标题、页签标题围绕 route meta 保持一致。
- 新增或删除页面时，同步考虑路由入口、导航语义与测试覆盖。
- 新增或显著修改代码时，关键注释覆盖核心流程、关键分支与重要约束，目标占比至少 25%。
- 默认使用 `pnpm` 与仓库脚本；仓库未封装的本地工具用 `pnpm exec`。
- 未经用户明确要求，不主动创建 Git Worktree，不主动执行提交、推送或发布动作。

## 文档维护

- `AGENTS.md` 保持短小，只做导航与事实入口。
- 架构变化或前端规则变化时，同步更新 `ARCHITECTURE.md`。
- 业务语义或产品边界变化时，同步更新 `docs/PRODUCT_SENSE.md` 与 `docs/design-docs/`。
- 新的长期设计决策放到 `docs/design-docs/`，不要混入一次性计划。
- 执行计划与阶段记录放到 `docs/active/`，完成后进入 `docs/archive/`。
- 组件契约优先维护在 `docs/components/`，不要复制出第二份权威描述。

## 不要这样做

- 不要把本文件写成长篇规则大全。
- 不要把仓库未来可能存在的系统写成当前事实。
- 不要让同一条规范同时出现在多个入口页里且语义不一致。
