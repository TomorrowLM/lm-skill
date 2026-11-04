# 云效 (Yunxiao) MCP Server 配置与使用

## 概述

云效 MCP Server（`alibabacloud-devops-mcp-server`）为 AI 助手提供与阿里云云效 DevOps 平台交互的能力，支持项目管理、工作项查询、代码管理、流水线等。

## 配置方式

### 方式一：npx / stdio 模式（推荐用于 VS Code）

```jsonc
{
  "yunxiao": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "-y",
      "alibabacloud-devops-mcp-server",
      "--toolsets=project-management"
    ],
    "env": {
      "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
    }
  }
}
```

**优点**：兼容性好，通过 npx 自动下载运行，无需 Docker。
**要求**：Node.js >= 20.0.0。

### 方式二：官方托管远程端点

```jsonc
{
  "yunxiao": {
    "url": "https://openapi-rdc.aliyuncs.com/ai/mcp?toolsets=project-management",
    "headers": {
      "Authorization": "Bearer <YOUR_TOKEN>"
    },
    "type": "url"
  }
}
```

**注意**：部分客户端（如 VS Code Copilot）对 `url` 类型的 MCP Server 支持有限，可能默认禁用所有工具。优先使用方式一。

### 方式三：Region 站点

```
https://<your-org>.devops.aliyuncs.com/ai/mcp
```

## Token 获取

1. 登录 [云效](https://devops.aliyun.com)
2. 个人头像 → 个人设置 → 个人访问令牌 → 新建令牌
3. 授予所需权限（至少勾选「项目协作」）
4. Token 格式：`pt-xxxxxxxxxxxxxxxx`
5. Token 只显示一次，妥善保存

## 工具集（Toolsets）

用 `--toolsets` 参数限制启用的工具域，避免 200+ 工具撑满 LLM context：

| 工具集 | 说明 |
|--------|------|
| `project-management` | 项目、工作项、迭代、版本、工时管理 |
| `code-management` | 代码仓库、分支、MR、文件操作 |
| `pipeline-management` | 流水线管理 |
| `organization-management` | 组织、部门、成员、角色 |
| `packages-management` | 制品仓库 |
| `application-delivery` | 应用交付、部署 |
| `test-management` | 测试管理 |

组合示例：`--toolsets=code-management,project-management`

## VS Code Copilot 配置避坑

### 问题：工具全部 "disabled by the user"

**根因**：在 `settings.json` 中把 MCP server 名列入 `chat.mcp.disabledTools`（即使是空数组 `[]`），VS Code Copilot 会按默认限制策略处理该 server 的**所有**工具，即使 `chat.permissions.default: "autoApprove"` 也不生效。

**修复**：从 `chat.mcp.disabledTools` 中删除该项。

```jsonc
// ❌ 错误 — 空数组也会禁用所有工具
"chat.mcp.disabledTools": {
  "yunxiao": []
}

// ✅ 正确 — 不列出即可走 autoApprove
"chat.mcp.disabledTools": {
  "gitnexus": []
}
```

### 推荐 settings.json 配置

```jsonc
{
  "chat.permissions.default": "autoApprove",
  "chat.mcp.disabledTools": {
    // 只列出需要禁用的 server，不列 yunxiao
  }
}
```

## 使用流程

### 1. 获取组织 ID（organizationId）

- 已知时直接用。
- `get_current_organization_info` 工具获取。
- 从云效 URL 获取：`https://devops.aliyun.com/organization/<organizationId>/...`

### 2. 获取项目 ID（spaceId）

- 从云效项目 URL 获取：`https://devops.aliyun.com/projex/project/<spaceId>/...`

### 3. 查询工作项

**按编号搜索**：

```
search_workitems:
  organizationId: "5ec7de0a405cdab50f3fd8e0"
  spaceId: "e4cc4abdc9380fbaf7ac3fb415"
  category: "Req"  // Req=需求, Task=任务, Bug=缺陷
  subject: "IFRD-10659"
```

**按 ID 直接获取**（需先知道内部 ID）：

```
get_work_item:
  organizationId: "5ec7de0a405cdab50f3fd8e0"
  workItemId: "ad606472e1e6c956583fa7e832"
```

### 4. 常用工具速查

| 工具 | 用途 |
|------|------|
| `get_current_organization_info` | 获取当前组织信息 |
| `get_current_user` | 获取当前用户信息 |
| `search_projects` | 搜索项目 |
| `search_workitems` | 搜索工作项（需 orgId + spaceId） |
| `get_work_item` | 获取工作项详情（需 orgId + workItemId） |
| `list_sprints` | 列出迭代 |
| `list_workitem_activities` | 查看工作项活动记录 |
| `list_work_item_comments` | 查看工作项评论 |

## 故障排查

### 工具全被禁用
→ 检查 `settings.json` → `chat.mcp.disabledTools` 是否列出了该 server 名。

### 403: user not in organization
→ organizationId 不正确，从云效 URL 确认正确值。

### search_workitems 返回空
→ spaceId 不正确（不要用 organizationId 作为 spaceId），从项目 URL 确认。

### npx 模式报 Node 版本错
→ 确认 `node --version` >= 20.0.0。如版本过低，升级 Node 或用 Docker 方式。

### curl 备用方案（当 MCP 工具不可用时）

```bash
curl -s -X POST "https://openapi-rdc.aliyuncs.com/ai/mcp" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_work_item","arguments":{"organizationId":"<ORG_ID>","workItemId":"<ITEM_ID>"}}}'
```

**关键 Header**：
- `Accept: application/json, text/event-stream` — 缺此返回 406
- `Content-Type: application/json` — 缺此返回 415