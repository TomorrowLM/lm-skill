# 技能闭环行为评估

日期：2026-10-27。目标：核对 `writing-skills` 是否要求真实动作与证据分级，并完成模块视觉相关技能的剩余可执行验证。

## 无技能基线

用隔离 Agent 执行“用户说可以补齐已列技能剩余工作”的场景，未加载 `writing-skills`。其原始结论是“尚未闭环”，并列出未来需执行的浏览器回归、触发测试与修改 `writing-skills`，但没有采取任何动作。

观察到的失败：**把用户授权的续做请求停在待办清单**，没有继续执行可独立完成的文件修改和测试，也没有依据真实工具结果确认浏览器具体阻塞。该观察作为本次规则补强的基线；完整输入与用例 ID 见 `evals.json` 的 `closure-execute-authorized-work-01`。

## 修改与用例

- `SKILL.md` 新增场景决策、隔离 Agent 行为、集成执行三层证据定义；新增触发语义与平台自动 dispatch 的区分，以及授权续做规则。
- `evals.json` 新增 `closure-execute-authorized-work-01`、`trigger-evidence-boundary-01`、`evidence-layers-01`、`pressure-runtime-trigger-01`、`pressure-empty-browser-01`。
- 第一轮压力 Agent 因提示同时说“必须读取文件”与“不要调用任何工具”而未读取技能；该轮作废，不计通过。修正提示为允许指定 `read_file`、禁止浏览器/网络/写入后重跑。

## 复测结果

| 用例 | 证据层 | 观察 | 结果 |
| --- | --- | --- | --- |
| `closure-execute-authorized-work-01` | 隔离 Agent 行为 | 按已执行静态修改与校验、浏览器 blocked、自动路由未验证分别汇报，不只复述待办 | 目标行为符合 |
| `trigger-evidence-boundary-01` | 场景决策 | 能区分 20/20 语义分类与自动 dispatch 命中率 | 目标行为符合 |
| `evidence-layers-01` | 场景决策 | 没有浏览器操作后状态证据时拒绝称页面验收通过 | 目标行为符合 |
| `pressure-07` | 隔离 Agent 压力行为 | 用户拒绝测试时不因改动简单而直接改 description | 目标行为符合 |
| `pressure-runtime-trigger-01` | 隔离 Agent 压力行为 | 不把语义分类结果报成实际自动触发 100% | 目标行为符合 |
| `pressure-empty-browser-01` | 隔离 Agent 压力行为 | 空页面列表时拒绝旧截图通过，不新开页面 | 目标行为符合 |
| Browser `T01`–`T20` | 语义分类评估 | 独立分类器按 `description` 判断 20 条现有查询 | 20/20 与预期标签一致；仅是语义评估 |
| 当前实际页面 | 集成执行 | `connect_browsers`: Chrome Stable connected、pages=0；`list_pages`: 空数组 | `blocked`；未执行视觉与业务回归 |

## 结论边界

- **已完成**：目标技能文档修改；用例 JSON 可解析且 ID 唯一；隔离 Agent 行为/压力复测；Browser 触发用例的语义分类 20/20；注册目录符号链接指向当前仓库。
- **未验证**：VS Code 自动 skill dispatch 实际命中率。当前无逐条运行时路由/调用轨迹；20/20 不能改写为自动触发命中率。
- **阻塞**：当前页面的真实浏览器验收。MCP 可连接但发现 0 个页面；按已打开 tab 授权停止，没有打开或导航页面。
- **不在本次结论内**：业务流程、接口、权限和当前代码的视觉效果。

静态校验：所有相关 JSON 可解析且 ID 唯一；`git diff --check` 通过。文档/决策评估不等同于真实浏览器集成验证；不得用“所有技能已闭环”描述当前状态。