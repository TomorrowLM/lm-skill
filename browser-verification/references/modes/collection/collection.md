# 页面结构采集协议

本文件是 `browser-verification` 的采集模式参考。通用的逐层验证、证据闭环、风险分类和完成门禁以根 `SKILL.md` 为准；本文件只补充菜单、视图和业务控件的采集规则。

## 1. 采集范围和模型

采集范围包括主应用、微前端子应用（包括 qiankun 等实现）、路由页面、Tab、Dialog、Drawer 和页面业务控件。采集结果使用以下层级：

```text
menu / page
└── children
    ├── menu / page
    ├── tab
    ├── dialog
    └── drawer
```

- 路由菜单本身就是页面时，不重复生成 page。
- 无路由父菜单仍保留，并继续递归其子菜单。
- 有独立路由的详情或编辑页面建立新的 page；无独立路由的覆盖层建立 dialog/drawer。
- 每个节点保留稳定 `id`、`parentId`、`type`、`route`、`children` 和业务 `buttons`。

## 2. 菜单遍历

- 进入父级菜单前，先通过截图、DOM 和 MCP 枚举全部可见子菜单。
- 为每个子菜单建立候选台账，并逐个导航验证名称、路由、激活态和主要内容。
- 处理完一个子菜单后，返回父菜单并确认父层仍有效，再继续下一个兄弟节点。
- 菜单没有路由、路由未变化或无法访问时，仍保留节点，并使用根技能定义的 `partial`、`unverified` 或 `blocked` 状态。
- 同名菜单使用父节点、DOM 路径、路由和 occurrence 生成定位信息，禁止使用全局第一个同名节点。
- 父菜单下所有兄弟节点都收口后，才允许关闭该菜单层；不能采完第一个页面就把父菜单标记为完成。

## 3. 页面和 Tab 遍历

- 菜单页面进入稳定状态后，枚举 page、外层 Tab 和内层 Tab。
- 每个可见 Tab 必须单独激活，等待异步渲染，再复采截图、DOM、路由和业务按钮。
- 外层 Tab 完成后，继续检查内容中的内层 Tab；Tab 必须挂在实际所属节点的 `children` 中。
- Tab 属于低风险导航，可以实际点击；Tab 内的保存、提交、删除、导出等业务动作仍按根技能的高风险策略处理。
- `collect_navigation_tree` 和 `collect_tab_variants` 只负责候选发现、去重和回到父路由，不能替代逐节点验证。

### 3.1 强制递归队列

每个菜单、page、Tab、Dialog、Drawer 和详情页都要建立自己的 `pending` 队列，执行以下固定闭环：

```text
进入节点
→ 截图并做视觉候选标记
→ MCP DOM/iframe/滚动采集并对账
→ 分类所有业务候选
→ 低风险候选：MCP 点击 → 等待稳定 → 复采 DOM+截图 → 递归子节点 → 关闭/返回并复核父节点
→ 高风险候选：record-only，写定位、风险、未执行原因
→ 继续同层兄弟候选
→ pending 为空且没有 unknown，才关闭当前节点
```

- 页面完成 Tab 切换不等于页面完成；每个 Tab 仍必须重新扫描按钮、表格行操作、Switch、Dialog/Drawer 入口和内层 Tab。
- 看到 `详情`、`查看`、`编辑` 等可能改变 route 的低风险入口时，由 AI 结合截图、DOM、业务风险和用户范围选择代表实例进入；进入后必须新增 page 节点并递归，不能只把按钮文字写进父页。
- 看到会打开 Dialog/Drawer 的低风险入口时，必须使用 MCP 的覆盖层采集能力，记录覆盖层类型、标题、route（通常为空）、按钮和关闭后父页恢复证据。
- `导入`、`导出`、`新增`、`保存`、`提交`、`删除`、`发布` 等高风险动作不点击，但必须作为 `record-only` 保留；“未点击”不是“未发现”。
- 一个工具调用批量返回多个 Tab 或结构，只能减少发现工作，不能清空这些节点的业务控件队列。

## 4. 覆盖层和微前端

- 查看、详情和可确认安全的编辑入口可以选择代表实例打开，验证覆盖层内容、归属、关闭行为和返回状态。
- 页面、表格/列表和嵌套容器的滚动覆盖、切换后的视口复位、懒加载补采和滚动后候选对账，统一遵循 `references/common/scrolling.md`。
- 重复的统计卡片、列表行或模板化控件先全部发现并分组；同模板只选代表实例递归解析，差异卡片单独作为变体，具体按 `references/common/sampling.md` 执行。
- 主应用和实际挂载的 Vue/React 子应用都属于扫描范围；子应用挂载、路由切换或 Tab 切换后等待内容稳定。
- 继续检查 Shadow DOM；跨域 iframe 不绕过同源策略，记录 `blocked` 或 `unverified` 及原因。
- 菜单或业务路由跳转到 `/login` 时，提示用户、将当前节点标记为 `blocked`/`auth-required` 并跳过；不采集登录表单，也不把登录页写入业务菜单或 page 结果。

## 5. 按钮和排除规则

- 候选不只包括 `button`，还包括 `a`、`div`、`span`、`role=button`、组件类名、表格操作列和无 ARIA 的交互元素。
- 表格中的查看、详情、编辑、Switch 和行内操作记录所属行或操作列；删除、保存、提交、审核、发布、撤回、导出只记录不点击。
- 表格操作必须逐行/逐类去重；至少对一个低风险代表行做后续状态验证，其他同类行记录定位和覆盖范围。若未执行代表性验证，表格节点不得标记 `verified`。
- 侧边栏、顶部全局入口、分页、筛选、查询、下拉条件、单选项以及筛选区清除/重置控件进入排除清单，并写明排除原因。
- 无 ARIA 的自定义 Tab 结合截图、文本、class、祖先容器、occurrence 和点击结果判断；只有 DOM 命中时不能标记为 `verified`。

## 6. 采集输出

每个节点至少保留：

```text
id, type, parentId, route, children, buttons, status, reason, evidence
```

`buttons` 只放当前 page/tab/dialog/drawer 内的业务能力；Tab 本身放在 `children`，不重复放入 `buttons`。每个节点同时保留 `pendingNodes`、`unverifiedNodes`、`blockedNodes`、`recordOnlyNodes` 和证据引用；最终 JSON 不保存完整 DOM、frames、visibleText 或页面全文。

只有当前范围的 `pendingNodes` 和 `unknownCandidates` 都为空，且每个低风险代表操作都有操作后 DOM/截图/状态证据，才允许节点标记 `verified`。如果候选发现、导航、Tab 切换、滚动、按钮递归或覆盖层验证无法完成，输出部分结果并标记剩余节点和原因，不得把候选结构直接声明为最终完成。
