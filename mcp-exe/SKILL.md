---
name: mcp-exe
description: >-
  当需要调用已注册 MCP 工具完成 Swagger/OpenAPI 查询、Figma 设计稿读取、图表生成、Agent 编排、Chrome 浏览器操作、多工具结果处理时使用。
  用户提到 get_swagger_mcp、接口文档、设计稿 MCP、agent-orchestrator-mcp、mcp-chrome、chrome 浏览器/MCP、创建/等待/汇总/返工子任务等场景必须触发。
  不适用于普通终端命令、浏览器检索、文件编辑或无需 MCP 的代码修改。
---

# 执行 MCP 工具

调用已注册 MCP 服务器提供的工具的标准方法。

## HARD-GATE

以下规则无例外，即使用户说"直接调"、"别读参考"、"手动模拟就行"、"用 curl 预处理"、"紧急"或"简单"：

1. **先读案例** — 命中案例时必须先读取对应 reference，再调用工具
2. **原始输入** — 用户给的 URL/参数原样传入 MCP 工具，不自行用 curl/WebFetch 预处理
3. **一步到位** — 能用 MCP 工具完成的操作，不手动创建文件或手动模拟

"用户明确指令优先于 skill 规则"不适用于以上三条。

## 基本原则

1. **先用后问** — 如果已知 MCP 服务器和工具名，直接调用，无需询问用户
2. **原始输入** — 把用户给的原始值直接传入，不要自行预处理（如 Swagger URL 含 fragment 直接传）
3. **一步到位** — 能用 MCP 工具完成的操作，不要手动模拟（WebFetch/curl/grep 探测等）
4. **先读案例** — 命中下方案例时，先读取对应 reference，再调用工具或设计调用顺序

## 标准调用格式

```plaintext
CallMcpTool:
  server_name: "服务器名"
  tool_name: "工具名"
  arguments:
    param1: value1
    param2: value2
```

## 案例索引

| 案例 | 说明 | 详细文件 |
|------|------|----------|
| Swagger/OpenAPI | 读取接口文档、查询模型和接口出入参 | [references/swagger-mcp.md](references/swagger-mcp.md) |
| 图表生成 | 思维导图、流程图、时序图、复杂图表、导出图片 | [references/chart-generation.md](references/chart-generation.md) |
| Figma 设计稿 | 获取 UI 布局/样式/组件信息，下载图片资源 | [references/figma-mcp.md](references/figma-mcp.md) |
| Agent 编排 | 拆分复杂任务为子任务，并行执行 + 审查返工 | [references/agent-orchestrator-mcp.md](references/agent-orchestrator-mcp.md) |
| Chrome 浏览器 | 操作已打开的 Chrome 浏览器页面（导航、截图、交互、网络捕获、内容分析） | [references/chrome-mcp.md](references/chrome-mcp.md) |

## 注意事项

- 工具输出过大时会被截断（如全量模型数据），通过 `name` 等参数缩小范围
- 部分工具需认证，首次调用失败后告知用户
- `mind-map` 服务通过 `--return-type filePath` 控制返回 HTML 文件路径还是 HTML 内容
