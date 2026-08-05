---
name: skill-routing
description: 当需要根据用户意图在本地技能之间选择、分派、流程选择、组合、串联技能或转交到合适子技能时使用；用户询问该读哪个 SKILL.md，尤其是 Figma 设计稿落地、前端视觉设计、React/Next.js 性能实践，或继续查找可安装技能时使用。
---

# Skill Routing

先在本地技能中路由；只有本地没有合适技能，或用户明确要查找/安装新技能时，才转到开放生态搜索。

## 路由顺序

1. 判断用户目标是否能由本地技能直接覆盖。
2. 如果能覆盖，读取对应 `SKILL.md` 并按该技能执行。
3. 如果任务跨多个技能，先读取主导技能，再读取辅助技能。
4. 如果本地没有匹配项，读取 `skills/find-skills` 并按其流程搜索外部技能。

## 不适用边界

- 用户已经明确指定某个技能时，直接读取该技能，不再通过本技能重新路由。
- 普通代码修改、问题解释或文档编辑不涉及下方路由表领域时，不使用本技能。
- 用户只是询问技能概念、目录含义或文件作用时，直接解释，不转入子技能执行。
- 项目级约定、一次性规则或自动化校验逻辑，不通过本技能包装成子技能。

## 本地技能路由表

| 用户意图 | 主导技能 | 辅助技能 |
| --- | --- | --- |
| 根据 Figma 链接、节点或截图实现 UI/组件/页面 | `skills/figma-implement-design` | `skills/frontend-design`、`skills/vercel-react-best-practices` |
| 创建新 UI、重塑页面视觉、提升审美和差异化 | `skills/frontend-design` | `skills/vercel-react-best-practices` |
| 编写、审查或重构 React/Next.js 代码并关注性能 | `skills/vercel-react-best-practices` | - |
| 查找某类 Agent Skill、问有没有现成能力、安装新技能 | `skills/find-skills` | - |

## 组合规则

### 冲突优先级

1. 用户当前明确要求优先于所有子技能建议。
2. 项目既有约定优先于 Figma 输出和通用最佳实践。
3. 有 Figma 输入时，`skills/figma-implement-design` 主导；`skills/frontend-design` 只处理视觉取舍，不覆盖设计稿事实。
4. `skills/vercel-react-best-practices` 只能约束实现质量和性能，不得破坏 Figma 验收、用户指定视觉或项目组件契约。
5. 本地技能已覆盖时，不使用 `skills/find-skills` 做外部搜索。

### Figma 到代码

当用户提供 Figma URL、节点 ID、设计稿截图或说“按设计稿实现”时：

1. 先读取 `skills/figma-implement-design/SKILL.md`，把设计上下文、截图和素材作为实现依据。
2. 如果涉及视觉取舍、设计系统映射或页面气质，再读取 `skills/frontend-design/SKILL.md`。
3. 如果实现落在 React 或 Next.js 项目中，再读取 `skills/vercel-react-best-practices/SKILL.md` 检查性能模式。

### 纯视觉设计

当用户没有 Figma 输入，只要求“做得好看”“重新设计”“不要模板感”“优化页面视觉”时：

1. 读取 `skills/frontend-design/SKILL.md`。
2. 只有在进入 React/Next.js 代码实现或评审时，才读取 `skills/vercel-react-best-practices/SKILL.md`。

### React 性能与最佳实践

当用户提到 React/Next.js 组件、页面、数据获取、bundle、渲染性能或代码评审时：

1. 读取 `skills/vercel-react-best-practices/SKILL.md`。
2. 不要因为普通 React 改动自动引入视觉设计技能，除非用户同时要求 UI 观感或设计方向。

### 查找外部技能

当本地技能无法覆盖，或用户明确说“找一个技能”“有没有技能”“安装技能”时：

1. 读取 `skills/find-skills/SKILL.md`。
2. 按开放技能生态的搜索、质量验证和推荐流程执行。

## 红线

### 不要跳过主导技能

命中本地技能时，必须先读取主导技能的 `SKILL.md`，不要只凭本路由表概括执行。

### 不要把所有技能都读一遍

只读取与当前任务有直接关系的技能。任务不涉及视觉、Figma 或 React 性能时，不要加载这些技能。

### 不要用外部搜索替代本地技能

本地技能已覆盖的问题，优先使用本地技能；外部搜索只用于发现本地没有的能力。

## 完成前检查

- 已确认用户意图命中了路由表，或明确进入了外部技能搜索 fallback。
- 已读取主导技能的 `SKILL.md`，没有只凭本文件概括执行。
- 辅助技能只在触发条件满足时读取，没有把所有子技能默认加载。
- 多技能建议发生冲突时，已按“冲突优先级”处理。
- 如果进入 `skills/find-skills`，已确认本地技能无法覆盖或用户明确要求查找/安装新技能。

## 技能集成

### 前置技能

无。

### 后置技能

- `skills/figma-implement-design`：设计稿到代码实现。
- `skills/frontend-design`：视觉设计方向和差异化 UI 决策。
- `skills/vercel-react-best-practices`：React/Next.js 性能和实现实践。
- `skills/find-skills`：外部技能搜索、评估和安装建议。
