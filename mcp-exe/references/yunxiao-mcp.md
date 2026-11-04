# 云效 (Yunxiao) MCP Server 配置与使用

## 概述

云效 MCP Server（`alibabacloud-devops-mcp-server`）为 AI 助手提供与阿里云云效 DevOps 平台交互的能力，支持项目管理、工作项查询、代码管理、流水线等。

## 配置方式

### 方式一：url 模式（推荐用于 VS Code Copilot）

```jsonc
{
  "yunxiao": {
    "type": "url",
    "url": "https://openapi-rdc.aliyuncs.com/ai/mcp?toolsets=project-management",
    "headers": {
      "Authorization": "Bearer <YOUR_TOKEN>"
    }
  }
}
```

**优点**：token 直接在 headers 传递，不依赖子进程环境变量；无需本地 npx 启动，避免启动超时或版本问题。
**注意**：VS Code Copilot 对 url 类型 MCP 支持有限——实测（2026-11-04）url 模式可正常列出 46 个工具，但需重启 VS Code 后生效。如工具仍不可用，检查 `settings.json` 中 `chat.mcp.disabledTools` 是否列了 `yunxiao`。

### 方式二：npx / stdio 模式（备选）

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

**要求**：Node.js >= 20.0.0。
**注意**：实测（2026-11-04）macOS VS Code Copilot 下 stdio 模式工具全部报 "disabled by the user"（疑似 npx 启动超时），建议优先使用 url 模式。如必须用 stdio 模式，确保终端能先手动成功运行 `npx -y alibabacloud-devops-mcp-server --toolsets=project-management`。

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

当前已知组织 ID：`5ec7de0a405cdab50f3fd8e0`

- 已知时直接用。
- 从云效 URL 获取：`https://devops.aliyun.com/organization/<organizationId>/...`
- `get_current_organization_info` 工具获取。`

### 2. 获取项目 ID（spaceId）

- 从云效项目 URL 获取：`https://devops.aliyun.com/projex/project/<spaceId>/...`

### 3. 查询工作项

**⭐ 推荐：直接用序列号获取（最快）**

`get_work_item` 的 `workItemId` 参数可以直接传序列号（如 `IFRD-10831`），无需先搜索再拿内部 ID。

```
get_work_item:
  organizationId: "<ORG_ID>"
  workItemId: "IFRD-10831"
```

> **实测**：`get_work_item` 同时接受内部 ID（如 `ad606472e1e6c956583fa7e832`）和序列号（如 `IFRD-10831`）。直接传序列号是最快的查询方式。

**按编号在项目内搜索**（需先知道 spaceId）：

`search_workitems` 的 `subject` 参数按**标题文本**匹配，**不搜索序列号（serialNumber）**。如果只知道 `IFRD-xxx` 但不知道所在项目，无法用 `search_workitems` 搜到；应优先用 `get_work_item` + 序列号。

```
search_workitems:
  organizationId: "<ORG_ID>"
  spaceId: "<SPACE_ID>"
  category: "Req"  // Req=需求, Task=任务, Bug=缺陷
  subject: "检查记录"  // 按标题关键词搜索，非序列号
```

**按内部 ID 获取**（如果已知）：

```
get_work_item:
  organizationId: "<ORG_ID>"
  workItemId: "ad606472e1e6c956583fa7e832"
```

### 4. 从 URL 提取参数

**项目页面 URL** 格式：

```
https://devops.aliyun.com/projex/project/<spaceId>/req/<internalWorkItemId>
```

例如 `https://devops.aliyun.com/projex/project/e4cc4abdc9380fbaf7ac3fb415/req/ad606472e1e6c956583fa7e832`

- `spaceId` = `e4cc4abdc9380fbaf7ac3fb415`
- `workItemId` (内部) = `ad606472e1e6c956583fa7e832`

### 5. 常用工具速查

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

### 401 未授权（常见于 Windows）

**根因**：Windows 上 npx 子进程可能未正确继承 `mcp.json` 中 `env` 配置的环境变量，导致 `YUNXIAO_ACCESS_TOKEN` 未传入。

**方案一：改 `url` 模式**（推荐）— token 直接写在 `headers`，不依赖子进程环境变量：

```jsonc
"yunxiao": {
  "url": "https://openapi-rdc.aliyuncs.com/ai/mcp?toolsets=project-management",
  "headers": {
    "Authorization": "Bearer <YOUR_TOKEN>"
  },
  "type": "url"
}
```

注意：确保 VS Code `settings.json` 的 `disabledTools` 中不列 `yunxiao`。

**方案二：设系统环境变量**后在终端验证：

```powershell
set YUNXIAO_ACCESS_TOKEN=pt-xxxxx
npx -y alibabacloud-devops-mcp-server --toolsets=project-management
```

能启动说明 token 有效，env 传递问题需要排查 MCP 客户端。

**其他排查**：
| 原因 | 排查 |
|------|------|
| Token 复制带换行/空格 | 检查 `%YUNXIAO_ACCESS_TOKEN%` 两端有多余字符 |
| 公司代理/防火墙 | 直连 `https://openapi-rdc.aliyuncs.com` 看是否可达 |
| TLS 证书问题 | 浏览器访问该 URL 看有无证书警告 |
| npx 缓存旧版本 | 加 `@latest` 锁定：`alibabacloud-devops-mcp-server@latest` |

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