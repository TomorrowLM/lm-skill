# Agent 编排 — agent-orchestrator-mcp

当需要将复杂任务拆分为多个独立子任务并行执行时，使用 `agent-orchestrator-mcp` 工具链完成编排。

## 工具清单

| 工具 | 角色 | 说明 |
|------|------|------|
| `agent_create_task` | 主 Agent | 创建单个编排任务 |
| `agent_create_tasks` | 主 Agent | 批量创建多个编排任务 |
| `agent_list_tasks` | 主 Agent | 列出工作区任务，可按状态过滤 |
| `agent_get_task` | 主 Agent | 获取单个任务详情 |
| `agent_open_task_chats` | 主 Agent | 挂载任务 `inputFiles`；返工时额外挂载当前 `rework.inputFiles`，并使用对应独立 `prompt` 打开子聊天窗口 |
| `agent_wait_for_tasks` | 主 Agent | 阻塞等待多个任务完成（轮询状态 + 结果文件） |
| `agent_poll_tasks` | 主 Agent | 非阻塞查看多个任务当前状态 |
| `agent_complete_task` | 子 Agent | 写入结果并标记任务完成 |
| `agent_read_task_result` | 主 Agent | 读取已完成任务的结果文件 |
| `agent_mark_task_reviewed` | 主 Agent | 审查通过后标记任务为已审查 |
| `agent_request_rework` | 主 Agent | 结果不合格时记账（Agent 先写文档再调此工具） |
| `agent_summarize_results` | 主 Agent | 读取多个任务结果并合并为汇总文本 |

## 完整编排流程

```
Phase 3 产出子任务规格
       ↓
Step 1: agent_create_tasks   → 批量创建任务，返回 taskIds
       ↓
Step 2: agent_open_task_chats → 加载 spec（+ 可选 prompt），打开子聊天窗口
       ↓                          （任务状态自动变为 running）
Step 3: agent_wait_for_tasks  → 阻塞等待所有子任务完成
       或 agent_poll_tasks    → 非阻塞查看进度
       ↓
Step 4: agent_summarize_results → 合并所有结果
       ↓
Step 5: 逐条审查
       ├─ 通过 → agent_mark_task_reviewed
       └─ 不通过 → Agent写返工文档 → agent_request_rework → 重新等待
```

## `tasks.json` 关键字段

`tasks.json` 是当前需求目录下的任务状态账本。追加任务只能追加新项，不能覆盖已有任务。

| 字段 | 说明 |
|------|------|
| `id` | 任务唯一 ID，通常为 `task-<uuid>`。 |
| `title` | 任务标题，用于主窗口识别任务边界。 |
| `prompt` | 可选。创建任务时的原始任务要求；未传时子 Agent 仅根据 `inputFiles` 中的 spec 文件和 AGENTS.md 中的项目级约束自行执行。 |
| `inputFiles` | 子任务输入文件，页面工作流内至少应包含对应 `spec/*.md`。 |
| `resultFile` | 子任务当前最终结果文件；返工完成也必须覆盖该文件。 |
| `status` | 当前任务状态：`pending`、`running`、`completed`、`failed`、`reviewed`、`rework_requested`。 |
| `rework` | 当前最新一次返工记录，只在返工任务上存在。 |
| `reworks` | 全部返工历史，按发生顺序追加。 |

返工记录中的 `prompt` 是给返工子任务的简短独立说明，`inputFiles` 至少包含 `reworks/task-<uuid>-rework-<N>.md`。普通任务和返工任务统一通过 `inputFiles` 挂载文档，不生成 `prompts/` 目录。`reworks/` 只保存返工要求历史，不保存返工结果；任务结果始终以 `resultFile` 为准。

返工文档格式由 `page-development-workflow` 技能的「返工文档模板」定义，MCP 只负责机械写入。模板包含：返工编号、关联任务、返工原因、输入文件、结果文件、执行清单。详见 `phase4-execution-modes.md` → 返工文档模板。

