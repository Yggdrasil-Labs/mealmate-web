# Reliability

> Status: placeholder entry, not a primary source of repository truth yet.

本文件用于说明 MealMate 当前如何理解可靠性，以及哪些内容已经落地、哪些仍只是目标。

## 当前已知可靠性基础

- ESLint 保障基础代码规范
- `vue-tsc` 保障类型检查
- Vitest 覆盖单元与协议级验证
- Playwright 提供关键页面流程的端到端验证骨架

## 当前仍在建设中的部分

- 更完整的业务流程回归
- 更系统的页面状态与异常路径验证
- 更清晰的发布前验证分层

## 本文件的职责

记录稳定性目标、已知风险和后续可靠性工作方向，不在这里伪造尚未存在的 SLA、SLO 或告警体系。
