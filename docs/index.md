# Docs Index

本页是 `docs/` 目录的总导航，帮助人和 AI 快速判断“先读什么、哪些是权威来源、哪些仍在建设中”。

## 我现在该去哪里

- 如果你要开始实现页面或组件：去 [FRONTEND.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/FRONTEND.md)
- 如果你要确认业务语义、产品范围或术语：去 [PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
- 如果你要找具体业务事实：去 [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
- 如果你要找组件契约：去 [components/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
- 如果你要找提案、计划或历史记录：去 [PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PLANS.md) 或 [exec-plans/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/exec-plans)

## 1. Primary Sources

这些文档应优先阅读，并可视为当前仓库的一等入口：

- [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md)
  解决“仓库是怎么组织的、哪些依赖方向是允许的”。
- [FRONTEND.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/FRONTEND.md)
  解决“写前端代码时应该遵守哪些实现约束”。
- [PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
  解决“业务术语和产品边界去哪看”；详细事实位于 `docs/design-docs/`。
- [PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PLANS.md)
  解决“计划应该放哪、提案和实施计划如何区分”。

## 2. Domain And Contract Sources

这些目录承载具体事实，不应被入口页重复定义：

- [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
  当你需要具体业务事实、统一语言和 Web 范围时，直接回到这里。
- [components/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
  当你需要具体组件协议、字段约定和公共 API 说明时，直接回到这里。

## 3. Working Records

- [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
  适合长期有效的结构性设计决策。
- [exec-plans/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/exec-plans)
  适合活跃提案、实施计划、已完成记录与技术债。
- [product-specs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/product-specs)
  适合未来按功能沉淀产品规格。

## 4. Building Status

以下页面当前是“建设中入口”，用于说明未来该沉淀什么，而不是当前最强事实来源：

- [QUALITY_SCORE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/QUALITY_SCORE.md)
- [RELIABILITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/RELIABILITY.md)
- [SECURITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/SECURITY.md)
- [generated/README.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/generated/README.md)
- [references/README.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/references/README.md)

在这些页面补齐更具体的仓库事实之前，不应优先拿它们替代主入口文档。

## 5. 阅读建议

- 初次进入仓库：先读 `AGENTS.md`，再用本页决定下一跳
- 要开始实现：优先 `ARCHITECTURE.md -> FRONTEND.md -> 具体业务/组件文档`
- 要开始规划：优先 `PLANS.md -> exec-plans/`
- 要校对术语：优先 `PRODUCT_SENSE.md -> design-docs/mealmate-domain-language-design.md`
