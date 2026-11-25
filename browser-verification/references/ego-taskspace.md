# EGO Lite TaskSpace 与登录态

本文只补充 `browser-verification/SKILL.md` 的工作区、Profile 和登录态决策。浏览器 API 以每次任务实际运行的 `ego-browser skill` 指南为准；不要把旧指南中的 API 形态覆盖到当前版本。

## TaskSpace 是什么

- 一个 Agent TaskSpace 保存一项任务的页面和控制状态；不同 Space 名称本身不代表不同账号或独立 Cookie。
- 新 TaskSpace 创建时会绑定一个 Profile。绑定同一 Profile 的用户页面和 TaskSpace 会共享该 Profile 的 Cookie/缓存；站点登出、Cookie 变化也可能影响同 Profile 的其他页面。
- 不同 Profile 使用不同的浏览器数据。新空间若使用默认 Profile，而目标登录态在另一个 Profile，页面会显示登录提示；这不能单独证明 EGO Lite 登录迁移失效。
- 从 Chrome/Edge 等浏览器导入资料是一次迁移，不是之后与来源浏览器持续同步。导入结果不等于某个网站的会话一定有效；需在目标站点确认实际账号和登录状态。

## 选择或复用工作区

### 同一目标的后续操作

继续使用原 TaskSpace ID 和已有 Page label。先调用 `task.pages()` / `task.tabs()` 查看当前页和 URL，再恢复操作；不要新建 Space 来“续聊”，也不要假设旧 JavaScript 变量仍存在。

### 用户明确指定了 Profile 的新工作区

只在用户明确说出要用的 Profile 后，按当前指南调用 `profiles()`，用返回的 Profile `id` 创建新空间：

```js
const available = await profiles();
// 将这个占位名称替换为用户明确指定的 Profile 名称。
const selected = available.find((profile) => profile.name === "user-named-profile");
if (!selected) throw new Error("指定的 Profile 不可用");

const task = await taskSpace("check signed-in page", {
  profileId: selected.id,
});
const page = task.page("p1");
```

示例中的 Profile 名称是占位符，必须替换成用户明确指定的名称；不能把某个 Profile、当前默认 Profile 或账号名称写死为所有用户的选择。`profileId` 只在创建新空间时生效。创建后核对 `listTaskSpaces()`（若当前版本提供 `profileId`）和页面上可见的账号/组织。

### Profile 未指定

- 对不依赖登录的公开页面，可使用 EGO Lite 当前默认创建方式。
- 对依赖用户已有登录态的任务，询问要使用哪个 Profile，再建 Space；不要自行调用 `profiles()` 来替用户挑选。
- 页面若出现登录提示，停止该页面的业务操作。若用户愿意登录，使用 `task.handOff()` 把当前 Space 交给用户；用户在这个 Space 登录并确认后，再通过 `takeOverTaskSpace(spaceId)` 恢复并重新检查页面。

## 账号与会话验证

开始读取私有数据或修改页面前，至少核对：

1. 当前 Page 的完整 URL/route 与目标一致。
2. 页面可见的账号和组织与用户要求一致。
3. 页面没有登录墙、验证码或设备确认；若有，按 handoff 流程处理。

历史会话、头像或熟悉的 URL 只能作为辅助线索。需要确认具体账号时以页面当前可见身份为准。不要通过 `document.cookie` 猜测是否已登录，也不要读取、打印或传送 Cookie、密码和令牌。

## 不要扩大状态清理范围

登录失效不是清空整个 Profile 的理由。读取 EGO Lite 的 `references/clearing-state.md` 后，只能在用户明确授权且确认影响范围时处理站点级数据；不得调用会清空整个 Profile Cookie 或缓存的命令来尝试修复单站登录。不要在多个 Profile 之间反复试探。

## 完成与保留

- 任务已完成且用户无需继续查看页面时，按当前指南结束 TaskSpace。
- 用户要留在页面上继续使用、审阅结果或接管时，只保留必要的 Page/Space。
- `task.finish()` 不用于等待用户完成登录、验证码、权限提示或其他 handoff 步骤；此时停手并等待用户确认。

## 官方参考

- [EGO Lite Windows 快速开始](https://lite.ego.app/document/en/docs/windows/quick-start)：导入来源浏览器/Profile，并逐站验证登录。
- [EGO Lite Space 文档](https://lite.ego.app/document/en/docs/space)：Space 与账号/Profile 的区别、同 Space 的接管流程。
- [Cookie、缓存与存储说明](https://github.com/citrolabs/ego-lite/blob/main/skills/ego-browser/references/clearing-state.md)：同 Profile 的共享状态及清理范围。

