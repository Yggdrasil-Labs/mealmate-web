# Changelog

## [1.2.1](https://github.com/Yggdrasil-Labs/mealmate-web/compare/v1.2.0...v1.2.1) (2026-03-29)


### 🔧 Miscellaneous Chores

* **deps-dev:** bump unplugin-vue-components from 31.0.0 to 32.0.0 ([027b3e6](https://github.com/Yggdrasil-Labs/mealmate-web/commit/027b3e6c2c0c37826b10d1b7a65d46bcca30d1ed))
* **deps:** bump the minor-and-patch group with 4 updates ([3e788b9](https://github.com/Yggdrasil-Labs/mealmate-web/commit/3e788b925e4783cba165e85fff73c4b4ff328883))

## [1.2.0](https://github.com/Yggdrasil-Labs/asgard-frontend-template/compare/v1.1.0...v1.2.0) (2026-03-29)


### ✨ Features

* **api:** 移动请求封装到util包 ([bc0ea8d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/bc0ea8d678514cf0b58f8b5621394ff64760c880))
* **docker:** 支持容器化构建 ([bac5cb8](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/bac5cb816ae723cd4458e691989a264ab522efc1))
* **docs:** 添加组件 API 约定文档，统一公共组件的 API 风格 ([0a06f22](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0a06f22ad946ce2e67c9093f963e1aadea69fb95))
* **layout:** 使用 shell 组件实现新的布局架构 ([eca3854](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/eca3854e8fe58f21f27cd3215ddd0d0ca990d189))
* **ProDialog:** 实现pro-Dialog公共组件 ([dcf8f07](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/dcf8f071af89e2240b836975a51f321744dec111))
* **responsive:** 跨组件实现移动布局支持 ([7236d44](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/7236d4436ab7387d692a558150302ddafff099f9))
* **search-bar:** 实现SearchBar公共组件 ([12b9697](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/12b969705a552482dd24d5ed1e273a841a16aca5))
* 优化ProForm样式 ([ee43999](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ee43999637b46523d352e08ede1ca1d8f90bc149))
* 在ESLint配置中添加Vite和VueUse的全局变量 ([b31ffd1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b31ffd16be431e5eb2dec71ee75b57cbe8418980))
* 实现ProForm组件基本能力 ([b045f07](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b045f07cc2346a3c3a61f1a7a66bb5048390b58f))
* 将 Element Plus 和图标支持与自定义主题覆盖集成 ([9250b97](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9250b975085fe01961ce2e7dc2b5a28f90d200de))
* 添加 Element Plus 函数式 API 样式支持 ([5291817](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5291817d320bb26594c9c5a09ced4303ddff558a))
* 添加 ProDetail 组件及相关字段展示功能，支持动态字段分组和复制功能 ([42d1c35](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/42d1c351b6a7db0406d0f6522215a72a1d90e86b))
* 添加 ProForm 组件文档，完善基本用法、属性、事件及校验说明 ([15d103d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/15d103dc87b28fd35ea91f31be6a178a0468fb83))
* 添加 ProTable 组件及其文档，支持多种列类型和自定义渲染功能 ([ad4481e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ad4481eb3759e113eaed15bacc592a30ee8cb7b5))


### 📝 Documentation

* 更新 README 文档，完善环境要求和项目结构说明，删除无用的样式和 ESLint 规范文档 ([7e98132](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/7e98132c3ff3cc80a2fab47a393c5af335a00e11))
* 添加 ProDetail 组件文档，详细说明组件用法、属性及与 ProForm 的关系 ([474fa84](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/474fa842e13b1445bce2c2cd7aa86b23056c1357))


### ♻️ Code Refactoring

* enhance syncRef functionality with transform options for locale management ([2c8d477](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/2c8d47776054fa7387e8b44efa24eceed7f53342))
* **env:** 优化环境变量的配置 ([650966b](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/650966b7ce15f7cd9eba67f5a8886d906278492c))
* **env:** 删除不需要的环境变量 VITE_ENV ([120e228](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/120e22836ef22ac615afe846e403f9e91962a60c))
* **ProTable:** 清理ESLint ([12e73fd](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/12e73fd671f23c2f23436aa1b99029c54a9f719b))
* 修复lint，使用静态正则 ([94ae2a6](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/94ae2a6178539807ddd8b04dbe22d44b538b8ae9))
* 删除与用户相关的 API 并存储、更新 README 和组件以获得更通用的模板 ([ee37c0c](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ee37c0cc68ad8c61630a96ecebe73aab10e8e834))
* 删除无用的组件 ([3859d1f](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/3859d1fe89dcbb501cda25a76bc5f35ee35593e6))
* 移除登录页面相关代码并简化首页功能测试。 ([9e2ad80](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9e2ad80edb71e07223f41bd13eacef0b686618be))


### 🔧 Miscellaneous Chores

* add 'docs/plans/' to .gitignore ([c1440a0](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/c1440a0806f6323836c9ac8c9acac7ca071c5c82))
* **deps-dev:** bump @antfu/eslint-config from 6.7.3 to 7.0.1 ([6e91ccb](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/6e91ccb4ae735585adba991b568928bd97cae726))
* **deps-dev:** bump the minor-and-patch group with 2 updates ([186af30](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/186af30eec00f338832485cef7c63bffb1bf9bab))
* **deps-dev:** bump the minor-and-patch group with 3 updates ([9c10653](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9c106538f7046b7d4207fcaa4fca93e5b84d01b5))
* **deps-dev:** bump unplugin-auto-import from 20.3.0 to 21.0.0 ([b07c11e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b07c11e0a4c93e4b6a0a74c5246e2cac256c2be4))
* **deps-dev:** bump unplugin-vue-components from 30.0.0 to 31.0.0 ([0f51046](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0f51046573b82fbe844dde79cb37405e16916ee0))
* **deps:** bump actions/cache from 4.2.0 to 5.0.1 ([44d2d39](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/44d2d39c683f33c72eccf23c7747a0ba6bf43671))
* **deps:** bump actions/cache from 5.0.1 to 5.0.2 ([ceb5cb6](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ceb5cb646188c16f6b05d03f887a8dafdf99dd53))
* **deps:** bump actions/cache from 5.0.2 to 5.0.3 ([33cecac](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/33cecac3dc05e6cf27d8315de65fbad8de2dc86e))
* **deps:** bump actions/cache from 5.0.3 to 5.0.4 ([cd2b472](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/cd2b472e7ed4556160fa218944ba60f0f4652162))
* **deps:** bump actions/checkout from 4 to 6 ([7aa1953](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/7aa19536cba0bac3f7333c0406c433552ca8b6e4))
* **deps:** bump actions/download-artifact from 4.1.8 to 7.0.0 ([27175be](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/27175bef7acd757138374a43aa9ce25bb641ae21))
* **deps:** bump actions/download-artifact from 7.0.0 to 8.0.0 ([b9d5003](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b9d5003a6fa5be23c1649f523edc05fdb5f1c1b1))
* **deps:** bump actions/download-artifact from 8.0.0 to 8.0.1 ([5f69bc1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5f69bc1d3b1778d7f371edc6ad4265414c85c135))
* **deps:** bump actions/github-script from 7.0.1 to 8.0.0 ([d94b5f9](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d94b5f9410475f1bf57a64f6a8b72251553b519a))
* **deps:** bump actions/setup-node from 4 to 6 ([6c4d79c](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/6c4d79cd49e19d1ac7d44efb42747258c91b5ab8))
* **deps:** bump actions/upload-artifact from 4.5.0 to 6.0.0 ([542d791](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/542d7913ee78a249180ed47a7d83578efa8b376a))
* **deps:** bump actions/upload-artifact from 6.0.0 to 7.0.0 ([0870c8a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0870c8aad8f91416ee61100c378a4782d7c42bdb))
* **deps:** bump pnpm/action-setup from 4.0.0 to 4.2.0 ([dd10551](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/dd10551915b86cdee2ad186d6536a40f171dd02b))
* **deps:** bump pnpm/action-setup from 4.2.0 to 4.4.0 ([b39c63d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b39c63d1547b0ec93ce4df77e933417ee60735d3))
* **deps:** bump softprops/action-gh-release from 2.1.0 to 2.5.0 ([fbcf9c7](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/fbcf9c74ce8006f9476280bc9dda77b1643df17c))
* **deps:** bump softprops/action-gh-release from 2.5.0 to 2.6.0 ([3a18930](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/3a189303d12b77f8d37b5d2ae34758bf802c23e7))
* **deps:** bump softprops/action-gh-release from 2.6.0 to 2.6.1 ([290204a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/290204a8e567f2336948b0fd19ccd165749e5f36))
* **deps:** bump the minor-and-patch group across 1 directory with 9 updates ([6277659](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/627765916517b4a06e3b064b61689a52a4ab8b05))
* **deps:** bump the minor-and-patch group with 2 updates ([813ebe1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/813ebe11526bbfbe04cac6433ce7499b8d7d5e76))
* **deps:** bump the minor-and-patch group with 5 updates ([0abab4e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0abab4e4f6895b1bf909fb7e0baaf2b09e5f46c6))
* **deps:** bump the minor-and-patch group with 6 updates ([d2d50b1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d2d50b17c52f21e88efeb9b171461a360675e140))
* **deps:** bump the minor-and-patch group with 7 updates ([a094016](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/a094016e90fe1958b75b4aa993540deb9ecfc321))
* **deps:** 升级依赖到最新版本 ([adb8f4d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/adb8f4d6b9dbaec89cf633ea9521c4b92fe16627))
* **gitignore:** 暂时忽略ai相关文件 ([9a190db](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9a190db48139e0921ccab7808e13ead115ff9a15))
* update release-please configuration to exclude component in tag ([ecc3c41](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ecc3c416da282a45d3e85b637f3293d26da4a396))
* 使用vue-router v5，移除unplugin-vue-router ([0604498](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0604498edba9c6a29c05ffadfb6cab79a83d3b56))
* 增加mise的配置文件; 关闭预提交检查 ([e3d45b9](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/e3d45b9c2c0335fefe8c7bc3a1043b3d96ebb261))

## [1.1.0](https://github.com/Yggdrasil-Labs/asgard-frontend-template/compare/asgard-frontend-template-v1.0.0...asgard-frontend-template-v1.1.0) (2026-01-10)


### ✨ Features

* **api:** 新增axios与http封装，新增.env.example [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([8d79acb](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/8d79acbb90c8e20945fa3cbf4edcf42f326aec43))
* **ci:** 新增CI工作流，调用组织通用的CI工作流 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([1b1b24d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/1b1b24dd6f77d809b3ad4b557ae56ffb155925b7))
* **composables:** 添加组合函数入口文件并统一导出相关函数 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([d6bf11e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d6bf11eb421b9889f58a9a3138569c70434c4272))
* **e2e:** 集成playwright，支持端到端测试 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([8968197](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/896819785155242beeaaddf6c8a91b4e3e4602ff))
* **env:** 添加测试模式环境变量和配置，更新 Vite 配置以支持动态环境加载 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([7fdb415](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/7fdb415c0b03d1da9d9807bd5b33130f9898b1b7))
* **i18n:** 支持国际化，封装常用api与切换组件 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([1fd63d0](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/1fd63d0432c60fedba380facf17bb3f0ae9170d2))
* **index:** 增强首页视觉效果，添加新功能卡片并优化样式 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([b1c157e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b1c157eaa8212e579b1097f77edf7d1701cfb50c))
* **index:** 首页样式优化 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([347a91e](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/347a91e1577691dc199d0d7c78a019f8d7288780))
* init project [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([6031cf2](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/6031cf26404bd274b16fda6c86a93b0fa1ec3088))
* **sass:** 使用sass替换less，预置基础的函数、变量、混入 [#2](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/2) ([5832c3f](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5832c3fc93cea1d6b37d8afb3d98c8802f36dab9))
* **store:** 新增pinia依赖，预置状态管理能力 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([2db5894](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/2db58942472bf697e3f08a9626ddbc8a1af3a2fe))
* **unit:** 集成vitest，增加单元测试能力 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([4196314](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/419631438681819c921b43f143c842d7c6a3eb50))
* **vueuse:** 引入VueUse依赖，对现有代码进行简化 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([1021165](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/1021165e11dcffafd31d09288cc8573470f38b75))


### 🐛 Bug Fixes

* **env:** isTest为空 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([73b5146](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/73b514641663100fc10f1105f8ed5b6198272df8))
* **route:** 登出后跳转登录界面；非生产环境已登录时，不强制从login跳转到首页 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([11a931a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/11a931aa09cc2dad78cdaa923e782ce780118386))
* 将所有 Vitest 相关包统一到 4.0.3 [#13](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/13) ([3d9fc0d](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/3d9fc0dde2b0126d076c1d1dde65c313afff06bc))
* 移除不兼容的 tempDirectory 配置 [#13](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/13) ([ad022ab](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ad022abf449092de0e45992ba57ec07f4a08f90f))


### 📝 Documentation

* 更新 README 文档，添加开发文档导航和项目特色介绍 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([6f40fd5](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/6f40fd5097a13f5d0e1f5cacd8f509f79b99306f))
* 更新README ([5a5eefe](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5a5eefeccdab7842bd7d17470c48ab9fc1de8067))
* 更新README，新增pinia状态管理库说明 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([daed3bf](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/daed3bf213ea9cc60139f854bc5d60c541283787))
* 标题居中 ([04b0b02](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/04b0b02505f38915e1ccac3eeb2ac1c7d7e45f37))
* 添加项目设置、开发指南、测试指南和故障排除文档 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([ee9e7d8](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ee9e7d8141cc36666a67ff68ce78e13050efde04))
* 添加项目设置、开发指南、测试指南和故障排除文档 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([af58d37](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/af58d3769606dd51a9bc9840ea4e413ad1ac82ff))
* 添加项目设置、开发指南、测试指南和故障排除文档 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([3e632e4](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/3e632e4741ab9e4e505492c370b7b828d5cfa01b))
* 添加项目设置、开发指南、测试指南和故障排除文档 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([277129f](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/277129fa68eeb6a53e21d8e22b6b36f199612af9))
* 添加项目设置、开发指南、测试指南和故障排除文档 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([c493687](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/c493687e76dbd345246f1b43637fcd805564d09f))
* 补充vue-i18n [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([b80eaa5](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b80eaa5bc653f7cc0015a2193b679cc353bc63d3))


### ♻️ Code Refactoring

* **api:** 重构请求响应部分，适配cola5.0 ([d7d884f](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d7d884fdae16c993d77679c4ff02ec7a35913898))
* **docs:** 清理docs目录 ([ef87893](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ef87893bbec79b5d11c4d5cf4629c1f71b49d111))
* **tests:** 清理单元测试相关 ([9f9a1ac](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9f9a1ac0aa43984387692440d1791fe65b1a6b7b))


### ✅ Tests

* **integration:** 增加集成测试 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([152c6f6](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/152c6f67f0013ffe781862e3812cd5e7ab56d435))


### 👷 Continuous Integration

* **release:** fix release流水线报错 ([0d445fd](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0d445fd1e8c6fd8a4f3e16e4a438db007209844b))
* **release:** 新增自动发布工作流 ([232e818](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/232e8188dd6330ac226cdb85011affa51d3650e2))
* **release:** 新增自动发布工作流 ([78110da](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/78110da81f8ffcce6fce2999342cad18f6d2249f))
* **workflow:** Add GitHub Actions workflow for syncing labels ([c3805ae](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/c3805aeab30b928651104907dc727de5eacceaeb))


### 🔧 Miscellaneous Chores

* **ci:** enhance CI workflow with linting and E2E testing steps ([e45d478](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/e45d4786cb90945110fbaced31fd968d9997f3c9))
* **ci:** remove Codecov workflow and update release-please checkout step ([1cbf7b2](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/1cbf7b2b9f543647ee5ff87c556908652c2c1f39))
* **ci:** remove pnpm version specification in CI workflow ([22513cd](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/22513cd9fa7214e0c6dc58505e781fbeac0da923))
* **ci:** update action versions in CI workflows for consistency and stability ([e8e3a0a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/e8e3a0a00d99468b6a9ccc992d3f0e5b451d3c83))
* **ci:** update CI workflow to include type checking and remove E2E testing steps ([6f56c11](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/6f56c119d0a976b1458b47fd1feb1b1583e3d6f4))
* **ci:** update pnpm/action-setup version for improved stability ([f9a7585](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/f9a75859ee15270bcf310b3e98438a942ee710f3))
* **config:** 移除单元测试的报告器 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([ec7f112](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ec7f112fa6e76ea391ecab2fc81456a7af6e91ab))
* **deps-dev:** bump @semantic-release/github from 11.0.6 to 12.0.2 ([5bebffe](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5bebffe6cf07f8e7795188e9e7936faaf7c804d1))
* **deps-dev:** bump @semantic-release/npm from 12.0.2 to 13.1.2 ([ca85d1a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/ca85d1a4a2cb8dda1d35a996e4a5cbccfba51b59))
* **deps-dev:** bump @semantic-release/release-notes-generator ([f3d300b](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/f3d300b5951baaaec66de236afffffe432526a3a))
* **deps-dev:** bump the minor-and-patch group with 4 updates ([533a950](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/533a9507cb3a84683c382946fd22acd9b325d29b))
* **deps-dev:** bump the minor-and-patch group with 5 updates ([8478c46](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/8478c46449342dd3d6841bdab2877f94af2465fa))
* **deps-dev:** bump the minor-and-patch group with 7 updates ([27a9daa](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/27a9daa75e03fae31020bf9b11838ddc59e71e21))
* **deps-dev:** bump unplugin-vue-components from 29.1.0 to 30.0.0 ([f2a6463](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/f2a6463081f2059fe852ef4416eece4eaf3d2181))
* **deps-dev:** bump vitest from 3.2.4 to 4.0.3 in the dev-deps group ([d0daea3](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d0daea35a55e3668c2a532ab2fa4954a0321a834))
* **deps:** bump @vueuse/core from 13.9.0 to 14.0.0 ([95f9ee5](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/95f9ee5279c185d9fd8cf43f27f91387f7da9a0b))
* **deps:** bump actions/checkout from 4 to 6 ([60c1a21](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/60c1a21ee066a26004ae84966bbbaf21f36d8441))
* **deps:** bump actions/checkout from 4.3.0 to 5.0.0 ([e158b0b](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/e158b0bc4030e0c147a3d7c790fa5bba5930759d))
* **deps:** bump actions/checkout from 5.0.0 to 6.0.0 ([4c45c5a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/4c45c5a36f2ad1acd314fbb15440a8b886207ff8))
* **deps:** bump actions/setup-node from 4 to 6 ([4e7c062](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/4e7c062d02b0c7d044eaa8835f04478709b7f41b))
* **deps:** bump actions/setup-node from 4.4.0 to 6.0.0 ([95b569c](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/95b569ccad94d6f7ffcf537a746328d4f964f480))
* **deps:** bump codecov/codecov-action from 4.5.0 to 5.5.1 ([8214302](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/821430277b9c76f695ec6fec3fe538165a1728b0))
* **deps:** bump codecov/codecov-action from 5.5.1 to 5.5.2 ([77c41fd](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/77c41fd641668128a3c2a16190215619502a03b3))
* **deps:** bump pnpm/action-setup from 2 to 4 ([aa33c41](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/aa33c41553735021155174d3622748811f2eff2d))
* **deps:** bump the minor-and-patch group across 1 directory with 11 updates ([54c7941](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/54c7941cdad47a726643896011e40d92ac3bbedb))
* **deps:** bump the minor-and-patch group across 1 directory with 16 updates ([d009137](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/d00913722f37749f424b2cafabfa82f6e1ca872c))
* **deps:** bump the minor-and-patch group with 10 updates ([8143887](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/8143887ad9ebee3f0e849caa80f2cdc8511762a2))
* **deps:** bump the minor-and-patch group with 10 updates ([52a4295](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/52a42952d7d9cc10e4978e61f6872f1a020e4596))
* **deps:** remove unused dependencies from pnpm-lock.yaml ([f640afa](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/f640afa4eab3b7d51db72591dd63f9cbf8eb5503))
* **deps:** sync dependabot.yml ([5d2430f](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5d2430f6f181d95ba21a2fd09c6dfd4d7f492384))
* **deps:** sync dependabot.yml ([0cd64a6](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/0cd64a69410e148a7dfa4c8552e449384bf854fa))
* **deps:** update dependencies to latest versions ([2bd3082](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/2bd308286fcfa7e3404d982724c7870af0619efb))
* **deps:** 依赖升级 ([726a269](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/726a269d46b088574767ffe7fed47e62d0b650c8))
* **deps:** 升级依赖 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([3c08429](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/3c08429dc41d2901464737808a21cd6450d4ecec))
* **deps:** 更新依赖 ([4cb7957](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/4cb7957db0a81ee284a12d5515bfb8a050bef8be))
* downgrade release version to v1.0.0 ([8df6189](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/8df6189e59fe2a11c373291887d90aa39e32dfed))
* **eslint:** update ignore patterns to exclude 'docs/**' and '.cursor/**' directories [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([c21196a](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/c21196a36a27b03e9e40a00cd5058d4b04cf560d))
* **main:** release asgard-frontend-template 1.1.0 ([69135ef](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/69135ef360b569151a837e4721b5f72bcaddbd84))
* **main:** release asgard-frontend-template 1.1.0 ([52ef1b4](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/52ef1b410780608777385f4621d8f7f0ada9c41a))
* **release:** 1.0.0 [skip ci] ([99aba36](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/99aba363e910d038fa4e3139ab19dff484a17093))
* **release:** 调整自动化发布工作流 ([195b4aa](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/195b4aaafe95db89b37075e4cdae275df4e2d64d))
* **workflows:** update actions/cache version to v4.2.0 for improved performance ([5d34a72](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/5d34a72836a7a54f9221be9a7ae81d96583a8810))
* **workflows:** update pnpm/action-setup version for consistency across workflows ([51a22c6](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/51a22c6bd13c6b470ae74a54d747453f0d200598))
* **workflows:** update upload-artifact action version for consistency ([2028408](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/202840892bbec7d8bf8833ec63893e171eb98cf0))
* **workflows:** 流水线最小权限 ([9f58c81](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/9f58c81deded9fb25ff9bb643f6c447d4856fec3))
* 上传pnpm-lock.yaml，固定依赖树，降低供应链风险，提高缓存命中率与安装速度 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([33f2414](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/33f241430cae7d091c5c139dd485c1b0021a3ea9))
* 增加codecov的覆盖率流水线，增加CI徽章、codecov徽章 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([4e37e52](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/4e37e52e54fee937d268c53954f984f2d97c270a))
* 提交时不强制要求绑定issue ([1a522d9](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/1a522d92e3e3da54c49d661d462033120463b786))
* 解决code scanning的告警 [#1](https://github.com/Yggdrasil-Labs/asgard-frontend-template/issues/1) ([b353707](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b3537076c0b405f9c8ee52c2768e0ca0292dfe9e))
* 重新发布v1.1.0 ([b8f1539](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/b8f15390db8df92dc9e7153342086fede5a8aed5))
* 重新发布v1.1.0 ([29e3e88](https://github.com/Yggdrasil-Labs/asgard-frontend-template/commit/29e3e88a43b79077f24ecf94f3f0d6817cd5cf2e))
