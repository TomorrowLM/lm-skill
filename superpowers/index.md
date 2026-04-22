# Superpowers
"name": "superpowers-zh",
"version": "1.1.8",
名称：superpowers-zh

版本：1.1.8

## 简介

superpowers 是一个面向工程工作流的技能包，用来把复杂任务路由到更合适的子技能。它覆盖需求澄清、计划拆解、实现执行、调试定位、测试验证、代码审查、Git 收尾、中文团队协作，以及 MCP 和 workflow 等专项能力。

## Skills 路由表

### 流程类 Skills

| Skill | 何时进入 | 前置 Skill | 后续 Skill | 说明 |
|---|---|---|---|---|
| using-superpowers | 任何对话开始时 | 无 | 根据场景分流到其他 skill | 总入口，用来判断当前任务该走哪条流程。 |
| brainstorming | 需求不清、方案未定、要先收敛设计时 | using-superpowers | writing-plans / test-driven-development / 具体实现类 skill | 先澄清目标、边界、约束和实现方向。 |
| writing-plans | 需求已经明确，但任务步骤较多时 | using-superpowers / brainstorming | subagent-driven-development / executing-plans | 输出实现计划，拆清任务、文件、测试和验证步骤。适用于还没有明确任务清单的阶段。 |
| subagent-driven-development | 已有计划，且适合按任务拆分协作执行时 | writing-plans | requesting-code-review / verification-before-completion / finishing-a-development-branch | 在当前主流程里按任务推进，适合细粒度执行和阶段审查。适用于已经有明确任务清单的阶段。 |
| executing-plans | 已有计划，且要按顺序逐任务执行时 | writing-plans | verification-before-completion / finishing-a-development-branch | 先审查计划，再按任务顺序执行、验证和记录状态。 |
| dispatching-parallel-agents | 存在多个可独立推进的任务时 | writing-plans / systematic-debugging | requesting-code-review / verification-before-completion | 适合并行处理没有共享状态、没有顺序依赖的任务。 |
| verification-before-completion | 准备宣称“完成”“修复完成”“测试通过”之前 | test-driven-development / executing-plans / subagent-driven-development / systematic-debugging | requesting-code-review / finishing-a-development-branch | 所有完成性结论都要先过验证。 |
| requesting-code-review | 功能完成、准备合并、需要正式审查时 | verification-before-completion / subagent-driven-development | receiving-code-review / finishing-a-development-branch | 发起正式代码审查，暴露风险和遗漏。 |
| receiving-code-review | 收到 review 意见、准备处理反馈时 | requesting-code-review | test-driven-development / verification-before-completion / finishing-a-development-branch | 先判断反馈是否成立，再决定如何改。 |
| using-git-worktrees | 开始功能开发、执行计划前需要隔离工作区时 | using-superpowers | writing-plans / executing-plans / subagent-driven-development | 创建独立 worktree，降低对当前工作区的影响。 |
| finishing-a-development-branch | 开发完成、验证通过后要收尾时 | verification-before-completion / requesting-code-review | 无 | 负责合并、PR、保留或清理分支等收尾动作。 |

#### **subagent-driven-development/executing-plans 区别**

这两个都属于“拿着现成计划去执行”，但执行方式完全不同。

最短的区分是：

- `subagent-driven-development`：用子代理按任务执行
- `executing-plans`：你自己在当前流程里按任务执行

具体差异可以看 4 个方面。

**1. 执行主体不同**

`subagent-driven-development` 的主体是“子智能体”。控制者负责提取任务、分派实现者、再分派两个审查者，见 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html)。

`executing-plans` 的主体是“当前会话本身”。它要求你先把计划整理成任务清单，然后一个任务一个任务地自己推进，见 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html)。

**2. 适用前提不同**

`subagent-driven-development` 适合：

- 已经有实现计划
- 任务基本独立
- 想留在同一个主会话里协调
- 希望每个任务交给一个全新子代理去做

它自己的“何时使用”流程图就写得很直白：有计划、任务独立、留在当前会话时，走它，见 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html)。

`executing-plans` 适合：

- 已经有书面计划
- 要按顺序逐任务推进
- 不依赖子代理协作
- 更像“严格照计划施工”

它的重点是先审查计划、重建任务清单、再顺序执行，见 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html)。

**3. 审查机制不同**

`subagent-driven-development` 最大的特点是“两阶段审查”：

- 先规格合规审查
- 再代码质量审查

