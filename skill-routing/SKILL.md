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

1. **先确认领域**：用户意图是否落在本地路由表覆盖的 4 个领域内（UI实现/视觉设计/React性能/技能查找）。不在领域内直接说"不归本技能管"，不做路由。
2. **先读主导技能**：命中本地技能后必须先 `read_file` 读取对应 `SKILL.md`，不能只凭本路由表概括执行。
3. **按需读辅助技能**：只在触发条件满足时读取，不默认加载所有子技能。
4. **冲突时用户优先**：用户当前明确要求 > 项目既有约定 > Figma 输出 > 通用最佳实践。

## 本地技能路由表

| 用户意图 | 主导技能 | 辅助技能 | 辅助触发条件 |
| --- | --- | --- | --- |
| 提供 Figma 链接/节点/截图，要求实现 UI/组件/页面 | `skills/figma-implement-design` | `skills/vercel-react-best-practices` | 项目为 React/Next.js 时 |
| | | `skills/frontend-design` | 仅设计稿未覆盖的视觉决策（配色、间距、动效） |
| 无 Figma 输入，要求"做得好看""重新设计""不要模板感""优化视觉" | `skills/frontend-design` | `skills/vercel-react-best-practices` | 进入 React/Next.js 代码实现或评审时 |
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

### Figma 到代码

1. 读取 `skills/figma-implement-design/SKILL.md`，按 7 步流程执行。
2. 项目为 React/Next.js → 读取 `skills/vercel-react-best-practices/SKILL.md`。
3. 仅当 Figma 未覆盖视觉决策时 → 读取 `skills/frontend-design/SKILL.md`。
4. `vercel-react-best-practices` 不能破坏 Figma 验收标准。

### 纯视觉设计

1. 读取 `skills/frontend-design/SKILL.md`，按两轮设计流程执行。
2. 进入 React/Next.js 代码实现时 → 读取 `skills/vercel-react-best-practices/SKILL.md`。
3. 不要因为写了 React 代码就自动引入 Figma 技能。

### React 性能与最佳实践

1. 读取 `skills/vercel-react-best-practices/SKILL.md`，按 8 类规则执行。
2. 不要自动引入视觉设计技能，除非用户同时要求 UI 方向。

### 查找外部技能

1. 先确认本地 4 个技能无法覆盖。
2. 读取 `skills/find-skills/SKILL.md`，按 leaderboard → 搜索 → 质量验证 → 推荐流程执行。

## 红线

### 不要跳过主导技能的 SKILL.md

只读本路由表就开始执行 → 违规。必须先 `read_file` 主导技能。

### 不要把所有技能都读一遍

任务不涉及 Figma 时不读 figma-implement-design，不涉及视觉时不读 frontend-design。只读与当前任务直接相关的技能。

### 不要用外部搜索替代本地技能

本地 4 个技能已覆盖 → 不使用 `find-skills`。外部搜索只用于发现本地没有的能力。

### 不要路由本路由表不覆盖的技能

用户说"帮我调试这个 bug"→ 不归本技能管，直接说不在路由表领域内。不要尝试把 `systematic-debugging` 等技能硬塞进路由表。

## 完成前检查

- [ ] 已确认用户意图命中路由表，或明确进入外部搜索 fallback。
- [ ] 已读取主导技能的 `SKILL.md`，没有只凭本文件概括执行。
- [ ] 辅助技能只在触发条件满足时读取，没有默认加载。
- [ ] 多技能建议冲突时，已按"用户优先 > 项目约定 > Figma > 通用实践"处理。
- [ ] 如果进入 `find-skills`，已确认本地 4 个技能无法覆盖。

## 技能集成

### 前置技能

无。

### 后置技能

- `skills/figma-implement-design`：设计稿到代码实现。
- `skills/frontend-design`：视觉设计方向和差异化 UI 决策。
- `skills/vercel-react-best-practices`：React/Next.js 性能和实现实践。
- `skills/find-skills`：外部技能搜索、评估和安装建议。

### Token 效率

当路由涉及读取多个子技能 SKILL.md 时，按 `token-saving` 技能设定预算、分层读取，避免一次性加载所有文件。
