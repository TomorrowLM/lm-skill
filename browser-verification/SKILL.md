---
name: browser-verification
description: >-
  当需要对前端页面进行浏览器端验证时使用，包括视觉验收截图、交互验证、网络请求检查、控制台错误排查、DOM 与可访问性检查。
  用户提到"验证页面""检查页面""验收""截图对比""浏览器验证""页面验收"等场景必须触发。
  当任务要求 AI 结合截图识别页面结构、对照 DOM、通过 MCP 采集或避免漏识别元素时同样触发。
  页面采集默认使用项目内最新的 front-automation-mcp；旧 Chrome MCP 仅保存在 references/cache 中。
  也由 page-development-workflow Phase 5 引用，用于 UI 手动验收。
  同时适用于页面结构采集、交互测试、回归验证和后续自动化流程设计；测试或自动化执行必须沿用同一套截图、DOM、风险和证据闭环。
  不适用于纯代码修改、纯后端接口测试、不需要浏览器的任务。
---

# 浏览器页面验证

通过 front-automation-mcp 对前端页面进行系统化验证，覆盖视觉、交互、网络、控制台和 DOM 五个维度。

## HARD-GATE

以下规则无例外，即使用户要求“只要结构”“手动推断”“相信工具返回”或“跳过截图”：

1. **先确认可用** — 先调用 `connect_browser`，再调用 `list_pages` 确认已登录页面和 `page_index`
1a. **多 Chrome 必须按 CDP 端点隔离** — `page_index` 只表示同一 CDP 端点下的页面，不代表 Chrome 窗口。发现多个 Chrome/CDP 时必须记录每个 `cdp_url`，分别连接、分别 `list_pages`，禁止在一个会话中混用；切换端点后必须重新确认页面和登录态。
1b. **不得干扰正常 Chrome** — 启动采集浏览器只能使用独立 CDP 端口和独立临时 profile；禁止退出、重启、复用或覆盖用户正常 Chrome 及其 profile。端口已占用时只连接并核验，不得强制启动或关闭进程。
1c. **启动后必须打印浏览器标识** — 启动成功后必须输出 `{ "browserLabel": "Chrome-{port}", "cdpUrl": "http://127.0.0.1:{port}" }`，并在后续证据中沿用该标识；不能只报告“已启动”。
1d. **当前聊天端点复用规则** — 不读取或假设另一个聊天窗的 MCP 会话状态；只探测当前 MCP 配置的 CDP 端点。调用 `launch_login_browser` 前先按实际监听地址探测 `/json/version`（macOS 同一端口可能分别监听 `[::1]` 和 `127.0.0.1`），端点可达就返回实际 `cdpUrl`、`reused:true` 并执行 `connect_browser`，端点不可达且端口空闲才启动；端口占用但不是可达 CDP 时停止并报告。`list_pages=[]` 只表示该端点当前没有页面，不能据此再次启动 Chrome。
2. **默认 front-automation-mcp** — 页面采集和交互验证统一使用项目内最新的 `front-automation-mcp`；旧 MCP 只保存在 `references/cache/legacy-mcp.md`。
3. **证据落盘** — 截图和日志必须保存到指定目录，不能只口头描述结果
4. **先导航再操作** — 操作前必须确保已在目标页面
4a. **登录重定向默认阻塞，明确授权后允许认证前置** — 业务页导航后若 URL path 为 `/login`，或页面明确显示登录页，默认提示用户“业务页已重定向到 `/login`，已跳过当前页面验证”，并将范围标记为 `blocked`/`auth-required`。只有用户明确授权使用已提供的凭据时，AI 才能先通过 `inspect_dom`/截图识别登录控件，再调用 MCP 的通用 `fill_text_control`、`click_visible_control`、`select_visible_option` 完成一次认证前置；登录页不写入业务结构，认证成功后必须重新确认目标 route、DOM 和截图，再继续业务页面验证。MCP 不识别或硬编码登录字段、组织名称和业务流程。
4a.1. **认证数据隔离** — 账号、密码、验证码等敏感值只能作为 MCP 工具调用参数传入；默认使用 `sensitive=true`，不得出现在截图说明、原始日志、验证 JSON、异常文本或最终报告中。MCP 只返回脱敏长度/存在性摘要，验证码不由 MCP 自动获取。
4b. **强制逐层递归门控** — 任何页面验证或结构采集都必须建立待处理队列，按“菜单 → page → 外层 Tab → 内层 Tab → 业务按钮/表格行操作 → Dialog/Drawer 或详情页 → 详情页内部节点”逐层处理；完成子节点后必须回到父层重新确认并继续兄弟节点。只完成菜单、page 或 Tab 不算完成；队列未清空前禁止输出“验证完成”或最终 `verified` JSON。
4c. **双重验证门控** — 任何节点标记 `verified` 前必须同时满足：第一重为截图/视觉与 DOM 的候选对账，第二重为 MCP 实际操作后的状态证据（激活态、内容变化、URL、弹层、滚动结果或其他适用结果）。只有单次快照、DOM 命中、截图识别或工具返回的节点只能标记 `partial`/`unverified`。
4d. **最终输出门控** — 输出最终报告或 JSON 前必须列出 `scope`、`visitedNodes`、`pendingNodes`、`unverifiedNodes`、`blockedNodes` 和 `evidence`；存在待处理、未验证或阻塞节点时，只能输出部分结果并明确原因，不能把结构发现结果冒充验证完成。
4e. **业务控件递归门控** — 每个 page、Tab、Dialog、Drawer 和表格区域都必须建立独立控件台账。低风险详情/查看/编辑入口必须至少验证一个代表实例的后续状态；会改变 route 的入口要递归采集详情页，会打开覆盖层的入口要递归采集 Dialog/Drawer。高风险导入、导出、新增、保存、提交、删除、发布不点击，但必须写入 `record-only` 台账并带定位、风险和未执行原因；台账未收口时父节点只能是 `partial`/`unverified`。
4f. **滚动与视口验证门控** — 所有滚动、切换后的视口复位、内部容器、表格/列表懒加载和滚动后的复采都必须遵循下方“滚动与视口验证”章节；滚动范围未收口时禁止标记节点为 `verified`。
4g. **重复模板抽样门控** — 重复卡片、统计组件、列表行或相同控件必须先全部发现并按模板分组；确认结构、交互、权限、风险和状态行为一致后，只解析代表实例，其余保留实例定位、数量和覆盖范围。标题、Tab、Tooltip、权限、路由、数据状态或子控件有差异时必须拆成变体单独处理；不能把代表实例的证据冒充所有实例都已 `verified`。
5. **MCP 操作必须闭环验证** — 工具返回成功不等于页面状态成功；Tab/菜单点击后必须确认激活状态、内容变化和截图。
6. **弹层必须实测** — 低风险按钮需点击后检测 Dialog/Drawer；保存、提交、删除、导出等高风险控件只记录不点击。
7. **可操作控件必须按风险闭环** — 页面按钮、Tab、表格行操作、Switch、详情/编辑入口都要进入当前节点台账并分类；低风险控件按代表实例触发并检测后续 Dialog/Drawer 或 route，可能进入详情页的按钮不能只记录文字；高风险控件只记录但不能遗漏。未触发、未检测到后续状态或没有明确排除原因时必须标记 `unverified`。
9. **图片不能代替 DOM** — 截图/AI 视觉分析只负责发现候选区域、文字和控件；每个视觉候选都必须在 DOM 中查找、定位、分类并与截图核对。找不到对应 DOM 时不得静默跳过，必须继续检查滚动容器、iframe、Shadow DOM、Vue/React/qiankun 子应用和非标准元素，仍找不到才记录 `visual-only`/`unverified` 及原因。
10. **DOM 候选不能静默丢弃** — `body.innerText`、`interactiveCandidates` 或单次快照都不是完整清单；对每个可见 DOM 候选建立台账，至少分类为业务菜单、页面结构、Tab、Dialog/Drawer、按钮/行操作、筛选控件、全局控件或未知。被排除的元素也要有排除原因，不能因 `div`、`li`、无 ARIA、同名文本、图标按钮或结果超过截断数量而跳过。
11. **MCP 是唯一浏览器执行层** — 连接、选页、导航、滚动、查找、控件填充、点击、选项选择、Tab 切换、弹层检测和证据采集均通过最新 `front-automation-mcp`；禁止用截图猜结果、直接 Playwright/CUA 补采或把旧 MCP 当默认路径。AI 负责识别和编排，MCP 只执行通用浏览器原语，不包含业务语义。MCP 返回成功后必须再次检查 URL/激活态/主要内容/截图，闭环失败就标记 `unverified`。
11a. **禁止在 MCP 外新增 Python 自动化处理** — 不得在 `front-automation-mcp` 工程之外新增 Python 浏览器驱动、采集编排、DOM 后处理、路由/按钮硬编码或 JSON 拼装脚本。浏览器操作、结构识别、滚动、交互、证据和结构化 JSON 必须由最新 MCP 工具及其工程内部 collector/serializer 完成；外部只允许发起 MCP 调用并保存 MCP 原始返回。
11b. **通用背景职责分离** — AI 负责从截图、DOM、可访问性和操作前后证据中识别页面层级、控件语义、风险、同名 occurrence、父子关系和下一步调用；MCP 只负责 CDP/page 生命周期、按 AI 提供的可见元数据定位、填充/点击/选择、滚动、快照、路由/指纹/弹层状态和脱敏返回。MCP 不得内置站点 URL、登录字段、组织名称、菜单名称、按钮名称、路由表、业务流程或“自动识别后直接执行”的业务判断。
11c. **通用控件发现回退** — `interactiveCandidates` 不足时，AI 必须先调用 `find_text_elements`，结合截图、完整渲染文本、tag/class/role、祖先节点、视口可见性和 occurrence 判断目标；不得要求 MCP 为某个业务站点增加专用名称或流程分支。无法确认目标时记录 `visual-only`/`dom-verified`/`unverified`，而不是猜测点击。
12. **用户问句先答后改** — 用户提出“是否重复”“之前是否放在 button”“为什么缺少”等问题时，先解释当前页面/JSON 事实、原因和拟议结构；涉及修改 JSON、代码或技能时，先取得确认，不能把问句自动当成修改授权。
14. **按钮是否进入详情由 AI 判定** — 导入、导出、新增、保存、提交、删除等默认只记录；只有 AI 根据截图、DOM、风险和用户意图判断某个按钮可能进入低风险详情页/向导且确需验证时，才执行一次代表性点击。查看、编辑等也不能机械地全部点击或全部跳过。
16. **自定义 Tab 要区分证据状态** — 带数量徽标的 `div`、`filterItem`、无 ARIA 控件仍可能是业务 Tab。用截图、`find_text_elements`、完整渲染文本、class 和点击结果联合判断；DOM 命中但 `switch_tab` 无法激活时使用 `dom-verified`/`interaction-unavailable`，不能写成 `verified`。
17. **表格不能按 HTML 标签漏采** — `button`、`a`、`div`、`span.textBtn`、`operation-btn` 和无 ARIA 元素都要进入候选台账；`interactiveCandidates` 不足时继续查 `domCandidates`、`find_text_elements`、iframe 和嵌套滚动区域。
18. **采集、测试、自动化分层** — 采集模式先建立结构和权限候选清单，但仍必须执行菜单、page、Tab、业务按钮、表格行操作、Dialog/Drawer 和详情页的逐层导航与证据复核；测试模式才执行额外的低风险代表性交互；自动化模式只能使用已验证的 route、selector、Tab 层级和风险策略。未完成截图/DOM/状态闭环的元素不得进入可执行自动化步骤，只能标记 `unverified` 或 `planned`。
19. **逐层验证是所有浏览器验证任务的通用完成门禁** — 不论视觉、交互、网络、控制台、DOM/a11y、结构采集还是自动化设计，都必须按“枚举当前层 → 逐项验证 → 记录证据 → 回到父层/继续兄弟节点 → 清空待处理队列”执行；一次快照或单次工具返回只能产生候选，不可直接下结论。每个候选最终必须归类为 `verified`、`partial`、`unverified`、`record-only`、`excluded` 或 `blocked` 并带原因；采集专用细节见 `references/collection/collection.md`。

