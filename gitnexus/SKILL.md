---
name: gitnexus
description: >-
  当任务需要借助 GitNexus 代码知识图谱进行代码库探索、调用链追踪、变更影响分析、安全重构、PR 风险审查，
  或需要运行 GitNexus 索引/状态/清理/wiki CLI 时使用。不要用于普通文本搜索、单文件阅读或与 GitNexus 无关的通用编程问题。
---

# GitNexus

用 GitNexus 把“猜测代码关系”改成“基于索引的调用图、执行流和影响面判断”。本技能是入口路由，不承载完整工具说明；命中后先判断任务类型，再加载对应子技能。

## 先做三件事

1. 确认当前工作区是否是已索引仓库；不确定时读取 `gitnexus-guide`。
2. 根据用户意图选择一个子技能，不要一次性加载全部子技能。
3. 如果 GitNexus 提示索引过期，先按 `gitnexus-cli` 刷新索引，再继续分析。

## 路由表

| 用户意图 | 加载技能 | 目标 |
| --- | --- | --- |
| “X 怎么工作的？”、“入口在哪？”、“调用链是什么？” | `gitnexus-exploring` | 找到相关执行流、关键符号和源码位置 |
| “为什么报错？”、“这个值从哪来？”、“接口为什么失败？” | `gitnexus-debugging` | 沿调用链和执行流定位根因 |
| “改 X 会影响什么？”、“谁依赖它？”、“编辑前评估风险” | `gitnexus-impact-analysis` | 给出上游依赖、受影响流程和风险等级 |
| “重命名/抽取/拆分/移动 X” | `gitnexus-refactoring` | 先建影响图，再按依赖顺序安全修改 |
| “审查 PR”、“这个 diff 安全吗？”、“缺测试吗？” | `gitnexus-pr-review` | 将 diff 映射到符号、流程和合并风险 |
| “重新索引”、“查看状态”、“清理索引”、“生成 wiki” | `gitnexus-cli` | 使用 CLI 维护索引和文档产物 |
| “有哪些工具？”、“GitNexus 怎么用？”、“schema 是什么？” | `gitnexus-guide` | 查询工具、资源和图模型参考 |

## 强制规则

- 修改函数、类、方法或导出符号前，先使用影响分析；不要用肉眼搜索替代。
- 重命名符号时走 `gitnexus-refactoring`；不要用普通查找替换。
- 提交或宣称变更完成前，使用变更检测确认影响范围与预期一致。
- 对 HIGH / CRITICAL 风险先告知用户，并说明直接调用方、受影响流程和建议验证范围。
- GitNexus 结果用于定位和评估，最终结论仍要回到源码、测试或运行结果验证。

## 渐进式读取

只在需要时读取这些文件：

| 文件 | 何时读取 |
| --- | --- |
| `gitnexus-guide/SKILL.md` | 需要工具、资源、schema、整体用法 |
| `gitnexus-exploring/SKILL.md` | 探索架构或执行流 |
| `gitnexus-debugging/SKILL.md` | 调试错误或异常行为 |
| `gitnexus-impact-analysis/SKILL.md` | 变更前、提交前、评估爆炸半径 |
| `gitnexus-refactoring/SKILL.md` | 重命名、抽取、拆分、移动代码 |
| `gitnexus-pr-review/SKILL.md` | PR 或 diff 审查 |
| `gitnexus-cli/SKILL.md` | 索引、状态、清理、wiki |
| `references/toolkit.md` | 需要具体参数、示例或资源速查 |

## 与其他工作流组合

- 新功能开发：在实现计划和编码前叠加影响分析，识别可复用符号和受影响流程。
- Bug 修复：在系统化调试中用查询、上下文和执行流缩小根因范围。
- 重构：先用影响分析定边界，再按引用关系修改并验证。
- 代码审查：用变更检测和影响分析补足人工 diff 审查看不到的调用方。

## 不要这样变通

- 不要因为“只是小改动”跳过影响分析。
- 不要在索引过期时继续把 GitNexus 结果当成事实。
- 不要把 `query` 当全文搜索；找精确引用时用 `context`、`impact` 或源码阅读交叉验证。
- 不要把子技能内容复制到本入口；入口只负责触发、路由和红线。

## 目录约定

本目录是 GitNexus 系列技能的唯一物理存储位置。外部通过技能名引用 `gitnexus-guide`、`gitnexus-exploring` 等子技能，不依赖这些子技能在文件系统中的具体路径。
