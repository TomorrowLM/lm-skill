---
name: browser-verification
description: >-
  当需要对前端页面进行视觉与交互验收、结构采集或自动化回归时使用；也适用于选择复用已有 Tab 或新开 Tab、按 URL 定位目标页面及排查 lm-browser/CDP 连接。网络请求或控制台检查仅在当前 lm-browser 工具支持时执行，否则标记未验证/阻塞。
  用户提到"验证页面""检查页面""验收""截图对比""浏览器验证""页面验收"等场景必须触发。
  当任务要求 AI 结合截图识别页面结构、对照 DOM、通过 MCP 采集或避免漏识别元素时同样触发。
  页面采集默认使用项目内最新的 lm-browser；旧 Chrome MCP 归档于 references/archive。
  也由 page-development-workflow Phase 5 引用，用于 UI 手动验收。
  同时适用于页面结构采集、交互测试、回归验证和后续自动化流程设计；测试或自动化执行必须沿用同一套截图、DOM、风险和证据闭环。
  不适用于纯代码修改、纯后端接口测试、不需要浏览器的任务。
disable-model-invocation: true
user-invocable: true
---

# 浏览器页面验证

通过 lm-browser 对前端页面进行系统化验证，覆盖视觉、交互、路由、DOM 与可访问性。当前 MCP 未提供网络请求捕获和控制台日志工具；不得改用其他浏览器工具补采，应将相关验收项标记为 `unverified`/`blocked` 并说明原因。

## HARD-GATE

以下规则无例外，即使用户要求“只要结构”“手动推断”“相信工具返回”或“跳过截图”：

1. **先确认打开方式，再调用浏览器工具** — 明确目标 URL 和打开方式：`existing-tab`（复用已打开目标页）或 `new-tab`（新开标签）。仅提供 URL 不代表用户选择了哪种方式；意图不清时先询问，并在答复前不调用任何浏览器工具。

- `existing-tab`：有完整 URL 时调用 `connect_browsers(target_url=完整URL)` 并等待结果；无 URL 时调用 `connect_browsers()`，等待完成后再按需 `list_pages`，由用户从实际候选页中确认目标。
- `new-tab`：仅在用户明确选择新开并提供完整 URL 后，先调用 `connect_browsers()` 并等待完成，再调用 `open_browser_page(url)`；随后核对新页完整 URL/route。若没有可用的远程调试实例，标记 `blocked`/`unverified`，不得自动启动另一浏览器。
- 导航已有 Tab 到新地址也必须由用户明确要求；不能用 `navigate_page` 修正错误索引或伪造目标匹配。用户给出明确 CDP 地址或要求连接单个 endpoint 时才使用 `connect_browser(cdp_url)`。
  1a. **优先使用精确目标诊断** — `connect_browsers(target_url)` 返回 `targetDiagnostic` 时，`matched` 使用 `matches` 中的全局 `index`、`browserId` 和 `browserLabel`，无需为单页读取再列出所有标签。`ambiguous` 只能检查返回的匹配项；有多个同 URL 页面且无法凭已有证据区分时，询问用户，不得新开重复页或任选一页。
  1a.1. **区分连接结果** — `attach_failed` 表示已发现远程调试端点但 CDP 附加失败，不得描述成“没有可调试浏览器”；查看 `skipped`，按 MCP 的有界重试结束后仍失败则报告阻塞。`url_mismatch`、`connected_instances_empty` 和 `no_debuggable_instances` 也必须分别按实际含义报告，不能拿别的标签或新页面代替目标。
  1a.2. **校验页面索引新鲜度** — 全局 `index` 只对当前标签集合有效。每次页面级工具返回后检查 `pageUrl`/route；与目标不一致时立即停止该页操作，重新调用 `connect_browsers(target_url=完整URL)` 获取新匹配，再继续。不得用 `navigate_page` 把错误索引导航成目标页面。
  1a.3. **仅在无精确诊断时列页** — `list_pages` 的每项包含 `browserId`、`browserLabel` 和跨实例/contexts 的全局 `index`。仅在没有可用 `targetDiagnostic` 且确需枚举页面时，才按完整 URL 精确匹配；不得默认使用第一个 tab。
  1a.4. **已有 Tab 失败时不得自动切换模式** — `existing-tab` 未命中或目标实例不可读时，标记 `blocked`/`unverified` 并提示用户在可读实例打开目标页后重试；不得自动调用 `open_browser_page`、`navigate_page` 或 `launch_login_browser`。只有用户明确切换到 `new-tab` 或明确要求导航时才执行对应操作。
  1b. **不得干扰正常 Chrome** — `connect_browsers` 和 `connect_browser` 只附加到已允许远程调试的实例，不得退出、重启或覆盖用户 profile。只有验收范围明确需要新浏览器且用户授权时才调用 `launch_login_browser`，并使用独立 CDP 端口和临时 profile。
  1c. **启动后必须打印浏览器标识** — 启动成功后必须输出 `{ "browserLabel": "Chrome-{port}", "cdpUrl": "http://127.0.0.1:{port}" }`，并在后续证据中沿用该标识；不能只报告“已启动”。
  1d. **发现边界与会话隔离** — `connect_browsers` 只搜索当前 MCP 主机可发现且存在有效 `DevToolsActivePort` 的 Chrome/Chromium 用户目录；不会读取另一个聊天窗的 MCP 会话，也不扫描 Safari、Firefox、Edge 或 Brave。检查 `skipped`；存在未启用远程调试或权限错误时报告不完整，不能把已连接实例冒充为全部浏览器；明确告诉用户哪个实例未接入，并提示在该实例允许远程调试后重新连接。

