# 云效 MCP 配置与排错

## 连接配置

VS Code 优先使用 HTTP 模式，类型必须为 `http`，不能写成 `url`：

```jsonc
{
  "yunxiao": {
    "type": "http",
    "url": "https://openapi-rdc.aliyuncs.com/ai/mcp?toolsets=project-management",
    "headers": {
      "x-yunxiao-token": "${env:YUNXIAO_ACCESS_TOKEN}"
    }
  }
}
```

stdio 是备选模式，需要 Node.js 20+：

```jsonc
{
  "yunxiao": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "alibabacloud-devops-mcp-server", "--toolsets=project-management"],
    "env": { "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>" }
  }
}
```

Region 部署地址格式为 `https://<your-org>.devops.aliyuncs.com/ai/mcp`。`project-management` 包含项目、工作项、迭代、版本和工时；其他工具集包括 `code-management`、`pipeline-management`、`organization-management`、`packages-management`、`application-delivery` 和 `test-management`。

## Token 安全

在云效个人设置中创建访问令牌，并授予「项目协作」权限。通过环境变量 `YUNXIAO_ACCESS_TOKEN` 提供；Windows 在用户环境变量中设置后重启 VS Code。排查时只检查变量是否存在，绝不打印或记录 Token。

## 工具未显示或被禁用

`disabled by the user` 是 VS Code 客户端侧问题，不是云效 401/403。按顺序检查：

1. 确认当前 Profile 的 MCP 配置中 `yunxiao` 已启用，且连接类型为 `http`。
2. 在 MCP 面板重启 server，并在 Chat 的 Tools 设置中启用 `_get_work_item` 或 `_search_workitems`。
3. 从 `chat.mcp.disabledTools` 中移除 `yunxiao`；即使配置为 `"yunxiao": []` 也应移除。
4. Windows 使用 `Ctrl+Shift+P` 打开 MCP 配置或服务器列表；macOS 使用 `Cmd+Shift+P`。
5. 修改环境变量后重启 VS Code。若出现激活器，继续激活其返回的下一层，直到查询工具显示。

## 认证与权限错误

- `missing Yunxiao access token`：检查环境变量是否存在，以及请求配置是否使用 `x-yunxiao-token`；不要改用 `Authorization`，也不要立即判断 Token 过期。
- `403 user not in organization`：核对 `organizationId` 和令牌的组织权限。
- `npx` Node 版本错误：确认 Node.js 版本为 20 或更高。

