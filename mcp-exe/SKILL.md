---
name: mcp-exe
description: >-
  当需要调用已注册 MCP 工具完成 Swagger/OpenAPI 查询、Figma 设计稿读取、图表生成、Agent 编排、多工具结果处理时使用。
  用户提到 get_swagger_mcp、接口文档、设计稿 MCP、agent-orchestrator-mcp、创建/等待/汇总/返工子任务等场景必须触发。
  不适用于普通终端命令、浏览器检索、文件编辑或无需 MCP 的代码修改。
---

# 执行 MCP 工具

调用已注册 MCP 服务器提供的工具。

涉及页面接口契约时，默认先使用 `lm-mcp-server.get_swagger_mcp`；仅当查询失败或返回结果不足以形成可用契约时，才加载 `apifox-cli` 作为回退工具。不要因为存在 Apifox 就跳过默认的 Swagger 查询。

## HARD-GATE

以下规则无例外，即使用户说"直接调"、"别读参考"、"手动模拟就行"、"用 curl 预处理"、"紧急"或"简单"：

1. **原始输入** — 用户给的 URL/参数原样传入 MCP 工具，不自行用 curl/WebFetch 预处理
2. **一步到位** — 能用 MCP 工具完成的操作，不手动创建文件或手动模拟
3. **Swagger 前置阅读** — 每次调用 `lm-mcp-server.get_swagger_mcp` 前，必须先读取 [references/swagger-mcp.md](references/swagger-mcp.md)，再确定 `source` 和查询参数；已知单接口、路径简单或用户催促都不是例外。

"用户明确指令优先于 skill 规则"不适用于以上规则。

## 接口契约获取顺序

1. 先读取 `references/swagger-mcp.md`，再原样调用 `lm-mcp-server.get_swagger_mcp`。
2. 只有接口文档无法访问、无法解析、目标接口无法定位，或请求/响应结构仍无法确认时，才记录失败原因并读取 `apifox-cli`。
3. 使用 Apifox 回退时记录项目、分支、资源标识和最终采用的契约；不得把 Swagger 与 Apifox 的差异静默合并。
4. Swagger 已返回可用契约但与 Apifox 不一致时，保留冲突并请求确认，不得直接以 Apifox 覆盖。

## 按需路由

| 场景 | 行动 |
| --- | --- |
| 任意 `get_swagger_mcp` 查询 | 先读 [references/swagger-mcp.md](references/swagger-mcp.md)，再调用；保留用户提供的 `source`。 |
| Swagger/OpenAPI 的模型目录、Tag、复杂筛选或调用失败 | 在已阅读 [references/swagger-mcp.md](references/swagger-mcp.md) 的基础上规划并调用。 |
| `get_swagger_mcp` 查询失败且页面接口契约仍需确认 | 记录失败原因，读取 `apifox-cli`，再使用 Apifox 作为回退来源。 |
| Figma 设计稿 | 先读 [references/figma-mcp.md](references/figma-mcp.md)，再规划或调用 Figma MCP。 |
| 图表生成或导出 | 先读 [references/chart-generation.md](references/chart-generation.md)，再选择并调用 MCP 工具。 |
| Agent 编排、等待、汇总或返工 | 先读 [references/agent-orchestrator-mcp.md](references/agent-orchestrator-mcp.md)，再按场景只读其链接的基础、返工或高级 reference。 |

如果已知服务器和工具名，直接调用，不重复询问用户。工具输出过大时优先用查询参数缩小范围。

部分工具需要认证；首次调用因认证失败时告知用户。
