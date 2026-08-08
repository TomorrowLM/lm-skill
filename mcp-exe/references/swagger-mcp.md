# Swagger / OpenAPI — get_swagger_mcp

`lm-mcp-server.get_swagger_mcp` 用于读取 Swagger/OpenAPI 文档，列出模型或返回指定模型/接口的数据结构。

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `source` | Swagger 文档 URL（支持 `doc.html` 或 JSON 端点），也支持相对 API 路径（如 `/api/xxx/page`） | 必填 |
| `name` | 模型名或接口关键词（不传则返回模型目录；传了优先匹配模型，未命中则按接口关键词模糊匹配） | 可选 |
| `operationId` | 精确匹配接口的 operationId | 可选 |
| `tag` | 精确匹配 Tag，返回该 Tag 下所有接口 | 可选 |
| `keyword` | 在 Tag/模型目录下过滤结果 | 可选 |
| `refresh` | 跳过缓存，强制重新拉取文档 | `false` |
| `resolveRefs` | 是否解析 `$ref` 引用 | `true` |
| `maxDepth` | 解析深度 | `15` |
| `document` | 直接传入文档对象（优先级高于 source） | 可选 |

## 示例

### 传入相对 API 路径（推荐）

直接传入接口路径，自动加载文档并在所有 Knife4j 分组中搜索匹配：

```plaintext
arguments:
  source: "/dsb/yqarw/api/yqa/urban/app/checkplan/task/page"
```

### 传入 doc.html URL + fragment

```plaintext
arguments:
  source: "https://example.com/api/doc.html#/任务管理/标签/操作ID"
```

> **注意**：该工具内置 HTML 页面解析、fragment 解析、swagger-resources 自动发现、跨分组搜索，**直接传入 API 路径或原始 URL** 即可，无需手动探测端点。

## 缩小结果范围

```plaintext
# 只查某个模型
arguments:
  source: "https://example.com/api/v3/api-docs"
  name: "YqaNoticeResp"

# 只查某个接口的出入参（精确 operationId）
arguments:
  source: "https://example.com/api/doc.html#/任务管理"
  name: "pageUsingPOST_13"

# 强制刷新（跳过缓存）
arguments:
  source: "/dsb/yqarw/api/yqa/urban/app/checkplan/task/page"
  refresh: true
```
