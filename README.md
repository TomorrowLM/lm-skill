# lm-skill

前端 AI 辅助开发技能库，共 **32 项技能**，按功能分为 7 个系列。

---

## 一、页面开发工作流

从需求到交付的完整页面开发闭环。

| 技能 | 位置 | 描述 |
|------|------|------|
| `page-development-workflow` | 根目录 | **页面开发主流程**。Phase 1-6 完整闭环：需求分析 → 技术方案 → 实现计划 → 编码实现 → 测试验收 → 收尾交付。统一功能文件夹 `docs/design/YYYY-MM-DD-<topic>-design/` 收敛所有产物 |
| `writing-doc` | 根目录 | **技术文档编写**。输出技术方案文档、页面级实现方案，写入 `index.md` |
| `writing-plans` | `superpowers/` | **实现计划编写**。将需求拆分为可执行的子任务规格文件，写入 `spec/` |

### 统一产物目录结构

`page-development-workflow` 驱动下，所有技能的非代码产物收敛到 `docs/design/YYYY-MM-DD-<topic>-design/`：

```
docs/design/YYYY-MM-DD-<topic>-design/
│
├── index.md                            ← writing-doc（Phase 2 技术方案）
│
├── spec/                               ← writing-plans（Phase 3 实现计划）
│   ├── implementation-plan.md          ←   不拆分时
│   └── <module>-spec.md                ←   拆分时，多份子任务规格
│
├── assets/                             ← 静态资源（跨技能收敛）
│   ├── figma/                          ←   figma-implement-design：设计稿、标注图、图标
│   ├── screenshots/                    ←   webapp-testing / mcp-exe：浏览器截图
│   └── diagrams/                       ←   mcp-exe：思维导图、流程图
│
├── evidence/                           ← verification-before-completion
│   └── phase5-verification.md          ←   Phase 5 自动化验证 + 手动验收记录
├── results/                            ← subagent-driven-development / dispatching-parallel-agents
│   └── <id>-result.md                  ←   子任务执行结果
└── tasks.json                          ←   任务编排记录
```

| 产物 | 产出技能 | 落点 |
|------|---------|------|
| 技术方案文档 | `writing-doc` | `index.md` |
| 实现计划 | `writing-plans` | `spec/implementation-plan.md` |
| 子任务规格 | `writing-plans` | `spec/<module>-spec.md` |
| Figma 设计稿 / 图标 | `figma-implement-design` | `assets/figma/` |
| 浏览器截图 | `webapp-testing`、`mcp-exe` | `assets/screenshots/` |
| 思维导图 / 流程图 | `mcp-exe` | `assets/diagrams/` |
| 验证证据 | `verification-before-completion` | `evidence/phase5-verification.md` |
| 任务编排记录 | `subagent-driven-development`、`dispatching-parallel-agents` | `tasks.json` |
| 子任务结果 | `subagent-driven-development`、`dispatching-parallel-agents` | `results/<id>-result.md` |
| 业务代码（页面/组件/API） | `page-development-workflow`（Phase 4） | `src/pages/`、`src/services/` 等 |

> **跨技能约束：** `mcp-exe`、`webapp-testing`、`figma-implement-design` 在页面开发工作流内必须输出到对应 `assets/` 子目录，不再散落到桌面/tmp。

---

## 二、GitNexus 代码智能（7 项）

> 物理位置：`gitnexus/` 目录

基于知识图谱的代码理解、影响分析、安全重构工具集。

| 技能 | 描述 |
|------|------|
| `gitnexus-guide` | **总入口 / 使用手册**。工具与资源速查表，按任务类型路由到对应技能 |
| `gitnexus-exploring` | **架构探索**。理解代码结构、追踪执行流，回答"X 是怎么工作的？" |
| `gitnexus-impact-analysis` | **影响范围分析**。评估修改的爆炸半径，回答"改了 X 会破坏什么？" |
| `gitnexus-debugging` | **Bug 追踪**。从错误信息出发，沿调用链定位根源 |
| `gitnexus-pr-review` | **PR 审查**。分析 PR 变更的爆炸半径、检查测试覆盖、评估合并风险 |
| `gitnexus-refactoring` | **安全重构**。跨文件协调重命名、提取模块、拆分服务 |
| `gitnexus-cli` | **CLI 操作**。索引管理（analyze）、状态查询（status）、清理（clean）、文档生成（wiki） |

---

## 三、Superpowers 开发协作（9 项）

> 物理位置：`superpowers/` 目录

覆盖完整开发生命周期的高级工作流技能。

| 技能 | 描述 |
|------|------|
| `brainstorming` | **需求头脑风暴**。在编码前探索用户意图、需求和设计方案 |
| `writing-plans` | **实现计划编写**。将规格说明拆分为多步骤可执行计划 |
| `executing-plans` | **计划执行**。在独立会话中按审查检查点执行书面实现计划 |
| `subagent-driven-development` | **子代理驱动开发**。在当前会话中并行执行独立子任务 |
| `dispatching-parallel-agents` | **并行代理调度**。处理 2 个以上独立、无依赖的子任务 |
| `test-driven-development` | **测试驱动开发**。先写测试再写实现代码 |
| `systematic-debugging` | **系统化调试**。在提出修复方案前先系统性定位根因 |
| `requesting-code-review` | **代码审查**。系统化审查变更，支持完整审查 / diff 审查 / 附件审查 |
| `verification-before-completion` | **完成前验证**。运行验证命令并确认输出后才能声称完成 |

---

## 四、Skill-routing 技能路由（5 项）

> 物理位置：`skill-routing/` 目录；子技能在 `skill-routing/skills/`

技能发现、路由分发与设计类专项技能。

| 技能 | 描述 |
|------|------|
| `skill-routing` | **技能路由器**。根据用户意图在本地技能间选择、串联、分发 |
| `find-skills` | **技能发现**。帮助发现和安装外部技能 |
| `figma-implement-design` | **Figma 设计还原**。将 Figma 设计稿 1:1 转化为生产代码。产出到 `assets/figma/` |
| `frontend-design` | **前端视觉设计**。有辨识度的美学方向、配色、排版指导 |
| `vercel-react-best-practices` | **React/Next.js 性能优化**。Vercel 官方 70+ 条规则，8 个优先级类别 |

---

## 五、MCP 工具链（2 项）

| 技能 | 位置 | 描述 |
|------|------|------|
| `mcp-builder` | 根目录 | **MCP 服务器构建**。系统化构建生产级 MCP 工具 |
| `mcp-exe` | 根目录 | **MCP 工具执行**。发现工具、传递参数、处理结果。产出截图/图表到 `assets/` |

---

## 六、UI 组件库参考（2 项）

| 技能 | 位置 | 描述 |
|------|------|------|
| `an-ui` | 根目录 | **PC 端组件库**。基于 Ant Design 封装的高级组件（表单、表格、抽屉、弹窗） |
| `an-ui-mobile` | 根目录 | **移动端组件库**。基于 Ant Design Mobile 封装的 H5 组件 |

---

## 七、效率与质量保障（4 项）

| 技能 | 位置 | 描述 |
|------|------|------|
| `token-saving` | 根目录 | **Token 节省**。按预算分层获取上下文，减少无效 token 消耗 |
| `webapp-testing` | 根目录 | **Web 应用测试**。基于 Playwright 的交互测试，截图产出到 `assets/screenshots/` |
| `self-improvement` | 根目录 | **自我改进**。捕获错误和学习，持续优化技能表现 |
| `writing-skills` | 根目录 | **技能编写**。创建、修订、压力验证技能文档 |
