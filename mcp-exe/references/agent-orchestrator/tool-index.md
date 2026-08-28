# 工具索引

仅在需要确认工具职责、参数或调用角色时读取。

| 工具 | 角色 | 说明 |
| --- | --- | --- |
| `agent_create_task` | 主 Agent | 创建单个编排任务。 |
| `agent_create_tasks` | 主 Agent | 批量创建多个编排任务。 |
| `agent_list_tasks` | 主 Agent | 列出工作区任务，可按状态过滤。 |
| `agent_get_task` | 主 Agent | 获取单个任务详情。 |
| `agent_open_task_chats` | 主 Agent | 挂载任务 `inputFiles`；返工时额外挂载当前 `rework.inputFiles`，并使用任务 `prompt` 打开子聊天窗口。 |
| `agent_wait_for_tasks` | 主 Agent | 阻塞等待多个任务完成，轮询状态与结果文件。 |
| `agent_poll_tasks` | 主 Agent | 非阻塞查看多个任务当前状态。 |
| `agent_complete_task` | 子 Agent | 写入结果并标记任务完成。 |
| `agent_read_task_result` | 主 Agent | 读取已完成任务的结果文件。 |
| `agent_mark_task_reviewed` | 主 Agent | 审查通过后标记任务为已审查。 |
| `agent_request_rework` | 主 Agent | 在返工文档已写入后，请求返工并更新任务账本。 |
| `agent_summarize_results` | 主 Agent | 读取多个任务结果并合并为汇总文本。 |

## 创建任务字段

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 任务标题。 |
| `workspaceRoot` | 是 | 任务所属工作区绝对路径。 |
| `prompt` | 否 | 原始任务要求；未传时子 Agent 仅依据 `inputFiles` 与项目约束执行。 |
| `inputFiles` | 否 | 任务输入文件，路径必须位于 `workspaceRoot` 内；打开聊天前至少应有一个。 |
| `resultFile` | 否 | 结果文件；未传时从输入推断并写入 `docs/design|prod/<需求目录>/results/task-<uuid>.md`，无法推断时写入 `docs/results/task-<uuid>.md`。 |
| `visualDir` | 否 | 视觉或头脑风暴产物目录；未传时由输入或结果位置推断。 |

## 常用工具参数

- `agent_open_task_chats`：`workspaceRoot`、非空 `taskIds`。
- `agent_wait_for_tasks`：`workspaceRoot`、非空 `taskIds`；可选 `timeoutMs`、`pollIntervalMs`。
- `agent_poll_tasks`、`agent_summarize_results`：`workspaceRoot`、非空 `taskIds`。
- `agent_mark_task_reviewed`：`workspaceRoot`、`taskId`、`reviewNote`。
- `agent_request_rework`：`workspaceRoot`、`taskId`、`reason`、`reworkFile`。
- `agent_complete_task`：`workspaceRoot`、`taskId`、`result`。

任务状态、返工字段与完整 JSON 示例见 [task-state.md](task-state.md)。
