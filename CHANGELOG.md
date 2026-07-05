# Changelog

## [1.1.0](https://github.com/Yggdrasil-Labs/mealmate-web/compare/v1.0.0...v1.1.0) (2026-07-05)


### ✨ Features

* **dashboard:** 首页接入周计划数据，展示今日三餐和本周概览 ([fb9d640](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fb9d6400fc4ccd6468e088894a273b8a94eb6dcd))
* **meal-plan:** MealItemCard 添加已调整角标和历史事件 ([8bf3ffe](https://github.com/Yggdrasil-Labs/mealmate-web/commit/8bf3ffe33c34796111d5c051fef8860f1c468346))
* **meal-plan:** useAdjustMealItem 增加错误码提示(重复/冻结) ([111c77d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/111c77dfcf6116952605fc13953eb4b1f10e7d0f))
* **meal-plan:** 周导航增加本周快捷按钮，生成按钮增加 loading spinner ([0078007](https://github.com/Yggdrasil-Labs/mealmate-web/commit/00780070c2b7e88fd9f2b8e1c06df91f33ea874c))
* **meal-plan:** 完善周计划 API 层与 store，统一 COLA 响应解包 ([cdcb9cd](https://github.com/Yggdrasil-Labs/mealmate-web/commit/cdcb9cd02d3bab1f697b0d63bc1e9d087f407306))
* **meal-plan:** 新增 useAdjustMealItem composable ([1f62a1c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/1f62a1ca863eb2950e831cf7a0dff241e18b49c7))
* **meal-plan:** 模块骨架 types/api/mock/store ([9a965cd](https://github.com/Yggdrasil-Labs/mealmate-web/commit/9a965cd15fcb42e3730761838f2a986883577df9))
* **meal-plan:** 补齐 replaceItem 链路、生成覆盖确认，同步 DOMAINS.md ([943c376](https://github.com/Yggdrasil-Labs/mealmate-web/commit/943c3769e081ffaf13d5c3903e7b7d4b5561a336))
* **meal-plan:** 调整历史弹窗组件 ([df8b908](https://github.com/Yggdrasil-Labs/mealmate-web/commit/df8b908666a2dc978fcd62f28aca4163f2858f69))
* **meal-plan:** 调整抽屉 + 搜索面板组件 ([341ae4e](https://github.com/Yggdrasil-Labs/mealmate-web/commit/341ae4ed64fac7e54a35bcbca3119bbe79b0976a))
* **mealplan:** DRAFT 状态下显示重新生成按钮 ([6dc1b05](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6dc1b0525bec35da8e4068ec0ea172f1a61b7adb))
* **mealplan:** 实现UC3周计划、备菜计划、采购清单前端页面 ([20200f5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/20200f5aae2f71fbe34088c26ad56254b4b91073))
* **prep:** 备菜计划和采购清单增加周导航，显示对应周区间并支持切换 ([7b4f859](https://github.com/Yggdrasil-Labs/mealmate-web/commit/7b4f859df9ad3f6c544a31421d017940e351eebf))
* **recipe:** 完成菜品库页面实现并修复集成问题 ([cf035d5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/cf035d54cd1388767d72d37493a4a7591b3816c6))
* **recipe:** 菜品库添加分页组件 ([3dcff92](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3dcff92ad7d4f160605dcb6ceaa9c35422a04512))
* 合入 UC4 调整餐次菜品(v1.3.0) ([95c6b55](https://github.com/Yggdrasil-Labs/mealmate-web/commit/95c6b553c78c28acadc256938e0ab92aeb195b23))
* 增加Agents规范 ([3115f58](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3115f58134b68b42c4214be60453e0499133399d))
* 添加家庭成员管理功能，包括API、状态管理和组件设计 ([9d819c5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/9d819c5f71f869f352ba373bcfb91a61edee34ae))
* 添加家庭画像前端设计与实施计划文档 ([106ae90](https://github.com/Yggdrasil-Labs/mealmate-web/commit/106ae90b8383ba1323918525b1eea939ec64d71e))
* 添加带有 API、状态管理和 UI 组件的配方管理模块 ([45374f4](https://github.com/Yggdrasil-Labs/mealmate-web/commit/45374f4f819a41f28b8b55e0ff539fc9afbf2879))


### 🐛 Bug Fixes

* **a11y:** 修复 WCAG AA 违规 — 对比度、ARIA 属性、表单 label ([14f046f](https://github.com/Yggdrasil-Labs/mealmate-web/commit/14f046f5f7f5ca1a578b09bee54a05905510d6cb))
* **api:** 统一 COLA 响应解包，拦截器直接返回 body 消除双层 .data 问题 ([c76ca0f](https://github.com/Yggdrasil-Labs/mealmate-web/commit/c76ca0f0e97af48182d9083d2b4742251c5dca79))
* **i18n:** 修复菜品新增表单枚举选项未正确国际化 ([2cf365b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/2cf365b4d723d2443aa4827ae035814069696279))
* **icon:** 补充周计划/备菜计划/采购清单缺失的菜单图标 ([f99f3e0](https://github.com/Yggdrasil-Labs/mealmate-web/commit/f99f3e024cc5579d8bb738107382c82c7b718dd3))
* **layout:** 修复首页卡片网格只显示一列的问题 ([49fbda5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/49fbda503983816346310abd6ebf8b03745b8cb0))
* lint 清零，修复全部 10 个 eslint error ([ea24003](https://github.com/Yggdrasil-Labs/mealmate-web/commit/ea24003390e9976ae17196686a73cccbe02a0a04))
* **meal-plan:** API 调用补传 familyId，修复后端 generate/current 报错 ([1025194](https://github.com/Yggdrasil-Labs/mealmate-web/commit/1025194d9f9fe05a1752fced4aa74c97b479257b))
* **meal-plan:** types.ts MealPlanItem 补充 isBabyMeal/isWeightLoss/duplicateFlag 字段 ([fd6324b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fd6324bd1a14acd895a374e3a72029cb97bb95b0))
* **meal-plan:** 修复错误处理链路、类型字段名、提取周导航composable ([4d2cd01](https://github.com/Yggdrasil-Labs/mealmate-web/commit/4d2cd01135c123233d95246893ede036163669f9))
* **mealplan:** 修复周一日期计算的时区 bug，避免 toISOString UTC 偏差 ([81c95f1](https://github.com/Yggdrasil-Labs/mealmate-web/commit/81c95f136073eeb398709768aff64f4f8757e20a))
* **proxy:** 移除 API 路径 rewrite，保留完整 /api 前缀直接转发到后端 ([3933592](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3933592073b7c927a70c2f8bb60d17f28247caa0))
* **recipe:** 分页高亮同步 + 卡片网格不拉伸（auto-fill 替代 auto-fit） ([40f590d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/40f590d1400f7776c9b9e7c9505e50085182884d))
* **recipe:** 实现真实 API 调用并修复枚举与国际化 ([cad304c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/cad304cd1e192c51a81f12991f8d11eaae320ac2))
* **recipe:** 对齐前后端契约，修复菜品创建400/500错误 ([6f8e355](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6f8e3551dcf51dfa944584b7d0a38e9e114d25cf))
* review 反馈修复 — 周计划副标题走 i18n、家庭 emoji 改 👪、记录 TD5 ([fb51f81](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fb51f819a26c3eb57668b2fef3bf70227574e363))


### 📝 Documentation

* harness engineering 文档优化 ([fddec51](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fddec51875bac671dcbe884caef83caf538bbc08))
* **harness:** 按 harness-docs 最佳实践优化文档体系 ([ed3ee9c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/ed3ee9c7e9c7a805e9c197e65f99814468636b4e))
* **meal-plan:** UC4 需求文档 + execution-state + tech-debt TD6 ([f1c8144](https://github.com/Yggdrasil-Labs/mealmate-web/commit/f1c8144b73db0994c7449baac926579288639bdb))
* 删除 HARNESS.md 和 FRONTEND.md，清理遗留引用 ([fc97287](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fc97287f767a59e69ffb976dada6654b5d9da070))
* 基于Harness engineering构建docs体系 ([5bac98a](https://github.com/Yggdrasil-Labs/mealmate-web/commit/5bac98a0e112be4b7745b5e3b9ff9639829cd023))
* 审查并优化 harness 文档体系 ([9f991dd](https://github.com/Yggdrasil-Labs/mealmate-web/commit/9f991dda2f9f177f02040aa0e5d9de184a00fc33))
* 将 HARNESS.md 和 FRONTEND.md 内容合并入 ARCHITECTURE.md ([d8b5bd6](https://github.com/Yggdrasil-Labs/mealmate-web/commit/d8b5bd66f2592066e21515cd65e3163d2185eda9))
* 将业务文档重新组织为设计文档 ([cff8872](https://github.com/Yggdrasil-Labs/mealmate-web/commit/cff887282976dff6c439610079326148efd23b8e))
* 归档 UC3 + UC4 至 2026-06-03 ([8e4c251](https://github.com/Yggdrasil-Labs/mealmate-web/commit/8e4c2513487b9d290e10bc482ea0ace6e55b6368))
* 新增前端代码质量深度分析报告 ([f78823d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/f78823d4ba139961992f1742e96065d2fd701f40))
* 更新业务文档与领域上下文，明确Web端职责与实施约束 ([9902c27](https://github.com/Yggdrasil-Labs/mealmate-web/commit/9902c27f073d7de2e76628ebacb0c7c8f5f81e4e))
* 标记 TD5 已解决（Recipe E2E 已补齐搜索筛选+详情查看） ([a9e91c7](https://github.com/Yggdrasil-Labs/mealmate-web/commit/a9e91c7f9d293e852a78fe041838c7386675d43b))
* 标记 TD6 已解决（vitest ElementPlusResolver + 组件单测补齐） ([6cee5d9](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6cee5d9fbe34e410d7df8270197f67eb1cfa7c5c))


### ♻️ Code Refactoring

* **core:** 修复架构审查发现的安全与可维护性问题 ([f9164e7](https://github.com/Yggdrasil-Labs/mealmate-web/commit/f9164e71ad737d93a5b2ef72854fa1766c411b28))
* **recipe:** 修复代码审查问题，提升类型安全与组件质量 ([458775d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/458775dce4d414d64929598915951a781a4bc627))
* **recipe:** 修复第二轮审查问题 ([b01e262](https://github.com/Yggdrasil-Labs/mealmate-web/commit/b01e262884aa01358b4ecfb8970d730937327c23))
* 业务组件迁移到 Pro 组件体系（ProDialog/ProForm/ProDetail） ([50e3f7d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/50e3f7d2e15a6e0e930bd7ac9eb1759ee9d3913d))
* 初始化清理 ([4730912](https://github.com/Yggdrasil-Labs/mealmate-web/commit/4730912306a3efc4447a0be28ea2eaddf64c73ea))
* 批量清理架构卫生问题 ([00bf3e5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/00bf3e53fead19c0330b8eb06b904dfca23841dd))
* 移除 mock 层，API 直连后端 ([fddc295](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fddc2956e885ac6ce1543576ebb3eca2ec90f5e9))


### ✅ Tests

* **meal-plan:** vitest 配置 ElementPlusResolver + css inline，补齐 Drawer/Modal/Panel 组件单测 ([57811d4](https://github.com/Yggdrasil-Labs/mealmate-web/commit/57811d4a030e71cff6de22c7fb5cb6afe15b3f20))
* **meal-plan:** 补齐 UC4 模块单测 api/store/composable/MealItemCard ([5671c3b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/5671c3bf3123e10921efa0302f8ec869a54fd9ef))
* 修复全部 vitest 失败 — 补 Pinia 初始化、对齐断言、移除过时 mock 测试 ([c9f420c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/c9f420c2c257499a0f30e59cae9c33f855ca1932))


### 🔧 Miscellaneous Chores

* **deps-dev:** bump @commitlint/config-conventional ([bb34408](https://github.com/Yggdrasil-Labs/mealmate-web/commit/bb34408d994920c2bba9796217e6e18f53e28a25))
* **deps-dev:** bump @commitlint/config-conventional from 20.5.0 to 21.1.0 ([bec86cc](https://github.com/Yggdrasil-Labs/mealmate-web/commit/bec86cc7053f9c8650fca340579531f937a45ac5))
* **deps-dev:** bump the dev-deps group across 1 directory with 2 updates ([fbde118](https://github.com/Yggdrasil-Labs/mealmate-web/commit/fbde118dd510d59ee371b205ace361fe3c1a3043))
* **deps-dev:** bump unplugin-vue-components from 31.0.0 to 32.0.0 ([027b3e6](https://github.com/Yggdrasil-Labs/mealmate-web/commit/027b3e6c2c0c37826b10d1b7a65d46bcca30d1ed))
* **deps:** bump actions/cache from 5.0.4 to 5.0.5 ([2b7f001](https://github.com/Yggdrasil-Labs/mealmate-web/commit/2b7f0018aa35d2ed187c5f9acb6386be4f62b419))
* **deps:** bump actions/cache from 5.0.5 to 6.1.0 ([5988c6f](https://github.com/Yggdrasil-Labs/mealmate-web/commit/5988c6f0f935a5cb57b12061d6439fd4a30953b1))
* **deps:** bump actions/cache from 5.0.5 to 6.1.0 ([0fa5f4c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/0fa5f4c7f92477dafb1a2cf2e4ff85d77f575092))
* **deps:** bump actions/checkout from 6 to 7 ([88c57b9](https://github.com/Yggdrasil-Labs/mealmate-web/commit/88c57b9e2910d038bf161db0a539f658d559f35b))
* **deps:** bump actions/checkout from 6 to 7 ([ca24819](https://github.com/Yggdrasil-Labs/mealmate-web/commit/ca2481985065a68d5898100c4895517319e4e7c5))
* **deps:** bump actions/github-script from 8.0.0 to 9.0.0 ([34e84b2](https://github.com/Yggdrasil-Labs/mealmate-web/commit/34e84b2bfed3b81515fdbcc5bd740aa773f9f48d))
* **deps:** bump actions/upload-artifact from 7.0.0 to 7.0.1 ([e0d3d74](https://github.com/Yggdrasil-Labs/mealmate-web/commit/e0d3d74c52f85dc5befd68fee0f793b7ce8b92f0))
* **deps:** bump googleapis/release-please-action from 4.4.0 to 4.4.1 ([66064db](https://github.com/Yggdrasil-Labs/mealmate-web/commit/66064db22cb1d410721f9453c18a7d44dd35ed03))
* **deps:** bump googleapis/release-please-action from 4.4.1 to 5.0.0 ([a115e10](https://github.com/Yggdrasil-Labs/mealmate-web/commit/a115e10db440a7da5d5bc39967f249e8b099bf9b))
* **deps:** bump pnpm/action-setup from 5.0.0 to 6.0.9 ([52ed387](https://github.com/Yggdrasil-Labs/mealmate-web/commit/52ed3871d486e3236bb03f874c7baed3db1e6ab1))
* **deps:** bump pnpm/action-setup from 5.0.0 to 6.0.9 ([c719003](https://github.com/Yggdrasil-Labs/mealmate-web/commit/c719003dedf64b84c0d133c2564c9f87479efdfd))
* **deps:** bump softprops/action-gh-release from 2.6.1 to 3.0.0 ([9ddb6bc](https://github.com/Yggdrasil-Labs/mealmate-web/commit/9ddb6bc007361bbf4ce40a3d7b1578ac64d1362a))
* **deps:** bump softprops/action-gh-release from 3.0.0 to 3.0.1 ([3f89b3b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3f89b3b7d24127c62182dd80b19e7558a10caf3b))
* **deps:** bump softprops/action-gh-release from 3.0.0 to 3.0.1 ([4eaa465](https://github.com/Yggdrasil-Labs/mealmate-web/commit/4eaa465a43c0374be58be4ed002bd693a43582a0))
* **deps:** bump the minor-and-patch group across 1 directory with 14 updates ([5ba15a3](https://github.com/Yggdrasil-Labs/mealmate-web/commit/5ba15a3ebaa74a2be1c3e51ab29bd855a93ec514))
* **deps:** bump the minor-and-patch group across 1 directory with 14 updates ([52d9ae1](https://github.com/Yggdrasil-Labs/mealmate-web/commit/52d9ae16f6da4f03f5e4de790f992ee7a7353995))
* **deps:** bump the minor-and-patch group across 1 directory with 8 updates ([6a4f396](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6a4f3964372a77d77f5b07954d877f4511abe3e8))
* **deps:** bump the minor-and-patch group with 4 updates ([db43a31](https://github.com/Yggdrasil-Labs/mealmate-web/commit/db43a31bc3b2033d73733df1b442e295d1488f00))
* **deps:** bump the minor-and-patch group with 4 updates ([3e788b9](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3e788b925e4783cba165e85fff73c4b4ff328883))
* **deps:** bump the minor-and-patch group with 6 updates ([69e1a03](https://github.com/Yggdrasil-Labs/mealmate-web/commit/69e1a0360aec496f72e56c8f6bd1b1f8825accc1))
* **deps:** bump the minor-and-patch group with 6 updates ([6dc9e7e](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6dc9e7ecf018642f98e3849cd5e66572397c50a6))
* 移除不再需要的 build.sh/build.ps1 ([61786c4](https://github.com/Yggdrasil-Labs/mealmate-web/commit/61786c46a3cb696f7c557336eef18cd1b4ac722d))
* 移除仓库内 project-workflow skill 文件 ([296e31f](https://github.com/Yggdrasil-Labs/mealmate-web/commit/296e31f063ff698dd08c8f634d0e4f6b596613bc))


### 💄 Code Style

* **home:** 首页仪表盘视觉增强 — emoji 图标、统计色、空态 CTA ([eba89cd](https://github.com/Yggdrasil-Labs/mealmate-web/commit/eba89cd110693f0006455df5cca70d8289c79d77))
* **i18n:** 统一默认语言为中文，RecipeCard 分钟硬编码改为 i18n key ([c108d7f](https://github.com/Yggdrasil-Labs/mealmate-web/commit/c108d7f389fde114b0d298e1312a29cff3a3641c))
* **meal-plan:** 周计划空态增强 — emoji 图标、副标题层次、骨架屏呼吸动画 ([f40ed3d](https://github.com/Yggdrasil-Labs/mealmate-web/commit/f40ed3dc1ce72a5ce271bda45ac0bd7c23a274cf))
* **mealplan:** MealItemCard 改为紧凑 chip 风格，适配网格布局 ([853b19a](https://github.com/Yggdrasil-Labs/mealmate-web/commit/853b19a28f2a3847c8ab2b9d8272ec3163c0c89b))
* **pages:** 备菜计划和采购清单空态 icon 改为 emoji（🥘🛒） ([1a59172](https://github.com/Yggdrasil-Labs/mealmate-web/commit/1a591726617b1b193b741699773292c54ee02643))
* **recipe:** RecipeCard 无图 fallback 改为菜品类型 emoji，加图片 [@error](https://github.com/error) 回退 ([061786c](https://github.com/Yggdrasil-Labs/mealmate-web/commit/061786c4c1260e85e624095783baaaef0db5e908))
* **recipe:** RecipeCard 渐变色硬编码改用 CSS 变量 ([8cd2204](https://github.com/Yggdrasil-Labs/mealmate-web/commit/8cd22046269874aa8fc8f287f77dafd4d5b85070))
* **recipe:** 优化菜品库布局 — grid 3列 + 筛选栏默认收起 ([75dbad5](https://github.com/Yggdrasil-Labs/mealmate-web/commit/75dbad571acf138a62ee5974fb1630c53c973d7f))
* **recipe:** 修复移动端卡片 meta 区适配，grid 两列布局 ([469486b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/469486bd5f7e5fbff2ddca91fdb50076ea944138))
* **recipe:** 移动端卡片封面比例缩小为 2:1 ([7ed3855](https://github.com/Yggdrasil-Labs/mealmate-web/commit/7ed3855e0a9b7ac81980fa57f99a832e85969c5a))
* **recipe:** 移动端筛选栏只显示 1 个字段，减少首屏占用 ([4da51fb](https://github.com/Yggdrasil-Labs/mealmate-web/commit/4da51fb4cb5c78c26a27120012538321ba92ddce))
* **ui:** recipe 模块样式 token 化 + 周计划网格/卡片/替换抽屉优化 ([3660890](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3660890399ce5a1b677e8926030db5a576e494a3))
* **ui:** 全面视觉优化 - token 系统化、交互状态、骨架屏、可访问性 ([55920f6](https://github.com/Yggdrasil-Labs/mealmate-web/commit/55920f6ddc626ca354cbd88a90f81038613f8a45))
* **ui:** 第三轮视觉优化 - 圆角统一、颜色一致、氛围动画 ([0c4fad4](https://github.com/Yggdrasil-Labs/mealmate-web/commit/0c4fad4e6105f489dd5d00e3dca61dbe806a0b98))
* **ui:** 第二轮视觉深入优化 - PageHeader、网格升级、暗色模式 ([6e00394](https://github.com/Yggdrasil-Labs/mealmate-web/commit/6e003945ae147110eea86b26c4ce02c413453f36))
* **ui:** 第五轮优化 - 基于真实截图修复字体/图标/对比度/比例 ([62fcddf](https://github.com/Yggdrasil-Labs/mealmate-web/commit/62fcddfb01e384d547d48fc28f9e5966353f4e60))
* **ui:** 第四轮精细打磨 - Shell token 化、滚动体验、表单覆盖、响应式 ([5db676b](https://github.com/Yggdrasil-Labs/mealmate-web/commit/5db676bbd6f2208da4d6f381fe375a125f58967a))
