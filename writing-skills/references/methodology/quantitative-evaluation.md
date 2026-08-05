# 量化评估方法

当需要对技能进行定量对比（description 优化、A/B 测试、回归验证）时使用此文件。

> **注意**：本文引用的 `scripts.run_loop`、`scripts.aggregate_benchmark`、`eval-viewer/generate_review.py` 等脚本尚未实现。当前阶段使用手动替代方案：手动改 description → 用 eval 集测试 → 人工比较触发准确率，或使用 subagent 并行跑基线 + 技能后人工评分。

## 目录

1. [评估 JSON 格式](#评估-json-格式)
2. [五步评估流程](#五步评估流程)
3. [断言写法指南](#断言写法指南)
4. [Benchmark 聚合](#benchmark-聚合)

## 评估 JSON 格式

测试用例保存为 `evals/evals.json`：

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "用户的测试提示",
      "expected_output": "期望结果的描述",
      "files": []
    }
  ]
}
```

- `prompt`：模拟用户真实输入
- `expected_output`：自然语言描述期望结果，供 grader 评估
- `files`：可选，需要附带的文件路径列表

结果放入 `<skill-name>-workspace/` 目录，作为 skill 目录的同级目录。

## 五步评估流程

这是一个连续流程，不要在中途停下来。

### Step 1：并行启动运行（带技能 + 基线）

对每个测试用例，同时启动两个 subagent——一个加载技能，一个不加载。**在同一次 turn 中发出所有 subagent 调用。**

### Step 2：运行期间起草断言

为每个测试用例起草量化断言。好的断言具有：

- 客观可验证——不依赖主观判断
- 描述性命名——见名知义
- 覆盖关键行为——不只检查输出格式

### Step 3：运行完成后捕获计时数据

将 `total_tokens` 和 `duration_ms` 保存到每个 run 目录的 `timing.json`。

### Step 4：评分、聚合、启动查看器

1. 评分每个 run——启动 grader subagent 或内联评分
2. 聚合为 benchmark：`python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>`
3. 分析：读取 benchmark 数据，提炼模式
4. 启动查看器：`nohup python eval-viewer/generate_review.py <workspace>/iteration-N --skill-name "my-skill" --benchmark <workspace>/iteration-N/benchmark.json`

### Step 5：读取反馈

用户审查完毕后，读取 `feedback.json`，聚焦有具体投诉的测试用例进行改进。

## 断言写法指南

好的断言示例：

```json
{
  "name": "output_contains_error_handling",
  "description": "输出应包含错误处理逻辑",
  "check": "output_includes('try/catch') or output_includes('.catch(')"
}
```

```json
{
  "name": "no_hardcoded_secrets",
  "description": "输出不应包含硬编码密钥",
  "check": "not output_matches('sk-[a-zA-Z0-9]{20,}')"
}
```

避免的断言模式：
- 过于宽泛："代码质量好"
- 依赖外部状态："测试通过"
- 主观判断："代码优雅"

## Benchmark 聚合

Aggregator 脚本生成 JSON，包含：

```json
{
  "skill_name": "example-skill",
  "iteration": 1,
  "runs": [
    {
      "test_id": 1,
      "with_skill": { "grade": "pass", "tokens": 1234, "duration_ms": 5600 },
      "baseline": { "grade": "fail", "tokens": 987, "duration_ms": 3200 }
    }
  ],
  "summary": {
    "with_skill_pass_rate": 0.85,
    "baseline_pass_rate": 0.30,
    "avg_token_increase": 247,
    "avg_duration_delta_ms": 2400
  }
}
```

分析时重点关注：
- 技能是否显著提升了通过率？
- token 开销是否合理（提升 vs 成本的 tradeoff）？
- 哪些测试用例的 with-skill 仍然失败？这些是改进重点。