## 滚动与视口验证

滚动验证适用于所有浏览器验证任务，不只适用于结构采集。页面、路由、菜单、Tab、子应用、Dialog/Drawer、详情页、表格、列表、虚拟列表、懒加载和无限滚动都必须按 `references/common/scrolling.md` 执行。

最小门控：每次菜单、路由、Tab、子应用或覆盖层切换后，必须先调用 MCP `scroll_to_top`，检查返回的 `atTop=true`、窗口 `windowScrollY=0` 和内部容器无残余滚动；没有回顶证据时不得截图、采集 DOM 或标记验证。回顶并等待稳定后，再分别检查相关容器的顶部、中部和底部；每次滚动后都要重新做截图、DOM、MCP 状态和候选台账对账。若 `scrollTop` 没有变化，说明滚动未生效，不能把相同展示当作完成；若 `scrollTop` 已变化但截图、DOM 和候选指纹相同，可记录为重复检查点并跳到下一个滚动区域，不重复分析同一展示。若新区域命中已确认的重复模板且没有新变体，可记录实例和覆盖范围，跳过重复递归并继续下一个区域；连续 2–3 次没有新业务结构且没有未分类候选，才可停止滚动；复位、覆盖或复采失败时标记 `unverified`/`blocked`。

## 重复模板与代表性抽样