而且这是每个任务后都要做的，不是可选项。实现者修完，先过规格，再过质量，任何一轮不过都要回环修复，见 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html)。

`executing-plans` 没有这种固定的“双审查子代理机制”。它强调的是：

- 先审查计划本身
- 每完成一个任务就跑验证
- 每 3 个任务回顾一次方向

所以它更像“严格任务执行 + 节点检查”，不是“子代理实现 + 双代理审查”。

**4. 节奏和成本不同**

`subagent-driven-development`：

- 质量更高
- 上下文污染更少
- 任务隔离更强
- 审查更严
- 但成本更高，流程更重，因为每个任务至少要跑实现者 + 规格审查 + 质量审查

`executing-plans`：

- 更直接
- 更轻量
- 更适合按计划线性推进
- 但没有子代理隔离和自动化双审查保护

所以它们不是“谁替代谁”，而是两种不同的执行模式。

**怎么选**

按现在 [index.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 的分工，可以直接这么判断：

- 已有计划，但想让每个任务交给独立子代理做，并且任务边界清楚：选 `subagent-driven-development`
- 已有计划，只想在当前流程里自己一项一项执行：选 `executing-plans`

再压缩成一句判断规则：

- 想要“分派执行 + 双审查” → `subagent-driven-development`
- 想要“自己顺序执行 + 严格验证” → `executing-plans`

如果你要，我可以下一步把 `writing-plans`、`subagent-driven-development`、`executing-plans` 三个放进一张三列表里，对比它们在整条链路里的关系。

#### 独立子代理

 独立子代理的意思不是“另一个标签页里的同一个你”，而是一个全新的、隔离上下文的执行者。

按 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 的定义，它有几个关键点：

1. 它不继承你当前会话的上下文历史
   你主会话里之前看过什么、聊过什么、试过什么，子代理默认都不知道。你必须把它完成当前任务所需的计划文本、上下文、约束、目标，重新明确地给它。
2. 它只拿到你分派给它的那一小块任务
   比如计划里有 5 个任务，任务 2 是“给 mobile 端加签名展示”，那这个子代理就只做任务 2，不顺手扩展任务 3，也不假设自己知道整个项目讨论历史。
3. 它是一次性的、隔离的
   任务 A 用一个新子代理，任务 B 再开一个新子代理。这样做的目的就是避免上下文污染。任务 A 里形成的错误假设、临时判断、无关细节，不会带到任务 B。
4. 它是被主控制者调度的，不是自己乱跑的
   主会话负责：

- 读取计划
- 提取任务文本
- 给子代理喂上下文
- 回答子代理的问题
- 安排规格审查和代码质量审查

子代理负责：

- 按给定任务实现
- 测试
- 自审
- 汇报 DONE / NEEDS_CONTEXT / BLOCKED 等状态

所以“独立”主要指两件事：

- 上下文独立
- 任务边界独立

这也是为什么 [SKILL.md](vscode-file://vscode-app/d:/software/front/Microsoft VS Code/560a9dba96/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 里强调：
每个任务一个全新子智能体，而且它们“不应继承你的会话上下文或历史记录”。

你可以把它类比成这样：

- 主会话：项目经理 / 技术负责人
- 独立子代理：拿着明确任务单干活的单兵工程师
- 审查子代理：专门做规格审查和代码质量审查的 reviewer

最重要的实际区别是：

如果不是独立子代理，模型很容易把前面任务的判断、用户之前随口说的话、别的文件里的上下文，全混进当前任务里；
而独立子代理因为只拿到当前任务所需信息，更容易做到“只做该做的这部分”。

所以它的价值不是“更聪明”，而是：

- 更聚焦
- 更少串任务
- 更少上下文污染
- 更适合按计划逐任务推进

如果你要，我可以下一步直接用你现在这套 superpowers 语境，给你举一个“主会话 + 独立子代理 + 审查子代理” 的完整执行例子。

### 专项类 Skills

| Skill | 何时进入 | 前置 Skill | 后续 Skill | 说明 |
|---|---|---|---|---|
| systematic-debugging | 遇到 bug、失败测试、异常行为时 | using-superpowers | test-driven-development / verification-before-completion / requesting-code-review | 修之前先找根因，避免拍脑袋修复。 |
| test-driven-development | 要实现功能或修 bug，且希望按测试先行推进时 | brainstorming / systematic-debugging / writing-plans | verification-before-completion / requesting-code-review | 先写失败测试，再写最小实现。 |
| chinese-documentation | 编写中文 README、说明文档、技术文档时 | using-superpowers | 无 | 规范中文排版、术语和文档结构。 |
| mcp-builder | 要构建 MCP 服务、工具或集成能力时 | brainstorming / writing-plans | test-driven-development / verification-before-completion | 关注 MCP 服务设计、接口和可用性。 |
| workflow-runner | 要运行 YAML 多角色工作流时 | using-superpowers / writing-plans | verification-before-completion | 直接执行 workflow 文件定义的协作流程。 |
| writing-skills | 新建、修改、验证 skill 自身时 | using-superpowers / brainstorming | verification-before-completion | 用来维护 skill 文档和 skill 体系本身。 |

### 叠加增强类 Skills

| Skill | 何时进入 | 叠加在哪类流程上 | 说明 |
|---|---|---|---|
| chinese-code-review | 中文团队做代码审查时 | requesting-code-review / receiving-code-review | 中文团队语境下的专业审查表达规范。 |
| chinese-commit-conventions | 需要写中文 commit message 时 | verification-before-completion / finishing-a-development-branch | 统一中文项目的提交信息风格。 |
| chinese-git-workflow | 使用 Gitee、Coding、极狐 GitLab 等平台时 | using-git-worktrees / requesting-code-review / finishing-a-development-branch | 适配国内平台和中文团队协作方式。 |

## 候选子路由判断

当 `/superpowers` 不能唯一确定应该进入哪个子技能时，路由判断直接以本文件的技能分类和路由表为准，不再依赖单独的候选路由参考文件。

### 何时进入候选子路由选择

以下情况应先给出候选子路由，而不是直接进入某个 skill：

1. 用户显式调用 `/superpowers`，但没有同时指定具体子技能。
2. 用户只表达目标，没有明确说明希望先设计、先写计划还是直接实现。
3. 用户输入同时命中多个子技能的触发条件。
4. 用户描述过短，无法唯一确定子路由。
5. 用户说“生成”“实现”“做一个”某功能，但没有说明流程偏好。

只要用户没有直接写出具体 skill 名，这里就仍然视为“未指定子技能”，哪怕需求描述已经非常具体。

### 路由判断规则

1. 优先从“流程类 Skills”里挑选候选项，再考虑“专项类 Skills”。
2. 如果请求还没有任务清单，优先给 `brainstorming` 或 `writing-plans`，不要直接给 `subagent-driven-development`。
3. 只有在已经有明确任务清单时，才把 `subagent-driven-development` 或 `executing-plans` 作为高优先级候选项。
4. “叠加增强类 Skills”默认不单独作为主路由，而是附着在代码审查、Git 工作流或文档场景上叠加使用。
5. 候选项通常给 2 到 4 个，并始终提供“自定义路由 / 都不匹配”。
6. 不要因为模型主观判断“任务很简单”或“像单点修改”就跳过候选路由确认。
7. 如果运行环境支持选项式提问工具，候选确认应优先走工具，不要直接在回复里替用户拍板。

### 候选项生成顺序

1. 先判断这是流程问题、专项问题，还是需要专项 skill 叠加到流程上。
2. 如果是流程问题，优先按下面顺序考虑：`brainstorming` → `writing-plans` → `subagent-driven-development` / `executing-plans`。
3. 如果是 bug、异常行为或失败测试，优先考虑 `systematic-debugging`。
4. 如果是文档、MCP、workflow 或 skill 维护等明确专项问题，再从“专项类 Skills”里给候选项。
5. 如果是中文团队代码审查、提交或 Git 协作场景，在主路由确定后叠加对应“叠加增强类 Skills”。

### 选项式确认模板

当需要用户确认候选子路由时，使用类似下面的格式：

> 我先为这个请求推断几个可能匹配的子路由，请你选一个：
>
> 1. `brainstorming`：先确认目标、样式、交互和限制，再进入设计
> 2. `writing-plans`：需求已大致明确，先拆成实现计划
> 3. `subagent-driven-development`：已有明确任务清单后，直接进入按任务执行
> 4. `自定义路由 / 都不匹配`：如果你想走别的子技能，请直接告诉我

如果运行环境支持选项式提问工具，应优先使用工具化选项，而不是只输出纯文本列表。

### 常见判断示例

对于下面的请求：

> `/superpowers` 生成一个轮播图

推荐候选路由：

1. `brainstorming`：如果用户还没确定轮播图的样式、交互和约束，应该先澄清需求和设计。
2. `writing-plans`：如果轮播图需求已明确，但实现涉及多个步骤，先写计划更稳妥。
3. `subagent-driven-development`：如果用户已经明确要直接开始实现，并接受按任务执行。
4. `自定义路由 / 都不匹配`：如果用户其实想走别的技能，由用户指定。

对于下面的请求：

> `/superpowers` fieldName 为企业人员数量，后面展示问号 tips，里面文案为……

更合适的候选路由应先让用户确认，例如：

1. `brainstorming`：如果用户还想确认提示文案、交互方式或展示形式。
2. `writing-plans`：如果这属于一个较完整的小需求，需要先拆步骤。
3. `subagent-driven-development`：如果用户明确希望直接开始修改代码，并且已有足够明确的任务拆分。
4. `自定义路由 / 都不匹配`：如果用户想指定别的子技能。

这里的重点是：即使模型认为“这已经是很明确的单点修改”，也仍然要先把候选项展示给用户选择，不能直接宣布“我将使用 subagent-driven-development”。

### 自定义路由处理

当用户选择“自定义路由 / 都不匹配”时，继续按以下规则处理：

1. 要求用户直接指定想走的子技能。
2. 如果用户只说目标，不知道技能名，提供一轮更窄的候选项。
3. 如果用户指定了一个存在的子技能，直接宣告并切换过去。
4. 如果用户指定的并不是现有子技能，说明当前没有精确匹配项，并选择最接近的技能继续。

## 默认分流策略与入口模板

### 默认分流策略

如果用户只说“用 superpowers 帮我处理这个任务”，默认按下面规则判断：

1. 还没想清楚做什么 → `brainstorming`
2. 已经清楚要做什么，但步骤多 → `writing-plans`
	默认先在当前会话中输出完整计划，不落地为 md 文件，除非用户明确要求保存。
3. 已经有计划，要开始实现 → `subagent-driven-development`
	如果用户明确要留在当前会话，并要求按计划顺序逐任务推进，则切到 `executing-plans`。
4. 问题是 bug / 测试失败 / 构建失败 → `systematic-debugging`
5. 用户要审查或处理审查反馈 → `requesting-code-review` 或 `receiving-code-review`
6. 用户明确提到中文文档 / 中文 commit / 国内 Git 平台 → 叠加对应中文技能。
7. 用户明确提到 MCP、YAML 工作流或技能编写 → `mcp-builder`、`workflow-runner`、`writing-skills`

判断完成后，不要只返回技能名。应按以下格式继续：

1. 先宣告将使用哪个技能。
2. 立即读取对应技能的 `skills/superpowers/skills/<skill-name>/SKILL.md`；如果工具要求绝对路径，则先基于当前工作区根目录拼接后直接读取。
3. 再说明这样分流的原因。
4. 然后按该技能的规则进入下一步动作。

### 入口回复模板

当用户访问 `/superpowers` 且任务还没分流时，可以这样回复：

> 我将先判断这个任务最适合进入哪个 superpowers 子技能。
>
> 如果是需求不清、要先比较方案，我会使用 `brainstorming`。
> 如果是需求已定、要先在当前会话中输出实施计划，我会使用 `writing-plans`。
> 如果是已有计划、准备开始实现，我会使用 `subagent-driven-development`；如果你明确要留在当前会话里按计划逐任务执行，我会使用 `executing-plans`，并先把计划整理成待执行清单，再一项一项推进。
> 如果是 bug、失败测试或构建失败，我会使用 `systematic-debugging`。
> 如果任务需要 TDD、代码审查、中文团队协作、MCP、YAML 工作流或技能编写，我会在主流程上叠加或切换到对应技能。
>
> 一旦判断出明确场景，我会直接宣告“将使用哪个技能处理这个任务”，然后进入该技能，而不是停留在 `/superpowers` 总入口层面。

## 典型链路

### 1. 新功能开发

using-superpowers → brainstorming → writing-plans → subagent-driven-development 或 executing-plans → verification-before-completion → requesting-code-review → receiving-code-review → finishing-a-development-branch

适用场景：需求刚明确，要从想法走到实现、验证和收尾的完整流程。

### 2. 单会话按计划执行

using-superpowers → writing-plans → executing-plans → verification-before-completion → finishing-a-development-branch

适用场景：已经决定留在当前会话里，按计划逐任务顺序推进，不做并行分工。

### 3. 多任务协作执行

using-superpowers → writing-plans → subagent-driven-development → requesting-code-review → verification-before-completion → finishing-a-development-branch

适用场景：计划已经拆好，任务之间边界清晰，适合按任务分段推进并穿插审查。

### 4. Bug 修复

using-superpowers → systematic-debugging → test-driven-development → verification-before-completion → requesting-code-review → finishing-a-development-branch

适用场景：出现 bug、失败测试、构建异常或不明行为，先找根因，再修复和验证。

### 5. 并行处理多个独立任务

using-superpowers → writing-plans → dispatching-parallel-agents → verification-before-completion → requesting-code-review

适用场景：多个任务相互独立，没有共享状态，也没有严格顺序依赖。

### 6. 中文团队代码审查

using-superpowers → requesting-code-review + chinese-code-review → receiving-code-review + chinese-code-review → verification-before-completion

适用场景：团队沟通以中文为主，希望 review 反馈既专业又符合本地协作习惯。

### 7. 中文文档编写

using-superpowers → chinese-documentation

适用场景：编写 README、技术说明、接入文档、操作手册等中文材料。

### 8. MCP 工具建设

using-superpowers → brainstorming → writing-plans → mcp-builder → test-driven-development → verification-before-completion

适用场景：设计和实现 MCP 服务、工具能力或外部系统集成。

### 9. 运行 YAML 工作流

using-superpowers → workflow-runner → verification-before-completion

适用场景：已有 workflow 文件，需要直接运行多角色协作流程。

### 10. Skill 自身维护

using-superpowers → brainstorming → writing-skills → verification-before-completion

适用场景：新增 skill、修改 skill、补规则、修路由或验证 skill 是否可执行。

## 按场景查找

| 我现在要做什么 | 推荐进入的 Skill | 常见后续 Skill | 说明 |
|---|---|---|---|
| 我还没想清楚方案 | brainstorming | writing-plans | 先澄清目标、边界、约束和实现方向。 |
| 我已经知道要做什么，但步骤很多 | writing-plans | subagent-driven-development / executing-plans | 先把任务、文件、测试和验证拆清楚。 |
| 我想按计划一步一步执行 | executing-plans | verification-before-completion | 适合当前会话内逐任务推进。 |
| 我想把计划拆给多个任务去推进 | subagent-driven-development | requesting-code-review / verification-before-completion | 适合任务边界明确的实现计划。 |
| 我有多个互不依赖的问题要同时处理 | dispatching-parallel-agents | verification-before-completion | 适合并行处理独立任务。 |
| 我在修 bug | systematic-debugging | test-driven-development / verification-before-completion | 先定位根因，不直接拍脑袋修。 |
| 我想按测试先行开发 | test-driven-development | verification-before-completion | 先写失败测试，再写最小实现。 |
| 我准备说“已经完成了” | verification-before-completion | requesting-code-review / finishing-a-development-branch | 先跑验证，再下结论。 |
| 我想发起代码审查 | requesting-code-review | receiving-code-review | 正式进入 review 流程。 |
| 我收到了 review 意见 | receiving-code-review | test-driven-development / verification-before-completion | 先判断反馈是否成立，再改。 |
| 我想隔离当前开发环境 | using-git-worktrees | writing-plans / executing-plans | 先建 worktree，再开始实现。 |
| 我准备收尾、提 PR 或合并 | finishing-a-development-branch | 无 | 处理分支交付和清理动作。 |
| 我在中文团队里做代码审查 | chinese-code-review | verification-before-completion | 提高中文 review 的专业性和可接受度。 |
| 我需要写中文 commit message | chinese-commit-conventions | finishing-a-development-branch | 统一提交信息风格。 |
| 我需要写中文 README 或技术文档 | chinese-documentation | 无 | 规范中文排版、术语和结构。 |
| 我使用 Gitee、Coding 或极狐 GitLab | chinese-git-workflow | requesting-code-review / finishing-a-development-branch | 适配国内 Git 平台工作方式。 |
| 我想构建 MCP 服务或工具 | mcp-builder | test-driven-development / verification-before-completion | 聚焦 MCP 的设计和实现方法。 |
| 我想运行 YAML 工作流 | workflow-runner | verification-before-completion | 直接执行多角色工作流。 |
| 我在维护 skill 本身 | writing-skills | verification-before-completion | 用于新增、修改、验证 skill。 |
| 我想用 superpowers，但还不知道选哪个 | using-superpowers | 任何具体 skill | 先做路由判断，再进入对应流程。 |