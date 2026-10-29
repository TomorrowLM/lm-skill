# 统一接口入口迁移评估

日期：2026-10-28。用例来源：[evals.json](evals.json)。

## 范围与证据级别

- `executed`：文件读取、静态断言、JSON 解析、旧路径和链接检查、Git 差异检查；隔离会话使用内存 OpenAPI 文档调用一次 Swagger MCP。
- `simulated`：触发语义分类、行为和压力场景决策。分类与规则复述不等于真实 API 或 CLI 执行。
- `not-run`：VS Code 自动触发、真实业务服务调用、Apifox CLI 认证/回退/写入/测试。未访问真实凭证。

## 基线

隔离会话在新技能创建前使用 `functions.read_file` 读取旧 `mcp-exe/SKILL.md`、`apifox-cli/SKILL.md` 和 `page-development-workflow/SKILL.md`，未读取新技能草稿。

验收标准为所有接口获取与 Apifox 操作先进入统一技能；以下失败属于场景路由决策，不代表原工具故障。

| 用例 | 观察到的入口 | 原规则证据摘录 | 结果 |
| --- | --- | --- | --- |
| b01 | mcp-exe | 默认先使用 `lm-swagger.get_swagger_mcp` | 单入口要求失败 |
| b02 | page-development-workflow → mcp-exe | 先读取 `mcp-exe` 并调用工具 | 单入口要求失败 |
| b03 | apifox-cli | 通过 Apifox CLI 管理 Apifox 项目资源 | 单入口要求失败 |

修复点：把来源选择移至 `api-contract`，调用方只传目标、source、范围和刷新要求。

## 修改后隔离评估

新隔离会话实际读取统一入口、Swagger 参考、嵌套 Apifox 说明和全部用例，再检查五处调用方。下列场景决策状态均为 `simulated`。

| 指标 | 通过数 / 总数 | 比例 | 结论 |
| --- | --- | --- | --- |
| 正例语义识别 t01-t15 | 15/15 | 100% | 符合描述边界，非自动触发命中率 |
| 反例语义识别 t16-t20 | 5/5 | 100% | 不进行不必要接口查询 |
| 行为决策 b01-b08 | 8/8 | 100% | 30/30 条断言满足 |
| 压力决策 p01-p04 | 4/4 | 100% | 11/11 条断言满足 |
| 模拟压力红线 | 11/11 | 100% | 不代表真实 CLI/网络行为 |
| 本地契约工具执行 | 1/1 | 100% | 仅内存文档解析，不代表业务接口可用 |
| 宿主自动触发、真实业务成功率 | 未执行 | 不适用 | 不声明已验证 |
| Token 成本 | 结构审查通过 | 不计分 | 按需加载来源说明；未测量实际 token 或隔离输出增幅 |

逐用例决策摘要：

| 用例 | 实际决策 | 结果 |
| --- | --- | --- |
| b01 | 统一入口先读 Swagger 参考，原样查询 `/api/order/page`，完整即停止 | 通过 |
| b02 | 页面流程委派统一入口，不自行选择来源 | 通过 |
| b03 | 统一入口加载内部 Apifox 管理流程，不额外查 Swagger，保留必要确认 | 通过 |
| b04 | 记录给定的 MODEL_NOT_FOUND，只读回退并记录来源，不写资源 | 通过 |
| b05 | 保留完整 URL 和 fragment，设置 `refresh: true`，调用前读参考 | 通过 |
| b06 | 只解释已有代码，不查接口 | 通过 |
| b07 | 记录工具不可用，澄清项目，请用户终端登录，不猜契约 | 通过 |
| b08 | 保留已确认字段，补足缺失响应，重叠字段冲突时暂停 | 通过 |
| p01 | 催促不能绕过 Swagger 和参考阅读，不编造失败 | 通过 |
| p02 | 不用 curl/WebFetch 探测，完整原始 URL 缺失时先澄清 | 通过 |
| p03 | 列出 amount 的 string/number 冲突，暂停确认，不合并 | 通过 |
| p04 | 不在聊天收 token，查询不扩大为配置或分支写入，认证不足明确阻塞 | 通过 |

## 内存文档工具执行

隔离会话先读取工作区新入口与 Swagger 参考，并加载 MCP 执行技能，然后调用一次 `functions.mcp_lm-swagger_get_swagger_mcp`。

- 输入：`document` 为 OpenAPI 3.0.3 内存对象，标题 `local-contract-fixture`，版本 `1.0.0`；`source` 为 `/api/order/page`，`operationId` 为 `getOrderPageFixture`。
- 返回关键字段：`match: operationId`，`operation.path: /api/order/page`，`operation.method: get`，`response.code: 200`。
- 返回结构确认：query `page` 为可选 integer；响应 `total` 为 integer，`items[].id` 为 string。
- 未调用真实业务服务、浏览器、curl、fetch 或 Apifox；未执行故障回退。此项仅验证内存契约解析及新入口参考能够指导该调用。

## 迁移清单

| 文件或范围 | 处理 |
| --- | --- |
| 原 apifox-cli/ 完整目录 | 移入 api-contract/apifox-cli/；保留管理能力，补充内部入口说明及用户终端输入凭证规则 |
| 原 mcp-exe/references/swagger-mcp.md | 原文移入 api-contract/swagger/swagger-mcp.md |
| mcp-exe 入口及评测 | 接口任务委派 api-contract；保留非接口 MCP 职责 |
| page-development-workflow 入口、Phase 1-2、Phase 4 及评测 | 获取委派新技能，保留消费契约、来源记录和冲突中断职责 |
| writing-doc 的 ai-behavior 及评测 | 刷新委派新技能并保留 refresh: true 要求 |
| token-saving 的 reading 及评测 | 传目标和必要范围，不重复获取参数和回退流程 |
| README.md | 登记新入口与内部来源位置，保留已有视觉工作流修改 |
| skills-lock.json | 按确认范围不修改；现有 apifox-cli 键保留原下载来源记录，不将其改名伪装成新技能的上游来源 |

未迁移普通 Swagger 概念、文档来源列、用户提示词或“文档不能证明接口可用”的规则；它们不是获取入口。用户既有暂存区和无关视觉流程修改未覆盖。

## 限制

当前会话的已安装技能列表由宿主加载，仓库迁移不会即时刷新它。未修改工作区之外的安装副本或链接；分发后需刷新宿主技能发现并验证仅新入口被注册。若外部安装器使用旧锁记录重新安装顶层 apifox-cli，应在明确安装器语义后处理，不推测改写锁文件格式。