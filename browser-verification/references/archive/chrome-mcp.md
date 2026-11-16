# Chrome MCP Server — mcp-chrome

mcp-chrome 是一个基于 Chrome 插件的 MCP 服务器，可直接操作 AI 已打开的 Chrome 浏览器（复用登录态、配置、用户环境），无需启动独立浏览器进程。

> 项目地址：https://github.com/hangwin/mcp-chrome
> 中文文档：https://github.com/hangwin/mcp-chrome/blob/master/README_zh.md
> 完整工具列表：https://github.com/hangwin/mcp-chrome/blob/master/docs/TOOLS_zh.md

## 适用场景

- 需要与运行中的 Chrome 页面交互（导航、点击、填表、截图）
- AI 需要读取当前浏览器标签页的内容
- 需要捕获网络请求、分析接口响应
- 需要管理书签、浏览历史
- 需要对线上页面做视觉验收、截取 UI 截图
- 需要复用浏览器已有登录态（无需重新登录）

## 部署方式

### 前置条件

1. 从 [Releases](https://github.com/hangwin/mcp-chrome/releases) 下载 Chrome 扩展
2. 全局安装桥接工具：`npm install -g mcp-chrome-bridge`
3. 加载 Chrome 扩展：打开 `chrome://extensions/` → 启用开发者模式 → 加载已解压的扩展程序
4. 点击插件图标 → 连接，即可看到 MCP 配置

### 客户端配置

推荐使用 Streamable HTTP 方式连接：

```json
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

## 可用工具

### 浏览器管理（6 个）

| 工具 | 说明 |
|------|------|
| `get_windows_and_tabs` | 列出所有浏览器窗口和标签页 |
| `chrome_navigate` | 导航到指定 URL，可选创建新窗口、设置视口 |
| `chrome_close_tabs` | 关闭指定的标签页或窗口 |
| `chrome_switch_tab` | 切换到指定的标签页 |
| `chrome_go_back_or_forward` | 浏览器历史导航（后退/前进） |

### 截图和视觉（1 个）

| 工具 | 说明 |
|------|------|
| `chrome_screenshot` | 高级截图，支持元素截图、全页截图、返回 base64 |

### 网络监控（4 个）

| 工具 | 说明 |
|------|------|
| `chrome_network_capture_start` | 使用 webRequest API 开始捕获网络请求 |
| `chrome_network_capture_stop` | 停止网络捕获并返回数据 |
| `chrome_network_debugger_start` | 使用 Debugger API 开始捕获（含响应体） |
| `chrome_network_debugger_stop` | 停止调试器捕获 |
| `chrome_network_request` | 发送自定义 HTTP 请求 |

### 内容分析（4 个）

| 工具 | 说明 |
|------|------|
| `search_tabs_content` | AI 驱动语义搜索，跨标签页搜索内容 |
| `chrome_get_web_content` | 提取网页 HTML 或文本内容 |
| `chrome_get_interactive_elements` | 查找页面上可点击和交互的元素 |
| `chrome_console` | 获取控制台日志消息 |

### 交互操作（3 个）

| 工具 | 说明 |
|------|------|
| `chrome_click_element` | 使用 CSS 选择器点击元素 |
| `chrome_fill_or_select` | 填充表单字段或选择选项 |
| `chrome_keyboard` | 模拟键盘输入和快捷键 |
| `chrome_upload_file` | 上传文件到页面 |
| `chrome_handle_dialog` | 处理浏览器弹窗（alert/confirm/prompt） |
| `chrome_handle_download` | 处理下载事件 |

### 数据管理（5 个）

| 工具 | 说明 |
|------|------|
| `chrome_history` | 搜索浏览器历史记录 |
| `chrome_bookmark_search` | 按关键词搜索书签 |
| `chrome_bookmark_add` | 添加书签 |
| `chrome_bookmark_delete` | 删除书签 |
| `chrome_javascript` | 执行 JavaScript 脚本 |

## 与 Playwright 浏览器的区别

| 对比项 | mcp-chrome | Playwright 浏览器 |
|--------|-----------|-------------------|
| 浏览器进程 | 复用已打开的 Chrome | 需启动独立进程 |
| 登录态 | 自动使用已登录状态 | 需重新登录 |
| 用户环境 | 完整保留用户配置 | 干净环境 |
| 启动速度 | 只需激活插件 | 需启动浏览器进程 |
| 工具命名 | `chrome_*` 前缀 | `*_page` 系列 |

## 典型使用场景

### 1. 视觉验收截图

> **页面开发工作流内使用时：** 截图应保存到当前功能文件夹的 `assets/screenshots/` 目录，便于和设计方案文档一同归档，作为视觉验收证据。

```plaintext
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_screenshot"
  arguments:
    fullPage: true
    storeBase64: true
```

### 2. 导航到指定页面

```plaintext
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_navigate"
  arguments:
    url: "http://localhost:8080/page"
    newWindow: false
```

### 3. 搜索打开的标签页内容

```plaintext
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "search_tabs_content"
  arguments:
    query: "充值套餐"
```

### 4. 捕获网络请求

```plaintext
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_network_capture_start"
  arguments:
    url: "http://localhost:8080"
    maxCaptureTime: 30000
    includeStatic: false
```

### 5. 交互操作（点击、填表）

```plaintext
# 点击元素
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_click_element"
  arguments:
    selector: "#submit-button"

# 填充表单
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_fill_or_select"
  arguments:
    selector: "#email-input"
    value: "user@example.com"
```

### 6. 获取页面内容

```plaintext
CallMcpTool:
  server_name: "chrome-mcp-server"
  tool_name: "chrome_get_web_content"
  arguments:
    format: "text"
    selector: ".main-content"
```

## 注意事项

- 必须先安装 Chrome 扩展并连接，否则调用会失败
- 工具名有 `chrome_` 前缀（如 `chrome_navigate`），与 Playwright 浏览器的工具名不同
- `search_tabs_content` 依赖内置向量数据库和本地小模型，首次使用可能需要初始化索引
- 网络请求捕获使用 Chrome 的 webRequest API 或 Debugger API；Debugger API 可获取响应体

## 故障排查

### 工具被禁用（Tool is currently disabled）

**症状：** 调用 `chrome_*` 系列工具时返回 `Tool ... is currently disabled by the user`

**原因：** VS Code Copilot 在会话中未自动激活 `chrome-mcp-server` 的工具，工具处于 fallback 状态。

**临时解决：** 调用 `activate_fallback_mcp_chromemcpserv_*`（如 `activate_fallback_mcp_chromemcpserv_get_windows_and_tabs`）激活全部 23 个工具。

**永久解决：** 在 VS Code `settings.json` 中配置：

```json
{
  "chat.mcp.disabledTools": {
    "chrome-mcp-server": []
  },
  "chat.mcp.autostart": "newAndOutdated",
  "chat.permissions.default": "autoApprove"
}
```

- `disabledTools` 设空数组表示不禁用该服务器的任何工具
- `autostart: "newAndOutdated"` 确保工具集自动启动
- `permissions.default: "autoApprove"` 自动批准工具调用，避免每次手动确认