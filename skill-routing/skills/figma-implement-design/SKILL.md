---
name: figma-implement-design
description: 当需要将 Figma 设计稿转化为生产可用的应用代码并保持 1:1 视觉还原时使用；适用于用户提到实现设计稿、生成代码、实现组件、提供 Figma 链接，或要求按 Figma 规格构建组件的场景。如需通过 `use_figma` 写入 Figma 画布，请使用 `figma-use`。
---

# 实现设计稿

## 概述

本技能提供一套结构化流程，用于将 Figma 设计稿转化为生产可用代码，并尽可能实现像素级准确还原。它确保与 Figma MCP 服务器一致集成，正确使用设计令牌，并与设计稿保持 1:1 视觉一致性。

## 技能边界

- 当交付物是用户仓库中的代码时，使用本技能。
- 如果用户要求在 Figma 内部创建、编辑或删除节点，切换到 `figma-use`。
- 如果用户要求基于代码或描述在 Figma 中构建或更新整页界面，切换到 `figma-generate-design`。
- 如果用户只要求 Code Connect 映射，切换到 `figma-code-connect-components`。
- 如果用户要求编写可复用的智能体规则（`CLAUDE.md`/`AGENTS.md`），切换到 `figma-create-design-system-rules`。

## 前置条件

- Figma MCP 服务器必须已连接且可访问。
- 用户必须提供如下格式的 Figma URL：`https://figma.com/design/:fileKey/:fileName?node-id=1-2`
  - `:fileKey` 是文件 key。
  - `1-2` 是节点 ID，即要实现的具体组件或画框。
- 或者，在使用 `figma-desktop` MCP 时：用户可以直接在 Figma 桌面应用中选择节点（无需 URL）。
- 项目最好已有设计系统或组件库。

## 必需流程

按顺序执行以下步骤，不要跳步。

### 步骤 1：获取节点 ID

#### 方案 A：从 Figma URL 解析

当用户提供 Figma URL 时，提取文件 key 和节点 ID，作为 MCP 工具参数传入。

URL 格式：`https://figma.com/design/:fileKey/:fileName?node-id=1-2`

提取：
- 文件 key：`:fileKey`（`/design/` 后面的路径片段）
- 节点 ID：`1-2`（`node-id` 查询参数的值）

注意：使用本地桌面 MCP（`figma-desktop`）时，不需要把 `fileKey` 作为参数传给工具。服务器会自动使用当前打开的文件，因此只需要 `nodeId`。

示例：
- URL：`https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15`
- 文件 key：`kL9xQn2VwM8pYrTb4ZcHjF`
- 节点 ID：`42-15`

#### 方案 B：使用 Figma 桌面应用当前选中节点（仅限 figma-desktop MCP）

使用 `figma-desktop` MCP 且用户未提供 URL 时，工具会自动使用 Figma 桌面应用当前打开文件中选中的节点。

### 步骤 2：获取设计上下文

使用提取出的文件 key 和节点 ID 运行 `get_design_context`。

```
get_design_context(fileKey=":fileKey", nodeId="1-2")
```

它会提供结构化数据，包括：
- 布局属性（Auto Layout、约束、尺寸）
- 字体排版规格
- 颜色值和设计令牌
- 组件结构和变体
- 间距和内边距数值

如果响应过大或被截断：
1. 运行 `get_metadata(fileKey=":fileKey", nodeId="1-2")` 获取高层级节点映射。
2. 从元数据中识别需要的具体子节点。
3. 使用 `get_design_context(fileKey=":fileKey", nodeId=":childNodeId")` 分别获取子节点。

### 步骤 3：捕获视觉参考图

使用相同的文件 key 和节点 ID 运行 `get_screenshot`，获取视觉参考图。

```
get_screenshot(fileKey=":fileKey", nodeId="1-2")
```

此截图是视觉验证的事实来源。整个实现过程中都应保持可访问。

### 步骤 4：下载所需资源

下载 Figma MCP 服务器返回的所有资源（图片、图标、SVG 等）。

重要：遵守以下资源规则：
- 如果 Figma MCP 服务器为图片或 SVG 返回 `localhost` 来源，直接使用该来源。
- 不要导入或新增图标包，所有资源都应来自 Figma 负载。
- 如果提供了 `localhost` 来源，不要使用或创建占位资源。
- 资源通过 Figma MCP 服务器内置的资源端点提供。

> **页面开发工作流内使用时：** 需要落盘的 Figma 截图、标注图、图标文件应保存到当前功能文件夹的 `assets/figma/` 目录，便于和设计方案文档及代码一同归档。详见 `page-development-workflow` 的统一目录结构约定。

### 步骤 5：转换为项目约定

将 Figma 输出转换为当前项目的框架、样式和约定。

关键原则：
- 将 Figma MCP 输出（通常是 React + Tailwind）视为设计和行为表达，而不是最终代码风格。
- 用项目偏好的工具类或设计系统令牌替换 Tailwind 工具类。
- 复用现有组件（按钮、输入框、排版、图标包装器），不要重复实现功能。
- 一致使用项目的颜色系统、字体层级和间距令牌。
- 遵循现有路由、状态管理和数据获取模式。

