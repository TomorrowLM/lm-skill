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

### 案例 2：图表生成（思维导图 / 流程图 / 其他）

根据不同的图表类型选择不同的 MCP 工具。

#### 选型指南

| 图表类型 | 推荐 MCP | 理由 |
|----------|----------|------|
| **思维导图**（知识分层、大纲、头脑风暴）| `mind-map` | 最轻量，纯 Markdown 输入，一步生成 HTML |
| **流程图**（业务流程、算法逻辑、状态机）| `drawio-mcp` + Mermaid | Mermaid `flowchart` 语法简洁，支持分支/循环 |
| **时序图 / 类图 / ER 图 / 甘特图 / 饼图** | `drawio-mcp` + Mermaid | 一行语法声明，不下十种类型覆盖 |
| **复杂图表**（泳道图、架构图、网络拓扑）| `drawio-mcp` + XML | 支持容器/嵌套/泳道/专业图标（AWS、Cisco 等）|
| **从表格数据生成图表**（组织架构等）| `drawio-mcp` + CSV | draw.io CSV 导入格式，自动布局 |

#### 场景 A：思维导图 — `mind-map.convert_markdown_to_mindmap`

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

#### 场景 B：流程图 / 时序图 / 其他 — `drawio-mcp.open_drawio_mermaid`

用 Mermaid 语法声明图表，在 draw.io 编辑器中在线预览和编辑。

**流程图示例：**

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

**时序图示例：**

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

#### 场景 C：复杂图表 — `drawio-mcp.open_drawio_xml`

当需要泳道图、容器嵌套、专业图标（AWS/GCP/Cisco）时，使用 draw.io XML 格式。

```plaintext
CallMcpTool:
  server_name: "drawio-mcp"
  tool_name: "open_drawio_xml"
  arguments:
    content: "<mxGraphModel>...</mxGraphModel>"
```

> AI 会自动生成准确的 XML，包含节点坐标、样式、容器层级和边连接。

#### 场景 D：导出为图片 — `chrome-devtools.take_screenshot`

以上任意工具生成的图表都可截图保存为图片。

**对 `mind-map`（HTML 文件）：**

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

**对 `drawio-mcp`（在线编辑器）：**

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

### 案例 3：Figma 设计稿 → Framelink Figma MCP Server

当用户提供 Figma 设计稿链接时，使用以下工具获取 UI 数据。

#### get_figma_data

获取 Figma 文件的布局、内容、视觉样式和组件信息。

**参数：**

| 参数 | 说明 |
|------|------|
| `fileKey` | Figma 文件 key，从 URL 中提取 |
| `nodeId` | 可选，指定节点 ID |

**URL 格式：** `figma.com/(file|design)/<fileKey>/...`

**示例：**

```plaintext
CallMcpTool:
  server_name: "Framelink MCP for Figma"
  tool_name: "get_figma_data"
  arguments:
    fileKey: "abc123"
    nodeId: "123:456"
```

> 用途：获取页面布局结构、组件层级、样式属性（颜色、字体、间距等）

#### download_figma_images

下载 Figma 文件中的 SVG/PNG 图片资源。

**参数：** `fileKey`、`nodes`（节点数组）、`localPath`（保存路径）

> 用途：下载图标、插画等图片资源到项目中

#### 示例流程

```
用户提供: https://www.figma.com/design/abc123/设计稿?node-id=123:456
↓
提取 fileKey='abc123', nodeId='123:456'
↓
调用 get_figma_data 获取 UI 布局、样式、组件信息
↓
根据设计数据实现页面 UI
```

### 案例 4：Agent 编排 — agent-orchestrator-mcp

当需要将复杂任务拆分为多个独立子任务并行执行时，使用 `agent-orchestrator-mcp` 工具链完成编排。

#### 工具清单

| 工具 | 角色 | 说明 |
|------|------|------|
| `agent_create_task` | 主 Agent | 创建单个编排任务 |
| `agent_create_tasks` | 主 Agent | 批量创建多个编排任务 |
| `agent_list_tasks` | 主 Agent | 列出工作区任务，可按状态过滤 |
| `agent_get_task` | 主 Agent | 获取单个任务详情 |
| `agent_open_task_chats` | 主 Agent | 为任务生成 Prompt 并通过 VS Code CLI 打开子聊天窗口 |
| `agent_wait_for_tasks` | 主 Agent | 阻塞等待多个任务完成（轮询状态 + 结果文件） |
| `agent_poll_tasks` | 主 Agent | 非阻塞查看多个任务当前状态 |
| `agent_complete_task` | 子 Agent | 写入结果并标记任务完成 |
| `agent_read_task_result` | 主 Agent | 读取已完成任务的结果文件 |
| `agent_mark_task_reviewed` | 主 Agent | 审查通过后标记任务为已审查 |
| `agent_request_rework` | 主 Agent | 结果不合格时标记返工 |
| `agent_summarize_results` | 主 Agent | 读取多个任务结果并合并为汇总文本 |

