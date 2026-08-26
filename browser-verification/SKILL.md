---
name: browser-verification
description: >-
  当需要对前端页面进行浏览器端验证时使用，包括视觉验收截图、交互验证、网络请求检查、控制台错误排查、DOM 与可访问性检查。
  用户提到"验证页面""检查页面""验收""截图对比""浏览器验证""页面验收"等场景必须触发。
  Chrome 浏览器操作默认使用 chrome-mcp-server（chrome_ 前缀），不可用时回退到 chrome-devtools-mcp。
  也由 page-development-workflow Phase 5 引用，用于 UI 手动验收。
  不适用于纯代码修改、纯后端接口测试、不需要浏览器的任务。
---

# 浏览器页面验证

通过 Chrome MCP 工具对前端页面进行系统化验证，覆盖视觉、交互、网络、控制台和 DOM 五个维度。

## HARD-GATE

以下规则无例外：

1. **先确认可用** — 调用任何 Chrome 工具前，必须先确认 `chrome-mcp-server` 可用（调用 `get_windows_and_tabs` 验证），不可用时回退到 `chrome-devtools-mcp`
2. **默认 chrome-mcp-server** — 涉及浏览器操作时默认使用 `chrome-mcp-server`（工具前缀 `chrome_`），仅在其不可用或不支持所需操作时才回退到 `chrome-devtools-mcp`（工具前缀 `mcp_chrome_devtoo_`）
3. **证据落盘** — 截图和日志必须保存到指定目录，不能只口头描述结果
4. **先导航再操作** — 操作前必须确保已在目标页面

## 触发判断

### 使用本技能

- 用户说"验证页面""检查页面""验收""截图对比""浏览器验证"
- 页面开发完成后做视觉验收
- 排查页面交互问题
- 检查接口请求是否正常
- 检查控制台错误
- 验证 DOM 结构或可访问性
- `page-development-workflow` Phase 5 引用

### 不使用本技能

- 纯代码修改、lint、typecheck、单元测试
- 纯后端接口测试（无前端页面）
- 不需要浏览器的代码审查或静态分析

## 验证流程

```text
Phase 0 前置检查 — 确认 Chrome 工具可用、页面 URL 可达
  ↓
Phase 1 视觉验收 — 多视口截图、关键元素截图
  ↓
Phase 2 交互验证 — 点击、填表、导航等关键用户路径
  ↓
Phase 3 网络请求 — 接口捕获、响应字段检查
  ↓
Phase 4 控制台与性能 — 错误日志、性能指标
  ↓
Phase 5 DOM 与可访问性 — 结构检查、a11y
  ↓
Phase 6 证据汇总 — 截图、日志、清单落盘
```

## 按需读取 references

| 文件 | 何时读取 |
|------|----------|
| `references/chrome-mcp.md` | 首次使用 Chrome MCP 工具时，查看工具列表和用法 |

## Phase 0：前置检查

### 目标

确认 Chrome 工具可用、目标页面可访问。

### 步骤

1. 调用 `get_windows_and_tabs` 确认 Chrome 插件连接正常
2. 如果工具返回 `Tool ... is currently disabled by the user`，说明 `chrome-mcp-server` 工具被禁用，需要先激活 fallback 工具组
3. 如果 `get_windows_and_tabs` 等工具处于 fallback 状态（未激活），调用 `activate_fallback_mcp_chromemcpserv_*` 激活全部工具
4. 如果页面 URL 已知，调用 `chrome_navigate` 导航到目标页面
5. 确认页面加载完成，无白屏或 404

### 工具禁用（fallback）排查

当 `chrome-mcp-server` 的工具在新会话中处于未激活/禁用状态时：

1. **临时激活**：调用 `activate_fallback_mcp_chromemcpserv_*` 系列工具一次性激活全部 23 个工具
2. **永久解决**：在 VS Code `settings.json` 中添加：
   ```json
   "chat.mcp.disabledTools": {
     "chrome-mcp-server": []
   }
   ```
   配合 `"chat.mcp.autostart": "newAndOutdated"` 和 `"chat.permissions.default": "autoApprove"` 可确保后续会话不再被禁用

### 失败处理

- `chrome-mcp-server` 不可用 → 回退 `chrome-devtools-mcp`，使用 `mcp_chrome_devtoo_list_pages` + `mcp_chrome_devtoo_navigate_page`
- 页面不可达 → 提示用户检查本地服务是否启动、URL 是否正确

## Phase 1：视觉验收

### 目标

通过截图验证页面视觉表现符合预期。

