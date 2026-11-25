---
name: browser-verification
description: >-
  当任务需要在本机浏览器中查看、操作、采集或验收网页时使用，包括视觉与交互验收、DOM/页面结构检查、回归测试、登录态检查、EGO Lite 工作区和网页自动化。
  用户提到“浏览器验证”“页面验收”“检查网页”“截图对比”“打开页面并操作”时触发。
  默认通过 EGO Lite 的 ego-browser 执行；纯代码或后端检查、无需打开网页的公开资料检索不使用本技能。
---

# 浏览器页面验证

使用 EGO Lite 的 `ego-browser` 在真实页面中完成浏览器工作。页面截图、DOM/快照、路由和操作后的状态共同构成证据；不能把工具调用成功或单次快照当成页面验收通过。

## HARD-GATE

1. **先读取本机 EGO Lite 操作说明。** 每项浏览器任务开始前运行 `ego-browser skill`，完整阅读输出并遵守当前安装版本的说明。若末尾缺少 `[ego-browser:skill] end of guide`，说明输出截断，先按说明保存并分段读取。命令不可用时只按 `references/install.md` 及对应系统的安装说明排查。
2. **EGO Lite 是默认浏览器执行层。** 不要因 EGO Lite 未连接、没有 Chrome 远程调试端口或页面不可见，就改用 `lm-browser`、CUA、Playwright 或另一个浏览器实例重试。先按 EGO Lite 指南诊断并报告实际阻塞；只有用户明确改用其他工具时才切换。
3. **新旧工作区与用户控制权分开处理。** 新目标可创建 Agent TaskSpace；同一目标的后续操作优先续用原 TaskSpace ID 和 Page label。不要仅凭名称猜测 Space 或页面存在；先用指南指定的列表/恢复流程核对。用户拥有或已接管的 Space，不得擅自 claim、take over、关闭或改导航。
4. **不要猜登录 Profile。** 新 TaskSpace 创建时会绑定一个 Profile。只有用户明确指定某个 EGO Lite Profile 后，才调用 `profiles()` 解析其准确 ID，并在创建时使用 `taskSpace(name, { profileId })`。若任务依赖现有登录态而用户没指定 Profile，先询问要用哪个 Profile；不得默默枚举、切换或尝试其他 Profile。已存在的 Agent TaskSpace 不能事后改绑 Profile。
5. **按任务需要处理登录墙。** 到达登录页时，不猜凭据、不把凭据写进脚本或日志，也不继续私有数据或业务操作。如果用户的任务只是检查是否登录，报告页面未登录并停止；如果任务必须在登录后继续，先确认用户愿意完成登录，再用当前 EGO 指南规定的 handoff 流程让用户在同一个 Space 操作，用户确认后恢复同一 Space 并重新检查页面。验证码、设备确认和浏览器权限提示必须 handoff；不得通过另开匿名 Space 或清 Cookie 绕过。
6. **先判断操作风险。** 仅执行用户明确要求或授权的网页操作。发送消息、发布、提交、购买、删除、账号更改等会产生外部影响；用户已明确要求该操作时才执行，并在操作前确认目标账号、会话/页面和内容。其他高影响操作先停下确认。低风险检查也要在操作后复核页面状态。
7. **证据和结论范围一致。** 先核对完整 URL/路由和页面身份，再用当前指南支持的 snapshot/DOM 与截图识别目标。交互后再次检查 URL、页面内容或状态。未覆盖的网络、控制台、隐藏内容或交互结果标为 `unverified`/`blocked`，不能用猜测补齐。

## 执行顺序

1. 判断是否需要真实本机浏览器。公开网页资料查询优先使用网页检索；纯代码、后端 API 或静态检查不启动浏览器。
2. 运行 `ego-browser skill`，确认当前命令和 API 用法。PowerShell 中如需执行包含中文的脚本，按指南写入 UTF-8 `.mjs` 文件再通过 `ego-browser nodejs -e` 导入；不要把中文或复杂多行脚本塞进 `-e` 参数。
3. 明确目标 URL、要复用的 Space/Profile，以及允许执行的动作。目标依赖已有登录态但 Profile 未明确时先问；不依赖登录态的普通网页任务可按当前 EGO 默认配置创建 Space。
4. 新建或恢复 Space 后，确认实际 `spaceId`、Page label、URL/route 和可见账号/组织。URL 相同不代表会话、账号或组织相同。
5. 先采集页面快照；需要视觉证据时使用 EGO 指南支持的截图接口。识别菜单、Tab、弹层和控件时，把视觉候选与 DOM/快照对照；发现范围较大时按页面层级递归记录待处理项。
6. 按风险执行获准的操作。每个关键操作后重新读取页面状态；失败、超时或结果不符时先观察当前页面，再决定下一步，不能盲目重复点击。
7. 按实际证据报告已验证、部分验证、未验证或阻塞的范围，并说明证据与限制。任务结束时按 EGO 指南关闭测试 Space，或只保留用户明确需要查看/继续使用的结果页；handoff 等待期间不要结束 Space。

## 按需读取

- TaskSpace 生命周期、Profile/登录态及 handoff：`references/ego-taskspace.md`
- 安装、升级或命令不可用：通过 `ego-browser skill` 输出中的 `references/install.md`，再读对应系统说明
- 清理 Cookie、缓存或站点存储：通过 EGO Lite `ego-browser` 技能的 `references/clearing-state.md`；默认不要清理任何状态
- Figma 或设计稿视觉差异判定：使用 `visual-workflow` 的 verification 模式；本技能负责 EGO Lite 页面证据
- 页面开发 Phase 5：遵循 `page-development-workflow` 的验收范围，并使用本技能执行实际页面检查

