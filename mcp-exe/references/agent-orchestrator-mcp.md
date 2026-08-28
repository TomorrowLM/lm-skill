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

1. 不用手工 Markdown 模拟任务状态；创建、打开、等待与汇总都调用编排工具。
2. `agent_open_task_chats` 前确保每个任务已有 `inputFiles`。
3. 普通任务精确调用链：`agent_create_tasks` → `agent_open_task_chats` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。
4. 返工精确调用链：用户确认 → 写入 `reworkFile` → `agent_request_rework` → `agent_open_task_chats` → `agent_wait_for_tasks` → `agent_summarize_results` → `agent_mark_task_reviewed`。
5. 不得缩写、改写或虚构工具名；例如 `agent_wait_tasks`、`agent_aggregate_results`、`agent_collect_results` 均不可调用。
6. 单文件简单修改或紧密耦合的串行任务不使用编排。
