---
name: requesting-code-review
description: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
---

# 请求代码审查

派遣 CodeReview 子代理来在问题扩散之前发现它们。审查者获得的是精心组织的评估上下文——绝不是你的会话历史。这样可以让审查者专注于工作成果而非你的思考过程，同时保留你自己的上下文以便继续工作。

**核心原则：** 早审查，勤审查。

## 何时请求审查

**必须审查：**
- 子代理驱动开发中每个任务完成后
- 完成重要功能后
- 合并到 main 之前

**可选但有价值：**
- 卡住时（换个视角）
- 重构之前（建立基线）
- 修复复杂 bug 之后

## 如何请求

**1. 获取 git SHA：**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # 或 origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 检查 GitNexus 索引（主会话执行，派遣前）：**

> 此步骤由主会话在派遣子代理前完成，确保子代理拿到的索引是可用的。

| 情况 | 判断方式 | 处理 |
|------|---------|------|
| 索引不存在 | context 返回 "No index found" | 跑 `npx gitnexus analyze` 建立索引 |
| 索引过期 | context 返回 "Index is stale" | 跑 `npx gitnexus analyze` 重建索引 |
| 索引最新 | context 返回正常数据 | 直接使用，无需处理 |

> 可用 `npx gitnexus status` 查看索引时间和符号数量。重建后重新 READ `gitnexus://repo/{name}/context` 验证索引已加载。
> 项目无 GitNexus 时跳过此步，子代理会自动走纯 diff 审查。

**3. 派遣 code-reviewer 子代理：**

使用 CodeReview 子代理，将 `code-reviewer.md` 模板内容填入 prompt

> **GitNexus 增强：** 子代理会自动使用已有索引执行影响分析——检测爆炸半径、漏改调用方和测试缺口。子代理只读取索引，不重建。无索引时自动跳过，走纯 diff 审查。

**占位符说明：**
- `{WHAT_WAS_IMPLEMENTED}` - 你刚完成的内容
- `{PLAN_OR_REQUIREMENTS}` - 预期功能（无正式计划时填："无正式计划，审查重点放在代码质量、架构合理性和明显 bug"）
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交
- `{DESCRIPTION}` - 简要说明

**4. 处理反馈：**
- Critical 问题立即修复 → 修复后执行 delta review（见下方）
- Important 问题在继续之前修复 → 修复后执行 delta review
- Minor 问题记录到代码中 `// TODO(review): <描述>` 注释，或在项目 issue tracker 中标记 `code-review-minor` 标签，每 5 个任务或每批次结束时集中清理
- 如果审查者有误，用技术理由反驳

**5. Delta Review（修复后再审查）：**

> 修复 Critical/Important 问题后，不要直接继续。执行轻量级 delta review 确认修复到位。

```
1. 获取修复 diff：
   BASE_SHA=$(git rev-parse HEAD~N)  # N = 修复提交数
   HEAD_SHA=$(git rev-parse HEAD)

2. 派遣同一个 code-reviewer 子代理，填写：
   WHAT_WAS_IMPLEMENTED: 针对审查反馈的修复
   PLAN_OR_REQUIREMENTS: 上一轮审查报告中的 Critical/Important 问题列表
   DESCRIPTION: 修复了 N 个问题：[简要列出]

3. 子代理只需审查修复 diff，确认：
   - 原始问题是否已解决
   - 修复是否引入新问题
   - 返回：PASS（可以继续）/ FAIL（需要再修）
```

> 如果只有 Minor 问题，无需 delta review，直接继续。

**Delta Review FAIL 处理：**
- 第 1 次 FAIL：根据反馈再次修复，重新执行 delta review
- 第 2 次 FAIL：回退到完整审查（重新走步骤 3），获取更全面的诊断
- 第 3 次仍 FAIL：暂停，向用户报告问题并请求指导

## 示例

```
[刚完成任务 2：添加验证功能]

你：让我在继续之前请求代码审查。

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[主会话检查索引]
  READ gitnexus://repo/my-app/context → 索引最新，直接使用

[派遣 CodeReview 子代理]
  WHAT_WAS_IMPLEMENTED: 会话索引的验证和修复功能
  PLAN_OR_REQUIREMENTS: docs/superpowers/plans/deployment-plan.md 中的任务 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: 添加了 verifyIndex() 和 repairIndex()，支持 4 种问题类型

[子代理返回]:
  优点：架构清晰，测试真实

  影响范围：4 个符号，2 个文件，1 个执行流 | 风险 MEDIUM
  | 变更符号        | d=1 调用方      | diff 中 | 测试 |
  | verifyIndex     | indexManager    | ✅      | ✅   |
  | repairIndex     | indexManager    | ✅      | ✅   |
  | validateChecksum| checksumService | ❌ 漏改 | ✅   |

  问题：
    Critical：checksumService 未更新 validateChecksum 调用签名
    Important：缺少进度指示器
    Minor：报告间隔使用了魔法数字 (100)
  评估：修复 Critical 后可以继续

你：[修复 checksumService 调用签名]
你：[修复进度指示器]
你：[在 reportInterval 旁添加 // TODO(review): 提取魔法数字为常量]

[Delta Review]
  BASE_SHA=3df7661  # 审查时的 HEAD
  HEAD_SHA=$(git rev-parse HEAD)
  WHAT_WAS_IMPLEMENTED: 针对审查反馈的修复
  PLAN_OR_REQUIREMENTS: Critical: checksumService 调用签名未更新 / Important: 缺少进度指示器
  DESCRIPTION: 修复了 2 个问题

[Delta Review CodeReview 子代理返回]: PASS — 原始问题已解决，未引入新问题
[继续任务 3]
```

## 与工作流的集成

**子代理驱动开发：**
- 每个任务完成后审查
- 在问题叠加之前发现它们
- 修复后再进入下一个任务

**执行计划：**
- 每批（3 个任务）后审查
- 获取反馈，修复，继续

**临时开发：**
- 合并前审查
- 卡住时审查

## 红线

**绝不要：**
- 因为"很简单"就跳过审查
- 忽略 Critical 问题
- 带着未修复的 Important 问题继续推进
- 对合理的技术反馈进行争辩

**如果审查者有误：**
- 用技术理由反驳
- 展示证明其可行的代码/测试
- 要求澄清

参见模板：requesting-code-review/code-reviewer.md
