# 依赖、追加与页面工作流

仅在任务存在依赖、需要中途追加，或处于页面开发工作流时读取。

## 有依赖的分批执行

1. 先创建全部任务，并标明依赖关系。
2. 先打开无前置依赖的第一批任务。
3. 用 `agent_wait_for_tasks` 确认前置任务完成且未失败。
4. 再打开依赖它们的下一批任务。
5. 每批完成后汇总并审查；不要让依赖任务读取未完成的共享产物。

```plaintext
# 第一批：先跑共享层
agent_open_task_chats:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-shared-layer"]

agent_wait_for_tasks:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-shared-layer"]
	timeoutMs: 300000

# 第二批：再并行跑依赖页面
agent_open_task_chats:
	workspaceRoot: "/Users/zm/work/yqa-g-h5-urban"
	taskIds: ["task-list-page", "task-detail-page"]
```

## 中途追加任务

仅可用于已确认范围内的实现细节，且不得改变接口契约、共享层、页面范围、状态流或验收标准。

1. 先说明追加原因、任务边界、输入与结果位置，取得用户确认。
2. 页面工作流中，先新增当前设计目录下的子任务规格。
3. 创建任务时将规格加入 `inputFiles`，并显式传入 `resultFile`。
4. 打开、等待、汇总并审查追加任务。

工具会依据 `inputFiles` 或 `resultFile` 将任务追加到当前设计目录的 `tasks.json`；追加后检查账本未覆盖既有任务，并确认对应结果文件可被 `agent_summarize_results` 读取。

新增页面、模块、接口、状态流、验收标准，或影响共享层、全局状态、路由、构建配置时，应回到计划阶段。

## 页面工作流约束

这些是页面工作流的目录约定，不是 MCP 创建接口的必填参数：

- `inputFiles` 应包含对应 `spec/*.md`。
- `resultFile` 应显式指向当前功能目录的 `results/<module>-result.md`。
- 子任务账本写入当前设计目录的 `tasks.json`；只能追加任务，不覆盖既有记录。
