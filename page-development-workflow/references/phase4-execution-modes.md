# Phase 4：执行方式

用于执行 Phase 3 已确认的计划。进入本阶段前必须确认 Phase 1、Phase 2、Phase 3 均已完成并获得用户确认。

## 通用执行纪律

- 先读取实现计划或子任务规格。
- 只能执行计划内任务，不自行扩展范围。
- 只能并行计划明确允许的批次。
- 未标明可并行的任务默认串行。
- TDD 任务必须使用红-绿-重构：先写失败测试，再写最少实现，再重构。
- 每个并行批次完成后，按计划执行合流检查。

## 推进模式

Phase 4 开始前，必须向用户确认推进模式。推进模式决定任务之间的流转方式：

| 推进模式 | 行为 |
|----------|------|
| **自动推进** | 每完成一个任务（或一个并行批次）后自动进入下一个。仅在遇到需要用户决策的错误（如接口字段冲突、类型矛盾）时暂停。 |
| **手动确认** | 每完成一个任务（或一个并行批次）后暂停，展示完成报告（变更文件列表、验证结果），等待用户确认后再进入下一个。 |

### 定义："一个任务"

- 串行任务：spec 文件中编号的单个子任务（如 01、02、03…）。
- 并行批次：同一批次内可并行的子任务（如 02a、02b）算 **一个任务** — 必须全部执行完毕才视为该任务完成，然后按推进模式决定是否暂停。

### 推进模式下的中断条件

无论哪种推进模式，以下情况必须暂停并等待用户决策：

- 类型检查失败且根因不明确。
- 测试失败且需要修改其他任务的产物。
- 发现 spec 与技术方案或已修改代码冲突。
- 接口字段与 Swagger 实际返回不一致。
- 影响面前置未评估到的高风险修改。

### 推进模式不适用于

- Phase 3 的拆分方案选择 — 那是独立确认点。
- Phase 5 的验证结果展示 — Phase 5 总是需要用户确认。
- 跨 Phase 的过渡 — Phase 之间总是需要用户确认。

## 执行方式选择

| 执行方式 | 适用场景 |
|----------|----------|
| 直接实现 | 低复杂度、文件少、无需子任务规格 |
| 内联执行 | 有完整 `implementation-plan.md`，但不需要并行 |
| 多窗口并行 | 子任务相互独立，用户愿意手动开多个聊天窗口 |
| MCP 编排执行 | 已配置 agent-orchestrator-mcp，需要自动创建、打开、等待、汇总任务 |
| 子代理驱动 | 当前环境支持子代理，任务可由代理分工完成 |

## 多窗口并行

前置条件：

- 子任务规格已保存到 `docs/design/YYYY-MM-DD-<topic>-design/spec/`。
- 共享层任务已完成，或作为第一个子任务先执行。
- 每个子任务规格独立可执行。

主窗口职责：

1. 保存子任务规格文件。
2. 输出新窗口启动指令。
3. 等各窗口完成后检查变更范围。
4. 运行集成验证。
5. 如冲突，主窗口负责合并和修复。

新窗口启动指令模板：

```text
请读取 docs/design/YYYY-MM-DD-xxx-design/spec/module-a-spec.md，用 executing-plans 执行这个子任务规格。
项目根目录是 <workspace-root>，严格按计划步骤逐任务执行。
每完成一个任务记录变更范围；不要提交、推送、删除文件。全部完成后报告结果。
```

新窗口完成报告格式：

```md
## 子任务完成报告

- 规格文件：...
- 已完成任务：
  1. ...
  2. ...
- 修改文件：
  - ...
- 已运行验证：
  - 命令：...
  - 结果：...
- 需要主窗口注意：...
```

## MCP 编排执行

前置条件：

- `agent-orchestrator-mcp` 已注册。
- 子任务规格文件已保存。
- 共享依赖任务已识别。

编排顺序：

1. 用 `agent_create_tasks` 批量创建所有任务，必须显式传 `resultFile`。注意：`agent_create_tasks` 只创建任务记录，不会自动打开聊天窗口。
2. 用 `agent_open_task_chats` 为待执行任务打开 VS Code 聊天窗口（通过 `code chat --mode agent --add-file <spec>` 启动）。普通任务不生成 `prompts/` 文件夹，执行上下文来自 `spec/*.md` 和任务 `prompt` 字段。
3. **有共享层依赖时**：先打开共享层任务 → 等共享层完成 → 再打开功能层任务。
4. **无共享依赖时**：可以一次性打开所有任务聊天窗。
5. 用 `agent_wait_for_tasks` 等待全部任务完成。
6. 用 `agent_summarize_results` 汇总结果。
7. 审查结果；不合格则用 `agent_request_rework` 请求返工。
8. 通过后用 `agent_mark_task_reviewed` 标记，进入 Phase 5。

`resultFile` 规则：

```text
docs/design/YYYY-MM-DD-<topic>-design/results/<编号>-result.md
```

MCP 编排目录规则：

```text
docs/design/YYYY-MM-DD-<topic>-design/
├── spec/
├── tasks.json
├── reworks/
│   └── task-<uuid>-rework-<N>.md
└── results/
  └── <编号>-result.md
```