### 步骤

1. 确定需要检查的视口尺寸（如 375px 移动端、1920px 桌面端）
2. 调用 `chrome_screenshot` 截取全页截图
3. 对关键 UI 元素（卡片、按钮、表单、弹窗）使用元素截图
4. 保存截图到 `assets/screenshots/` 目录

### 检查项

- 布局是否错位、溢出
- 颜色、字体、间距是否与设计稿一致
- 空状态、加载态、错误态是否正确展示
- 不同视口下的响应式表现

## Phase 2：交互验证

### 目标

验证关键用户路径可正常操作。

### 步骤

1. 使用 `chrome_get_interactive_elements` 获取页面可交互元素
2. 按用户路径依次操作：点击按钮、填写表单、切换 Tab
3. 每次操作后检查页面状态变化是否正确
4. 对弹窗使用 `chrome_handle_dialog` 处理

### 检查项

- 按钮点击是否触发正确行为
- 表单输入、校验、提交是否正常
- 导航、Tab 切换是否正确
- 弹窗打开/关闭是否正常
- 防重复提交是否生效

## Phase 3：网络请求验证

### 目标

验证页面发出的接口请求正确。

### 步骤

1. 调用 `chrome_network_capture_start` 开始捕获
2. 执行触发请求的操作
3. 调用 `chrome_network_capture_stop` 停止捕获
4. 检查请求 URL、方法、参数、响应状态码

### 检查项

- 请求 URL 和方法是否正确
- 请求参数是否完整
- 响应状态码是否 200
- 响应数据关键字段是否存在

## Phase 4：控制台与性能

### 目标

检查控制台错误和页面性能。

### 步骤

1. 调用 `chrome_console` 获取控制台日志
2. 筛选 error 和 warn 级别日志
3. 检查是否有未捕获的异常

### 检查项

- 无 JavaScript 运行时错误
- 无 404 资源加载失败
- 无 React/Vue 等框架警告
- 无接口请求失败日志

## Phase 5：DOM 与可访问性

### 目标

检查 DOM 结构和可访问性。

### 步骤

1. 调用 `chrome_get_web_content` 获取页面内容
2. 检查关键 DOM 元素是否存在
3. 检查 alt 属性、aria 标签、语义化 HTML

### 检查项

- 关键元素存在且正确渲染
- 图片有 alt 属性
- 表单有 label 关联
- 按钮有可辨识文本

## Phase 6：证据汇总

### 目标

将验证结果整理为可追溯的证据。

### 步骤

1. 汇总各阶段截图路径
2. 记录关键发现和问题
3. 保存验证清单到 `assets/screenshots/verification.md`

### 清单模板

```markdown
# 浏览器验证报告

## 基本信息
- 页面 URL：
- 验证时间：
- 视口尺寸：

## 视觉验收
- [ ] 全页截图：`assets/screenshots/fullpage.png`
- [ ] 关键元素截图：...
- 发现：...

## 交互验证
- [ ] 用户路径 1：...
- 发现：...

## 网络请求
- [ ] 接口列表：...
- 发现：...

## 控制台
- [ ] 错误数：0
- 发现：...

## DOM 与可访问性
- [ ] 关键元素检查：...
- 发现：...
```

## Tool mapping

| 场景 | chrome-mcp-server | chrome-devtools-mcp (回退) |
|------|-------------------|---------------------------|
| 列出标签页 | `get_windows_and_tabs` | `mcp_chrome_devtoo_list_pages` |
| 导航 | `chrome_navigate` | `mcp_chrome_devtoo_navigate_page` |
| 截图 | `chrome_screenshot` | `mcp_chrome_devtoo_take_screenshot` |
| 获取页面内容 | `chrome_get_web_content` | `mcp_chrome_devtoo_take_snapshot` |
| 获取交互元素 | `chrome_get_interactive_elements` | `mcp_chrome_devtoo_take_snapshot` (verbose) |
| 点击元素 | `chrome_click_element` | `mcp_chrome_devtoo_click` |
| 填表 | `chrome_fill_or_select` | `mcp_chrome_devtoo_fill` |
| 控制台 | `chrome_console` | `mcp_chrome_devtoo_list_console_messages` |
| 网络捕获 | `chrome_network_capture_start/stop` | `mcp_chrome_devtoo_list_network_requests` |
| 执行 JS | `chrome_javascript` | `mcp_chrome_devtoo_evaluate_script` |
| 键盘输入 | `chrome_keyboard` | `mcp_chrome_devtoo_press_key` |
