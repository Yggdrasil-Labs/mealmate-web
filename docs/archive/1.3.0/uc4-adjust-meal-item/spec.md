---
id: spec-uc4-adjust-meal-item-web
status: draft
owner: ""
tags: [mealplan, core]
created: 2026-06-02
updated: 2026-06-02
---

# UC4 Adjust Meal Item (Frontend) Spec

## Overview

用户在周计划页面中点击餐次卡片触发调整交互，通过推荐或搜索选择新菜品并确认替换，页面实时刷新；可查看历史调整记录。本轮同时搭建 UC3 周计划页面骨架（只读展示 + 路由注册）作为 UC4 交互的载体。

## Behavior: 查看周计划（UC3 骨架）

### Scenario: 导航到周计划页面

Given 用户已登录
When 用户点击菜单中的"周计划"
Then 页面跳转到 /weekly-meal-plan
And 展示当前周的计划（若有）或空态引导

### Scenario: 切换周

Given 页面展示当前周计划
When 用户在周选择器中切换到下一周
Then 页面加载对应周的计划数据并刷新

### Scenario: 计划为空

Given 目标周无计划数据
When 页面加载完成
Then 展示空态提示"暂无计划"

## Behavior: 打开调整抽屉

### Scenario: 点击换一换

Given 周计划页面展示 DRAFT 状态计划，某餐次卡片显示「红烧肉」
When 用户点击该卡片的「换一换」按钮
Then 底部抽屉弹出
And 抽屉内默认展示推荐 Tab
And 自动请求推荐列表

### Scenario: 推荐列表展示

Given 调整抽屉已打开
When 推荐列表加载完成（返回 8 条）
Then 展示 8 个菜品卡片，每个含封面图、菜名、烹饪时长
And 列表中不包含本周已使用的菜品

### Scenario: 推荐列表为空

Given 菜品库中无符合条件的候选
When 推荐列表返回空
Then 展示"暂无推荐，请手动搜索"提示

## Behavior: 搜索替换菜品

### Scenario: 切换到搜索 Tab

Given 调整抽屉已打开，当前在推荐 Tab
When 用户点击搜索 Tab
Then 展示搜索输入框和空结果区

### Scenario: 输入关键字搜索

Given 用户在搜索输入框输入"鱼"
When 300ms 内无新输入
Then 触发搜索请求，展示匹配结果

### Scenario: 持续输入不触发请求

Given 用户输入"清"后 100ms 又输入"蒸"
When 距最后一次输入不足 300ms
Then 不触发搜索请求

## Behavior: 确认替换

### Scenario: 选中菜品后确认

Given 用户在推荐或搜索结果中选中「清蒸鱼」
When 底部确认条出现，用户选择原因"口味变化"并点击「确认替换」
Then 请求 PUT /items/{itemId} 提交
And 抽屉关闭
And 对应餐次卡片刷新为「清蒸鱼」
And 卡片右上角出现橙色「已调整」角标

### Scenario: 替换被拒绝（重复）

Given 用户选中的菜品本周同 crowd 已存在
When 点击确认替换
Then 提示"该菜品本周已使用，请选择其他菜品"
And 抽屉保持打开

### Scenario: 不选原因直接确认

Given 用户选中菜品后不选调整原因
When 点击确认替换
Then 替换成功（adjustReason 不传）

## Behavior: 查看调整历史

### Scenario: 点击已调整角标

Given 某餐次卡片显示已调整角标（adjustCount=2）
When 用户点击角标
Then 弹窗展示 2 条历史记录
And 每条显示：旧菜品 → 新菜品、调整时间、调整原因

### Scenario: 无调整历史

Given 某餐次未被调整过
When 用户触发查看历史（角标不显示，此场景不应可达）
Then 不展示弹窗

## Behavior: 移动端适配

### Scenario: 移动端抽屉全屏

Given 视口宽度 < 768px
When 用户打开调整抽屉
Then 抽屉从底部弹出，高度占 90% 视口

### Scenario: 触控区域

Given 移动端视口
When 用户操作换一换按钮和确认按钮
Then 按钮触控区域不小于 44×44px

## Constraints

- 搜索防抖 300ms
- 推荐列表最大展示 20 条
- 调整抽屉 PC 端为右侧抽屉（width=400px），移动端为底部弹出（height=90%）
- 确认条固定在抽屉底部，不随列表滚动
- 本轮实现 UC3 骨架仅含：路由注册、页面组件、周选择器、餐次卡片展示（只读）；不含生成计划、确认计划、备菜/采购
