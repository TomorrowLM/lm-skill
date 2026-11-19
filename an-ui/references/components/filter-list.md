# FilterList

## 作用

组合搜索表单与 TablePro，负责条件提交、分页查询、表格展示和批量操作，适合常见后台列表页。

## Props

| 属性 | 类型 | 说明 |
|---|---|---|
| fieldsConfig | `FilterFormProps["fieldsConfig"]` | 必填，搜索字段配置 |
| columns | `TableProProps["columns"]` | 必填，列表列配置 |
| request | `(page, values) => Promise<any>` | 必填，按分页与筛选值请求数据 |
| formProps / tableProps | 对应组件属性（不含 fieldsConfig） | 透传给搜索表单/表格 |
| formValues | `Record<string, any>` | 异步初始搜索值 |
| rowKey | `TableProProps["rowKey"]` | 行 key |
| frontPagination | `boolean` | 前端分页 |
| manual | `boolean` | 手动触发请求 |
| batchOperations | `BatchButtonProps[]` | 批量操作配置 |
| toolBarRender | `TableProProps["toolBarRender"]` | 自定义工具栏 |
| onClear / onSearch | 对应 FilterForm 回调 | 清空/搜索回调 |
| title / cols / emptyColumnValue | 对应子组件属性 | 表格标题、搜索表单列数、空值占位 |

`BatchButtonProps` 扩展 Ant Design Button 属性：`confirm` 配置确认框、`completedAction` 选择成功后 `reload`（保持页码）或 `refresh`（回第一页）、`render` 自定义按钮、`onSuccess` 成功回调、`onOk` 确认回调。

### Ref

`values`/`setFormValues` 获取或设置筛选值，`form` 为表单实例，`selectedRowKeys`/`setSelectedRowKeys` 管理勾选行，`reload()` 保持分页刷新，`refresh()` 回第一页刷新。

## 用法

```tsx
<FilterList
  fieldsConfig={[{ label: "名称", name: "name", type: "input" }]}
  columns={[{ title: "名称", dataIndex: "name" }]}
  request={async (page, values) => api.list({ ...page, ...values })}
/>
```

字段配置见 [[form-pro|FormPro]]，表格列及 `request` 返回值约定见 [[table-pro|TablePro]]。