## Step 1：创建任务

主 Agent 根据 Phase 3 的子任务规格创建任务。推荐批量创建：

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_create_tasks"
  arguments:
    tasks:
      - title: "共享层：类型定义 + API 服务"
        prompt: "根据 spec/shared-layer-spec.md 创建类型定义和 API 服务层..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/shared-layer-spec.md"
      - title: "列表页实现"
        prompt: "根据 spec/list-page-spec.md 实现列表页..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/list-page-spec.md"
      - title: "详情页实现"
        prompt: "根据 spec/detail-page-spec.md 实现详情页..."
        workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
        inputFiles:
          - "docs/design/2026-08-06-xxx-design/spec/detail-page-spec.md"
```

> 返回每个任务的 `id`、`resultFile`。`resultFile` 未指定时从 `inputFiles` 推断需求目录，写入 `docs/design|prod/<需求目录>/results/task-<uuid>.md`；无法推断时写入 `docs/results/task-<uuid>.md`。
>
> **页面开发工作流内使用时：** `resultFile` 必须显式指定，指向 `docs/design/YYYY-MM-DD-<topic>-design/results/<module>-result.md`，确保子任务结果归入功能文件夹。详见 `page-development-workflow` 的统一目录结构约定。

## Step 2：打开子聊天窗口

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds:
      - "task-<uuid-1>"
      - "task-<uuid-2>"
      - "task-<uuid-3>"
```

> 服务端通过 VS Code CLI 为任务的全部 `inputFiles` 追加 `--add-file`，把任务 `prompt` 作为独立指令传给子 Agent，并将状态更新为 `running`。
>
> 普通任务不生成 `prompts/` 文件夹；普通任务的可执行上下文来自 `spec/*.md` 和任务 `prompt` 字段。
>
> 返工任务会额外挂载当前 `rework.inputFiles`，其中返工要求文档位于当前设计目录的 `reworks/` 下；旧数据中的 `promptFile` 仅作为读取兼容。

### 执行编排规则

- 共享层任务（类型/API）先打开并等待完成，再打开依赖它的页面任务
- 无依赖的页面任务可以一批全部打开

```plaintext
# 第一批：先跑共享层
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer"]

# 等待共享层完成
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_wait_for_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer"]
    timeoutMs: 300000

# 第二批：并行跑页面任务
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_open_task_chats"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
```

## Step 3：等待或轮询

### 阻塞等待（推荐，适合需要统一收口的场景）

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_wait_for_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
    timeoutMs: 600000
    pollIntervalMs: 2000
```

> 返回 `completed`、`failed`、`pending` 三组 taskId。超时未完成的任务仍在 `pending` 中。

### 非阻塞查看（适合在等待过程中展示进度）

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_poll_tasks"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-list-page", "task-detail-page"]
```

> 返回每个任务的状态、结果文件路径、更新时间，以及总数/已完成/失败/待处理汇总。

## Step 4：汇总结果

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_summarize_results"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskIds: ["task-shared-layer", "task-list-page", "task-detail-page"]
```

> 返回合并后的 Markdown 汇总文本，主 Agent 可直接审查。

## Step 5：审查与返工

返工不是自动动作。主 Agent 必须先整理返工草案，向用户展示任务、原因、缺失验收项、期望结果、允许范围、资源定位和原 `resultFile`，并等待明确确认。确认前不得调用 `agent_request_rework` 或写入返工文件；自动推进模式也不例外。

用户确认后，Agent 按技能模板写入 `reworks/task-<uuid>-rework-<N>.md`，再调用 `agent_request_rework` 传入 `reworkFile` 路径；MCP 只更新 `tasks.json` 不生成文档。

用户要求调整草案时，修改后重新确认。只有用户回复“确认返工”“执行”“打开”等明确指令后，才执行以下返工调用并重新打开任务窗口。

```plaintext
# 审查通过
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_mark_task_reviewed"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-list-page"
    reviewNote: "列表页实现符合规格，类型检查通过"