2. **默认 lm-browser** — 页面采集和交互验证统一使用项目内最新的 `lm-browser`；旧 MCP 只保存在 `references/archive/legacy-mcp.md`。
3. **证据落盘** — 截图和日志必须保存到指定目录，不能只口头描述结果
4. **先确认目标 tab 再操作** — 操作前确认选中 tab 的完整 URL/route 与验收目标一致。只有验收步骤明确要求导航时才调用 `navigate_page`；已打开目标 tab 时不得为了“确认”而重复导航。
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
8. **图片不能代替 DOM** — 截图/AI 视觉分析只负责发现候选区域、文字和控件；每个视觉候选都必须在 DOM 中查找、定位、分类并与截图核对。找不到对应 DOM 时不得静默跳过，必须继续检查滚动容器、iframe、Shadow DOM、Vue/React/qiankun 子应用和非标准元素，仍找不到才记录 `visual-only`/`unverified` 及原因。
9. **DOM 候选不能静默丢弃** — `body.innerText`、`interactiveCandidates` 或单次快照都不是完整清单；对每个可见 DOM 候选建立台账，至少分类为业务菜单、页面结构、Tab、Dialog/Drawer、按钮/行操作、筛选控件、全局控件或未知。被排除的元素也要有排除原因，不能因 `div`、`li`、无 ARIA、同名文本、图标按钮或结果超过截断数量而跳过。
10. **MCP 是唯一浏览器执行层** — 连接、选页、导航、滚动、查找、控件填充、点击、选项选择、Tab 切换、弹层检测和证据采集均通过最新 `lm-browser`；禁止用截图猜结果、直接 Playwright/CUA 补采或把旧 MCP 当默认路径。AI 负责识别和编排，MCP 只执行通用浏览器原语，不包含业务语义。MCP 返回成功后必须再次检查 URL/激活态/主要内容/截图，闭环失败就标记 `unverified`。
    11a. **禁止在 MCP 外新增 Python 自动化处理** — 不得在 `lm-browser` 工程之外新增 Python 浏览器驱动、采集编排、DOM 后处理、路由/按钮硬编码或 JSON 拼装脚本。浏览器操作、结构识别、滚动、交互、证据和结构化 JSON 必须由最新 MCP 工具及其工程内部 collector/serializer 完成；外部只允许发起 MCP 调用并保存 MCP 原始返回。
    11b. **通用背景职责分离** — AI 负责从截图、DOM、可访问性和操作前后证据中识别页面层级、控件语义、风险、同名 occurrence、父子关系和下一步调用；MCP 只负责 CDP/page 生命周期、按 AI 提供的可见元数据定位、填充/点击/选择、滚动、快照、路由/指纹/弹层状态和脱敏返回。MCP 不得内置站点 URL、登录字段、组织名称、菜单名称、按钮名称、路由表、业务流程或“自动识别后直接执行”的业务判断。
    11c. **通用控件发现回退** — `interactiveCandidates` 不足时，AI 必须先调用 `find_text_elements`，结合截图、完整渲染文本、tag/class/role、祖先节点、视口可见性和 occurrence 判断目标；不得要求 MCP 为某个业务站点增加专用名称或流程分支。无法确认目标时记录 `visual-only`/`dom-verified`/`unverified`，而不是猜测点击。
