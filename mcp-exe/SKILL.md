---
name: mcp-exe
description: 执行 MCP 工具的标准方法 — 发现可用工具、传递参数、处理结果。包含 get_swagger_mcp 等常见案例
---

# 执行 MCP 工具

调用已注册 MCP 服务器提供的工具的标准方法。

## 基本原则

1. **先用后问** — 如果已知 MCP 服务器和工具名，直接调用，无需询问用户
2. **原始输入** — 把用户给的原始值直接传入，不要自行预处理（如 Swagger URL 含 fragment 直接传）
3. **一步到位** — 能用 MCP 工具完成的操作，不要手动模拟（WebFetch/curl/grep 探测等）

## 标准调用格式

```plaintext
CallMcpTool:
  server_name: "服务器名"
  tool_name: "工具名"
  arguments:
    param1: value1
    param2: value2
```

## 案例

### 案例 1：调用 get_swagger_mcp

`lm-mcp-server.get_swagger_mcp` 用于读取 Swagger/OpenAPI 文档，列出模型或返回指定模型的数据结构。

**参数：**

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `source` | Swagger 文档 URL（支持 `doc.html` 或 JSON 端点） | 必填 |
| `name` | 模型名（不传则返回所有模型名） | 可选 |
| `resolveRefs` | 是否解析 `$ref` 引用 | `true` |
| `maxDepth` | 解析深度 | `15` |
| `document` | 直接传入文档对象（优先级高于 source） | 可选 |

**示例：**

```plaintext
CallMcpTool:
  server_name: "lm-mcp-server"
  tool_name: "get_swagger_mcp"
  arguments:
    source: "https://example.com/api/doc.html#/任务管理/标签/操作ID"
```

> **注意**：该工具内置 HTML 页面解析、fragment 解析、swagger-resources 自动发现，**直接传入原始 URL（含 fragment）** 即可，无需手动探测端点。

**缩小结果范围：**

```plaintext
# 只查某个模型
arguments:
  source: "https://example.com/api/v3/api-docs"
  name: "YqaNoticeResp"

# 只查某个接口的出入参
arguments:
  source: "https://example.com/api/doc.html#/任务管理"
  name: "pageUsingPOST_13"
```

### 案例 2：（预留）

其他 MCP 工具调用案例可在此添加。

## 注意事项

- 工具输出过大时会被截断（如全量模型数据），通过 `name` 等参数缩小范围
- 部分工具需认证，首次调用失败后告知用户
