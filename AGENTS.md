# AGENTS.md

这个仓库同时服务于人类开发者、AI Agent 与自动化脚本。请把它当作仓库导航页，而不是全部规范的堆叠位置。

## 仓库使命

`mealmate-web` 是 MealMate 的 Web 前端仓库，负责家庭饮食规划与执行场景中的页面承载、交互编排与壳层体验。

它不是后端服务，也不是零散页面集合。默认围绕 schema 驱动的路由、统一 shell 与可复用组件协议演进。

## 我现在该读什么

- 如果你要理解仓库结构、分层、路由和 shell：先读 `ARCHITECTURE.md`
- 如果你要开始写前端代码：先读 `docs/FRONTEND.md`
- 如果你要确认业务术语、页面范围和产品边界：先读 `docs/PRODUCT_SENSE.md`
- 如果你要找计划、提案或历史记录：先读 `docs/PLANS.md`
- 如果你只知道“要去 docs 里找”，但不知道先看哪篇：先读 `docs/index.md`

## 建议阅读顺序

开始工作时，只读当前任务需要的最小文档集合：

1. `docs/index.md`
   `docs/` 目录总导航，用来决定下一跳。
2. `ARCHITECTURE.md`
   仓库分层、依赖方向、路由与 shell 事实来源。
3. `docs/FRONTEND.md`
   前端实现约束、命名规则、边界与验证约定。
4. `docs/PRODUCT_SENSE.md`
   MealMate 的业务目标、统一术语与业务文档入口。
5. `docs/PLANS.md`
   计划文档的生命周期、目录规则与维护方式。
6. `docs/design-docs/` 或 `docs/components/` 下的聚焦文档
   按改动范围继续阅读。
7. `README.md`
   只用来查安装、启动和仓库概览。

## 事实来源优先级

- 架构与边界：`ARCHITECTURE.md`
- 前端实施规则：`docs/FRONTEND.md`
- 业务语义与范围：`docs/PRODUCT_SENSE.md`、`docs/design-docs/`
- 组件协议：`docs/components/`
- 执行状态与计划：`docs/PLANS.md`、`docs/exec-plans/`

## 导航入口

- `AGENTS.md`
  仓库协作入口。
- `docs/index.md`
  `docs/` 目录总导航，用来决定下一跳。

如果两份文档冲突，优先采用更具体、且更贴近当前代码实现的那一份；仍不确定时，以代码与测试为准。

## 项目事实

- 技术栈：Vue 3、Vite、TypeScript、Vue Router、Pinia、Element Plus、VueUse、Vue I18n、Axios、Sass、Vitest、Playwright
- 运行时：Node.js `>= 22.14.0`
- 包管理器：`pnpm@10.32.1`
- WSL 环境下如需使用 Node，请先执行 `source ~/.nvm/nvm.sh`
- OpenJDK 17 在当前机器可用，但不是本仓库主运行时

## 常用命令

```bash
source ~/.nvm/nvm.sh
pnpm install
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm vitest
pnpm test:e2e
```

## 对 Agent 的工作约定

- 先尊重现有架构，再实现功能。
- 优先沿用已有命名、目录结构和组件协议。
- 页面、路由、布局和壳层状态通过现有 schema / store 体系组织，不要绕开。
- 页面标题、菜单标题、页签标题应保持一致。
- 新增或删除页面时，同步考虑路由入口、导航语义与测试覆盖。
- 默认使用 `pnpm` 与仓库脚本，不手工拼接不必要命令。
- 未经用户明确要求，不主动创建 Git Worktree，也不主动执行提交、推送或发布动作。

## 文档维护规则

- `AGENTS.md` 保持短小，只做导航与事实入口。
- 架构变化时，同步更新 `ARCHITECTURE.md`。
- 前端规则变化时，同步更新 `docs/FRONTEND.md`。
- 业务语义与产品边界变化时，同步更新 `docs/PRODUCT_SENSE.md` 与 `docs/design-docs/`。
- 新的长期设计决策放到 `docs/design-docs/`，不要混入一次性计划。
- 执行计划与阶段性工作记录放到 `docs/exec-plans/`。
- 组件契约优先维护在 `docs/components/`，不要复制出第二份权威描述。

## 不要这样做

- 不要把这个文件重新写成长篇规则大全。
- 不要把仓库未来可能存在的系统写成当前事实。
- 不要让同一条规范同时出现在多个入口页里且语义不一致。

## 下一跳

- 仓库结构与边界：[ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md)
- `docs/` 总导航：[docs/index.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/index.md)
