# lm-skill

本目录包含五组技能：**GitNexus 系列**（代码智能）、**React/前端性能**、**页面工作流系列**、**开发协作系列（superpowers）**、**设计类技能** 和 **技能管理**。

---

## GitNexus 系列

> **物理位置：`gitnexus/` 目录**（根目录下的 `gitnexus-*` 为反向符号链接，保持向后兼容）

基于知识图谱的代码智能工具集，提供代码理解、影响分析、安全重构等能力。

| 技能 | 描述 |
|------|------|
| `gitnexus-guide` | **使用手册 / 总入口**。GitNexus 工具与资源速查表，根据任务类型路由到对应技能 |
| `gitnexus-exploring` | **架构探索**。理解代码结构、追踪执行流、回答"X 是怎么工作的？" |
| `gitnexus-impact-analysis` | **影响范围分析**。评估修改的爆炸半径，回答"改了 X 会破坏什么？" |
| `gitnexus-debugging` | **Bug 追踪**。从错误信息出发，沿调用链定位根源 |
| `gitnexus-pr-review` | **PR 审查**。自动分析 PR 变更的爆炸半径、检查缺失的测试覆盖、评估合并风险 |
| `gitnexus-refactoring` | **安全重构**。跨文件协调重命名、提取模块、拆分服务，基于调用图保证一致性 |
| `gitnexus-cli` | **CLI 操作**。索引管理（analyze）、状态查询（status）、清理（clean）、生成文档（wiki）等命令行操作 |

> 入口方式：通过 `gitnexus-guide` 路由，或作为 superpowers 的叠加增强层使用（见 superpowers README）。

---

## React / 前端性能

| 技能 | 描述 |
|------|------|
| `vercel-react-best-practices` | **React & Next.js 性能优化**。Vercel 官方出品，含 70+ 条规则分 8 个优先级类别（消除瀑布、Bundle 优化、SSR 性能、重渲染优化、JS 性能等）。源自 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)（MIT） |

---

## 效率与上下文管理

| 技能 | 描述 |
|------|------|
| `token-saving` | **Token 节省与上下文压缩**。面向长文档、多文件探索、日志分析、网页调研、Figma/UI 还原、多代理协作和长对话续接，按预算分层获取上下文，减少无效 token。 |

---

## 页面工作流系列

| 技能 | 描述 |
|------|------|
| `create-ui-workflow` | **UI 页面生成工作流**。编排 `create_api_mcp` → `create_ui_mcp` 的完整链路，以 `page.json` 为单一事实来源生成页面代码，自动处理 apiName 回填 |

---

## 开发协作系列

| 技能 | 描述 |
|------|------|
| `superpowers` | **前端开发者总路由中心**。根据任务场景（头脑风暴→方案设计→编码实现→调试→审查→交付）自动分流到 15+ 子技能，覆盖完整开发生命周期 |
| `using-superpowers` | **技能使用规范**。确立在任何对话/澄清/操作之前优先调用 Skill 工具的强制规则，并提供多平台（Claude Code / Copilot CLI / Hermes / Gemini CLI）的技能加载方式 |
| `webapp-testing` | **Web 应用测试**。基于 Playwright 的本地 Web 应用交互测试工具，支持截图、DOM 检查、浏览器日志、服务生命周期管理。源自 [anthropics/skills](https://github.com/anthropics/skills)（Apache 2.0） |

---

## 设计类技能

| 技能 | 描述 |
|------|------|
| `frontend-design` | **前端视觉设计**。提供有辨识度的、有意图的视觉设计指导，涵盖美学方向、字体排版、配色方案、布局策略和文案撰写。帮助构建不像模板化默认产物的独特 UI。源自 [anthropics/skills](https://github.com/anthropics/skills)（Apache 2.0） |
| `figma-implement-design` | **Figma 设计还原**。将 Figma 设计稿按 1:1 像素级精度转化为生产就绪代码。支持 Figma MCP 集成、设计 Token 映射、7 步结构化工作流。源自 [openai/skills](https://github.com/openai/skills) |

---

## 技能管理

| 技能 | 描述 |
|------|------|
| `skill-creator` | **技能创建与优化**。创建、修改、评估、迭代优化 Agent Skill 的完整方法论。包含撰写→测试→评估→改进循环，支持定量基准测试和描述触发优化。源自 [anthropics/skills](https://github.com/anthropics/skills)（Apache 2.0） |
| `writing-skills` | **技能编写**。专门用于技能文档编写、修订和压力验证 |
