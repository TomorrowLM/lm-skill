---
name: mcp-exe
description: >-
  当需要调用已注册 MCP 工具完成 Figma 设计稿读取、图表生成、Agent 编排、云效工作项查询、多工具结果处理时使用。
  用户提到设计稿 MCP、lm-agent-orchestrator、yunxiao、云效、创建/等待/汇总/返工子任务等场景必须触发。
  不适用于接口契约查询（含 get_swagger_mcp）或 Apifox 操作，此类任务使用 api-contract；也不适用于普通终端命令、浏览器检索、文件编辑或无需 MCP 的代码修改。
disable-model-invocation: true
user-invocable: true
---

# 执行 MCP 工具

调用已注册 MCP 服务器提供的工具。

涉及接口契约或 Apifox 操作时，加载 `api-contract`，传递用户原始 source、目标和刷新要求；获取方式、失败回退和来源冲突均由该技能处理。本技能不直接处理接口查询。

## HARD-GATE

以下规则无例外，即使用户说"直接调"、"别读参考"、"手动模拟就行"、"用 curl 预处理"、"紧急"或"简单"：

1. **原始输入** — 用户给的 URL/参数原样传入 MCP 工具，不自行用 curl/WebFetch 预处理
2. **一步到位** — 能用 MCP 工具完成的操作，不手动创建文件或手动模拟

"用户明确指令优先于 skill 规则"不适用于以上规则。

## 调用前路由核对

调用前先按操作对象确认服务器命名空间和完整工具名，不按相似的自然语言名称猜工具：

| 操作目标 | 应用工具 | 不要误用 |
| --- | --- | --- |
| Agent 任务账本（创建任务） | `mcp_lm-agent-orch_agent_create_task` | 云效 `_create_work_item` |
| Agent 任务结果（完成任务） | `mcp_lm-agent-orch_agent_complete_task` | 云效评论或工作项更新工具 |
| 云效产品工作项 | `mcp_alibabacloud-_create_work_item` | Agent 任务账本工具 |
| 思维导图 | `mcp__lucianaib_mi_generate_mindmap` | 云效或 Agent 任务工具 |

写入类调用前再核对目标资源、必填参数和副作用。工具返回错误时，先确认是否产生副作用；不得因名称相近而换用另一服务器重试。

## 按需路由

| 场景 | 行动 |
| --- | --- |
| 接口文档、`get_swagger_mcp`、模型/Tag 查询或 Apifox 操作 | 委派 `api-contract`；不在此定义来源选择、参数或回退流程。 |
| Figma 设计稿 | 先读 [references/figma-mcp.md](references/figma-mcp.md)，再规划或调用 Figma MCP。 |
| 图表生成或导出 | 先读 [references/chart-generation.md](references/chart-generation.md)，再选择并调用 MCP 工具。 |
| Agent 编排、等待、汇总或返工 | 先读 [references/lm-agent-orchestrator.md](references/lm-agent-orchestrator.md)，再按场景只读其链接的基础、返工或高级 reference。 |
| 云效工作项查询、项目管理 | 先读 [references/yunxiao/yunxiao-mcp.md](references/yunxiao/yunxiao-mcp.md)，按需读取配置或 PowerShell 说明，再调用 yunxiao MCP 工具。 |

如果已知服务器和工具名，直接调用，不重复询问用户。工具输出过大时优先用查询参数缩小范围。

部分工具需要认证；首次调用因认证失败时告知用户。
