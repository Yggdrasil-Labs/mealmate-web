---
updated: 2026-05-26
---

# 自动生成文档注册表

本目录下的文档由智能体从项目源码自动生成，**禁止手动编辑**。

智能体在 bootstrap 和 gardening 时，按此表逐项扫描源码并生成/更新对应文档。每个文档必须包含 `最后生成: YYYY-MM-DD` 时间戳头，gardening 时据此检测过期（> 30 天）。

## 注册表

> **当前状态**: planned — 尚未建立自动生成脚本，注册表记录预期产物。首次生成待 gardening 时人工或脚本触发。

| 文档 | 数据源 | 提取方式 | 触发时机 |
|------|--------|----------|----------|
| `route-registry.md` | `src/router/app-route-schema.ts` | 扫描路由 schema，提取 name、path、title、icon、layout | bootstrap + 路由变更后 |
| `module-dependencies.md` | `src/modules/` import 语句 + 目录结构 | 分析模块间依赖方向，生成 Mermaid 依赖图 | bootstrap + 月度 gardening |
| `env-config.md` | `.env.example` / `src/config/env.ts` | 提取配置项名、类型、默认值、是否必填 | bootstrap + 配置变更后 |

## 如何添加新的生成文档

1. 在上方注册表中添加一行（文档名、数据源、提取方式、触发时机）
2. 生成时必须包含 `最后生成: YYYY-MM-DD` 时间戳头和 `数据源:` 声明
3. 智能体下次 gardening 时会按注册表生成

## 如何判断是否需要生成

- 项目中不存在对应数据源 → 跳过，不生成该文档
- 数据源存在但文档不存在 → 生成
- 文档存在但过期（> 30 天）→ 重新生成
- 数据源不再存在 → 删除对应文档，从注册表移除
