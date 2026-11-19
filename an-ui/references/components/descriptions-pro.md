# DescriptionsPro

## 作用

基于 Ant Design `Descriptions` 展示只读详情。通过 `data` 提供数据、`config` 描述展示字段；支持按 `title` 分组、隐藏字段、日期/文本格式化、自定义渲染和文件列表。

## Props

继承 Ant Design `DescriptionsProps`，扩展：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| data | `any` | — | 字段数据源 |
| config | `DescriptionsProItem[]` | 必填 | 详情项配置 |
| emptyColumnValue | `string` | `"--"` | 空值占位 |
| labelWidth | `React.CSSProperties["width"]` | `120` | bordered 模式下统一标签宽度 |
| className / style | `string` / `React.CSSProperties` | — | 根节点样式 |

### DescriptionsProItem

继承 `DescriptionsItemProps`（不含 `children`），扩展 `name`（从 data 取值，支持 lodash 路径）、`hide: boolean | (value, data) => boolean`、`title`（设置分组标题）、`date: boolean | string`、`ellipsis`、`type: "custom" | "file"`、`children`/`render`（自定义内容）、`format`（格式化数据）。`type: "file"` 将值交给 [[file-list-view|FileListView]]。

## 用法

```tsx
<DescriptionsPro
  data={record}
  bordered
  config={[
    { name: "name", title: "基本信息" },
    { name: "createdAt", date: "YYYY-MM-DD" },
    { name: "attachments", type: "file" },
  ]}
/>
```

自定义分组内容可使用 `{ type: "custom", children: ... }`；每个带 `title` 的普通字段会开始一个分组。
