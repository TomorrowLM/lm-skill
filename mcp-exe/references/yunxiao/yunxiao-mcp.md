# 云效工作项查询

## 执行顺序

1. 优先调用已注册的云效 MCP 查询工具 `get_work_item`，按序列号或内部 ID 查询。
2. 如果查询工具未出现在当前工具列表，先激活可用的项目管理/查询工具组；若返回下一层激活器，继续激活，直到只读查询工具出现。不要用创建、工时或关联工具代替查询。
3. `search_workitems` 仅用于按标题搜索，不能搜索序列号；必须提供 `organizationId`、`spaceId` 和 `category`。
4. 只有 MCP 查询工具在完成激活后仍不可用时，才使用 [PowerShell 备用流程](powershell-fallback.md)。若 MCP 返回认证或组织权限错误，先按[配置与排错说明](setup.md)处理，不要把业务错误当成工具不可用。

### 激活路径

云效 MCP 工具按 VS Code Copilot 的分层懒加载机制分三层注入，初始只暴露 `_create_work_item` 等创建类工具：

| 层级 | 激活器 | 暴露的工具 |
|------|--------|-----------|
| 初始 | — | `_create_work_item`、`_create_effort_record` 等创建类 |
| 第 1 层 | `activate_fallback_mcp_alibabacloud-_delete_version_1` | 返回下一层入口 |
| 第 2 层 | `activate_fallback_mcp_alibabacloud-_delete_version_2` | `_get_work_item`、`_search_workitems`、`_get_project`、`_get_sprint` 等查询类 |

激活是链式的：先调用第 1 层激活器，成功后调用第 2 层，查询工具才可用。不要跳过任何一层，也不要用创建工具代替查询。

## 按编号查询

`get_work_item` 的 `workItemId` 可直接传任务序列号（如 `IFRD-10914`）或内部 ID。组织 ID 可使用 `5ec7de0a405cdab50f3fd8e0`，也可通过 `get_current_organization_info` 获取。

```text
get_work_item(
  organizationId="<ORG_ID>",
  workItemId="IFRD-10914"
)
```

工具在客户端可能显示为 `get_work_item` 或 `_get_work_item`。

## 按标题搜索

`search_workitems` 按标题匹配，`subject` 不匹配序列号。`category` 使用 `Req`、`Task` 或 `Bug`，三类工作项分池搜索；不要使用 `Requirement` 等全称。

```text
search_workitems(
  organizationId="<ORG_ID>",
  spaceId="<SPACE_ID>",
  category="Task",
  subject="门头名称"
)
```

项目 URL 中 `/projex/project/<spaceId>/req/`、`/task/`、`/bug/` 分别对应 `Req`、`Task`、`Bug`。不要用组织 ID 代替 `spaceId`。

## 按需阅读

- 配置、Token、工具禁用或认证错误：阅读 [setup.md](setup.md)。
- MCP 查询工具激活后仍不可用，且需要 Windows 直连：阅读 [PowerShell 备用流程](powershell-fallback.md)。