- `tasks.json` 存储所有任务状态。
- 普通任务不生成 `prompts/` 目录。
- `reworks/` 只保存返工 prompt md，直接平铺，不按 taskId 建子目录。
- `results/` 保存子任务结果；返工后仍覆盖原 `resultFile`。

禁止事项：

- 禁止把修改同一文件的任务放在同一并行批次。
- 禁止共享层未完成就启动依赖它的任务。
- 禁止子 Agent 提交、推送、删除文件或执行破坏性操作。

## 返工规则

返工只用于处理已确认计划内的遗漏执行项：原 `spec` 或 `implementation-plan.md` 已写明，但执行结果漏做、做错或未满足验收标准。

处理规则：

1. 不创建新任务边界。
2. 写清返工原因：问题点、缺失验收项、期望修改结果、允许改动范围。
3. MCP 编排时使用 `agent_request_rework`，再重新 `agent_open_task_chats`、`agent_wait_for_tasks`、`agent_summarize_results`。
4. 主窗口重新审查，通过后再标记 reviewed。
5. 多次返工仍不通过时暂停，向用户说明阻塞点。

MCP 返工状态和文件规则：

- `agent_request_rework` 会生成 `reworks/task-<uuid>-rework-<N>.md`。
- `tasks.json` 中 `rework` 记录当前返工，`reworks[]` 记录所有历史返工。
- 每条返工记录必须包含 `reason`、实际发送给子窗口的 `prompt`、`promptFile`、`status` 和时间字段。
- 重新打开返工任务时会挂载原 `spec` 和当前 `rework.promptFile`。
- 返工完成后 `task.status = completed`，当前 `rework.status = completed`，并覆盖原 `resultFile`。

## 中途追加子任务

新发现的实现细节可以在 Phase 4 内追加子任务，但必须先暂停说明并获得用户确认。

允许追加的条件：

- 仍属于 Phase 1-3 已确认范围。
- 不改变页面范围、接口契约、共享类型、共享样式、全局状态和验收标准。
- 不影响已完成任务的主要产物。
- 适合作为独立补充任务执行。

处理规则：

1. 暂停当前批次推进。
2. 说明新增原因、任务边界、建议的 `spec` 文件路径、结果文件路径和对现有任务的影响。
3. 等用户确认。
4. 在当前设计目录的 `spec/` 下新增子任务规格，编号接在当前批次后，例如 `02c-xxx-spec.md`。
5. 用 `agent_create_task` 或 `agent_create_tasks` 创建追加任务，把新增 `spec` 放入 `inputFiles`，并显式指定对应 `resultFile`；工具会把任务记录同步写入当前功能目录的 `tasks.json`。
6. 调用 `agent_open_task_chats`、`agent_wait_for_tasks`、`agent_summarize_results` 执行并汇总追加任务。
7. 主窗口审查；通过后标记 reviewed，不通过则走返工。

追加任务完成检查：

- 新增 `spec/NNx-<module>-spec.md` 已存在。
- `tasks.json` 已追加新任务，且未覆盖已有任务。
- 新任务 `resultFile` 指向当前设计目录 `results/<编号>-result.md`。
- 追加任务完成后，`results/<编号>-result.md` 已生成并能被 `agent_summarize_results` 读取。

必须回到 Phase 3 的情况：

- 新增页面、模块、接口、状态流或验收标准。
- Swagger 字段与方案不一致，需要调整 API 契约。
- 影响共享层、全局状态、路由或构建配置。
- 与既有 `spec` 或技术方案冲突。
- 发现未评估的 HIGH / CRITICAL 风险。

### ⚠️ 常见遗漏

| 遗漏 | 后果 | 正确做法 |
|------|------|----------|
| 只调 `agent_create_tasks`，不调 `agent_open_task_chats` | 任务记录存在但子聊天窗未打开，`wait_for_tasks` 永远等不到结果 | 创建后立即 `agent_open_task_chats` |
| 只调 `agent_open_task_chats`，不调 `agent_wait_for_tasks` | 聊天窗打开但主窗口不等待，无法汇总 | 打开后立即 `agent_wait_for_tasks` |
| 忘记调 `agent_summarize_results` | 结果分散在各 resultFile，主窗口看不到汇总 | 等待完成后 `agent_summarize_results` |
| 不审查直接标记通过 | 子 Agent 产出有 bug 进入 Phase 5 | 逐条审查，不合格 `agent_request_rework` |
| 返工时新建任务或新建 resultFile | 返工历史和原任务结果分裂 | 使用 `agent_request_rework`，保留原 task 和原 `resultFile` |
| 追加任务不新增 spec | 后续无法追踪追加范围 | 先新增 `spec/NNx-xxx-spec.md`，再创建任务 |

## 内联执行

适用于不拆分或低复杂度任务。

流程：

1. 读取 `implementation-plan.md`。
2. 按步骤逐项执行。
3. 每完成一个步骤记录变更文件。
4. 遇到测试失败或类型错误，按当前步骤修复，不扩大范围。
5. 全部完成后进入 Phase 5。

## 子代理驱动

适用于当前环境支持子代理且任务可独立探索或实现。

规则：

- 子代理只接收明确任务边界。
- 子代理不得修改计划外文件。
- 子代理结果必须由主窗口审查。
- 主窗口负责最终集成和验收。