#### 完整编排流程

```
Phase 3 产出子任务规格
       ↓
Step 1: agent_create_tasks   → 批量创建任务，返回 taskIds
       ↓
Step 2: agent_open_task_chats → 生成 Prompt 文件 + 打开子聊天窗口
       ↓                          （任务状态自动变为 running）
Step 3: agent_wait_for_tasks  → 阻塞等待所有子任务完成
       或 agent_poll_tasks    → 非阻塞查看进度
       ↓
Step 4: agent_summarize_results → 合并所有结果
       ↓
Step 5: 逐条审查
       ├─ 通过 → agent_mark_task_reviewed
       └─ 不通过 → agent_request_rework → 重新等待
```

#### Step 1：创建任务

主 Agent 根据 Phase 3 的子任务规格创建任务。推荐批量创建：

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_create_tasks"
  arguments:
    tasks:
      - title: "共享层：类型定义 + API 服务"
        prompt: "根据 spec/shared-layer-spec.md 创建类型定义和 API 服务层..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/shared-layer-spec.md"
      - title: "列表页实现"
        prompt: "根据 spec/list-page-spec.md 实现列表页..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/list-page-spec.md"
      - title: "详情页实现"
        prompt: "根据 spec/detail-page-spec.md 实现详情页..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/detail-page-spec.md"
```

> 返回每个任务的 `id`、`promptFile`、`resultFile`。`resultFile` 未指定时默认写入 `.agent-results/task-<uuid>.md`。

#### Step 2：打开子聊天窗口

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds:
      - "task-<uuid-1>"
      - "task-<uuid-2>"
      - "task-<uuid-3>"
```

> 服务端会为每个任务生成 `.agent-orchestrator/prompts/task-<uuid>.md`，通过 VS Code CLI 打开 `code chat --mode agent --reuse-window --add-file <promptFile>`，并将状态更新为 `running`。

**执行编排规则：**
- 共享层任务（类型/API）先打开并等待完成，再打开依赖它的页面任务
- 无依赖的页面任务可以一批全部打开

```plaintext
# 第一批：先跑共享层
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer"]

# 等待共享层完成
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_wait_for_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer"]
    timeoutMs: 300000

# 第二批：并行跑页面任务
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
```

#### Step 3：等待或轮询

**阻塞等待（推荐，适合需要统一收口的场景）：**

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_wait_for_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
    timeoutMs: 600000
    pollIntervalMs: 2000
```

> 返回 `completed`、`failed`、`pending` 三组 taskId。超时未完成的任务仍在 `pending` 中。

**非阻塞查看（适合在等待过程中展示进度）：**

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_poll_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
```

> 返回每个任务的状态、结果文件路径、更新时间，以及总数/已完成/失败/待处理汇总。

#### Step 4：汇总结果

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_summarize_results"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer", "task-list-page", "task-detail-page"]
```

> 返回合并后的 Markdown 汇总文本，主 Agent 可直接审查。

#### Step 5：审查与返工

```plaintext
# 审查通过
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_mark_task_reviewed"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-list-page"
    reviewNote: "列表页实现符合规格，类型检查通过"

# 需要返工
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_request_rework"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-detail-page"
    reason: "详情页缺少错误态和空态处理，请补充"
```

> 标记返工后，需要重新 `agent_open_task_chats` → `agent_wait_for_tasks` → 审查。

#### 子 Agent 完成协议

子聊天窗口中的 Agent 在完成任务后应调用 `agent_complete_task`：

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_complete_task"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-list-page"
    result: "## 完成报告\n\n### 创建的文件\n- src/pages/list/index.tsx\n..."
```

> 兼容方式：子 Agent 直接写入 `resultFile`，主 Agent 轮询时会检测结果文件并自动同步为 `completed`。

#### 适用场景

| 场景 | 推荐 |
|------|------|
| 页面开发工作流 Phase 4 多子任务并行 | ✅ 首选 |
| 独立模块调研（多个代码库并行探索） | ✅ |
| 批量代码审查（多个模块同时审查） | ✅ |
| 单文件简单修改 | ❌ 不需要 |
| 紧密耦合的串行任务 | ⚠️ 用内联执行更合适 |

## 注意事项

- 工具输出过大时会被截断（如全量模型数据），通过 `name` 等参数缩小范围
- 部分工具需认证，首次调用失败后告知用户
- `mind-map` 服务通过 `--return-type filePath` 控制返回 HTML 文件路径还是 HTML 内容