### 步骤 6：实现 1:1 视觉一致性

尽量与 Figma 设计稿保持像素级一致。

指南：
- 优先保持 Figma 还原度，尽可能精确匹配设计稿。
- 避免硬编码数值；有可用 Figma 设计令牌时优先使用。
- 当设计系统令牌与 Figma 规格冲突时，优先使用设计系统令牌，但可最小化调整间距或尺寸以匹配视觉效果。
- 遵循 WCAG 可访问性要求。
- 按需添加组件文档。

### 步骤 7：对照 Figma 验证

在标记完成前，对照 Figma 截图验证最终 UI。

验证清单：
- 布局匹配（间距、对齐、尺寸）。
- 排版匹配（字体、字号、字重、行高）。
- 颜色完全匹配。
- 交互状态按设计工作（悬停、激活、禁用）。
- 响应式行为符合 Figma 约束。
- 资源正确渲染。
- 满足可访问性标准。

## 实现规则

### 组件组织
- 将 UI 组件放在项目指定的设计系统目录中。
- 遵循项目的组件命名约定。
- 除非动态值确实必要，否则避免使用内联样式。

### 设计系统集成
- 只要可行，始终使用项目设计系统中的组件。
- 将 Figma 设计令牌映射到项目设计令牌。
- 如果存在匹配组件，扩展它而不是新建组件。
- 为任何新增到设计系统的组件补充文档。

### 代码质量
- 避免硬编码数值，将其提取为常量或设计令牌。
- 保持组件可组合、可复用。
- 为组件 Props 添加 TypeScript 类型。
- 为导出的组件包含 JSDoc 注释。

## 示例

### 示例 1：实现按钮组件

用户说：“实现这个 Figma 按钮组件：https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15”

动作：
1. 解析 URL，提取 fileKey=`kL9xQn2VwM8pYrTb4ZcHjF` 和 nodeId=`42-15`。
2. 运行 `get_design_context(fileKey="kL9xQn2VwM8pYrTb4ZcHjF", nodeId="42-15")`。
3. 运行 `get_screenshot(fileKey="kL9xQn2VwM8pYrTb4ZcHjF", nodeId="42-15")` 获取视觉参考图。
4. 从资源端点下载所有按钮图标。
5. 检查项目是否已有按钮组件。
6. 如果已有，扩展新变体；如果没有，按项目约定创建新组件。
7. 将 Figma 颜色映射到项目设计令牌（例如 `primary-500`、`primary-hover`）。
8. 对照截图验证内边距、圆角和排版。

### 示例 2：构建仪表盘布局

用户说：“构建这个仪表盘：https://figma.com/design/pR8mNv5KqXzGwY2JtCfL4D/Dashboard?node-id=10-5”

动作：
1. 解析 URL，提取 fileKey=`pR8mNv5KqXzGwY2JtCfL4D` 和 nodeId=`10-5`。
2. 运行 `get_metadata(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId="10-5")` 了解页面结构。
3. 从元数据中识别主要区域（头部、侧边栏、内容区、卡片）及其子节点 ID。
4. 对每个主要区域运行 `get_design_context(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId=":childNodeId")`。
5. 运行 `get_screenshot(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId="10-5")` 获取整页截图。
6. 下载所有资源（Logo、图标、图表）。
7. 使用项目的布局基础组件构建布局。
8. 尽可能使用现有组件实现各个区域。
9. 对照 Figma 约束验证响应式行为。

## 最佳实践

### 始终从上下文开始
不要基于假设实现。始终先获取 `get_design_context` 和 `get_screenshot`。

### 增量验证
在实现过程中频繁验证，不要只在最后验证。这可以及早发现问题。

### 记录偏差
如果必须偏离 Figma 设计稿（例如出于可访问性或技术限制），在代码注释中说明原因。

### 优先复用，避免重建
创建新组件前始终检查现有组件。代码库一致性比机械复刻 Figma 更重要。

### 设计系统优先
不确定时，优先采用项目设计系统模式，而不是逐字逐项翻译 Figma 输出。

## 常见问题与解决方案

### 问题：Figma 输出被截断
**原因**：设计过于复杂，或嵌套层级太多，无法在单次响应中完整返回。
**解决方案**：使用 `get_metadata` 获取节点结构，然后用 `get_design_context` 分别获取具体节点。

### 问题：实现后与设计稿不匹配
**原因**：实现代码与原始 Figma 设计之间存在视觉差异。
**解决方案**：与步骤 3 获取的截图并排对比。检查设计上下文数据中的间距、颜色和排版值。

### 问题：资源无法加载
**原因**：Figma MCP 服务器的资源端点不可访问，或 URL 被修改。
**解决方案**：确认 Figma MCP 服务器的资源端点可访问。服务器会通过 `localhost` URL 提供资源，直接使用这些 URL，不要修改。

### 问题：设计令牌值与 Figma 不一致
**原因**：项目设计系统令牌的值与 Figma 设计中指定的值不同。
**解决方案**：当项目令牌与 Figma 值不同时，为保持一致性优先使用项目令牌，但调整间距或尺寸以维持视觉还原度。
