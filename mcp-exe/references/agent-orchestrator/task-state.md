# 任务账本与状态

仅在检查 `tasks.json`、结果位置或返工状态时读取。

## `tasks.json` 关键字段

追加任务只能追加新项，不能覆盖已有任务。

| 字段 | 说明 |
| --- | --- |
| `id` | 任务唯一 ID，通常为 `task-<uuid>`。 |
| `title` | 任务标题，用于识别任务边界。 |
| `prompt` | 创建时的原始任务要求。 |
| `inputFiles` | 子任务输入文件；页面工作流内至少包含对应 `spec/*.md`。 |
| `resultFile` | 当前最终结果文件；返工完成也覆盖该文件。 |
| `visualDir` | 视觉或头脑风暴产物目录。 |
| `status` | `pending`、`running`、`completed`、`failed`、`reviewed`、`rework_requested`。 |
| `rework` | 当前最新返工记录，仅返工任务存在。 |
| `reworks` | 全部返工历史，按发生顺序追加。 |
| `reviewNote` | 审查通过或请求返工时的意见。 |

返工记录的 `prompt` 是返工子任务的独立执行说明；普通任务和返工任务都通过 `inputFiles` 挂载文件，不生成 `prompts/` 目录。旧记录中的 `promptFile` 只作为读取兼容。`reworks/` 只保存返工要求历史，最终结果始终以 `resultFile` 为准。

## 返工记录示例

```json
{
  "id": "task-xxx",
  "status": "rework_requested",
  "reworkCount": 1,
  "rework": {
    "id": "rework-1",
    "reason": "缺少错误态和空态处理，请补充",
    "prompt": "请读取已挂载的原始任务输入文件和本次返工输入文件，严格按返工要求补齐实现。",
    "inputFiles": [
      "/workspace/docs/design/demo/reworks/task-xxx-rework-1.md"
    ],
    "status": "requested",
    "createdAt": "2026-08-13T00:00:00.000Z"
  },
  "reworks": [
    {
      "id": "rework-1",
      "reason": "缺少错误态和空态处理，请补充",
      "prompt": "请读取已挂载的原始任务输入文件和本次返工输入文件，严格按返工要求补齐实现。",
      "inputFiles": [
        "/workspace/docs/design/demo/reworks/task-xxx-rework-1.md"
      ],
      "status": "requested",
      "createdAt": "2026-08-13T00:00:00.000Z"
    }
  ]
}
```

## 状态同步

- `agent_request_rework`：任务变为 `rework_requested`，当前返工为 `requested`，并追加到 `reworks`。
- `agent_open_task_chats`：任务变为 `running`，当前返工变为 `running`。
- `agent_complete_task`：任务变为 `completed`，当前返工变为 `completed`，并覆盖原 `resultFile`。
- `agent_wait_for_tasks`：把 `completed` 与 `reviewed` 归入完成集合；超时或未完成任务归入 `pending`。