# 需要返工
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_request_rework"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-detail-page"
    reason: "详情页缺少错误态和空态处理，请补充"
    reworkFile: "/Users/zm/work/yqa-g-h5-urban/docs/design/demo/reworks/task-detail-page-rework-1.md"
```

> Agent 先按技能模板写入 `reworkFile`，再调 `agent_request_rework` 传入路径；MCP 只更新 `tasks.json`。

### 返工数据结构

`tasks.json` 中每个任务的返工字段示例：

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

返工状态同步规则：

- `agent_request_rework`：Agent 先写返工文档再调用；MCP 设 `task.status = rework_requested`，当前 `rework.status = requested`，并追加到 `reworks[]`。
- `agent_open_task_chats`：`task.status = running`，当前 `rework.status = running`。
- `agent_complete_task`：`task.status = completed`，当前 `rework.status = completed`，并覆盖原 `resultFile`。

## 中途追加任务

中途追加任务只用于已确认范围内的新实现细节，不用于扩大需求范围。

允许追加的条件：

- 仍属于已确认需求、技术方案和实现计划范围。
- 不改变接口契约、共享层、页面范围、状态流和验收标准。
- 不影响已完成任务的主要产物。
- 主 Agent 已暂停说明新增原因、任务边界、`spec` 文件路径、结果文件路径，并获得用户确认。

编排方式：

1. 先在当前设计目录的 `spec/` 下新增子任务规格，例如 `02c-xxx-spec.md`。
2. 使用 `agent_create_task` 或 `agent_create_tasks` 创建追加任务。
3. 将新增 `spec` 放入 `inputFiles`，并显式指定 `resultFile`，建议使用当前功能目录的 `results/<编号>-result.md`。
4. 工具会根据 `inputFiles` 或 `resultFile` 把任务记录同步写入当前功能目录的 `tasks.json`。
5. 调用 `agent_open_task_chats` 打开追加任务。
6. 调用 `agent_wait_for_tasks` 等待完成。
7. 调用 `agent_summarize_results`，把追加任务结果合并进当前批次。
8. 主 Agent 审查；通过则 `agent_mark_task_reviewed`，不通过则 Agent 写返工文档 → `agent_request_rework`。

追加任务文件规则：

- 必须先在当前设计目录 `spec/` 下生成新的子任务 md，例如 `05-added-task-spec.md`。
- `resultFile` 必须显式指向当前设计目录 `results/<编号>-result.md`。
- 创建任务后应检查当前设计目录 `tasks.json` 已追加新任务，不能覆盖已有任务。
- 追加任务完成后应检查对应 `results/<编号>-result.md` 已生成并能被 `agent_summarize_results` 读取。

必须回到计划阶段的情况：新增页面、模块、接口、状态流、验收标准，或影响共享层、全局状态、路由、构建配置和 HIGH / CRITICAL 风险。

## 子 Agent 完成协议

子聊天窗口中的 Agent 在完成任务后应调用 `agent_complete_task`：

```plaintext
CallMcpTool:
  server_name: "agent-orchestrator"
  tool_name: "agent_complete_task"
  arguments:
    workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
    taskId: "task-list-page"
    result: "## 完成报告\n\n### 创建的文件\n- src/pages/list/index.tsx\n..."
```

> 兼容方式：子 Agent 直接写入 `resultFile`，主 Agent 轮询时会检测结果文件并自动同步为 `completed`。

## 适用场景

| 场景 | 推荐 |
|------|------|
| 页面开发工作流 Phase 4 多子任务并行 | ✅ 首选 |
| 独立模块调研（多个代码库并行探索） | ✅ |
| 批量代码审查（多个模块同时审查） | ✅ |
| 单文件简单修改 | ❌ 不需要 |
| 紧密耦合的串行任务 | ⚠️ 用内联执行更合适 |
