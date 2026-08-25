---
name: page-development-workflow
description: >-
  当用户说“开发一个XX页面”“实现这个设计稿”“按PRD做页面”“新建模块/功能页”“做列表页/详情页/编辑页/表单页/大屏页”，或需要把 Figma、原型、接口文档、PRD 落地为前端页面，或大幅改造已有页面的结构/路由/接口/状态流/组件树时使用。
  覆盖需求分析→技术方案→实现计划→编码→测试验收→交付的完整闭环。
  不触发：修 bug、改文案、调单个样式、加单个字段/按钮、解释代码、代码评审、小范围快速改动。
---

# 页面开发工作流

用于从零开发或大幅改造前端功能页面。它是一个严格的状态机，不是代码模板集合。

## 铁律

1. **禁止跳阶段**：必须按 Phase 1 → 2 → 3 → 4 → 5 → 6 顺序执行。
2. **禁止提前写代码**：Phase 4 前不得编写业务代码，包括类型、常量、组件、页面和服务层。
3. **每阶段必须等用户确认**：阶段产出展示后，只有用户明确回复“继续 / 可以 / 下一步 / 执行”才进入下一阶段。
4. **每阶段必须有产出**：不能空过，也不能用“后续再补”代替阶段交付物。

如果用户直接说“帮我开发页面 / 实现设计稿 / 按 PRD 写页面”，从 Phase 1 开始；除非用户明确要求轻量路径。

## 触发判断

### 使用本技能

- 新建页面、新建模块、新增完整功能页。
- Figma / PRD / 原型图 / Swagger 接口文档落地。
- 大幅改造已有页面的结构、路由、接口、状态流或组件树。
- 需求涉及多个组件、接口、状态、交互和验收标准。

### 不使用本技能

- 单个文案、字段、按钮、样式、布局微调。
- 单点 bug 修复、报错定位、测试失败排查。
- 只解释代码、只做代码审查、只写小片段示例。
- 用户明确要求“直接改 / 快速处理”的小范围变更。

## 总流程

```text
Phase 1 需求分析与技术调研
  → 用户确认
Phase 2 技术方案编写
  → 用户确认
Phase 3 制定实现计划
  → 用户确认
Phase 4 编码实现
Phase 5 测试验收
  → 用户确认
Phase 6 收尾交付
```

轻量路径只允许合并 Phase 1-3 的展示和确认，不允许省略产出，也不允许跳过 Phase 4-6。

## 按需读取 references

主文件只保留触发、门控和状态机。阶段细节按需读取：

| 文件 | 何时读取 |
|------|----------|
| `references/phase-gates.md` | 进入任一 Phase 前，查看输入、产出、完成标志和门控 |
| `references/pages-registry.md` | Phase 2 注册页面到 `pages.yaml` 时，查看 schema 和约束 |
| `references/phase3-split-strategies.md` | Phase 3 需要设计拆分方案、实现计划、并行编排时 |
| `references/phase4-execution-modes.md` | Phase 4 需要多窗口、MCP 编排、子代理或内联执行时 |
| `references/phase5-verification.md` | Phase 5 选择验证命令、记录证据、做 UI 验收时 |

引用规则：

- 进入 Phase 3、Phase 4、Phase 5 时，必须读取对应 reference 后再执行该阶段。
- 使用 MCP 编排时，同时读取 `references/phase4-execution-modes.md` 和 `mcp-exe/references/agent-orchestrator-mcp.md`。
- Phase 1 涉及 Swagger/OpenAPI、Figma 或浏览器资源时，按需读取 `mcp-exe` 对应案例；Phase 3 只记录资源定位，Phase 4 隔离任务自行获取实现所需详情。

## Phase 1：需求分析与技术调研

目标：把用户需求转成可确认的页面范围，不写方案、不写代码。

必须确认：

- 页面目标、目标用户、核心流程、输入输出、边界状态、成功标准。
- 页面路由、文件位置、组件库选择、交互流程。
- 接口字段映射、状态枚举与展示映射。
- 可复用的现有组件、Hook、服务、执行流。

按条件加载：

- 从零需求且无设计稿/接口文档：读取 `brainstorming`。
- Figma / UI / React 实现相关：读取 `skill-routing`，只让它路由 UI/视觉/React 子技能。
- Swagger / OpenAPI / Figma：读取 `mcp-exe` 对应案例，获取确认需求、范围和接口契约所需的信息。
- 项目已有 GitNexus 索引：用 GitNexus 探索可复用代码和执行流。

结束时展示需求共识、范围取舍、待决策点和调研摘要，等待用户确认。

## Phase 2：技术方案编写

目标：把已确认需求写成可评审、可落盘的技术方案。

必须明确：

- 路由和文件位置。
- 组件拆分、props、状态和职责边界。
- hooks / utils / store 的边界。
- 类型、常量、枚举和状态映射。
- API 请求参数、响应字段、错误和空态处理。

规则：

