# 基础编排

适用于无依赖的独立子任务：创建、打开、等待、汇总与审查。

## 最短流程

**精确调用链：** `agent_create_tasks` → `agent_open_task_chats` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。

不得缩写、改写或虚构工具名，例如 `agent_wait_tasks`、`agent_collect_results`、`agent_get_task_results` 都不是可调用工具。

1. 用 `agent_create_task` 创建一个任务，或用 `agent_create_tasks` 批量创建多个任务。
2. 创建每个新任务时必须提供 `task`；`task` 可以是简短描述，也可以是工作区内的任务文件地址。`resources` 用于补充参考资源，`notes` 用于补充边界说明。旧任务可继续使用 `prompt/inputFiles`。
3. 调用 `agent_open_task_chats`。服务会逐个打开聊天窗口并将任务设为 `running`；全部窗口打开后，无依赖任务可并行执行。
4. 需要统一收口时调用 `agent_wait_for_tasks`；只查看进度时调用 `agent_poll_tasks`。
5. 调用 `agent_summarize_results` 汇总结果，再逐项审查。
6. 通过则调用 `agent_mark_task_reviewed`；不通过时读取 [rework.md](rework.md)。

## 最小参数

| 工具 | 必需参数 | 说明 |
| --- | --- | --- |
| `agent_create_task` | `title`、`task`、`workspaceRoot` | 单个任务；`resources`、`notes`、`resultFile` 可选。 |
| `agent_create_tasks` | `tasks` | 每个任务至少包含 `title`、`workspaceRoot`。 |
| `agent_open_task_chats` | `workspaceRoot`、`taskIds` | 每个任务必须已有 `task` 或兼容旧字段；任务文件地址会自动挂载。 |
| `agent_wait_for_tasks` | `workspaceRoot`、`taskIds` | 默认等待 300000ms，默认轮询间隔 2000ms。 |
| `agent_summarize_results` | `workspaceRoot`、`taskIds` | 读取各任务 `resultFile` 并合并文本。 |

完整工具清单、全部参数和角色见 [tool-index.md](tool-index.md)。

## 批量创建示例

```plaintext
agent_create_tasks:
	tasks:
		- title: "共享层：类型定义 + API 服务"
			task: "根据 spec/shared-layer-spec.md 创建类型定义和 API 服务层..."
			workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
			resources:
				- "docs/design/2026-08-06-xxx-design/spec/shared-layer-spec.md"
			resultFile: "docs/design/2026-08-06-xxx-design/results/shared-layer-result.md"
		- title: "列表页实现"
			task: "根据 spec/list-page-spec.md 实现列表页..."
			workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
			resources:
				- "docs/design/2026-08-06-xxx-design/spec/list-page-spec.md"
			resultFile: "docs/design/2026-08-06-xxx-design/results/list-page-result.md"
```

未传 `resultFile` 时，工具会尝试由任务文件地址或 `resources` 推断设计目录；无法推断时写入 `docs/results/`。页面工作流必须显式传入当前功能目录的结果位置。

## 打开、等待与汇总示例

```plaintext
agent_open_task_chats:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-list-page", "task-detail-page"]

agent_wait_for_tasks:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-list-page", "task-detail-page"]
	timeoutMs: 600000
	pollIntervalMs: 2000

agent_summarize_results:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-list-page", "task-detail-page"]
```

`agent_open_task_chats` 会为每个任务追加全部 `resources`，在最近活动的 VS Code 窗口中打开独立 Chat，并传入语义化标题、任务 `task` 和完成协议；普通任务不生成 `prompts/` 目录。旧任务读取 `prompt/inputFiles`。

页面工作流只允许在 Phase 3 已确认后创建任务。默认情况下，`task` 应指向对应 `spec/*.md`，并将同一 spec 放入 `resources`；只有任务账本中已有用户明确的 spec 豁免记录时，才允许使用完整内联任务描述。

`agent_poll_tasks` 返回每个任务的状态、结果文件路径、更新时间，以及总数、已完成、失败和待处理汇总。

## 子 Agent 完成协议

子 Agent 完成后应调用：

```plaintext
agent_complete_task:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskId: "task-list-page"
	result: "## 完成报告\n\n### 创建的文件\n- src/pages/list/index.tsx\n..."
```

## 等待结果与完成方式

- `agent_wait_for_tasks` 返回 `completed`、`failed`、`pending`；`reviewed` 会归入 `completed`。
- 子 Agent 应调用 `agent_complete_task` 写入结果并设为完成。
- 兼容方式是子 Agent 直接写入 `resultFile`；等待工具会检测结果并同步状态。
- `failed` 或 `pending` 任务不应直接视为验收通过。

## 适用边界

- 无依赖任务可批量创建、统一打开、统一等待。
- 有依赖关系时读取 [advanced.md](advanced.md)。
- 返工时读取 [rework.md](rework.md)。
- 单文件简单修改或紧密耦合的串行任务不使用编排。

| 场景 | 推荐 |
| --- | --- |
| 页面开发工作流 Phase 4 多子任务并行 | 首选 |
| 独立模块调研或批量代码审查 | 适用 |
| 单文件简单修改 | 不使用 |
| 紧密耦合的串行任务 | 用内联执行更合适 |
