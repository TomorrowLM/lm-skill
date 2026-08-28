---
name: page-development-workflow
description: >-
  当用户要从零开发完整前端页面或功能模块，或大幅改造已有页面时使用；典型输入包括 Figma、原型、PRD、Swagger/OpenAPI，且需求涉及页面结构、路由、多个交互区块、接口、状态流或验收。
  适用于列表页、详情页、编辑页、表单页、大屏及多步骤流程。不要用于单点 bug、文案/样式/字段/按钮微调、代码解释、代码审查或用户已限定文件与改动内容的小范围快速修改。
---

# 页面开发工作流

将页面需求转为可确认、可实施、可验证的交付物。它是状态机，不是代码模板集合。

## 先判断是否触发

| 判断 | 行动 |
| --- | --- |
| 新页面、完整功能模块、多步骤流程，或页面结构/路由/接口/状态流/组件树的大幅改造 | 使用本技能，从 Phase 1 开始。 |
| 单个文案、字段、按钮、样式或局部布局；单点 bug；代码解释或审查 | 不使用本技能，按对应小范围或调试流程处理。 |
| 用户说“直接开始/直接做” | 立即开始 Phase 1 调研，但不跳过后续阶段产出、确认或验证。 |
| 用户明确要求轻量路径 | 仅合并 Phase 1-3 的展示与一次确认；不得省略调研、方案、计划、编码、验收和交付。 |
| 用户提供已确认的方案或计划 | 核验阶段产物与用户确认记录，从首个未完成 Phase 继续；证据不足时从 Phase 1 重新确认。 |

边界不清时，先用需求规模、涉及文件和接口/状态变更判断；不要因“页面”一词对小改动误触发。

## HARD-GATE

以下规则无例外：

1. 阶段顺序固定为 Phase 1 → 2 → 3 → 4 → 5 → 6；不能跳阶段或空过阶段产出。
2. Phase 4 前不得写业务代码，包括类型、常量、组件、页面和服务层。
3. Phase 1、2、3、5 的阶段产出必须展示并等待用户明确确认；“直接开始”不构成跳过门禁的授权。
4. 发现新增页面、模块、接口契约、状态流、验收标准、共享层变更或未评估的 HIGH / CRITICAL 风险时，回到 Phase 3 更新计划并再次确认。

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

## 阶段路由

| 阶段 | 目标与阶段产出 | 必读材料 |
|------|----------|
| Phase 1 | 明确用户、目标、核心流程、边界状态、成功标准和现有实现影响；展示需求共识、范围取舍、待决策点和调研摘要。 | `references/phase-gates.md`、`references/phase1-2-discovery-and-design.md`；无设计和接口资料时读取 `brainstorming`；涉及 Figma、Swagger/OpenAPI 时按 `mcp-exe` 路由调研。 |
| Phase 2 | 明确路由、文件位置、组件与状态边界、类型/常量、接口映射和错误/空态；写入或审阅技术方案。 | `references/phase-gates.md`、`references/phase1-2-discovery-and-design.md`；无方案时读取 `writing-doc`；注册页面时读取 `references/pages-registry.md`。 |
| Phase 3 | 先展示 3-5 个拆分方案（必须含不拆分），用户选择后再生成可执行计划或子任务规格。 | `references/phase-gates.md`、`references/phase3-split-strategies.md`。 |
| Phase 4 | 先完成入口自检，再由用户选择执行方式和推进模式；仅执行已确认计划。 | `references/phase-gates.md`、`references/phase4-execution-modes.md`；内联实现读取 `test-driven-development`；MCP 编排同时读取 `mcp-exe` 的编排入口。 |
| Phase 5 | 选择真实项目验证命令、阅读输出、完成浏览器验收、记录证据并进行代码审查。 | `references/phase-gates.md`、`references/phase5-verification.md`、`superpowers/verification-before-completion`；浏览器验收读取 `browser-verification`。 |
| Phase 6 | 汇总证据和审查结论，检查变更范围，说明提交状态、遗留风险和后续建议。 | `references/phase-gates.md`；如存在，执行 `sync:designs`；提交、推送、PR、合并、发布或删除分支前再次确认。 |

## 跨阶段规则

- Figma Phase 1 只做需求调研；Phase 3 只记录资源定位；隔离执行任务自行获取实施详情并将资源落盘。
- 隔离执行（MCP/多窗口/子代理）自包含加载自身技能与资源，主窗口不预读；返工任务以自包含改动清单为准，不强依赖原 spec，追求最小 token 与修改精度。
- 并行只允许计划明确标记的批次；同一文件、symbol、API 契约、共享样式或全局状态不得并行。
- MCP、多窗口和子代理执行时，主窗口只传资源定位与验收目标，并在合流时审查结果。
- Phase 5 验收失败，或代码审查出现 Critical / Important 问题时，回到 Phase 4 修复后重新验收。
- 非代码产物统一放在 `docs/design/YYYY-MM-DD-<topic>-design/`；具体文件名、任务账本和证据格式以各 Phase reference 为准。