- 用户已有技术方案时，审阅并补充实现细节。
- 用户没有技术方案时，读取 `writing-doc` 并创建方案文档。
- 默认落盘到 `docs/design/YYYY-MM-DD-<topic>-design/index.md`。
- 方案中涉及的每个页面必须已在 `docs/pages/pages.yaml` 中注册；若不存在则提示用户先补充页面条目。`pages.yaml` 的 schema 和约束见 `references/pages-registry.md`。
- 提交用户审查前，清理占位符、内部矛盾、歧义和范围膨胀。

结束时展示技术方案摘要和文档路径，等待用户确认。

## Phase 3：制定实现计划

目标：把技术方案拆成可执行计划，明确串行、并行和合流检查点。

必须先读取 `references/phase3-split-strategies.md`。进入 Phase 3 时，先向用户确认已读取该文件，再展示拆分方案。

硬性要求：

- 先给出 3-5 种拆分方案，至少包含“不拆分”方案。
- 每个方案包含子任务、产出文件、执行方式、优点、风险和推荐排序。
- 等用户选择拆分方案和执行方式后，再生成实现计划。
- 不拆分：写入 `docs/design/YYYY-MM-DD-<topic>-design/spec/implementation-plan.md`。
- 拆分：写入多个 `docs/design/YYYY-MM-DD-<topic>-design/spec/<module>-spec.md`，按执行顺序编号（01、02、03…）；同一批次内可并行的子任务用字母后缀区分（如 02a、02b）

如需要修改现有模块且项目已有 GitNexus 索引，先做影响面分析；HIGH / CRITICAL 风险必须提醒用户后再继续。

结束时展示实现计划或子任务规格路径，等待用户确认。

## Phase 4：编码实现

目标：严格执行 Phase 3 已确认的计划。

进入前必须确认：

- Phase 1 已确认。
- Phase 2 已确认。
- Phase 3 已确认。

缺任一项，禁止写代码，回到对应阶段补齐。

**执行方式选择（必须等用户确认）：**

审视实现计划中标记为"可并行"的批次，向用户展示执行方式选项并等待选择：

| 方式 | 适用场景 |
|------|----------|
| 内联串行 | 任务少、无并行需求，当前对话逐个执行 |
| 子代理驱动 | 有可并行批次，子代理分工执行 |
| MCP 编排 | 已配置 agent-orchestrator-mcp，自动创建/等待/汇总 |
| 多窗口并行 | 用户愿意手动开多个聊天窗口 |

只允许串行前置任务在当前阶段立即内联执行；并行批次必须等用户选择方式后再动手。

**推进模式选择（必须等用户确认）：**

向用户展示计划中的任务序列（并行批次算一个任务），询问推进模式：

| 模式 | 行为 |
|------|------|
| 自动推进 | 每完成一个任务后自动进入下一个，直到全部完成或遇到需要用户决策的错误 |
| 手动确认 | 每完成一个任务后暂停，展示完成报告并等待用户确认后再进入下一个 |

执行方式和推进模式都确认后才能开始编码。

执行规则：

- 先读取实现计划里的执行编排。
- 开始编码前必须按 `references/phase4-execution-modes.md` 完成 Phase 4 入口自检。
- 只能并行计划中明确允许的批次。
- 未标明可并行的任务默认串行。
- 涉及同一文件、同一 symbol、同一 API 契约、同一共享样式或同一全局状态时禁止并行。
- TDD 任务必须读取 `test-driven-development` 并按红-绿-重构执行。
- 多窗口 / MCP 编排 / 子代理 / 内联执行细节见 `references/phase4-execution-modes.md`。
- **MCP 编排时**必须先读取 `mcp-exe/references/agent-orchestrator-mcp.md`，按 Step 1→2→3→4→5 完整流程执行，禁止跳过 `agent_open_task_chats`。
- 多窗口、MCP 编排和子代理等隔离执行方式中，主窗口只传递设计资源定位与验收目标；执行或返工任务自行获取详情、分析资源并落盘，主窗口只读取压缩结果。
- 返工前必须先向用户展示返工草案并获得明确确认；确认前禁止创建返工记录、生成返工文件或打开返工子窗口，自动推进模式也不能跳过此门禁。
- 已确认计划内的遗漏执行项走返工；返工和追加任务细节以 `references/phase4-execution-modes.md` 为准。
- 新增页面、模块、接口、状态流、验收标准、共享层变更或 HIGH / CRITICAL 风险时，必须回到 Phase 3 更新计划并等待确认。

结束时产出可工作的代码和变更记录，然后进入 Phase 5。

## Phase 5：测试验收

目标：用证据证明实现可用，不凭感觉宣布完成。

必须先读取 `references/phase5-verification.md` 和 `verification-before-completion`。进入 Phase 5 时，先向用户确认已读取这两份文件，再执行验证命令。

验收内容：

- 按 `references/phase5-verification.md` 完成 Phase 5 入口自检。
- 读取 `package.json`，按项目脚本选择 test / typecheck / lint / build 命令。
- 运行命令并阅读输出。
- 记录自动化验证证据。
- 给出手动验收入口和核心测试点。
- 验收通过后，读取 `requesting-code-review` 做代码审查。

