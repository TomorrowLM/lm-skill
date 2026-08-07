# Swagger / OpenAPI — get_swagger_mcp

`lm-mcp-server.get_swagger_mcp` 用于读取 Swagger/OpenAPI 文档，列出模型或返回指定模型的数据结构。

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `source` | Swagger 文档 URL（支持 `doc.html` 或 JSON 端点） | 必填 |
| `name` | 模型名（不传则返回所有模型名） | 可选 |
| `resolveRefs` | 是否解析 `$ref` 引用 | `true` |
| `maxDepth` | 解析深度 | `15` |
| `document` | 直接传入文档对象（优先级高于 source） | 可选 |

## 示例

```plaintext
CallMcpTool:
  server_name: "lm-mcp-server"
  tool_name: "get_swagger_mcp"
  arguments:
    source: "https://example.com/api/doc.html#/任务管理/标签/操作ID"
```

> **注意**：该工具内置 HTML 页面解析、fragment 解析、swagger-resources 自动发现，**直接传入原始 URL（含 fragment）** 即可，无需手动探测端点。

## 缩小结果范围

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
