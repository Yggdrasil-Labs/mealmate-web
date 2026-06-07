---
id: visual-polish
status: planned
created: 2026-06-06
---

# 视觉优化方案

## 背景

通过 E2E 截图观察到当前 Web 端存在以下视觉问题：

1. E2E 容器中文字体缺失（中文显示为方块）
2. 页面语言混合（部分英文 / 部分中文）
3. 首页仪表盘图标和布局视觉弱
4. 菜品卡片无图 fallback 依赖中文字体、缺少图片加载失败处理
5. 周计划空态留白过大

## 改动清单

### P1: 统一 i18n 默认语言为中文

| 文件 | 改动 |
|------|------|
| `src/locales/config.ts` | `defaultLocale` 改为 `zh-CN` |
| `src/modules/recipe/components/RecipeCard.vue` | `min` 硬编码改为 i18n key |

验证：页面所有文案统一为中文。

### P2: RecipeCard 无图 fallback 美化

| 文件 | 改动 |
|------|------|
| `src/modules/recipe/components/RecipeCard.vue` | 1. 首字母圆形徽章改为菜品类型 emoji 映射（🍲🥗🍜🍰等），不依赖中文字体<br>2. 加 `@error` 处理：图片加载失败时回退到 fallback<br>3. meta 标签区使用 i18n 值显示 |

### P3: 首页仪表盘视觉增强

| 文件 | 改动 |
|------|------|
| `src/pages/index.vue` | 1. 快捷入口图标从中文字改为 emoji（📅🍳👨‍👩‍👧🛒🥘）<br>2. 统计区数字放大、增加状态色<br>3. 空态引导增加 emoji 插图 + 更强 CTA 按钮 |

### P4: 周计划空态增强

| 文件 | 改动 |
|------|------|
| `src/pages/weekly-meal-plan.vue` | 1. 空态区 icon 从中文"计"改为 emoji 📋<br>2. 引导文案增加副标题层次<br>3. 骨架屏动画增加呼吸效果 |

### P5: E2E 容器中文字体

| 文件 | 改动 |
|------|------|
| `mealmate-e2e/env/compose/docker-compose.e2e.yml` | e2e-runner 服务启动前安装 `fonts-noto-cjk-no-hinted`（约 20MB） |

## 不做的事

- 不改布局结构（壳层、侧边栏、页签）
- 不改组件 props/emits 接口
- 不改路由或业务逻辑
- 不引入新依赖

## 验收标准

- `pnpm lint` + `pnpm type-check` 通过
- 相关 vitest 单测通过
- E2E 截图中文正常显示、视觉一致
- 视觉回归截图更新

## 执行顺序

P1 → P2 → P3 → P4 → P5（串行，每步完成后验证）