11. **用户问句先答后改** — 用户提出“是否重复”“之前是否放在 button”“为什么缺少”等问题时，先解释当前页面/JSON 事实、原因和拟议结构；涉及修改 JSON、代码或技能时，先取得确认，不能把问句自动当成修改授权。
12. **按钮是否进入详情由 AI 判定** — 导入、导出、新增、保存、提交、删除等默认只记录；只有 AI 根据截图、DOM、风险和用户意图判断某个按钮可能进入低风险详情页/向导且确需验证时，才执行一次代表性点击。查看、编辑等也不能机械地全部点击或全部跳过。
13. **自定义 Tab 要区分证据状态** — 带数量徽标的 `div`、`filterItem`、无 ARIA 控件仍可能是业务 Tab。用截图、`find_text_elements`、完整渲染文本、class 和点击结果联合判断；DOM 命中但 `switch_tab` 无法激活时使用 `dom-verified`/`interaction-unavailable`，不能写成 `verified`。
14. **表格不能按 HTML 标签漏采** — `button`、`a`、`div`、`span.textBtn`、`operation-btn` 和无 ARIA 元素都要进入候选台账；`interactiveCandidates` 不足时继续查 `domCandidates`、`find_text_elements`、iframe 和嵌套滚动区域。
15. **采集、测试、自动化分层** — 采集模式先建立结构和权限候选清单，但仍必须执行菜单、page、Tab、业务按钮、表格行操作、Dialog/Drawer 和详情页的逐层导航与证据复核；测试模式才执行额外的低风险代表性交互；自动化模式只能使用已验证的 route、selector、Tab 层级和风险策略。未完成截图/DOM/状态闭环的元素不得进入可执行自动化步骤，只能标记 `unverified` 或 `planned`。
16. **逐层验证是所有浏览器验证任务的通用完成门禁** — 不论视觉、交互、网络、控制台、DOM/a11y、结构采集还是自动化设计，都必须按“枚举当前层 → 逐项验证 → 记录证据 → 回到父层/继续兄弟节点 → 清空待处理队列”执行；一次快照或单次工具返回只能产生候选，不可直接下结论。每个候选最终必须归类为 `verified`、`partial`、`unverified`、`record-only`、`excluded` 或 `blocked` 并带原因；采集专用细节见 `references/modes/collection/collection.md`。

## 滚动与视口验证

页面或覆盖层切换后，先回顶并等待稳定，再检查相关的内部滚动区域；滚动后的内容必须重新采集证据。具体范围、停止条件和失败处理见 `references/common/scrolling.md`。

## 重复模板与代表性抽样

先发现并记录所有实例，再按结构与行为分组；有差异的实例单独验证。抽样只能减少重复递归，不能替代候选发现和差异检查，详见 `references/common/sampling.md`。

## 逐层验证方法论

按任务声明范围并建立候选队列；逐项检查、递归处理子节点，并记录证据与状态。候选只能归为 `verified`、`partial`、`unverified`、`record-only`、`excluded` 或 `blocked`；仅当范围内队列清空且无未分类项时，才可报告完成。采集细节见 `references/modes/collection/collection.md`。

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

先选择工作模式，再按 HARD-GATE 1 确认复用已有 Tab 或新开 Tab。连接成功后核对目标 URL/route，采集截图与 DOM；对目标控件执行获准的低风险操作，并复核操作后的页面状态。网络和控制台证据仅在 lm-browser 明确支持时采集，否则标记 `unverified`/`blocked`。

## 工作模式

- **视觉与交互验收（默认）**：日常页面检查的默认模式，覆盖样式、视口和低风险交互；读取 `references/modes/visual-interaction/verification.md`。涉及 Figma/设计稿时，由 `visual-workflow` verification 模式负责视觉差异判定，lm-browser 提供实际页面截图和 DOM 证据。
- **结构采集（按需）**：页面或控件结构未知、需要盘点时读取 `references/modes/collection/collection.md`；产品视角 JSON/HTML 格式见同目录 `output-format.md`。
- **自动化回归（按需）**：稳定、重复的固定用例可设计为自动化验证；只使用已完成双重验证的 route、定位方式、Tab 层级和风险策略。前置条件与执行协议见 `references/modes/automation/automation-testing.md`。
- **通用 AI+MCP 编排**：先由 AI 识别和建立控件台账，再把精确文本/metadata、occurrence、page/frame 和风险决策传给 MCP 原语；MCP 返回状态证据后，AI 负责判断是否进入下一层。登录、组织选择、分页、表格行操作和微前端切换都遵循同一模式，不得因为名称熟悉而把业务流程下沉到 MCP。

## 按需读取 references

| 文件                                                  | 何时读取                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `references/common/lm-browser.md`                     | 首次使用页面采集 MCP、Tab/Dialog/Drawer 或结构化 JSON 时读取                               |
| `references/modes/collection/collection.md`           | 采集菜单、页面、Tab、Dialog/Drawer 和结构化清单时读取                                      |
| `references/modes/collection/output-format.md`        | 生成产品视角 JSON/HTML 清单时读取                                                          |
| `references/modes/visual-interaction/verification.md` | 执行视觉/交互验收或对照 Figma 时读取                                                       |
| `references/modes/automation/automation-testing.md`   | 设计或执行自动化测试、回归测试、无人值守脚本时读取                                         |
| `references/common/scrolling.md`                      | 涉及页面、表格、列表、懒加载或嵌套滚动时读取                                               |
| `references/common/sampling.md`                       | 涉及重复卡片、列表行、按钮或模板变体时读取                                                 |
| `visual-workflow` 的 `verification` 模式              | 对照 Figma/设计图或回归样式时读取视觉比较标准；本技能只负责浏览器页面、DOM、截图和交互证据 |
| `references/tests/`                                   | 修改或评估本技能时读取触发、行为和压力测试用例；正常验证任务不读取                         |

