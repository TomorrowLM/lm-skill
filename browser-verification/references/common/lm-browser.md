# lm-browser（当前默认 MCP）

路径：`lm-ai-future/front/mcp/lm-browser`（相对仓库上级目录）

启动（在 `lm-ai-future` 仓库根目录执行）：

```bash
uv run --directory front/mcp/lm-browser/python-core python server.py
```

## 外部处理限制

- `lm-browser` 是唯一浏览器自动化和采集执行层。
- 禁止在 MCP 工程外新增 Python 驱动、CDP/Playwright 自动化、DOM 后处理、路由或按钮硬编码、以及 JSON 拼装脚本。
- 采集 JSON 必须来自 MCP 工具或 MCP 工程内部的 collector/serializer；外部调用方只保存 MCP 原始返回和工具已经生成的结构化结果。
- 如果 MCP 能力不足，必须修改 `lm-browser` 内部工具并重新通过 MCP 验证，不能在外部添加补偿脚本。

调用顺序：

```text
connect_browsers（或 connect_browser(cdp_url)）→ list_pages
→ 按完整 URL 精确匹配 browserId/browserLabel/global index
→ wait_until_ready → scroll_to_top(atTop=true)
→ page_snapshot/inspect_dom/page_screenshot
→ 核对 URL、route、readiness 和截图路径 → evidence
→ 有交互时复采 URL/DOM/截图并记录状态变化
```

`connect_browsers` 扫描当前 MCP 主机上可发现的 Chrome/Chromium 默认用户目录和运行进程声明的自定义 `--user-data-dir`，只连接存在有效 `DevToolsActivePort` 的实例。它不会启动浏览器或新建页面。`skipped` 中的 `remote_debugging_not_enabled`、`profile_access_denied` 或 `connection_failed` 表示发现不完整，必须作为 `blocked`/`unverified` 证据记录，指出未接入的实例并提示用户授权远程调试或修复目录权限后重试。此工具不扫描 Safari、Firefox、Edge 或 Brave。

`list_pages` 返回的 `index` 是所有已连接实例和 browser context 的全局索引，可传给 `page_snapshot`、`inspect_dom`、`page_screenshot` 及交互工具；`browserId`/`browserLabel` 用于保留来源。用户要求检查已打开页面时，先按完整 URL 精确匹配；未命中就停止并报告，不得改用第一个 tab，也不得调用 `open_browser_page` 或 `navigate_page`。只有用户或已确认的验收步骤明确要求进入新 route 时，才导航。

本 MCP 同时服务三种模式：

- 结构采集：建立菜单、页面、Tab、Dialog、Drawer、权限按钮和表格操作清单。
- 交互测试：只执行已获准的低风险代表性交互，并验证 route、激活态、主内容、截图和 DOM。
- 自动化设计/执行：只使用已完成双重验证的 route、定位方式、Tab 层级、occurrence 和风险策略；未验证节点只能进入待补证据队列。

当前工具按职责分组：

- 连接与页面：`connect_browser`、`connect_browsers`、`list_pages`、`open_browser_page`、`launch_login_browser`、`navigate_page`、`wait_until_ready`。
- 页面证据：`page_snapshot`、`page_screenshot`、`inspect_dom`、`scroll_to_top`、`scroll_page`、`collect_page_structure`、`collect_navigation_tree`、`collect_tab_variants`、`validate_view`。
- 通用交互：`find_text_elements`、`fill_text_control`、`click_visible_control`、`select_visible_option`、`switch_tab`、`enumerate_navigation`、`click_navigation_item`、`click_and_collect_overlay`、`close_overlay`。

当前工具没有网络请求捕获或控制台日志查询能力。验收项需要这些证据时，不得切换到其他浏览器 MCP、Chrome DevTools 或直接 CDP；应按 `#10` 记录为 `unverified`/`blocked`，或由用户选择手动验收方式。

工作流工具：`collect_navigation_tree`、`collect_tab_variants`。优先使用工作流工具，不要在 MCP 工程外编写 Python 循环或 JSON 后处理。

