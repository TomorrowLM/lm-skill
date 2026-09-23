# 任务账本与状态

仅在检查 `tasks.json`、结果位置或返工状态时读取。

## `tasks.json` 关键字段

追加任务只能追加新项，不能覆盖已有任务。

| 字段 | 说明 |
| --- | --- |
| `id` | 任务唯一 ID，通常为 `task-<uuid>`。 |
| `title` | 任务标题，用于识别任务边界。 |
| `task` | 必填。子任务简短描述或任务文件地址。 |
| `resources` | 子任务参考资源；页面工作流默认必须包含对应 `spec/*.md`，除非任务账本已有用户明确的 spec 豁免记录。 |
| `notes` | 补充说明、边界和暂不处理项。 |
| `resultFile` | 当前最终结果文件；返工完成也覆盖该文件。 |
| `visualDir` | 可选视觉产物目录，通常位于当前设计目录的 `assets/` 下。 |
| `status` | `pending`、`running`、`completed`、`failed`、`reviewed`、`rework_requested`。 |
| `rework` | 当前最新返工记录，仅返工任务存在。 |
| `reworks` | 全部返工历史，按发生顺序追加。 |
| `reviewNote` | 审查通过或请求返工时的意见。 |

返工记录统一使用 `task`、`resources`、`notes`：`task` 保存返工任务描述或任务文件地址，`resources` 保存返工参考资源，`notes` 保存返工边界和完成要求。不生成 `prompts/` 目录。旧记录中的 `prompt/inputFiles/promptFile` 只作为读取兼容。

## 返工记录示例

```json
{
  "id": "task-xxx",
  "status": "rework_requested",
  "reworkCount": 1,
  "rework": {
    "id": "rework-1",
    "reason": "缺少错误态和空态处理，请补充",
    "task": "/workspace/docs/design/demo/reworks/task-xxx-rework-1.md",
    "resources": [],
    "notes": "严格按返工要求补齐实现，完成后调用 agent_complete_task。",
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
      "task": "/workspace/docs/design/demo/reworks/task-xxx-rework-1.md",
      "resources": [],
      "notes": "严格按返工要求补齐实现，完成后调用 agent_complete_task。",
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
