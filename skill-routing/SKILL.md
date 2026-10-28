---
name: skill-routing
description: >-
  当需要判断应该使用哪个本地技能时使用——即用户意图不明确对应哪个技能，需要在多个候选技能之间做选择、组合或串联。
  触发场景：用户说"帮我实现这个设计稿"但未指定用哪个技能、"这个页面做得好看一点"但不确定走视觉设计还是Figma流程、
  用户问"有没有技能能帮我做X"需要判断本地覆盖还是外部搜索。
  不触发：用户已明确指定技能名称、普通代码修改/修bug/改文案/加字段、解释代码含义、单文件小改动、
  项目配置调整、lint/format/构建问题、纯知识问答（React怎么用、TypeScript类型怎么写）。
---

# Skill Routing

在本地技能中做路由决策。只有本地没有合适技能，或用户明确要查找/安装新技能时，才转到外部搜索。

## 核心原则

1. **先确认领域**：用户意图是否落在本地路由表覆盖的领域内（视觉工作流/React性能/技能查找）。不在领域内直接说"不归本技能管"，不做路由。
2. **先读主导技能**：命中本地技能后必须先 `read_file` 读取对应 `SKILL.md`，不能只凭本路由表概括执行。
3. **按需读辅助技能**：只在触发条件满足时读取，不默认加载所有子技能。
4. **冲突时用户优先**：用户当前明确要求 > 项目既有约定 > Figma 输出 > 通用最佳实践。
5. **嵌套技能也属于本地技能**：`skills/` 下的子技能可能不会出现在顶层可用技能列表中；只要路由表或本地目录存在对应的 `SKILL.md`，就必须直接读取并执行，不能仅因列表未展示而报告技能不可用或转向外部搜索。

## 本地技能路由表

| 用户意图 | 主导技能 | 辅助技能 | 辅助触发条件 |
| --- | --- | --- | --- |
| 提供 Figma、截图、原型或视觉 brief，要求整理技术方案 | `visual-workflow` 的 `technical-design` 模式 | `mcp-exe` | 需要访问 Figma MCP 时 |
| 提供视觉材料并要求实现 UI/组件/页面 | `visual-workflow` 的 `implementation` 模式 | `skills/vercel-react-best-practices` | 项目为 React/Next.js 且涉及实现实践时 |
| 无既定方向，要求重新设计、制定视觉方向或“做得好看” | `visual-workflow` 的 `technical-design` 模式 | `skills/vercel-react-best-practices` | 仅当同时涉及 React/Next.js 实现实践时 |
| 对照设计稿验收实际页面 | `visual-workflow` 的 `verification` 模式 | `browser-verification` | 需要连接页面、采集 DOM/截图或执行交互时 |
| 编写/审查/重构 React/Next.js 代码，关注性能、bundle、渲染 | `skills/vercel-react-best-practices` | — | — |
| 查找某类 Agent Skill、问"有没有技能能…""安装技能" | `skills/find-skills` | — | — |

## 不适用边界

以下场景**不进入本技能路由**，直接处理：

- 用户已明确说"用 X 技能"——直接读取该技能，不重新路由。
- 修 bug、改文案、调样式、加字段/按钮——小范围改动，不涉及技能选择。
- 解释代码含义、回答技术问题——纯知识问答，不需要技能路由。
- 项目配置调整、lint/format/构建问题——与技能路由无关。
- 用户只是问"这个技能是做什么的"——直接解释，不转入子技能执行。
- 任务涉及 `page-development-workflow`、`systematic-debugging`、`test-driven-development`、`writing-doc` 等非本路由表覆盖的技能——这些技能有自己的触发条件，不通过本技能路由。

## 路由流程

### 视觉材料驱动的工作

1. 读取 `skills/visual-workflow/SKILL.md`，根据用户当前目标选择 `technical-design`、`implementation` 或 `verification` 模式。
2. 需要 Figma MCP 数据时读取 `mcp-exe` 的 Figma 参考；需要实际页面截图、DOM 或交互证据时读取 `browser-verification`。
3. 项目为 React/Next.js 且任务涉及实现实践或性能时，按需读取 `skills/vercel-react-best-practices/SKILL.md`。
4. 单点 CSS/文案调整不因包含颜色、间距等视觉词语就自动进入视觉工作流。

### React 性能与最佳实践

1. 读取 `skills/vercel-react-best-practices/SKILL.md`，按 8 类规则执行。
2. 不要自动引入 `visual-workflow`，除非用户同时提供视觉材料、要求视觉方向或设计对比。
3. 对“页面慢/卡”等原因不明的症状，先询问是 React 渲染、资源/bundle、接口还是网络问题；确认属于 React 性能后才读取本技能，不得凭“页面慢”直接猜因路由。

### 查找外部技能

1. 先确认本地技能无法覆盖。
2. 读取 `skills/find-skills/SKILL.md`，按 leaderboard → 搜索 → 质量验证 → 推荐流程执行。

## 红线

### 不要跳过主导技能的 SKILL.md

只读本路由表就开始执行 → 违规。必须先 `read_file` 主导技能。

### 不要把所有技能都读一遍

任务不涉及视觉材料、视觉方向或设计对比时不读 `visual-workflow`。只读与当前任务直接相关的技能。

### 不要用外部搜索替代本地技能

本地技能已覆盖 → 不使用 `find-skills`。外部搜索只用于发现本地没有的能力。

### 不要路由本路由表不覆盖的技能

用户说"帮我调试这个 bug"→ 不归本技能管，直接说不在路由表领域内。不要尝试把 `systematic-debugging` 等技能硬塞进路由表。

## 完成前检查

- [ ] 已确认用户意图命中路由表，或明确进入外部搜索 fallback。
- [ ] 已读取主导技能的 `SKILL.md`，没有只凭本文件概括执行。
- [ ] 辅助技能只在触发条件满足时读取，没有默认加载。
- [ ] 多技能建议冲突时，已按"用户优先 > 项目约定 > Figma > 通用实践"处理。
- [ ] 如果进入 `find-skills`，已确认本地技能无法覆盖。

## 技能集成

### 前置技能

无。

### 后置技能

- `visual-workflow`：视觉材料驱动的技术方案、界面实现和视觉验证。
- `skills/vercel-react-best-practices`：React/Next.js 性能和实现实践。
- `skills/find-skills`：外部技能搜索、评估和安装建议。

### Token 效率

当路由涉及读取多个子技能 SKILL.md 时，按 `token-saving` 技能设定预算、分层读取，避免一次性加载所有文件。
