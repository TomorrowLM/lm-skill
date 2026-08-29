---
name: page-development-workflow
description: >-
  当用户要从零开发完整前端页面或功能模块，或大幅改造已有页面时使用；典型输入包括 Figma、原型、PRD、Swagger/OpenAPI，且需求涉及页面结构、路由、多个交互区块、接口、状态流或验收。
  适用于列表页、详情页、编辑页、表单页、大屏及多步骤流程。不要用于单点 bug、文案/样式/字段/按钮微调、代码解释、代码审查或用户已限定文件与改动内容的小范围快速修改。
---

# 页面开发工作流

将页面需求转为可确认、可实施、可验证的交付物。它是状态机，不是代码模板集合。

## 快速判断是否触发

### 不使用本技能的场景（快速否定检查）
- 单个文案、字段、按钮、样式或局部布局
- 单点 bug、代码解释或审查
- 用户已给出具体改动内容（"把 X 改成 Y"等）

### 使用本技能的场景
- 新页面、完整功能模块、多步骤流程
- 页面结构/路由/接口/状态流/组件树的大幅改造
- 涉及 Figma、PRD、OpenAPI 的端到端设计

边界不清时，按需求规模和涉及文件数判断；不要因"页面"一词误触发小改动。

## HARD-GATE

以下无例外（用户说"直接开始""简单改动""紧急"等不是授权）：

1. 阶段顺序固定：Phase 1→2→3→4→5→6，不能跳阶段或空过产出。
2. Phase 4 前禁止写业务代码（含类型、常量、组件、服务）。
3. Phase 1、2、3、5 的产出必须**展示并等待明确确认**；"直接开始"不等于授权跳过。
4. 发现新增页面、接口、状态流时立即回到 Phase 3 更新计划。

## 状态机

```text
Phase 1 调研需求与现状
  → 用户确认
Phase 2 编写技术方案
  → 用户确认
Phase 3 选择拆分并落盘计划
  → 用户确认
Phase 4 按确认计划编码
Phase 5 以证据验收并审查
  → 用户确认
Phase 6 收尾交付
```

每次进入阶段前读取下表指定的 reference；阶段细则只以 reference 为准，避免在入口文件重复解释。

## 阶段速查

| Phase | 第一步 | 对应 Reference |
|-------|--------|--------|
| 1 | 调研用户、目标、流程、边界、成功标准 | phase-gates.md、phase1-2-discovery-and-design.md |
| 2 | 写路由、组件拆分、类型、接口映射 | 同上 + writing-doc + pages-registry.md |
| 3 | 展示 3-5 拆分方案让用户选择 | phase-gates.md、phase3-split-strategies.md |
| 4 | 完成入口自检后按计划编码 | phase-gates.md、phase4-execution-modes.md、test-driven-development |
| 5 | 真实项目验证、浏览器验收、代码审查 | phase-gates.md、phase5-verification.md、browser-verification |
| 6 | 汇总证据、检查范围、说明遗留风险 | phase-gates.md |

## 跨阶段规则

- **设计资源**：Figma/截图只在 Phase 1 用于调研；隔离执行任务自行读取实施详情；Phase 5 验收截图单独保存。详见 `references/guides/execution-patterns.md`。
- **隔离执行**：MCP/多窗口/子代理自包含加载技能与资源，主窗口仅传资源定位；返工任务自包含修改目标，不强依赖原 spec。
- **并行规则**：仅计划明确标记的批次可并行；同一文件、symbol、API、状态不得并行。
- **失败处理**：Phase 5 验收失败或代码审查出 Critical 问题时回到 Phase 4 修复后重新验收。
- **产物位置**：非代码产物统一放在 `docs/design/YYYY-MM-DD-<topic>-design/`；具体文件名和证据格式以各 Phase reference 为准。
