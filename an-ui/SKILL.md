---
name: an-ui
description: pc端公共组件库，基于 Ant Design 封装的高级组件集合，包含表单、表格、详情、文件列表、按钮及抽屉弹窗
disable-model-invocation: true
user-invocable: true
---

# an-ui Skill

an-ui 是基于 Ant Design 的 PC 端组件库，提供配置式表单、数据表格、详情展示和常见业务容器组件。

## 何时使用

在业务代码中选择或使用 an-ui 组件、查找组件 API 和示例、组合 an-ui 的表单与列表能力时使用本技能。

## 组件作用与文档索引

先根据任务选择下方对应的组件说明文件。只读取当前任务涉及的组件及其明确依赖，避免一次性加载所有 API 文档。

| 组件 | 作用 | 说明文件 |
|---|---|---|
| Button | 统一按钮样式与加载、禁用状态 | [[references/components/button|button]] |
| FormPro | 通过字段配置生成表单，支持联动、远程选项、分组和重复字段 | [[references/components/form-pro|form-pro]] |
| FilterForm | 带搜索、清空和折叠操作的筛选表单 | [[references/components/filter-form|filter-form]] |
| TablePro | 带请求、列格式化、列设置能力的数据表格 | [[references/components/table-pro|table-pro]] |
| EditableTable | 表格内直接编辑行数据 | [[references/components/editable-table|editable-table]] |
| FilterList | 组合搜索表单、数据表格、分页请求和批量操作 | [[references/components/filter-list|filter-list]] |
| ModalForm | 在弹窗中录入或编辑表单 | [[references/components/modal-form|modal-form]] |
| DrawerPro | 带底部操作按钮的通用抽屉 | [[references/components/drawer-pro|drawer-pro]] |
| DrawerForm | 在抽屉中录入或编辑表单 | [[references/components/drawer-form|drawer-form]] |
| DescriptionsPro | 根据数据与字段配置展示只读详情 | [[references/components/descriptions-pro|descriptions-pro]] |
| FileListView | 以图片或文件样式展示文件并处理下载 | [[references/components/file-list-view|file-list-view]] |

## 按需读取方式

1. 根据用户目标，从组件索引中选出直接相关的组件。
2. 阅读对应组件说明文件，确认 props、ref 和配置约定。
3. 说明文件链接到其他组件时，再读取那些依赖组件的相关章节。
4. 示例和行为与文档不一致时，以当前组件源码及其类型定义为准，并据此修正文档。

## 常用组合

- 搜索列表页：优先使用 FilterList；深入配置时再查看 FilterForm、FormPro 和 TablePro。
- 表单弹窗或抽屉：查看 ModalForm 或 DrawerForm，并按需查看 FormPro、DrawerPro。
- 可编辑明细：查看 EditableTable，并按需查看 FormPro。
- 详情页附件：查看 DescriptionsPro 与 FileListView。
