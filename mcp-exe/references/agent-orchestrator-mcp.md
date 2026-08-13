# Agent 编排 — agent-orchestrator-mcp

当需要将复杂任务拆分为多个独立子任务并行执行时，使用 `agent-orchestrator-mcp` 工具链完成编排。

## 工具清单

| 工具 | 角色 | 说明 |
|------|------|------|
| `agent_create_task` | 主 Agent | 创建单个编排任务 |
| `agent_create_tasks` | 主 Agent | 批量创建多个编排任务 |
| `agent_list_tasks` | 主 Agent | 列出工作区任务，可按状态过滤 |
| `agent_get_task` | 主 Agent | 获取单个任务详情 |
| `agent_open_task_chats` | 主 Agent | 加载 spec + 任务 prompt（含返工原因），通过 VS Code CLI 打开子聊天窗口 |
| `agent_wait_for_tasks` | 主 Agent | 阻塞等待多个任务完成（轮询状态 + 结果文件） |
| `agent_poll_tasks` | 主 Agent | 非阻塞查看多个任务当前状态 |
| `agent_complete_task` | 子 Agent | 写入结果并标记任务完成 |
| `agent_read_task_result` | 主 Agent | 读取已完成任务的结果文件 |
| `agent_mark_task_reviewed` | 主 Agent | 审查通过后标记任务为已审查 |
| `agent_request_rework` | 主 Agent | 结果不合格时标记返工 |
| `agent_summarize_results` | 主 Agent | 读取多个任务结果并合并为汇总文本 |

## 完整编排流程

```
Phase 3 产出子任务规格
       ↓
Step 1: agent_create_tasks   → 批量创建任务，返回 taskIds
       ↓
Step 2: agent_open_task_chats → 加载 spec + 任务 prompt，打开子聊天窗口
       ↓                          （任务状态自动变为 running）
Step 3: agent_wait_for_tasks  → 阻塞等待所有子任务完成
       或 agent_poll_tasks    → 非阻塞查看进度
       ↓
Step 4: agent_summarize_results → 合并所有结果
       ↓
Step 5: 逐条审查
       ├─ 通过 → agent_mark_task_reviewed
       └─ 不通过 → agent_request_rework → 重新等待
```

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

> 服务端通过 VS Code CLI 打开 `code chat --mode agent --reuse-window --add-file <specFile>`，把任务 `prompt` 与（返工任务时的）返工原因作为指令传给子 Agent，并将状态更新为 `running`。

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
```

> `agent_request_rework` 会把返工原因写入任务；重新 `agent_open_task_chats` 时该原因随指令传给子 Agent，子 Agent 据此修正后重新 `agent_complete_task`。之后 `agent_wait_for_tasks` → 审查。

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
