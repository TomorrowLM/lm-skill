# Design 技能父入口接入规格

## 背景

当前 `design/` 目录下已有两个设计类技能：`frontend-design` 和 `figma-implement-design`。它们已经按目录归类，但缺少一个可被其他流程稳定依赖的父级入口。

`page-development-workflow` 在页面开发 Phase 1 中会遇到视觉方向、设计稿、Figma 还原等场景。为了避免页面工作流直接分散依赖具体设计子技能，需要新增 `design` 父技能作为统一路由入口。

## 目标

新增 `design/SKILL.md`，作为设计类技能的轻量路由器；同时让 `page-development-workflow` 在视觉或 Figma 场景下依赖 `design` 父技能。

## 范围

### 包含

- 新增 `design/SKILL.md`。
- 更新 `page-development-workflow/SKILL.md`：
  - Phase 1 的依赖 Skill 增加 `design`。
  - 视觉/Figma 调研说明改为经由 `design` 父技能路由。
  - 技能集成区补充 `design` 与两个子技能的关系。
- 更新 `README.md` 的设计类技能说明，让 `design` 成为总入口。

### 不包含

- 不修改 `design/frontend-design/SKILL.md` 的具体视觉设计方法论。
- 不修改 `design/figma-implement-design/SKILL.md` 的 Figma 实现流程。
- 不改变 `page-development-workflow` 的 Phase 1 → Phase 6 阶段顺序。
- 不新增强制性的页面实现流程。

## 路由规则

`design` 父技能只做意图识别和路由，不复制子技能正文。

| 用户意图 | 路由目标 | 说明 |
|---|---|---|
| 视觉方向、UI 风格、美化、让页面不模板化 | `frontend-design` | 先做视觉策略与设计方向 |
| Figma 链接、设计稿还原、像素级实现、按稿生成 UI 代码 | `figma-implement-design` | 按设计稿提取上下文并实现 |
| 同时涉及视觉方向和设计稿实现 | 先 `frontend-design`，再 `figma-implement-design` | 先明确方向，再执行还原 |
| 页面开发流程中出现视觉/Figma 输入 | `page-development-workflow` Phase 1 调用 `design` | 页面工作流不直接分散调用子技能 |

## `design/SKILL.md` 结构

- Frontmatter：
  - `name: design`
  - `description`: 说明其为设计类技能父入口，用于路由视觉设计和 Figma 实现任务。
- 正文：
  - 职责边界。
  - 路由表。
  - 与 `page-development-workflow` 的接入约定。
  - 禁止事项：不复制子技能内容、不直接跳过页面工作流门控、不替代实现计划。

## `page-development-workflow` 接入点

在 Phase 1 中增加说明：

- 当用户提供 Figma、设计稿、原型图、视觉方向或 UI 还原要求时，先使用 `design` 父技能判断应进入哪个设计子技能。
- 若仅需设计稿结构化数据，仍可在 Phase 1 使用 MCP 获取摘要，但触发策略由 `design` 父技能决定。
- 页面工作流继续负责页面路由、组件复用、接口字段、状态映射和后续 Phase 门控。

## 成功标准

- `design/SKILL.md` 能清楚表达父技能是路由入口。
- `page-development-workflow/SKILL.md` 不再把视觉/Figma 场景写成孤立能力，而是通过 `design` 入口接入。
- `README.md` 中设计类技能结构清晰：`design` 为总入口，两个现有技能为子技能。
- 没有占位符、TODO 或相互矛盾的流程说明。
