# Figma 设计稿 → Framelink Figma MCP Server

当用户提供 Figma 设计稿链接时，使用以下工具获取 UI 数据。

## get_figma_data

获取 Figma 文件的布局、内容、视觉样式和组件信息。

### 参数

| 参数 | 说明 |
|------|------|
| `fileKey` | Figma 文件 key，从 URL 中提取 |
| `nodeId` | 可选，指定节点 ID |

### URL 格式

`figma.com/(file|design)/<fileKey>/...`

### 示例

```plaintext
CallMcpTool:
  server_name: "Framelink MCP for Figma"
  tool_name: "get_figma_data"
  arguments:
    fileKey: "abc123"
    nodeId: "123:456"
```

> 用途：获取页面布局结构、组件层级、样式属性（颜色、字体、间距等）

## download_figma_images

下载 Figma 文件中的 SVG/PNG 图片资源。

### 参数

`fileKey`、`nodes`（节点数组）、`localPath`（保存路径）

> 用途：下载图标、插画等图片资源到项目中

## 示例流程

```
用户提供: https://www.figma.com/design/abc123/设计稿?node-id=123:456
↓
提取 fileKey='abc123', nodeId='123:456'
↓
调用 get_figma_data 获取 UI 布局、样式、组件信息
↓
根据设计数据实现页面 UI
```
