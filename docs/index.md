# Docs Index

本页是 `docs/` 目录的总导航，帮助人和 AI 快速判断"先读什么、哪些是权威来源、哪些是运行质量或产物入口"。

## 我现在该去哪里

- 如果你要开始实现页面或组件：去 [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md) §11
- 如果你要判断文档该写到哪里、Agent 应该怎么验收：去 [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md) §12
- 如果你要确认业务语义、产品范围或术语：去 [PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
- 如果你要找具体业务事实：去 [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
- 如果你要找组件契约：去 [components/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
- 如果你要找提案、计划或历史记录：去 [guides/PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/guides/PLANS.md)、[active/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/active) 或 [archive/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/archive)

## 1. Primary Sources

这些文档应优先阅读，并可视为当前仓库的一等入口：

- [ARCHITECTURE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/ARCHITECTURE.md)
  解决"仓库是怎么组织的、哪些依赖方向是允许的、前端代码怎么写、文档体系如何分层"。
- [PRODUCT_SENSE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/PRODUCT_SENSE.md)
  解决"业务术语和产品边界去哪看"；详细事实位于 `docs/design-docs/`。
- [guides/PLANS.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/guides/PLANS.md)
  解决"计划应该放哪、提案和实施计划如何区分"。

## 2. Domain And Contract Sources

这些目录承载具体事实，不应被入口页重复定义：

- [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
  当你需要具体业务事实、统一语言和 Web 范围时，直接回到这里。
- [components/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/components)
  当你需要具体组件协议、字段约定和公共 API 说明时，直接回到这里。

## 3. Working Records

- [active/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/active)
  当前仍在推进的需求、设计、实施计划与技术债。
- [archive/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/archive)
  已完成计划、历史迁移记录与未来版本快照。
- [guides/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/guides)
  spec、design、plan 与 workflow 的写作方法。
- [design-docs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/design-docs)
  适合长期有效的结构性设计决策。
- [product-specs/](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/product-specs)
  适合未来按功能沉淀产品规格。

## 4. Operational And Artifact Entries

以下页面用于记录运行质量、安全边界、可靠性目标、生成产物和参考资料。它们会影响验收，但不替代架构、业务和组件的一等事实来源：

- [QUALITY_SCORE.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/QUALITY_SCORE.md)
- [RELIABILITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/RELIABILITY.md)
- [SECURITY.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/SECURITY.md)
- [generated/README.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/generated/README.md)
- [references/README.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/references/README.md)

如果这些页面中的规则影响架构、业务语义或组件协议，应把结论同步回对应权威文档。

## 5. 阅读建议

- 初次进入仓库：先读 `AGENTS.md`，再用本页决定下一跳
- 要开始实现：优先 `ARCHITECTURE.md -> 具体业务/组件文档`
- 要开始规划：优先 `ARCHITECTURE.md §12 -> guides/PLANS.md -> active/`
- 要校对术语：优先 `PRODUCT_SENSE.md -> design-docs/mealmate-domain-language-design.md`
