# Swagger / OpenAPI — get_swagger_mcp

`lm-mcp-server.get_swagger_mcp` 用于读取 Swagger/OpenAPI 文档，查询模型目录、指定模型或单个接口的请求与响应结构。

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `source` | Swagger/OpenAPI 文档 URL（支持 `doc.html`、`swagger-ui.html`、JSON 端点及 fragment），也支持相对 API 路径（如 `/api/xxx/page`） | 默认 Swagger 源 |
| `name` | 兼容查询：优先精确匹配模型；未命中时按关键词返回评分最高的单个接口 | 可选 |
| `operationId` | 精确匹配接口的 operationId | 可选 |
| `tag` | 忽略大小写精确匹配 Tag，返回该 Tag 下所有接口 | 可选 |
| `keyword` | 在 Tag/模型目录下过滤结果 | 可选 |
| `offset` | Tag 或模型目录查询的分页起点 | `0` |
| `limit` | Tag 或模型目录查询的分页返回数量，取值范围为 1–200 | `50` |
| `refresh` | 跳过缓存，强制重新拉取文档 | `false` |
| `resolveRefs` | 是否解析 `$ref` 引用 | `true` |
| `maxDepth` | 解析深度 | `15` |
| `document` | 直接传入文档对象（优先级高于 source） | 可选 |

## 示例

### 传入相对 API 路径（推荐）

已知接口路径时，`source` 优先直接传入该路径；工具会选择内置 Swagger 源查询，默认分组未命中时再通过 `swagger-resources` 搜索分组。当前 `/dsb/api/` 前缀使用 DSB 文档源，其余相对路径使用 YQARW 文档源：

```plaintext
arguments:
  source: "/dsb/yqarw/api/yqa/urban/app/checkplan/task/page"
```

### 传入 doc.html URL + fragment

fragment 支持 `#/分组`、`#/分组/操作ID` 和 `#/分组/Tag/操作ID`：

```plaintext
arguments:
  source: "https://example.com/api/doc.html#/任务管理/标签/操作ID"
```

> **注意**：`source` 仅应传 Swagger/OpenAPI 文档 URL 或相对接口路径；任意业务 REST URL 不会自动转换为 Swagger 查询。工具内置 HTML 页面、fragment 与 `swagger-resources` 解析，无需手动探测 JSON 端点。

## 缩小结果范围

```plaintext
# 只查某个模型
arguments:
  source: "https://example.com/api/v3/api-docs"
  name: "YqaNoticeResp"

# 只查某个接口的出入参（精确 operationId）
arguments:
  source: "https://example.com/api/doc.html#/任务管理"
  operationId: "pageUsingPOST_13"

# 强制刷新（跳过缓存）
arguments:
  source: "/dsb/yqarw/api/yqa/urban/app/checkplan/task/page"
  refresh: true
```
