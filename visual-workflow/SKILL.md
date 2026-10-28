---
name: visual-workflow
description: >-
  当用户基于 Figma、原型、截图、标注或视觉方向，需要整理页面技术方案、实现 UI，
  或对照设计材料验证页面视觉时使用。按任务选择技术方案、实现或验证模式；单点 CSS
  修改、纯浏览器结构检查和 Figma 画布内编辑不触发本技能。
---

# Visual Workflow

统一处理视觉材料驱动的技术方案、界面实现和视觉验证。只承载视觉领域规则；页面生命周期由 `page-development-workflow` 管理，浏览器采集由 `browser-verification` 管理。

## 模式选择

每次先选择一个当前模式，只读取共享标准和该模式文件。用户明确要求跨阶段连续工作时，按技术方案 → 实现 → 验证顺序推进，并遵守主工作流的确认门禁。

| 模式 | 适用任务 | 必读文件 | 禁止越界 |
| --- | --- | --- | --- |
| `technical-design` | 从 Figma、截图、原型或视觉 brief 整理页面方案 | `references/visual-standards.md`、`references/modes/technical-design.md` | 不写业务代码，不把推断写成已确认需求 |
| `implementation` | 根据已确认方案或明确授权的视觉需求实现页面 | `references/visual-standards.md`、`references/modes/implementation.md` | 不跳过项目结构和设计依据，不把实现自查冒充 Phase 5 验收 |
| `verification` | 根据已确认验收清单对比设计与实际界面 | `references/visual-standards.md`、`references/modes/verification.md` | 只读验收，不改业务代码，不扩大 `#10` 范围 |

## 技能边界

- 交付物是用户仓库中的页面/组件代码、视觉技术方案或对比结果时使用本技能。
- 要在 Figma 画布里创建、编辑或删除节点时转给 `figma-use`；要从代码/描述生成 Figma 设计时转给 `figma-generate-design`；只做 Code Connect 映射时转给 `figma-code-connect-components`。
- Figma 读取通过已连接且获准的 Figma MCP；没有可访问节点或参考图时暂停并请求可用材料，不凭 URL 或记忆模拟设计内容。

## 共享规则

- 明确本次依据的设计版本、节点/图片和用户已确认的范围；缺少关键来源时标记未知并询问，不猜测尺寸或状态。
- 将视觉材料中的可观察事实、设计解释、业务规则和待确认项分开记录。业务预期以已确认需求与验收清单为准，不从图片推导未确认的业务行为。
- 设计系统、项目约定与用户明确要求共同约束实现；发生冲突时按 `visual-standards.md` 的优先级处理并记录偏差。
- 视觉规则和工具流程按需加载。实际 Figma MCP 调用遵循 `mcp-exe`，页面连接、截图、DOM 和交互采集遵循 `browser-verification`。

## 许可与来源

本技能整合并改写了原 `frontend-design` 中的视觉设计指导，适用 Apache-2.0 许可证，见本目录 `LICENSE.txt`。Figma 实现流程来自原 `figma-implement-design` 技能并已按三种模式拆分。