重复模板适用于所有验证模式，不只适用于采集。具体分组、抽样和输出字段见 `references/common/sampling.md`；抽样只能减少重复递归，不能减少候选发现和差异识别。

## 逐层验证方法论

逐层验证适用于本技能的所有工作模式，不只适用于菜单或 JSON 采集。先按任务定义层级，再逐项闭环，禁止只验证一个代表节点就推断整页或整条链路。

1. **定义层级**：视觉通常是页面 → 区域 → 组件 → 状态；交互通常是路径 → 动作 → 状态转移 → 弹层/页面；网络通常是动作 → 请求 → 响应 → UI 结果；DOM/a11y 通常是根节点 → 容器 → 控件 → 属性。
2. **建立待处理队列**：记录当前层全部候选及父子关系；不能因为快照截断、同名、非标准标签或工具只返回部分结果而静默丢弃。
3. **逐项验证**：对每个候选执行适合该层级的操作或检查，并核对操作前后状态、截图、DOM、URL、网络或控制台证据。
4. **递归推进**：完成当前节点后进入其子节点；子节点完成后回到父节点，确认父层仍有效，再继续下一个兄弟节点。
5. **分类收口**：每个候选必须标记 `verified`、`partial`、`unverified`、`record-only`、`excluded` 或 `blocked`；排除、记录和阻塞都要写原因及已有证据。
6. **完成判定**：预先声明范围后，范围内待处理队列为空且没有未分类候选，才允许输出“验证完成”；否则只能输出部分结果和剩余队列。

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

