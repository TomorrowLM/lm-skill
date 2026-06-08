# MCP 工具集成

Phase 1 需求分析阶段使用的 MCP 工具参数和示例。

## 1. Swagger/API 接口文档 → `lm-mcp-server`

当用户提供 Swagger/Knife4j 接口文档地址时，使用以下工具获取接口详情：

### get_swagger_mcp

读取 Swagger/OpenAPI 文档，获取请求参数和响应结构。

- 参数：
  - `source`（文档 URL）
  - `name`（模型名，不传返回所有）
  - `maxDepth`（解析深度）
  - `resolveRefs`（是否解析 $ref）
- 用途：获取接口的请求参数类型、响应数据结构、字段说明

### 示例流程

```
用户提供: https://api-test.17an.com/dsb/yqarw/api/doc.html#/城市管理/检查计划接口/xxx
↓
调用 CallMcpTool(server_name='lm-mcp-server', tool_name='get_swagger_mcp', arguments={ source: '<url>' })
↓
获取接口请求参数、响应结构、字段类型
↓
基于获取的数据创建 TypeScript 类型定义和 API 服务函数（手动编写）
```

## 2. Figma 设计稿 → `Framelink Figma MCP Server`

当用户提供 Figma 设计稿链接时，使用以下工具获取 UI 数据：

### get_figma_data

获取 Figma 文件的布局、内容、视觉样式和组件信息。

- 参数：
  - `fileKey`（Figma 文件 key，从 URL 中提取）
  - `nodeId`（可选，指定节点 ID）
- URL 格式：`figma.com/(file|design)/<fileKey>/...`
- 用途：获取页面布局结构、组件层级、样式属性（颜色、字体、间距等）

### download_figma_images

下载 Figma 文件中的 SVG/PNG 图片资源。

- 参数：`fileKey`、`nodes`（节点数组）、`localPath`（保存路径）
- 用途：下载图标、插画等图片资源到项目中

### 示例流程

```
用户提供: https://www.figma.com/design/abc123/设计稿?node-id=123:456
↓
提取 fileKey='abc123', nodeId='123:456'
↓
调用 CallMcpTool(server_name='Framelink Figma MCP Server', tool_name='get_figma_data', arguments={ fileKey: 'abc123', nodeId: '123:456' })
↓
获取 UI 布局、样式、组件信息
↓
根据设计数据实现页面 UI
```
