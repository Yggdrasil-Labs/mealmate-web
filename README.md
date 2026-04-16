# MealMate Web

MealMate Web 是一个面向家庭日常饮食规划的 Web 前端项目，帮助用户把“吃什么、怎么买、怎么备、实际吃了什么、接下来怎么优化”串成一条可持续复盘的闭环。

它不是单纯的菜谱展示站，而是 MealMate 家庭饮食系统的 Web 入口，服务的核心场景是三口之家这类需要兼顾口味偏好、宝宝适配、减脂目标和日常执行成本的家庭。

## Why MealMate

家庭饮食决策常常会遇到这些问题：

- 今天吃什么很难快速决定
- 一周三餐缺少整体规划，容易重复或失衡
- 临到做饭才发现食材没准备好
- 实际吃了什么没有记录，后续很难复盘
- 宝宝饮食、成人口味和减脂目标很难同时兼顾

MealMate 希望把这些零散问题变成一套连续的产品体验：

1. 维护家庭成员画像与饮食约束
2. 管理菜品库、标签与适配人群
3. 生成一周三餐计划，并支持手动调整
4. 派生采购清单与备菜计划
5. 记录实际饮食照片与备注
6. 对比计划与实际，输出营养分析与优化建议

## Core Features

- 家庭画像与饮食约束管理
- 一周三餐计划生成与调整
- 菜品库、标签与适配人群管理
- 采购清单与备菜计划
- 饮食记录与图片上传
- 计划对比、营养分析与复盘

## Repository Scope

这个仓库负责 MealMate 的 Web 端页面承载与交互编排，重点包括：

- 首页与业务导航入口
- 一周计划页
- 菜品库页
- 备菜计划与采购清单页
- 饮食记录页
- 营养分析页
- 个人中心与基础配置页

在前端实现上，仓库已经具备：

- 基于 Vue 3、Vite、TypeScript 的工程底座
- schema 驱动的路由注册与 layout shell
- 菜单、tabs、缓存与响应式壳层状态管理
- `ProForm`、`ProTable`、`ProDetail`、`SearchBar`、`ProDialog` 等通用组件协议
- 单元测试与 Playwright E2E 测试骨架

## Project Status

当前仓库仍处于业务页面逐步落地阶段。

- 已完成：前端壳层、路由协议、基础组件协议与测试骨架
- 进行中：MealMate 业务页面、真实接口接入与业务数据流建设
- 当前现状：首页仍是基础占位页，正式业务模块还在继续补齐

如果你准备继续推进实现，建议先阅读这些文档：

- [业务模型设计](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/mealmate-business-model-design.md)
- [领域语言设计](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/mealmate-domain-language-design.md)
- [Web 范围设计](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs/mealmate-web-scope-design.md)
- [协作约束](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/AGENTS.md)

## Getting Started

### Requirements

- Node.js `>= 22.14.0`
- `pnpm@10.32.1`
- WSL 环境下先执行 `source ~/.nvm/nvm.sh`

### Install

```bash
source ~/.nvm/nvm.sh
pnpm install
```

### Run

```bash
source ~/.nvm/nvm.sh
pnpm dev
```

### Common Commands

```bash
source ~/.nvm/nvm.sh

pnpm build
pnpm lint
pnpm type-check
pnpm test:e2e
```

## Docs

- `docs/design-docs/`：长期设计原则、业务模型、领域语言与 Web 范围
- `docs/components/`：组件协议与通用实现约定

长期业务知识优先写入 `docs/design-docs/`，不要只停留在外部笔记中。

## Development Notes

- 默认使用 Composition API + `<script setup lang="ts">`
- 页面、路由、布局和壳层状态通过现有 schema / store 体系组织
- 页面标题、菜单标题、页签标题保持一致
- 业务术语优先与 `docs/design-docs/` 保持一致，例如 `ShoppingList`、`NotifyTask`
- 提交信息遵循 Conventional Commits

## References

以下业务资料已提炼并同步进仓库文档：

- [点菜系统业务与领域设计文档](https://www.notion.so/32bf7b478cf3807796a4d05eb4c255fe)
- [点菜系统详细设计文档](https://www.notion.so/60f392079c98422cb0414cc76995234d)
