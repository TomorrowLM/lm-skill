# Phase 4：执行方式

用于执行 Phase 3 已确认的计划。进入本阶段前必须确认 Phase 1、Phase 2、Phase 3 均已完成并获得用户确认。

## 通用执行纪律

- 先读取实现计划或子任务规格。
- 只能执行计划内任务，不自行扩展范围。
- 只能并行计划明确允许的批次。
- 未标明可并行的任务默认串行。
- TDD 任务必须使用红-绿-重构：先写失败测试，再写最少实现，再重构。
- 每个并行批次完成后，按计划执行合流检查。

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
2. 用 `agent_open_task_chats` 为待执行任务打开 VS Code 聊天窗口（通过 `code chat --mode agent --add-file <spec>` 启动）。
3. **有共享层依赖时**：先打开共享层任务 → 等共享层完成 → 再打开功能层任务。
4. **无共享依赖时**：可以一次性打开所有任务聊天窗。
5. 用 `agent_wait_for_tasks` 等待全部任务完成。
6. 用 `agent_summarize_results` 汇总结果。
7. 审查结果；不合格则用 `agent_request_rework` 请求返工。
8. 通过后用 `agent_mark_task_reviewed` 标记，进入 Phase 5。

`resultFile` 规则：

```text
docs/design/YYYY-MM-DD-<topic>-design/.agent-orchestrator/results/<编号>-result.md
```

禁止事项：

- 禁止把修改同一文件的任务放在同一并行批次。
- 禁止共享层未完成就启动依赖它的任务。
- 禁止子 Agent 提交、推送、删除文件或执行破坏性操作。

### ⚠️ 常见遗漏

| 遗漏 | 后果 | 正确做法 |
|------|------|----------|
| 只调 `agent_create_tasks`，不调 `agent_open_task_chats` | 任务记录存在但子聊天窗未打开，`wait_for_tasks` 永远等不到结果 | 创建后立即 `agent_open_task_chats` |
| 只调 `agent_open_task_chats`，不调 `agent_wait_for_tasks` | 聊天窗打开但主窗口不等待，无法汇总 | 打开后立即 `agent_wait_for_tasks` |
| 忘记调 `agent_summarize_results` | 结果分散在各 resultFile，主窗口看不到汇总 | 等待完成后 `agent_summarize_results` |
| 不审查直接标记通过 | 子 Agent 产出有 bug 进入 Phase 5 | 逐条审查，不合格 `agent_request_rework` |

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