## Phase 0：前置检查

### 目标

确认 Chrome 工具可用、目标页面可访问。

### 步骤

1. 按 HARD-GATE 1 先确认 `existing-tab` 或 `new-tab`；模式不明确时询问后再继续。
2. `existing-tab` 使用目标 URL 精确连接；`new-tab` 只在用户明确选择且提供完整 URL 后连接可用浏览器，再调用 `open_browser_page(url)`。等待连接工具返回并检查 `connected`、`skipped` 和 `targetDiagnostic`，不得并发枚举页面。
3. `targetDiagnostic.status=matched` 时直接使用唯一 `matches` 项的全局 `index`、`browserId` 和 `browserLabel`；`ambiguous` 仅检查返回匹配项，无法分辨时询问用户。只有无精确诊断且确需枚举时才在连接完成后调用 `list_pages`。
4. 调用 `wait_until_ready`；截图或 DOM 采集前调用 `scroll_to_top` 并确认 `atTop=true`、`windowScrollY=0`、`remainingScrolledContainers=0`。
5. 使用 `page_snapshot`/`inspect_dom` 采集内容；每次页面级工具返回都核对 `pageUrl`/route。不一致时停止并重新解析目标，不得导航错误标签补救。截图保存到指定 `assets/screenshots/` 并记录路径。

### MCP 连接失败排查

当 lm-browser 无法连接时，不自动激活旧的 Chrome MCP，也不改用 CUA/直接 Playwright 补采。先检查当前 MCP 进程、CDP 地址、端口和登录页面；区分“端点不可达”“端点可达但 pages 为空”“页面未登录”。仍失败则停止采集并报告阻塞。只有用户明确要求历史兼容验证时，才读取 `references/archive/legacy-mcp.md`，并在结果中标记旧 MCP 来源。

### 失败处理

- 旧 MCP 不再自动回退；如用户明确指定，读取 `references/archive/legacy-mcp.md` 并标记采集来源
- 业务页重定向到 `/login` → 提示用户并跳过当前页面，记录 `blocked`/`auth-required` 和重定向 URL
- 页面不可达 → 提示用户检查本地服务是否启动、URL 是否正确

## 共用执行闭环

每次页面切换后先复位滚动并等待稳定，再对账截图、DOM 和当前 URL/route。交互只执行经风险判断允许的操作；每次操作后复查 URL、激活态、主要内容及适用的弹层。证据按实际覆盖范围记录，工具成功返回不能单独作为通过依据。

## 证据闭环与双重识别

结构化 JSON 只有在工具返回、操作后 DOM 状态和操作后截图三项证据一致时才能标记 `verified`；否则使用 `unverified`。Tab 点击需验证 active class/aria-selected、内容变化和截图；无 ARIA 子应用控件只允许使用精确文本与 `navItem/tab` class 的受限回退。低风险按钮点击后必须检测 Dialog/Drawer，保存、提交、删除、导出只记录不执行。详细工具说明见 `references/common/lm-browser.md`。

## 结构采集输出

需要产品视角 JSON 或可编辑 HTML 清单时，读取 `references/modes/collection/output-format.md`；可复用模板位于 `templates/`。原始 MCP 采集 JSON 必须保留，不覆盖或改写。

### 图片、DOM 与 MCP 双重识别

每页按以下顺序执行，不得跳步：`截图 → AI 标记候选 → page_snapshot/inspect_dom → 候选台账对账 → find_text_elements 定位 → MCP 操作 → 操作后 DOM + 截图复核 → JSON`。

- AI 看到的菜单、Tab、按钮、弹层、抽屉、表格操作、Switch、图标按钮和懒加载区域，以及 DOM 中看到但截图未标出的元素，都必须进入候选台账；视觉与 DOM 不一致时扩大检查范围。
- 对 `div.navItem`、`li.ivu-menu-item`、无 `role` 控件、重复文本、嵌套菜单和虚拟列表，先用精确文本、可见性、class、祖先容器和 occurrence 定位，禁止使用全局第一个同名节点。
- 滚动与视口覆盖按“滚动与视口验证”章节执行；连续稳定快照只是停止条件之一，任何未分类候选必须保留。

### 自动化前置门槛

自动化只用于重复运行已验证的稳定用例；生成或执行前置条件见 `references/modes/automation/automation-testing.md`。
