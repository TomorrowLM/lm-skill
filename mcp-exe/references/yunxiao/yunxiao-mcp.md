# 云效工作项查询

## 执行顺序

1. 优先调用已注册的云效 MCP 查询工具 `get_work_item`，按序列号或内部 ID 查询。
2. 如果查询工具未出现在当前工具列表，先激活可用的项目管理/查询工具组；若返回下一层激活器，继续激活，直到只读查询工具出现。不要用创建、工时或关联工具代替查询。
3. `search_workitems` 仅用于按标题搜索，不能搜索序列号；必须提供 `organizationId`、`spaceId` 和 `category`。
4. 只有 MCP 查询工具在完成激活后仍不可用时，才使用 [PowerShell 备用流程](powershell-fallback.md)。若 MCP 返回认证或组织权限错误，先按[配置与排错说明](setup.md)处理，不要把业务错误当成工具不可用。
5. 读取结果时按“完整任务输出”整理正文和元信息；正文有图片/附件时，继续执行[图片附件读取](#图片附件读取)，不要只返回摘要。

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

## 完整任务输出

用户要求获取/读取任务时，不能只返回摘要。输出应包含：

1. **任务元信息**：编号、标题、类型/类别、状态、负责人、项目、迭代、优先级、预估工时，以及返回结果中存在的相关自定义字段。字段缺失时标为未提供或省略，不推测。
2. **完整需求正文**：保留原有事实、范围、条件、数字、接口/页面名称、提示文案、验收标准和参考信息。原文结构凌乱时，可重新分组为背景、需求、规则/边界、验收标准、参考等小节；不得为了简洁删除要求。重复内容可合并，但保留语义；有歧义或冲突时单独标注待确认。
3. **图片和附件**：按下一节读取并在结果中列出地址、图像内容和对应需求；未读取成功的附件也要明确列出及说明原因。
4. **文档写入**：完成任务内容和图片整理后，默认写入当前业务项目根目录下的 `docs/design/YYYY-MM-DD-<topic>-design/prod/index.md`。日期使用执行当日，`<topic>` 从任务主题提炼为简洁 kebab-case；用户指定其他路径时遵循用户路径。目标文件已存在时先读取并保留已有内容，不得直接覆盖；无法确定所属业务项目时先询问用户。

## 图片附件读取

工作项描述可能通过 Markdown 图片、`fileIdentifier` 或附件字段引用图片。读取步骤：

1. 从正文/附件列表提取附件标识，并调用只读工具 `get_workitem_file`（客户端可能显示为 `_get_workitem_file`），参数使用当前工作项 ID、组织 ID 和附件 ID。不要调用 `_create_workitem_attachment` 或 `_delete_work_item` 来读取附件。
2. 该工具可能只返回文件名、大小、`embedUrl` 和短时有效的 `url`，不一定返回图片字节。需要视觉识别时，使用刚返回的下载地址，通过当前环境支持的文件下载方式保存到临时目录，再交给可用的视觉分析工具；下载地址必须原样使用，不写入代码、日志或最终答复。
3. 若下载返回 401/403，先重新调用附件读取工具取得新地址并重试一次，以排除短时链接过期。新地址仍失败时停止，不切换到写入工具或猜测内容；告知用户附件标识、文件名和错误类别，并请求直接上传图片。
4. 图片读取成功后，在完整任务输出中逐张注明：

  - **图片地址**：优先填写工具返回的稳定 `embedUrl`；没有时使用正文中的原始附件引用。不要展示短时签名 `url`。
  - **图片内容**：仅描述图中可辨认的界面、字段、文案、状态或流程；无法辨认之处明确标注。
  - **对应需求**：指出图片补充或佐证的具体需求点/验收标准；无法建立对应关系时说明“未能对应”。

不要仅凭文件名推断图片内容，也不要把图片描述误写成任务原文。图片文字与正文不一致时并列指出，标记待确认。

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
