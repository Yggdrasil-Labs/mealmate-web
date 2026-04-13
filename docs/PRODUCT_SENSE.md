# Product Sense

本文件是 MealMate 业务目标、产品边界与统一语言的入口页。它只负责告诉读者“去哪里看业务事实”，不重复维护业务术语正文。

## 1. 产品定位

MealMate 不是单纯的菜谱展示站，而是围绕家庭饮食决策的规划与执行系统。Web 端负责把“配置、规划、执行、复盘”这条链路承接成可操作的页面体验。

## 2. 权威来源

- [docs/business/README.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/business/README.md)
  业务文档目录总览。
- [docs/business/mealmate-domain-context.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/business/mealmate-domain-context.md)
  业务本质、核心闭环、限界上下文与统一术语。
- [docs/business/mealmate-web-scope.md](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/business/mealmate-web-scope.md)
  Web 仓库职责、页面范围与阶段边界。

如果需要确认 `Family`、`ShoppingList`、`NotifyTask` 等具体业务术语，请直接回到 `mealmate-domain-context.md`，不要把本页当成术语版权威来源。

## 3. 使用方式

- 改页面命名、菜单文案、路由标题、接口字段前，先确认领域上下文中的统一语言。
- 评估某个功能是否属于 Web 仓库职责时，先查看 Web scope 文档。
- 更细的功能级规格应逐步进入 [docs/product-specs](/home/yangyang/workspace/codes/Yggdrasil-Labs/mealmate-web/docs/product-specs)。