规则：MCP 返回 `switched: true` 不代表页面真的切换。必须同时确认激活标记/active class、主要内容变化和操作后截图；缺一时标记 `unverified`。`activeTabs` 要按容器去重。用户提出结构疑问时先解释事实和拟议方案，得到确认后再修改 JSON、代码或技能。

Vue/React/qiankun 的无 ARIA Tab 只能使用“可见、精确文本、class 含 `navItem`/`tab`/`Tab`、非全局导航”的受限回退，禁止点击全局同名文本的第一个结果。

所有可操作控件（页面按钮、Tab、表格行操作、Switch、详情/编辑入口）都要先做风险分类。导入、导出、新增、保存、提交、删除等默认只记录；只有 AI 根据截图、DOM、用户意图判断为低风险详情/向导入口且确需验证时，才点击代表性实例。低风险控件至少触发一个可见代表实例并检测 Dialog/Drawer；记录标题、route、正文摘要和内部按钮。未触发或未检测到后续状态时必须标记 `unverified`，采集完成后关闭弹层并确认页面恢复。

长页面采用增量滚动和稳定指纹去重；连续 2–3 次没有新结构或业务控件时停止。侧边栏、全局入口、筛选条件、查询、清除/重置、取消、分页和浮动客服不写入业务按钮，只保留排除原因。

## 权限结构与嵌套 JSON

- 实际 Tab 使用 `type: "tab"` 放在当前节点 `children`；`buttons` 只放权限按钮、Switch 和表格操作。`button.scope: "tab"` 只表示按钮属于某个 Tab，不能把同一个实际 Tab 同时写到两个位置。
- 每次切换父 Tab 或进入新 route 后重新截图和枚举子结构，不能复制历史页面 Tab 名称。嵌套关系要如实表达，例如“监管工作台 → 检查单 → 状态 Tab”。
- 带数量徽标的自定义 `div`/`filterItem` 可能是业务 Tab。使用 `find_text_elements` 时保留完整渲染文本、class 和祖先结构；DOM 命中但 `switch_tab` 无法激活时记录 `dom-verified` 与 `interaction-unavailable`，不能伪造为 `verified`。
- 表格中的 `button`、`a`、`div`、`span.textBtn`、`operation-btn` 和无 ARIA 控件都必须检查，不能只依赖 `interactiveCandidates`；必要时继续查 `domCandidates`、`find_text_elements`、iframe 和嵌套滚动区域。
- `verified` 表示截图 + DOM + 交互闭环；`dom-verified` 表示截图 + DOM 已确认但交互未完成；`unverified` 表示证据不足。

父菜单采集必须先枚举全部可见子菜单，再逐个导航、采集 DOM/截图并写入 JSON；不能只采当前已打开的子页面。子菜单路由失效或返回 404 时仍保留名称和路由，并标记 `unverified` 与失败证据。

## 视觉与 DOM 对账规则

- 截图/AI 视觉分析只提出候选；每个视觉候选必须由 `page_snapshot`/`inspect_dom` 或 `find_text_elements` 定位确认。视觉上存在但 DOM 暂未找到时，继续检查滚动容器、iframe、Shadow DOM、Vue/React/qiankun 子应用和非标准元素，不能静默丢弃。
- `body.innerText`、`interactiveCandidates` 和单次快照都可能截断，不能当作完整 DOM 清单。对每个可见候选建立台账并分类；被排除的筛选、全局、侧边栏元素也要记录排除理由。
- `div.navItem`、`li.ivu-menu-item`、无 ARIA 控件、图标按钮、重复文本和嵌套菜单必须用可见性、精确文本、class、祖先容器和 occurrence 定位；禁止点击全局第一个同名节点。
- MCP 的每次成功返回都必须用操作后 URL/激活态/主要内容/截图复核；不一致标记 `unverified`。

任何页面的编辑、查看详情、配置等入口都适用上述规则；不能只因为 DOM 中出现按钮文本就声称弹层已采集。
