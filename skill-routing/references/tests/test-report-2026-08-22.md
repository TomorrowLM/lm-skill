# skill-routing 测试报告

**日期**: 2026-08-22  
**测试方法**: subagent 并行对比 (baseline vs 带技能)  
**测试用例**: 4 个代表性 eval 用例

## 量化结果

| 指标 | 数值 |
|------|------|
| 应触发命中率 (baseline) | 0/2 = 0% |
| 应触发命中率 (带技能) | 2/2 = 100% |
| 误触发率 (baseline) | 0/2 = 0% |
| 误触发率 (带技能) | 0/2 = 0% |
| 规则遵守率 (带技能) | 4/4 = 100% |

## 逐用例分析

### Eval 1: Figma 链接 → 实现 UI

**用户输入**: "帮我实现这个设计稿 https://figma.com/design/abc123/MyApp?node-id=1-2"

| 维度 | Baseline | 带技能 |
|------|----------|--------|
| 主导技能 | `page-development-workflow` ❌ | `skills/figma-implement-design` ✅ |
| 辅助技能 | `brainstorming`, `writing-doc`, `writing-plans` 等 8 个 | `skills/vercel-react-best-practices`（条件触发） |
| 问题 | 将 Figma 实现误解为整页开发流程，引入了过多不相关技能 | 精确命中路由表第一行 |

**分析**: Baseline 看到 Figma 链接 + "实现"，直接联想到 `page-development-workflow`（因为它的 description 里有"实现设计稿"）。但 skill-routing 的路由表精确区分了"Figma → 代码"和"整页开发流程"两个场景。

### Eval 4: 纯视觉重设计

**用户输入**: "这个页面太丑了，帮我重新设计一下，不要模板感"

| 维度 | Baseline | 带技能 |
|------|----------|--------|
| 主导技能 | `brainstorming` ❌ | `skills/frontend-design` ✅ |
| 辅助技能 | `skill-routing`, `writing-plans`, `an-ui` 等 | 暂不触发（代码阶段才加载 `vercel-react-best-practices`） |
| 问题 | 将视觉设计需求误解为"需求模糊需要探索"，忽略了专门的设计技能 | 精确命中路由表第二行 |

**分析**: Baseline 的推理逻辑是"需求模糊 → brainstorming"，但忽略了 `frontend-design` 就是专门为"重新设计""不要模板感"等视觉诉求设计的。

### Eval 11: 用户明确指定技能

**用户输入**: "用 page-development-workflow 技能帮我开发一个用户列表页"

| 维度 | Baseline | 带技能 |
|------|----------|--------|
| 是否触发 skill-routing | 不触发 ✅ | 不触发 ✅ |
| 决策 | 直接使用指定技能 | 直接使用指定技能 |
| 理由 | 用户已显式指定 | 不适用边界第1条 + 第6条 |

**分析**: 两类都正确。带技能版本额外识别了 `page-development-workflow` 不在路由表覆盖范围内，避免硬塞。

### Eval 12: 修 bug 不应触发

**用户输入**: "这个按钮点击后没反应，帮我修一下bug"

| 维度 | Baseline | 带技能 |
|------|----------|--------|
| 是否触发 skill-routing | 不触发 ✅ | 不触发 ✅ |
| 决策 | 直接 debug | 直接 debug |
| 理由 | 意图清晰，一对一到 `systematic-debugging` | 不适用边界明确列出"修 bug" |

**分析**: 两类都正确。带技能版本有更明确的规则依据。

## 优化效果

1. **description 优化**: 新版 description 明确写了"不触发"场景，减少了误触发风险
2. **路由表优化**: 增加"辅助触发条件"列，让辅助技能加载更精准
3. **不适用边界扩展**: 从 4 条扩展到 6 条，明确排除了 page-development-workflow、systematic-debugging 等非路由表技能
4. **红线强化**: 新增"不要路由本路由表不覆盖的技能"，防止硬塞
5. **Token 效率**: 引用 token-saving，避免多文件读取时浪费上下文

## 后续建议

1. 在更多边缘场景（eval 16-18）中测试模糊意图的处理
2. 考虑是否需要增加 description 中的否定关键词来进一步降低误触发
3. 定期收集实际使用中的路由错误案例，迭代优化路由表