# Agent 编排 — agent-orchestrator-mcp

将复杂任务拆分为独立子任务时使用。先按场景读取一个最小 reference，不预加载其他分支。

| 场景 | 读取文件 |
| --- | --- |
| 创建、打开、等待、汇总、审查无依赖任务 | [agent-orchestrator/basic.md](agent-orchestrator/basic.md) |
| 任务不合格，需要返工 | [agent-orchestrator/rework.md](agent-orchestrator/rework.md) |
| 任务有依赖、中途追加或属于页面开发工作流 | [agent-orchestrator/advanced.md](agent-orchestrator/advanced.md) |
| 查询工具职责或参数 | [agent-orchestrator/tool-index.md](agent-orchestrator/tool-index.md) |
| 查询 `tasks.json` 字段或返工状态 | [agent-orchestrator/task-state.md](agent-orchestrator/task-state.md) |

## 核心规则

1. 不用手工 Markdown 模拟 MCP 任务状态；页面开发工作流的 `tasks.json` 由 MCP 任务工具维护，所有执行方式共用。
2. `agent_create_task` / `agent_create_tasks` 必须提供 `task`；`resources` 用于补充参考资源，`notes` 用于补充边界说明。
3. `agent_open_task_chats` 前确保每个任务已有可用的 `task` 或 `resources`。
4. 多窗口委派任务精确调用链：`agent_create_tasks` → `agent_open_task_chats` → 子 Agent 调用 `agent_complete_task` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。
5. 页面工作流的内联和子代理模式也先用 `agent_create_tasks` 建账；完成后由主 Agent 调用 `agent_complete_task` 写入结果，再审查并标记 `reviewed`，不调用打开或等待子聊天的工具。
6. 返工精确调用链：用户确认 → 写入返工任务文件 → `agent_request_rework` → `agent_open_task_chats` → 子 Agent 调用 `agent_complete_task` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。
7. 不得缩写、改写或虚构工具名；例如 `agent_wait_tasks`、`agent_aggregate_results`、`agent_collect_results` 均不可调用。
8. 不属于页面开发工作流的单文件简单修改或紧密耦合串行任务不使用任务编排；这不豁免已触发的页面工作流任务账本。