## 工作模式

- **结构采集**：读取并执行 `references/collection/collection.md`；根技能只负责通用连接、证据和完成门禁。
- **交互测试**：在采集结果基础上，必要时先执行经用户明确授权的认证前置，再执行低风险 Tab、查看详情和可关闭弹层；每次操作都要复核 route、激活态、主内容、截图和 DOM。高风险动作除非用户明确授权，否则只验证“存在性”和权限候选，不实际执行。
- **自动化设计/执行**：读取并执行 `references/automation/automation-testing.md`；只引用已完成双重验证的节点。
- **通用 AI+MCP 编排**：先由 AI 识别和建立控件台账，再把精确文本/metadata、occurrence、page/frame 和风险决策传给 MCP 原语；MCP 返回状态证据后，AI 负责判断是否进入下一层。登录、组织选择、分页、表格行操作和微前端切换都遵循同一模式，不得因为名称熟悉而把业务流程下沉到 MCP。

## 按需读取 references

| 文件 | 何时读取 |
|------|----------|
| `references/common/front-automation-mcp.md` | 首次使用页面采集 MCP、Tab/Dialog/Drawer 或结构化 JSON 时读取 |
| `references/collection/collection.md` | 采集菜单、页面、Tab、Dialog/Drawer 和结构化清单时读取 |
| `references/common/scrolling.md` | 涉及页面、表格、列表、懒加载或嵌套滚动时读取 |
| `references/common/sampling.md` | 涉及重复卡片、列表行、按钮或模板变体时读取 |
| `references/automation/automation-testing.md` | 设计或执行自动化测试、回归测试、无人值守脚本时读取 |
| `references/tests/` | 修改或评估本技能时读取触发、行为和压力测试用例；正常验证任务不读取 |

## Phase 0：前置检查

### 目标

确认 Chrome 工具可用、目标页面可访问。

### 步骤

1. 优先调用 `connect_browser` 连接当前聊天已经启动的 Chrome CDP；只有确认当前端点不可达且端口空闲时，才调用 `launch_login_browser`
2. 调用 `list_pages`，按 URL/title 选择目标页，禁止默认假设第一个标签页正确
3. 如果页面 URL 已知，调用 `navigate_page` 导航到目标页面
4. 确认页面加载完成，无白屏或 404