验收失败或审查出现 Critical / Important 问题时，回到 Phase 4 修复，再重新验收。

证据默认落盘到 `docs/design/YYYY-MM-DD-<topic>-design/evidence/phase5-verification.md`。

结束时展示验证证据、手动验收记录和审查结论，等待用户确认。

## Phase 6：收尾交付

目标：确认变更范围，输出交付摘要。

必须完成：

- 汇总 Phase 5 自动化验证、手动验收和代码审查结论。
- 检查未提交变更，确认只包含本次需求范围。
- 如用户授权，按项目提交规范提交；否则说明未提交原因。
- 输出修改内容、验证证据、文档路径、遗留风险和建议下一步。
- **执行 `npm run sync:designs`（如存在）同步 `docs/pages/pages.yaml`**，确保本次 design 版本已注册到页面索引中。

push、创建 MR/PR、合并、发布、删除分支等共享或难回滚操作，必须再次获得用户明确确认。

## 技能调度表

| 技能 | 触发条件 | 阶段 |
|------|----------|------|
| `brainstorming` | 从零需求，无 Figma / Swagger | Phase 1 |
| `skill-routing` | Figma、视觉设计、React / Next.js 实现取舍 | Phase 1-4 |
| `writing-doc` | 用户未提供技术方案文档 | Phase 2 |
| `gitnexus-exploring` | 项目有 GitNexus 索引，需探索复用代码 | Phase 1 |
| `gitnexus-impact-analysis` | 修改现有模块前评估影响面 | Phase 3 |
| `gitnexus-refactoring` | 修改现有模块且有 GitNexus 索引 | Phase 4 |
| `test-driven-development` | 需要实现业务逻辑、Hook、组件或页面整合 | Phase 4 |
| `executing-plans` | 内联执行已确认计划 | Phase 4 |
| `subagent-driven-development` | 子代理驱动执行计划 | Phase 4 |
| `verification-before-completion` | 自动化验证和完成前证据门控 | Phase 5 |
| `requesting-code-review` | 验收通过后做代码审查 | Phase 5 |
| `token-saving` | 长文档、多文件、Figma、并行任务、反复调试 | 任意阶段 |

## 产物目录规范

一个功能的非代码产物集中在同一目录：

```text
docs/design/YYYY-MM-DD-<topic>-design/
├── index.md
├── spec/
│   ├── implementation-plan.md          # 不拆分时
│   └── NNx-<module>-spec.md            # 拆分时；NN=01,02,03... 按执行顺序
│                                       # 并行批次用字母后缀：02a, 02b
├── tasks.json                          # MCP 编排任务状态，按需
├── reworks/                            # MCP 返工要求文档，按需，文件平铺
│   └── task-<uuid>-rework-<N>.md
├── results/                            # MCP 子任务执行结果，按需
│   └── <编号>-result.md
├── assets/
│   ├── figma/
│   ├── screenshots/
│   └── diagrams/
└── evidence/
    └── phase5-verification.md
```

`spec/` 只放可执行交付物，不放整体技术方案。

MCP 编排产物规则：

- 普通任务不生成 `prompts/` 文件夹；普通任务通过 `spec/*.md` 和 `tasks.json` 中的 `prompt` 字段提供上下文。
- `tasks.json` 记录所有子任务状态；返工时 `rework` 指向当前返工，`reworks[]` 保留历史返工。
- 返工记录保留简短独立的 `prompt`，返工要求文档通过 `rework.inputFiles` 挂载；旧 `promptFile` 仅作读取兼容。
- `reworks/` 只保存返工要求文档，文件命名为 `task-<uuid>-rework-<N>.md`，直接平铺在 `reworks/` 下。
- `results/` 保存每个任务的当前最终结果；返工完成后必须覆盖原任务的 `resultFile`，不另建返工结果文件。
- 中途追加任务必须先新增 `spec/NNx-<module>-spec.md`，再创建任务并显式指定 `results/<编号>-result.md`。

## 业务代码组织原则

- API 服务按业务模块放到 `src/services/<module>/index.ts` 和 `types.ts`。
- 页面代码放到 `src/pages/<page>/`，页面私有组件放到该页面的 `components/`。
- 类型集中到对应 `types.ts`，常量集中到 `consts.ts` 或项目约定的 constants 文件。
- 优先复用项目已有组件和样式体系，避免重复造轮子。
- 组件拆分适度，不为少量 JSX 过度抽象。

## 最终自检

Phase 6 结束前逐项核对，任一未通过不得交付：

- [ ] `docs/pages/pages.yaml` 包含本次方案涉及的全部页面条目
- [ ] `spec/` 下所有 spec 文件均已执行并有对应产物
- [ ] 如使用 MCP 编排，`tasks.json`、`results/`、`reworks/` 的状态和文件路径符合本次任务范围
- [ ] `evidence/phase5-verification.md` 存在且包含 test / typecheck / lint / build 四项结果
- [ ] 变更范围仅限本次需求，无无关文件改动
- [ ] 交付摘要和遗留风险已输出
