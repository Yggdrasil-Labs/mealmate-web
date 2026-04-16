# MealMate Domain Language Design

本设计文档用于沉淀 MealMate Web 需要长期统一的业务语言，确保页面命名、路由标题、组件文案和接口字段围绕同一套词汇演进。

## 1. 统一术语

- 家庭成员：系统中的饮食参与者，如妻子、丈夫、宝宝。
- 饮食画像：成员口味偏好、忌口、饮食目标、限制条件的集合。
- 菜品：可被计划、推荐、记录的标准业务对象。
- 餐次：早餐、午餐、晚餐。
- 周计划：覆盖 7 天三餐的结构化用餐安排。
- 减脂餐：满足低脂、低卡、高纤维规则的特定菜品安排。
- 宝宝适配：菜品满足软烂、少盐少糖、无辛辣等幼儿约束。
- 备菜计划：面向执行层的食材前置处理、保存和烹饪说明。
- 采购清单：需要外出购买的食材汇总，由周计划自动归并生成。统一使用 `ShoppingList`，不使用 `PurchaseList`。
- 实际饮食记录：用户真实食用情况的照片与备注记录。
- 营养分析：对饮食结构进行规则化评估的结果。
- 提醒任务：系统内需执行的定时或触发式消息提醒任务。统一使用 `NotifyTask`，不使用 `Reminder` 或泛化的 `Task`。

## 2. 前端优先使用的英文语义

- `Family` / `FamilyMember`
- `Recipe`
- `MealType`
- `WeeklyMealPlan`
- `MealPlanItem`
- `PrepPlan`
- `ShoppingList`
- `MealRecord`
- `NutritionReport`
- `NotifyTask`

## 3. 默认避免的别名

- `Dish`
- `Food`
- `Menu`
- `Schedule`
- `WeekMenu`
- `BuyList`
- `PurchaseList`
- `Reminder`
- 脱离业务语义的 `data`、`info`、`manager`、`temp`

## 4. 对前端表达的直接影响

- 页面命名、菜单标题、页签标题与接口文案应围绕同一套业务术语表达。
- 表单、表格、详情组件中的领域字段应保持统一，例如 `ShoppingList`、`NotifyTask`、宝宝适配、减脂餐等。
- 路由名、组件名和测试描述应尽量复用同一组业务名词，不在不同页面里混用不同别名。

## 5. 使用方式

- 修改路由标题、菜单文案、组件标签前，先确认这份文档中的术语约定。
- 新增业务模块时，若术语尚未被定义，应先补充领域语言设计，再进入实现。

## 来源

- [点菜系统业务与领域设计文档](https://www.notion.so/32bf7b478cf3807796a4d05eb4c255fe)
- [点菜系统详细设计文档](https://www.notion.so/60f392079c98422cb0414cc76995234d)