### MCP 连接失败排查

当 front-automation-mcp 无法连接时，不自动激活旧的 Chrome MCP，也不改用 CUA/直接 Playwright 补采。先检查当前 MCP 进程、CDP 地址、端口和登录页面；区分“端点不可达”“端点可达但 pages 为空”“页面未登录”。仍失败则停止采集并报告阻塞。只有用户明确要求历史兼容验证时，才读取 `references/cache/legacy-mcp.md`，并在结果中标记旧 MCP 来源。

### 失败处理

- 旧 MCP 不再自动回退；如用户明确指定，读取 `references/cache/legacy-mcp.md` 并标记采集来源
- 业务页重定向到 `/login` → 提示用户并跳过当前页面，记录 `blocked`/`auth-required` 和重定向 URL
- 页面不可达 → 提示用户检查本地服务是否启动、URL 是否正确

## Phase 1：视觉验收

### 目标

通过截图验证页面视觉表现符合预期。

### 步骤

1. 确定需要检查的视口尺寸（如 375px 移动端、1920px 桌面端）
2. 调用 `page_snapshot` 通过 front-automation-mcp 截取全页截图并采集可见 DOM
3. 对关键 UI 元素（卡片、按钮、表单、弹窗）使用 `page_screenshot` 或操作后截图
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

1. 使用 `inspect_dom` 获取 DOM 候选；结果不足时用 `find_text_elements` 按文本、class、祖先和 occurrence 补查
2. 按用户路径依次操作：点击按钮、填写表单、切换 Tab
3. 每次操作后检查页面状态变化是否正确
4. 低风险入口使用 `click_and_collect_overlay`；返回后仍需用 `inspect_dom` 和截图确认，不能只信工具返回
5. 操作前先由 AI 判定该控件是权限能力、筛选/取消控件还是高风险动作；导入等按钮默认不点击，只有判断为低风险详情/向导入口时才执行代表性探测

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

1. 先检查当前 front-automation-mcp 是否提供网络捕获工具；有则通过 MCP 开始捕获
2. 执行触发请求的操作并通过 MCP 结束捕获
3. 检查请求 URL、方法、参数、响应状态码；当前 MCP 未提供时记录“网络证据不可用”，不得私自切换旧 MCP

### 检查项

- 请求 URL 和方法是否正确
- 请求参数是否完整
- 响应状态码是否 200
- 响应数据关键字段是否存在

## Phase 4：控制台与性能

### 目标

检查控制台错误和页面性能。

### 步骤

1. 先检查当前 front-automation-mcp 是否提供控制台日志工具；有则通过 MCP 获取
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

1. 调用 `inspect_dom` 获取页面内容；对疑似遗漏的文本或控件用 `find_text_elements` 定位
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

## 证据闭环与双重识别

结构化 JSON 只有在工具返回、操作后 DOM 状态和操作后截图三项证据一致时才能标记 `verified`；否则使用 `unverified`。Tab 点击需验证 active class/aria-selected、内容变化和截图；无 ARIA 子应用控件只允许使用精确文本与 `navItem/tab` class 的受限回退。低风险按钮点击后必须检测 Dialog/Drawer，保存、提交、删除、导出只记录不执行。详细工具说明见 `references/common/front-automation-mcp.md`。

## 页面结构清单标准输出

页面结构采集完成后，统一输出两类产品视角清单：

1. `页面权限结构产品视角.json`：保留完整节点和证据语义，但对菜单层级做产品化归一。
2. `页面权限结构清单.html`：基于同一份产品视角 JSON 生成可编辑、可搜索、可筛选的页面结构树。

可复用模板位于技能目录：

- `templates/页面权限结构产品视角.template.json`
- `templates/页面权限结构清单.template.html`

生成新项目清单时，先复制模板，再将真实采集结果注入；不得只输出说明文字而缺少结构化文件。

原始采集 JSON 必须保留，不覆盖、不改写。产品视角 JSON 是新增产物，用于解决原始采集根节点、菜单导航项和页面承载节点混用的问题。

### JSON 产品视角结构模板

