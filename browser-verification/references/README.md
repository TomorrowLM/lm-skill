# References

当前技能使用 EGO Lite `ego-browser` 作为本机浏览器执行层。先读根目录 `SKILL.md`；具体命令/API 以每次执行 `ego-browser skill` 返回的已安装版本指南为准。

| 路径 | 用途 | 何时读取 |
| --- | --- | --- |
| `ego-taskspace.md` | TaskSpace 生命周期、Profile 与登录态、handoff、会话风险 | 新建/恢复 Agent 工作区或页面要求登录时 |
| EGO Lite `ego-browser` 技能的 `references/install.md` | 安装与通用启动排查 | `ego-browser` 命令不可用或初始化失败时 |
| EGO Lite `ego-browser` 技能的 `references/install-windows.md` | Windows 安装、PATH 与运行时检查 | Windows 上安装或命令排查时 |
| EGO Lite `ego-browser` 技能的 `references/clearing-state.md` | Cookie、缓存和站点存储影响范围 | 用户明确授权清理站点状态前 |
| `tests/evals.json` | 当前 EGO Lite 工作流的触发、行为和压力评测 | 修改或评估本技能时 |
| `tests/behavior-evals.json`、`tests/pressure-evals.json`、`tests/trigger-evals.json` | 旧版 lm-browser 流程的历史用例，保留用于审计 | 用户明确要求查看旧版验证记录时 |
| `archive/browser-verification-SKILL-pre-ego-2026-11-25.md` | 归档的旧版技能入口 | 用户明确要求查看旧版技能时 |
| `archive/references-README-pre-ego-2026-11-25.md` | 归档的旧版参考资料索引 | 用户明确要求查看旧版索引时 |
| `common/`、`modes/`、`templates/` | 旧版 lm-browser 工作资料；当前 EGO 流程不引用 | 用户明确要求迁移或查阅旧资料时 |

涉及 Figma 或设计稿的视觉差异判定仍由 `visual-workflow` 负责；页面开发验收范围仍由 `page-development-workflow` Phase 5 规定。

