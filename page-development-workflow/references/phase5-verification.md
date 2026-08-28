# Phase 5：测试验收

用于选择验证命令、记录证据、执行 UI 手动验收和代码审查。

## 自动化验证原则

- 必须读取项目 `package.json` 后再选择命令。
- pnpm 项目用 `pnpm`，npm 项目用 `npm`，不要混用。
- 优先使用项目已有 scripts。
- 没有固定脚本时，再使用框架通用命令。
- 运行命令后必须阅读输出，不能只看退出码。
- 声称通过前必须有输出证据。

## Phase 5 入口自检

进入测试验收前必须确认 Phase 4 已收口，任一不满足则回到 Phase 4 补齐。

- `spec/` 下所有计划或子任务规格均已有对应执行产物。
- 使用 MCP 编排时，`tasks.json` 中不存在 `pending`、`running`、`failed` 或 `rework_requested` 任务。
- 使用 MCP 编排时，所有已完成任务都已由主 Agent 审查，通过项应标记为 `reviewed`。
- 如存在 `reworks/`，当前返工必须已完成并覆盖原 `resultFile`。
- `results/` 中的执行报告能对应到每个 `spec/*.md`。
- Phase 4 没有遗留的新增范围、接口契约或验收标准变更；如有，必须回到 Phase 3。

## 验收窗口编排

浏览器验收推荐使用独立子窗口执行。主窗口应在进入 Phase 5 后：

1. 先完成本文件的 Phase 5 入口自检。
2. 创建并打开浏览器验收任务，挂载页面入口、验收范围和当前环境信息。
3. 等待验收任务完成，读取其 `resultFile`，只提取截图路径、环境、通过项、失败项和阻塞原因。
4. 如有未通过项或审查问题，提取失败证据（报错/偏差/审查意见）作为返工原因，在 Phase 4 生成自包含的返工文档派发修复；修复完成并覆盖 `resultFile` 后重新验收。
5. 在主窗口执行自动化验证、代码审查和正式证据文件生成。

验收子窗口不得修改业务代码、启动或停止服务，也不得宣布 Phase 5 完成。结果文件建议为：

```text
docs/design/YYYY-MM-DD-<topic>-design/results/05-browser-verification-result.md
```

## 命令选择

常见命令按项目实际调整：

```bash
<pm> test src/pages/page-name/ -- --coverage
<pm> typecheck
<pm> exec tsc --noEmit
<pm> lint
<pm> build
```

## 自动化验证清单

- [ ] 单元测试通过，0 failures。
- [ ] TDD 红-绿-重构循环已遵循。
- [ ] 覆盖空数据、错误状态、加载状态等边界。
- [ ] TypeScript 类型检查通过，0 errors。
- [ ] ESLint 检查通过，0 errors；如项目要求 0 warnings，也必须满足。
- [ ] 构建通过，exit 0。

## 证据落盘模板

保存到 `docs/design/YYYY-MM-DD-<topic>-design/evidence/phase5-verification.md`。

`evidence/phase5-verification.md` 只在 Phase 5 生成；Phase 4 只生成 `tasks.json`、`results/` 和按需 `reworks/`。

```md
# Phase 5 验证证据

## 验证命令

| 命令 | 选择理由 | 结果 |
|------|----------|------|
| `...` | ... | 通过 / 失败 |

## 自动化验证输出摘要

### test

- 命令：`...`
- 结果：...
- 关键输出：...

### typecheck

- 命令：`...`
- 结果：...
- 关键输出：...

### lint

- 命令：`...`
- 结果：...
- 关键输出：...

### build

- 命令：`...`
- 结果：...
- 关键输出：...

## 手动验收记录

> **浏览器 UI 验收**：使用 `browser-verification` 技能进行系统化浏览器验证。
> 读取 `browser-verification/SKILL.md` 获取完整验证流程（前置检查 → 视觉 → 交互 → 网络 → 控制台 → DOM → 证据汇总）。
> 工具映射见 `browser-verification/references/chrome-mcp.md`。

- 入口：...
- 环境：...
- 通过项：...
- 未通过项：...
- 截图：...

## 代码审查结论

- 审查方式：...
- Critical：...
- Important：...
- Minor：...
- 处理结果：...
```

## 手动验收入口

必须告诉用户：

- 访问路径。
- 前置登录或权限条件。
- 进入模块的点击路径。
- 如是移动端，说明设备、浏览器和屏幕尺寸建议。

视觉任务优先复用 Phase 5 验收子窗口生成的 `assets/screenshots/` 和验收结论；主窗口只在现有证据不足时读取关键截图，不重新获取或完整分析原始设计资源。

## 核心测试点

- [ ] 页面或模块能正常打开。
- [ ] 标题、文案、按钮、提示信息正确。
- [ ] 点击、切换、展开、关闭、提交等交互正常。
- [ ] 默认态、禁用态、空态、错误态完整。
- [ ] 无明显错位、遮挡、溢出、闪动。
- [ ] UI 还原度符合设计稿。
- [ ] 搜索和筛选正常。
- [ ] 分页或加载更多正常。
- [ ] 响应式布局在目标屏幕下正常。
- [ ] hover、loading、empty、error 状态合理。
- [ ] 键盘可达性和焦点顺序正确。

## 手动验收记录方式

要求用户按以下格式反馈：

```text
通过 / 不通过：
问题截图：
复现步骤：
设备和浏览器：
补充说明：
```

## 审查循环

- 验收失败：回到 Phase 4 修复，再重新执行 Phase 5。
- Critical / Important 审查问题：修复后重新验收和审查。
- Minor 问题：记录并集中清理，不阻塞交付，除非用户要求全部处理。
