---
name: requesting-code-review
description: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
---

# 请求代码审查

派遣 superpowers:code-reviewer 子代理来在问题扩散之前发现它们。审查者获得的是精心组织的评估上下文——绝不是你的会话历史。这样可以让审查者专注于工作成果而非你的思考过程，同时保留你自己的上下文以便继续工作。

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

使用 Task 工具，指定 superpowers:code-reviewer 类型，填写 `code-reviewer.md` 中的模板

> **GitNexus 增强：** 子代理会自动使用已有索引执行影响分析——检测爆炸半径、漏改调用方和测试缺口。子代理只读取索引，不重建。无索引时自动跳过，走纯 diff 审查。

**占位符说明：**
- `{WHAT_WAS_IMPLEMENTED}` - 你刚完成的内容
- `{PLAN_OR_REQUIREMENTS}` - 预期功能
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交
- `{DESCRIPTION}` - 简要说明

**4. 处理反馈：**
- Critical 问题立即修复
- Important 问题在继续之前修复
- Minor 问题记录下来稍后处理
- 如果审查者有误，用技术理由反驳

## 示例

```
[刚完成任务 2：添加验证功能]

你：让我在继续之前请求代码审查。

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[主会话检查索引]
  READ gitnexus://repo/my-app/context → 索引最新，直接使用

[派遣 superpowers:code-reviewer 子代理]
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