```json
{
  "mcpVersion": "1.0.0",
  "generatedAt": "2026-09-12T00:00:00+08:00",
  "sourceFiles": ["01-工作简报-mcp.json"],
  "normalizationRules": {
    "menuAsNavigation": true,
    "removeSameNamePageUnderMenu": true,
    "mergeSameNameRootMenus": true,
    "preserveRawSource": true
  },
  "productStructure": [
    {
      "id": "01-工作简报-mcp.json:$.menu",
      "type": "menu",
      "name": "工作简报",
      "route": {
        "path": "/an/home",
        "fullUrl": "https://example.test/an/home"
      },
      "status": "partial",
      "description": "菜单及其页面能力说明。",
      "source": {
        "sourceFile": "01-工作简报-mcp.json",
        "rawPaths": ["$.menu"],
        "originalType": "menu",
        "evidenceRefs": []
      },
      "children": []
    }
  ],
  "unclosedItems": []
}
```

### 菜单语义归一规则

- `menu` 表示产品侧导航菜单，不仅表示最顶层菜单。
- 菜单下直接承载导航入口的 `page` 节点，产品视角统一转为 `menu`；例如“业务工作”下的“远程监管”“工作分配管理”。
- 菜单与直接子 page 同名时，不重复展示 page；将该 page 的子节点提升到 menu 下。
- 多个采集文件产生同名、同类型的根菜单时合并为一个产品菜单，并保留各节点的 `source` 信息。
- `tab`、`action`、`dialog` 继续按原层级保留，不因展示方便删除节点。
- 原始采集中的 `root` 仅是采集上下文时，不自动当作产品菜单；必须结合截图、DOM、路由和菜单导航证据判断。
- 产品清单中的每个节点必须保留：`id`、`type`、`name`、`route`、`status`、`description`、`source`、`children`。

### HTML 清单模板

HTML 清单必须包含以下固定区域：

```text
页面权限结构清单                         [导出 JSON] [导出 Excel]
产品视角说明、节点总数

[搜索节点名称、路由或说明] [全部类型] [全部状态] [重置]

页面结构树  节点数                         [＋ 新增节点]
├── 工作简报 [01-工作简报]        menu  编辑  删除
├── 业务工作 [06-业务工作]         menu  编辑  删除
│   ├── 远程监管 [06-业务工作]      menu  编辑  删除
│   └── 消息管理 [07-消息管理]      menu  编辑  删除

右侧节点详情：节点名称、类型、路由 path、验证状态、父级节点、统一说明
```

HTML 行为要求：

- 左侧树与右侧详情双列布局；左侧默认占 55%，右侧占 45%。
- 顶部标题、导出按钮、搜索筛选区和“页面结构树 + 新增节点”标题行固定；仅内容区域滚动。
- 每个节点显示节点名称、来源简称、类型、编辑按钮和删除按钮。
- 搜索必须递归匹配深层节点，并自动展开命中的父级路径。
- “新增节点”固定在页面结构树标题行右侧；新增、编辑和删除均保持树与详情同步。
- 编辑使用弹框，支持名称、类型、路由、验证状态、父级节点和统一说明。
- 删除必须二次确认，并说明会同时删除子节点。
- 导出 JSON 导出当前编辑后的产品视角结构；导出 Excel 至少包含层级路径、节点名称、节点类型、路由 path、验证状态和统一说明。
- 同名节点不得仅靠名称区分，必须显示来源简称，详情中保留完整 `sourceFile` 和 `rawPaths`。

### 图片、DOM 与 MCP 双重识别

每页按以下顺序执行，不得跳步：`截图 → AI 标记候选 → page_snapshot/inspect_dom → 候选台账对账 → find_text_elements 定位 → MCP 操作 → 操作后 DOM + 截图复核 → JSON`。

- AI 看到的菜单、Tab、按钮、弹层、抽屉、表格操作、Switch、图标按钮和懒加载区域，以及 DOM 中看到但截图未标出的元素，都必须进入候选台账；视觉与 DOM 不一致时扩大检查范围。
- 对 `div.navItem`、`li.ivu-menu-item`、无 `role` 控件、重复文本、嵌套菜单和虚拟列表，先用精确文本、可见性、class、祖先容器和 occurrence 定位，禁止使用全局第一个同名节点。
- 滚动与视口覆盖按“滚动与视口验证”章节执行；连续稳定快照只是停止条件之一，任何未分类候选必须保留。
### 自动化前置门槛

自动化脚本生成前必须确认：目标 route 已验证、页面加载稳定、Tab 层级真实存在、定位文本/class/occurrence 已复核、操作风险已分类、预期 transition 已定义。任何一项缺失，都只能输出测试计划或待补证据项，不能直接生成无人值守点击流程。
