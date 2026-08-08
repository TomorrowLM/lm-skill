# pages.yaml 页面注册表

定义 `docs/pages/pages.yaml` 的 schema 约束和用法。

## Schema

```yaml
# pages.yaml — 文档与路由的映射表
<page-key>:
  title: 页面标题          # 必填
  path: /parent-route      # 必填，该页面对应的路由路径
  description: "..."       # 可选
  design:                  # 可选，关联的技术方案
    - title: "..."
      path: "..."
  children:                # 可选，仅路由子路径放入（如 /parent-route/sub）
    <sub-page-key>:
      title: 子页面标题
      path: /parent-route/sub  # 必须以父级 path 为前缀
      description: "..."
      design: [...]
      children:           # 仅当存在更深层级子路由时嵌套
```

## 核心约束

- **children 严格遵循路由层级**：仅 `path` 是父级 path 子路径时才放入 children
- **列表页不放 children**：列表页本身（与父级同 path）的 `title`/`description`/`design` 放在父级自身属性
- **`path` 必填**：每个条目必须有路由路径

## 示例

```yaml
daily-inspection:
  title: 日常检查
  path: /daily-inspection
  description: 执行人员查看后台分配的检查任务
  design:
    - title: 任务列表页技术方案
      path: docs/design/2026-08-08-daily-inspection-design
  children:
    detail:
      title: 检查执行页
      path: /daily-inspection/detail    # ✅ 父级 /daily-inspection 的子路由
      description: 签到 + 检查结果填写 + 提交
```
