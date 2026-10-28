# Visual Workflow 技能评估记录

## 目标与范围

- 目标：集中视觉材料到技术方案、界面实现、视觉验证三种模式及共享视觉标准。
- 基线：`baseline-evaluation.md`；修改范围和评估用例：`evals.json`。
- 证据层级：隔离场景决策。未验证 VS Code 自动 dispatch，也未运行 Figma MCP 或真实浏览器。

## 基线失败

修改前，隔离评估只读取 Phase 4、Phase 5、browser-verification 与 skill-routing 路由规则，不加载 Figma/frontend-design 目标技能正文。

| 场景 | 基线发现 | 判定 |
| --- | --- | --- |
| 视觉材料先整理方案，再进入实现 | 路由直接指向 Figma 实现；Phase 4 要求前置方案，但无明确视觉材料→技术方案交接 | 失败：阶段交接断层 |
| 无 Figma 的视觉方向 | 单独路由到 frontend-design，未规定如何进入页面技术方案和 `#10` | 失败：方案与页面工作流脱节 |
| Phase 5 视觉对比 | 视觉对比规则在 browser-verification，Figma 实现和视觉设计又在两个独立技能 | 失败：方法来源分散 |

## 修改后评估

| 指标 | 通过数 / 总数 | 比例 | 结论 |
| --- | ---: | ---: | --- |
| visual-workflow 触发语义分类 | 13 / 13 应触发 | 100% | 场景决策通过；自动触发未验证 |
| visual-workflow 非触发识别 | 4 / 4 | 100% | 单点样式、纯 DOM、Figma 画布编辑和 Figma 生成不误入本技能 |
| 三模式及边界行为（VW01–VW17） | 17 / 17 | 100% | 场景决策通过 |
| skill-routing 嵌套子技能路由（ID 1–21） | 21 / 21 | 100% | 5 条应触发（React 性能/技能查找），16 条非触发（含全部视觉请求）；自动触发未验证 |
| skill-routing 应触发识别 | 5 / 5 | 100% | 仅命中 `skills/skill-routing/skills/` 下性能实践或技能查找 |
| skill-routing 非触发识别 | 16 / 16 | 100% | Figma/视觉及其他根目录技能不由此路由器处理 |
| browser-verification 行为（B01–B14） | 14 / 14 | 100% | 浏览器定位、DOM/截图、交互证据等门禁保留 |
| browser-verification 压力（P01–P13、P16） | 14 / 14 | 100% | 滚动、抽样、未命中 tab 和风险边界场景决策通过 |
| 浏览器行为/压力断言 | 120 / 120 | 100% | 按根技能及 scrolling/sampling references 核对 |
| page-development-workflow 关键阶段用例 | 3 / 3 | 100% | Phase 1 与 Phase 5 视觉职责、阻塞收口断言通过 |
| 更新后的评估 JSON 语法 | 6 / 6 | 100% | Node JSON 解析通过 |
| 真实图片 VW15 重放 | 0 / 1 | — | 阻塞：actual/design fixture 在当前工作区不可访问 |
| VS Code 自动 dispatch / 真实 Figma MCP / 真实浏览器集成 | 未执行 | — | 当前结果不覆盖运行时集成 |

### 评估用例记录

- visual-workflow：`references/tests/evals.json` 的 VW01–VW17；隔离 Agent 按共享标准和对应模式判定。
- skill-routing：`skills/skill-routing/references/tests/evals.json` 的 ID 1–21；仅处理嵌套目录的 React 性能与技能查找。视觉/Figma 请求和其他根目录技能请求均预期不触发；一般代码 Review 不触发，模糊“页面慢”先问明原因。
- browser-verification：`skills/browser-verification/references/tests/behavior-evals.json` 的 B01–B14，以及 `pressure-evals.json` 中实际存在的 P01–P13、P16；滚动失败和模板覆盖同时读取 `references/common/scrolling.md` 与 `sampling.md`。
- page-development-workflow：`references/tests/evals.json` 的 `trigger-figma-list-page`、`phase5-independent-visual-business`、`phase5-visual-scope-and-blocker`。

### VW15 真实图片限制

VW15 的历史 fixture 路径指向 `yqa-g-h5-safety` 工作区中的样例截图和设计图，但本轮文件搜索未找到两张图片，因此没有调用图像对比工具。VW15 的场景决策断言通过，不等于实际图片重放通过；若以后素材恢复，应按该用例重新执行图像对比。

### skill-routing 范围变更

早期视觉工作流整合评估曾按旧路由范围将 Figma/视觉请求分发到视觉技能。用户随后明确限定 `skill-routing` 只处理其 `skills/` 子目录；因此原 21/21 结果不再作为当前范围证据。按新 eval 预期复测后，React 性能与技能查找用例命中，视觉/Figma 请求不触发，21/21 场景决策通过。

## 规则红线

- 技术方案模式不写业务代码；未确认的视觉推断不升级为需求。
- 实现模式遵循已确认的方案和项目约定；增量自查不冒充 Phase 5。
- 验证模式只读，范围来自 `#10`；视觉差异回 Phase 4 修复，阻塞/未测量不宣称通过。
- browser-verification 保留完整 URL/page_index、已有 tab 不新开/导航、截图/DOM 双重证据、高风险动作和不得自启服务等门禁。
- Apache-2.0 来源许可保留在新技能目录 `LICENSE.txt`。

## Token 成本

- 结构负担：共享规则集中于 `visual-standards.md`，长流程分置三个模式 reference；旧 Figma/frontend-design 正文已撤下，Phase 文档只保留入口与门禁，结构可接受。
- 简单任务开销：描述明确排除单点 CSS 调整和纯浏览器结构采集；未进行隔离 Agent 的定量输出长度比较，标记为未测量。