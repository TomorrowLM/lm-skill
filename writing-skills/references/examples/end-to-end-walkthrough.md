# 端到端走通示例

以"禁止 AI 在代码中用 `console.log` 输出调试信息"为例，展示从零到交付的完整流程。

## 场景设定

用户在项目中多次发现 AI 生成的代码含有 `console.log`，每次都需要手动删除。用户希望创建一个技能，让 AI 在任何编码场景下都不生成 `console.log`（用 `console.error` 记录异常时除外）。

## 第一步：需求访谈

对照 SKILL.md 的 5 个访谈问题：

| 问题 | 回答 |
|------|------|
| 1. AI 做到什么？ | 不生成 `console.log`；允许 `console.error` |
| 2. 什么触发？ | 任何编码、改代码、生成组件的会话 |
| 3. 什么不该触发？ | 文档写作、纯问答、不涉及代码的场景 |
| 4. 期望输出？ | 代码不含 `console.log`；或发现时主动纠正 |
| 5. 需要测试用例？ | 是——让 AI 写含调试输出的 React 组件 |

## 第二步：技能分类

这是**纪律执行类**技能。测试重点是：压力下（赶时间、复杂场景）是否守规矩。

## 第三步：红——基线失败

**没有技能时**，让 AI 写一个含调试输出的组件：

> 用户：创建一个用户信息卡片组件，打印一下获取到的数据

AI 生成了：

```tsx
function UserCard({ user }) {
  console.log('user data:', user);          // ❌ 违规
  return <div>{user.name}</div>;
}
```

**逐字记录**：
- 违规行为：生成了 `console.log(...)`
- 借口模式：用户明确要求"打印一下"，AI 理解为打印日志

重新测试，更隐晦的提示：

> 用户：创建一个 fetch 组件，debug 一下返回结果

```tsx
function DataFetcher() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        console.log('debug:', d);            // ❌ 又违规
        setData(d);
      });
  }, []);
}
```

**基线结论**：AI 默认会把"调试"/"打印"理解为 `console.log`，必须显式干预。

## 第四步：绿——最小技能

只针对观察到的失败，写最小规则：

```markdown
---
name: no-console-log
description: 当需要写代码、修改代码或生成组件时使用。不适用于纯文档写作。
---

# No Console Log

在生成的任何代码中，禁止使用 `console.log`。
`console.error` 用于异常记录，允许使用。
```

用同一场景复测：

> 用户：创建一个 fetch 组件，debug 一下返回结果

```tsx
function DataFetcher() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        // 调试信息已移除
        setData(d);
      });
  }, []);
}
```

✅ 行为已改变。但这是最简单场景，需要进重构阶段找漏洞。

## 第五步：重构——堵漏洞

### 漏洞 1：偷偷用别名

> 用户：写一个函数，追踪一下输入参数的变化

AI 生成：

```tsx
function trackChanges(value) {
  const log = console.log;      // 试图绕过
  log('value changed:', value);
}
```

**堵上**：在技能中补充"包括通过别名、bind、apply、call 等方式调用"。

### 漏洞 2：用 debugger 语句替换

AI 被禁止 `console.log` 后，改用 `debugger;` 语句。

**堵上**：补充"同时禁止 `debugger` 语句"。

### 漏洞 3：找借口"只是简单测试"

在复杂场景中 AI 可能说"我先用 console.log 验证一下，然后删掉"。

**堵上**：直接封堵这个借口——"不得以'临时测试''简单改动'为由添加 console.log"。

### 堵完后的技能

```markdown
---
name: no-console-log
description: 当需要写代码、修改代码或生成组件时使用。
  不适用于纯文档写作、不涉及代码输出的会话。
---

# No Console Log

## 禁止项

- `console.log` —— 无论直接调用还是通过别名（bind/call/apply/赋值）
- `debugger` 语句
- 不得以"临时测试""简单改动""只是验证一下"为由添加后声称会删除

## 允许项

- `console.error` —— 仅用于记录异常和错误信息

## 常见借口

| 借口 | 现实 |
|------|------|
| 我先 log 一下，马上删 | 生成即违规，规则对生成时刻生效 |
| 用别名不算 console.log | 通过任何方式调用 console.log 都是违规 |
| 用户说"打印"就是要 log | 输出到 UI，不是输出到控制台 |
```

## 第六步：测试

### 学术性测试

| 场景 | 预期 |
|------|------|
| 写一个组件，展示 API 返回的数据 | 不含 `console.log` |
| 写一个 catch 块处理错误 | 可以用 `console.error` |
| 写一个 debounce 工具函数 | 不含 `console.log` 和 `debugger` |

### 压力场景

> 用户：我赶时间，帮我快速写个带 debug 信息的 hook，越快越好

AI 不应生成 `console.log`。如果生成了，借口表需要补充"赶时间"借口。

### 变体场景

> 用户：写一个 logger 工具类，记录应用运行状态

这个场景下用户**就是**要写日志工具——技能不应误杀。需要在 description 中精确限定：禁止的是*调试性质的临时日志输出*，不是日志基础设施。

## 第七步：描述优化

初始 description：
```
当需要写代码、修改代码或生成组件时使用
```

问题：太宽泛——写 logger 工具类也会触发。

优化后：
```
当需要写代码、修改代码或生成组件时使用。
禁止 AI 生成 console.log 调试输出和 debugger 语句；
console.error 用于异常日志，logger 基础设施不属于禁用范围。
不适用于纯文档写作、日志基础设施开发、不涉及代码输出的会话。
```

## 第八步：交付与注册

1. 将 `no-console-log/` 放入 `~/.agents/skills/`
2. 在项目 `AGENTS.md` 中添加引用
3. 用真实编码任务验证触发——不会被 logger 工具类误触发

## 关键启示

| 阶段 | 经验 |
|------|------|
| 红 | AI 会把日常用语（"打印""debug"）理解为 console.log，是真实漏洞 |
| 绿 | "允许 console.error" 这一个小例外防止了万能封锁的副作用 |
| 重构 | 别名校验、debugger 语句、借口封堵——三个漏洞都来自实际测试 |
| 描述优化 | "禁止的内容"在 description 里说了，比"不适合的场景"更先被模型注意到 |
| 交付 | 步骤 3 的验证很重要——漏掉的话 description 问题要等用户反馈才知道 |
