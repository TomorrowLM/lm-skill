# Windows PowerShell 备用查询

仅当已注册 MCP 的只读查询工具在完成工具激活后仍不可用时，才使用此备用请求。若 MCP 返回认证或组织权限错误，应先查阅 [配置与排错说明](setup.md)。Token 只从环境变量读取，不得回显、写入请求体或日志。

```powershell
$organizationId = '<ORG_ID>'
$workItemId = 'IFRD-10914'
if ([string]::IsNullOrWhiteSpace($env:YUNXIAO_ACCESS_TOKEN)) {
  throw 'YUNXIAO_ACCESS_TOKEN is not set'
}

$headers = @{
  'x-yunxiao-token' = $env:YUNXIAO_ACCESS_TOKEN
  Accept = 'application/json, text/event-stream'
}
$payload = @{
  jsonrpc = '2.0'
  id = 1
  method = 'tools/call'
  params = @{
    name = 'get_work_item'
    arguments = @{
      organizationId = $organizationId
      workItemId = $workItemId
    }
  }
} | ConvertTo-Json -Depth 8

$response = Invoke-WebRequest `
  -Uri 'https://openapi-rdc.aliyuncs.com/ai/mcp' `
  -Method Post `
  -Headers $headers `
  -ContentType 'application/json; charset=utf-8' `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($payload)) `
  -UseBasicParsing
$stream = $response.RawContentStream
$stream.Position = 0
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
try {
  $mcpResponse = $reader.ReadToEnd() | ConvertFrom-Json
  if ($mcpResponse.error) {
    throw $mcpResponse.error.message
  }
  $item = $mcpResponse.result.content[0].text | ConvertFrom-Json
  $item | Select-Object serialNumber, subject, status
} finally {
  $reader.Dispose()
}
```

`ConvertTo-Json -Depth 8` 保留 JSON-RPC 嵌套参数；请求和响应均按 UTF-8 处理。
