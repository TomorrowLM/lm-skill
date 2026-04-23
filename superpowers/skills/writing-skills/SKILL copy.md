---
name: writing-skills
description: >-
  Use when 创建新技能、编辑现有技能或在部署前验证技能是否有效。
  症状：你需要教 AI 一个它不会的技术/模式/参考流程；你写了指令但不确认在压力下是否有效；
  AI 在你的指令中找到了漏洞。NOT for: 项目级约定（用 CLAUDE.md）、一次性解决方案、
  可以用自动化强制执行的机械性约束、通用标准实践（AI 已经会了）。
---

# Writing Skills

## 触发条件
- 要创建新技能/编辑已有技能
- 技能可能被 AI 绕过或合理化
- 需要在真实 AI 行为上验证指令是否有效
- 指令中包含关键纪律或约束

## 核心原则
- **TDD for docs**: 红-绿-重构。没有失败的测试就不写技能。
- **上下文窗口是公共资源**: 每个 token 都在和系统提示、对话历史、其他技能元数据竞争。
- **默认 AI 已经够聪明**: 只补充 AI 不知道的上下文。一段 200 词的说明能不能用一个 10 行的示例替代？
- **"不做什么" > "做什么"**: 画边界比描述可行域更精确。写完做"反转测试"——每条正面指导能否改写成"不要做X"？
- **祈使语气**: 指令统一用祈使句/不定式，减少歧义。

## 流程（红-绿-重构）

**红 — 基线测试**: 不用技能跑压力场景。逐字记录 AI 的选择和合理化借口。
→ 不看到 AI 在没有技能时失败，你就不知道技能该教什么。

**绿 — 写最小技能**: 只针对上一步记录的具体失败写指令。不假设、不预防未来场景。
→ 用技能跑相同场景。AI 现在应当合规。

**重构 — 堵漏洞**: AI 找到新的合理化借口？添加明确反驳。更新红线列表。重新测试直到无懈可击。
→ 具体测试方法论见 `references/methodology/testing-skills-with-subagents.md`

## 红线（遇到就删掉重来）
- 先写技能再测试
- 编辑技能不重新测试
- 保留未测试的更改"作参考"
- "这只是简单的补充" — 无例外
- "我之后会测试" — 现在测，否则删
- "先写测试太过了" — 删掉技能
- "这个技能显然没问题" — 那测试应该轻松通过，跑一下
- **违反字面就是违反精神。** 不存在"我遵循的是精神"的变通。

## 目录规则
```
skills/<skill-name>/
  SKILL.md              # [必需] frontmatter + body。≤300 行。
  references/           # 子目录（不直接放 .md 文件在此级）
  scripts/              # 可执行脚本（执行不读入，零 token 成本）
  assets/               # 产出物模板/资源（不读入上下文）
```

**SKILL.md 控制逻辑（必须保留）**: 触发条件、核心原则、关键流程、红线、明确引用 references/ 的条件。
**references/ 承担细节**: 完整示例、长篇幅说明、表格模板、扩展指南。
**禁止: README.md、CHANGELOG.md、INSTALLATION.md、QUICK_REFERENCE.md** — 这是给人看的，不是给 AI 的。

## 编写规则

### Frontmatter
- 只有 `name`（小写+连字符，≤64 字符）和 `description`（第三人称，≤1024 字符）
- description 以 "Use when..." 开头，包含触发症状 + NOT for
- 所有"何时使用"信息放进 description，**不放入 body**

### Body
- **一个优秀示例 > 多个平庸**: 不在 5+ 种语言实现同一个东西
- **具体反模式 > 模糊原则**: "不要连续出现 3 个以上的角色名和对白" > "保持简洁"
- **自由度光谱**: 创造性任务用文字引导（高自由度），格式/长度/命名约束用脚本锁死（低自由度）
- **禁止填空模板**: 写可直接适配的具体模式，不是"请填写 X"
- **引用一层深度**: 所有 references 从 SKILL.md 直接引用，禁止 A→B→C 嵌套
- **引用文件超 100 行时**: 顶部加目录，方便 AI 预览

### 流程图
- 仅在决策不明显、有 A vs B 选择、或可能过早退出循环时使用
- 不用来展示: 参考数据（用表格）、代码（用代码块）、线性步骤（用编号列表）
- 标签须有语义（不能是 step1、helper2）
- 样式规范见 `references/conventions/graphviz-conventions.dot`

## 反模式
| 反模式 | 问题 |
|--------|------|
| 叙事式示例（"在 2025-03-01 的会话中…"） | 太具体，不可复用 |
| 多语言实现（js + py + go + rs） | 所有版本都平庸，维护负担重 |
| 流程图里塞代码 | 无法复制粘贴，难读 |
| 信息重复（SKILL.md 和 references 都有） | 浪费 token，更新不一致 |
| 为 AI 已经会的知识写文档（"Python 有 for 循环"） | 占上下文，零价值 |

## References 加载条件

| 文件 | 什么时候读 |
|------|-----------|
| `references/methodology/testing-skills-with-subagents.md` | 跑基线测试前；迭代堵漏洞时 |
| `references/guides/persuasion-principles.md` | 设计纪律类技能，需要抵抗合理化时 |
| `references/guides/anthropic-best-practices.md` | 设计技能结构、命名、description 编写、渐进式披露时 |
| `references/examples/CLAUDE_MD_TESTING.md` | 创建 CLAUDE.md 文档变体的测试场景时 |
| `references/conventions/graphviz-conventions.dot` | 创建流程图时 |

## 前置技能
- `superpowers:test-driven-development` — 定义红-绿-重构循环。本技能将其适配到文档编写。
