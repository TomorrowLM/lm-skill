# 自动化测试与回归协议

本文件只处理自动化测试、回归测试和无人值守脚本设计。通用浏览器连接、截图、DOM、风险和证据门禁以根 `SKILL.md` 为准；页面结构发现和菜单递归采集以 `references/collection/collection.md` 为准。

## 自动化前置门槛

生成或执行自动化脚本前必须确认：

- 目标 route 已完成截图、DOM 和交互后的双重验证；
- 页面加载稳定，登录态和 CDP 端点明确；
- 菜单、page、Tab、Dialog/Drawer 的真实层级已收口；
- 定位文本、class、occurrence、父容器和 iframe/子应用边界已复核；
- 每个动作已完成风险分类；
- 预期 transition、成功状态、失败处理和清理动作已定义。

缺少任一项时，只能输出测试计划或待补证据项，不能生成无人值守点击流程。

## 自动化动作模型

每个动作必须记录：

```json
{
  "route": "/an/workbench/evaluation/analysis/overview",
  "nodePath": ["业务工作", "远程监管", "监管分析"],
  "action": "click",
  "locator": { "text": "查看详情", "class": "action-btn", "occurrence": 1 },
  "risk": "low",
  "expectedTransition": "打开详情页或详情弹层",
  "preconditions": [],
  "postconditions": [],
  "failureHandling": "截图、记录 DOM 和标记 unverified"
}
```

只允许引用已完成双重验证的 route、selector、Tab 层级和风险策略。`dom-verified`、`visual-only`、`interaction-unavailable` 只能进入人工确认或待补测队列，不能直接作为无人值守动作。

## 风险策略

- 低风险：Tab 切换、查看、详情、可关闭弹层，可执行代表性测试并复核操作后 URL、激活态、DOM 和截图。
- 高风险：导入、导出、新增、保存、提交、删除、审核、发布、撤回，默认只记录存在性、定位、风险和未执行原因。
- 可能改变 route 的查看/编辑入口，必须递归验证目标详情页；打开 Dialog/Drawer 的入口，必须记录覆盖层标题、归属、关闭后父页恢复证据。

## 测试闭环

```text
进入已验证 route
→ 检查前置状态
→ 执行动作
→ 等待稳定
→ 检查 URL / active / DOM / 截图 / 网络或控制台证据
→ 判定 verified、partial、unverified 或 blocked
→ 清理状态并返回父页面
```

测试结果必须保存截图、日志和失败上下文。工具返回成功不能单独作为测试通过依据。
