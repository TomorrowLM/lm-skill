# TablePro

## 作用

基于 Ant Design Table 扩展数据请求、列格式化、空值占位、工具栏和列设置，适用于常规数据列表。

## Props

继承 Ant Design `TableProps`（`columns` 和 `title` 由组件重新定义），扩展：

| 属性 | 类型 | 说明 |
|---|---|---|
| columns | `TableColumnProType<RecordType>[]` | 列配置 |
| title | `React.ReactNode` | 表格标题 |
| request | `(pagination, filters, sorter) => Promise<{datas, count} \| any[]>` | 异步请求数据 |
| manual | `boolean` | 手动触发请求 |
| frontPagination | `boolean` | 前端分页 |
| showSetting | `boolean` | 显示列设置 |
| cacheKey | `string` | 持久化列设置的缓存 key |
| emptyColumnValue | `React.ReactNode` | 空值占位 |
| toolBarRender | `() => React.ReactNode` | 自定义工具栏 |
| className / style | `string` / `React.CSSProperties` | 根节点样式 |

### TableColumnProType

基于 `TableColumnType<RecordType>`，额外支持 `date: boolean | string`（日期格式化）、`message: ReactNode`（标题提示）、`format(value, record, index)`（值格式化）和多行 `ellipsis: boolean | { showTitle?, rows? }`。

request 接收分页、筛选、排序参数；可返回 `{ datas: rows, count: total }` 或数组。使用服务端分页时提供总数对象。

### Ref

`reload()` 保持当前分页刷新；`refresh()` 回到第一页刷新。

## 用法

```tsx
<TablePro
  rowKey="id"
  columns={[{ title: "创建时间", dataIndex: "createdAt", date: "YYYY-MM-DD" }]}
  request={async (pagination, filters, sorter) => api.list({ pagination, filters, sorter })}
/>
```

需要搜索表单、批量操作和列表联动时使用 [[filter-list|FilterList]]。
