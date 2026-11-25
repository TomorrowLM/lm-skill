# References

按任务选择参考资料；跨模式规则以根 `SKILL.md` 为准。

默认使用视觉与交互验收。结构采集用于发现未知页面结构；自动化回归只用于重复运行已验证的稳定用例。浏览器调用前必须明确复用已有 Tab 还是新开 Tab，不能仅凭 URL 推断。

| 路径                                       | 用途                                    | 何时读取                           |
| ------------------------------------------ | --------------------------------------- | ---------------------------------- |
| `common/lm-browser.md`                     | 浏览器连接、工具能力和证据闭环          | 首次使用 lm-browser 或页面证据工具 |
| `common/scrolling.md`                      | 页面和内部容器滚动、视口复位            | 页面、表格或列表需要滚动时         |
| `common/sampling.md`                       | 重复卡片、行和模板变体抽样              | 存在重复模板时                     |
| `modes/collection/collection.md`           | 菜单、页面、Tab、弹层和控件结构采集     | 需要发现或盘点页面结构时           |
| `modes/collection/output-format.md`        | 产品视角 JSON 与 HTML 清单格式          | 需要生成结构采集结果时             |
| `modes/visual-interaction/verification.md` | 默认视觉与交互验收，以及 Figma 协作边界 | 页面视觉、交互或设计对比验收时     |
| `modes/automation/automation-testing.md`   | 固定测试用例、自动化回归和无人值守流程  | 需要重复运行稳定的回归用例时       |
| `archive/chrome-mcp.md`                    | 旧 Chrome MCP 工具说明                  | 用户明确要求查阅历史工具文档时     |
| `archive/legacy-mcp.md`                    | 旧浏览器 MCP 档案入口                   | 用户明确要求使用旧 MCP 时          |
| `tests/`                                   | 触发、行为和压力评测 JSON               | 修改或评估本技能时                 |

`archive/` 下的旧工具说明只作历史参考，不是默认执行路径。
