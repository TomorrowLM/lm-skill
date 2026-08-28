# 审查与返工

适用于子任务结果不符合已确认验收项的情况。

## 返工前的工作流门禁

以下是协作流程约束，不是 MCP 自动校验：

**返工精确调用链：** 用户确认 → 写入 `reworkFile` → `agent_request_rework` → `agent_open_task_chats` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。

不得跳过用户确认、返工文档、重新打开或等待步骤；不得缩写、改写或虚构工具名。

1. 主 Agent 先展示返工草案：任务、原因、缺失验收项、期望结果、允许范围、资源定位与原 `resultFile`。
2. 等待用户明确确认返工。
3. 确认后，按适用工作流模板写入 `reworks/task-<uuid>-rework-<N>.md`。

返工文档格式由 `page-development-workflow` 的返工文档模板定义，包含返工编号、关联任务、返工原因、输入文件、结果文件和执行清单；MCP 只更新任务账本，不生成文档内容。

未确认前不得写返工文档或调用 `agent_request_rework`。

## 已确认后的流程

1. 调用 `agent_request_rework`，传入 `workspaceRoot`、`taskId`、`reason`、`reworkFile`。
2. 工具将任务标为 `rework_requested`，追加 `reworks` 历史，并把本次返工输入设为 `reworkFile`。
3. 调用 `agent_open_task_chats` 重新打开任务；服务会同时挂载原 `inputFiles` 与本次 `rework.inputFiles`。
4. 调用 `agent_wait_for_tasks` 等待完成，再调用 `agent_summarize_results` 复审。
5. 通过后调用 `agent_mark_task_reviewed`。

不得只写返工文档或口头要求子 Agent 修改；确认后必须按上述工具链请求、重新打开、等待并复审。

## 工具调用示例

```plaintext
agent_mark_task_reviewed:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskId: "task-list-page"
	reviewNote: "列表页实现符合规格，类型检查通过"

agent_request_rework:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskId: "task-detail-page"
	reason: "详情页缺少错误态和空态处理，请补充"
	reworkFile: "/Users/zm/work/yqa-g-h5-urban/docs/design/demo/reworks/task-detail-page-rework-1.md"
```

## 状态要点

| 操作 | 任务状态 | 当前返工状态 |
| --- | --- | --- |
| `agent_request_rework` | `rework_requested` | `requested` |
| `agent_open_task_chats` | `running` | `running` |
| `agent_complete_task` | `completed` | `completed` |

`agent_request_rework` 只更新任务账本，不会生成返工文档。返工完成必须覆盖原 `resultFile`。

完整 `tasks.json` 字段和返工 JSON 示例见 [task-state.md](task-state.md)。
