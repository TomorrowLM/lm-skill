# 图表生成 — 思维导图 / 流程图 / 其他

根据不同的图表类型选择不同的 MCP 工具。

## 选型指南

| 图表类型 | 推荐 MCP | 理由 |
|----------|----------|------|
| **思维导图**（知识分层、大纲、头脑风暴）| `mind-map` | 最轻量，纯 Markdown 输入，一步生成 HTML |
| **流程图**（业务流程、算法逻辑、状态机）| `drawio-mcp` + Mermaid | Mermaid `flowchart` 语法简洁，支持分支/循环 |
| **时序图 / 类图 / ER 图 / 甘特图 / 饼图** | `drawio-mcp` + Mermaid | 一行语法声明，不下十种类型覆盖 |
| **复杂图表**（泳道图、架构图、网络拓扑）| `drawio-mcp` + XML | 支持容器/嵌套/泳道/专业图标（AWS、Cisco 等）|
| **从表格数据生成图表**（组织架构等）| `drawio-mcp` + CSV | draw.io CSV 导入格式，自动布局 |

## 场景 A：思维导图 — `mind-map.convert_markdown_to_mindmap`

纯 Markdown 层级结构，快速生成 HTML 思维导图。

```plaintext
CallMcpTool:
  server_name: "mind-map"
  tool_name: "convert_markdown_to_mindmap"
  arguments:
    markdown_content: |
      # 项目架构
      ## 前端
      ### React
      ### Vue
      ## 后端
      ### Java
      ### Node.js
```

> 返回 HTML 文件路径（服务以 `--return-type filePath` 启动）。

## 场景 B：流程图 / 时序图 / 其他 — `drawio-mcp.open_drawio_mermaid`

用 Mermaid 语法声明图表，在 draw.io 编辑器中在线预览和编辑。

### 流程图示例

```plaintext
CallMcpTool:
  server_name: "drawio-mcp"
  tool_name: "open_drawio_mermaid"
  arguments:
    content: |
      flowchart TD
        A[开始] --> B{是否通过?}
        B -->|是| C[处理]
        B -->|否| D[驳回]
        C --> E[结束]
        D --> E
```

### 时序图示例

```plaintext
CallMcpTool:
  server_name: "drawio-mcp"
  tool_name: "open_drawio_mermaid"
  arguments:
    content: |
      sequenceDiagram
        participant U as 用户
        participant S as 服务端
        U->>S: 发送请求
        S-->>U: 返回结果
        Note right of S: 记录日志
```

> 支持的类型：`flowchart`、`sequenceDiagram`、`classDiagram`、`stateDiagram-v2`、`erDiagram`、`gantt`、`pie`、`mindmap`、`timeline`、`gitGraph` 等。

## 场景 C：复杂图表 — `drawio-mcp.open_drawio_xml`

当需要泳道图、容器嵌套、专业图标（AWS/GCP/Cisco）时，使用 draw.io XML 格式。

```plaintext
CallMcpTool:
  server_name: "drawio-mcp"
  tool_name: "open_drawio_xml"
  arguments:
    content: "<mxGraphModel>...</mxGraphModel>"
```

> AI 会自动生成准确的 XML，包含节点坐标、样式、容器层级和边连接。

## 场景 D：导出为图片 — `chrome-devtools.take_screenshot`

以上任意工具生成的图表都可截图保存为图片。

### 对 `mind-map`（HTML 文件）

```plaintext
# Step 1：获取 HTML 文件路径（见场景 A）
# Step 2：在浏览器中打开
CallMcpTool:
  server_name: "chrome-devtools"
  tool_name: "navigate_page"
  arguments:
    url: "file:///场景A返回的文件路径"
    type: "url"

# Step 3：截取全页保存到桌面
CallMcpTool:
  server_name: "chrome-devtools"
  tool_name: "take_screenshot"
  arguments:
    filePath: "/Users/zm/Desktop/思维导图.png"
    format: "png"
    fullPage: true
```

> **页面开发工作流内使用时：** 截图和图表应存放到当前功能文件夹的 `assets/` 子目录，而非桌面。详见 `page-development-workflow` 的统一目录结构约定。

### 对 `drawio-mcp`（在线编辑器）

```plaintext
# Step 1：打开图表（见场景 B/C），drawio-mcp 会返回 editor URL
# Step 2：导航到该 URL
CallMcpTool:
  server_name: "browser-use" 或 "chrome-devtools"
  tool_name: "navigate_page"
  arguments:
    url: "drawio-mcp返回的编辑器URL"
    type: "url"

# Step 3：等待页面加载完成（draw.io 是重应用，需 10-30 秒）
# 如果弹出"所有修改均将会丢失！"对话框，点击"放弃更改"
# 先用 take_snapshot 确认对话框存在，然后：
# CallMcpTool:
#   server_name: "browser-use"
#   tool_name: "click"
#   arguments:
#     uid: "对话框上放弃更改按钮的uid"
#
# Step 4：通过菜单触发导出
# 点击"绘图"按钮打开主菜单
# CallMcpTool:
#   server_name: "browser-use"
#   tool_name: "click"
#   arguments:
#     uid: "绘图按钮的uid（在 take_snapshot 快照中查找）"
#
# Step 5：点击"导出为" → "PNG..." 打开导出对话框
# CallMcpTool:
#   server_name: "browser-use"
#   tool_name: "click"
#   arguments:
#     uid: "导出为菜单项的uid"
# # 然后点击 PNG... 子菜单项
# CallMcpTool:
#   server_name: "browser-use"
#   tool_name: "click"
#   arguments:
#     uid: "PNG...菜单项的uid"
#
# Step 6：在导出对话框中确认导出设置，点击"导出"
# CallMcpTool:
#   server_name: "browser-use"
#   tool_name: "click"
#   arguments:
#     uid: "导出按钮的uid"

# Step 7：在保存对话框中提示用户手动下载
# 路径：绘图按钮 → 导出为 → PNG... → 导出 → 保存（手动操作）
# 文件保存位置："设备"，默认下载到 ~/Downloads/未命名绘图.drawio.png

# Step 8：下载完成后手动移动到桌面（可选）
# Bash:
#   mv ~/Downloads/未命名绘图.drawio.png ~/Desktop/流程图.png
```

> **注意**：
> - draw.io 是重量级 Web 应用，首次加载可能需要等待 10-30 秒
> - 如果页面之前已有未保存的编辑，导航到新 URL 会弹出"放弃更改"确认框，需先点击关闭
> - 导出流程：**绘图按钮 → 导出为 → PNG... → 导出 → 保存**，用 `take_snapshot` 逐级定位 uid
> - 图片最终统一保存到桌面：思维导图 → `~/Desktop/思维导图.png`，流程图 → `~/Desktop/流程图.png`
> - 若需调整导出尺寸或格式（JPEG/WebP/SVG/PDF/HTML/XML 等），在导出对话框中修改选项
