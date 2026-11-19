# FilterForm

## 作用

将 FormPro 配置为搜索筛选表单，提供搜索、清空和折叠能力；也可单独使用。FilterList 内部使用此组件时负责驱动列表查询。

## Props

继承 FormPro 属性（`layout` 除外；组件另行支持布局值），扩展：

| 属性 | 类型 | 说明 |
|---|---|---|
| fieldsConfig | `FormFieldConfig[]` | 搜索字段配置 |
| foldRow | `number` | 折叠时显示行数，默认 1；假值表示不折叠 |
| searchText / clearText | `string` | 搜索、清空按钮文本 |
| collapse | `boolean` | 折叠状态 |
| onSearch | `(values) => void` | 搜索回调 |
| onClear | `(values) => void` | 清空回调 |
| onCollapse | `(collapse: boolean) => void` | 折叠状态变化 |
| layout | `"horizontal" | "inline" | "vertical" | "insert-vertical"` | 表单布局 |
| className / style | `string` / `React.CSSProperties` | 根节点样式 |

## 用法

```tsx
<FilterForm
  fieldsConfig={[{ label: "名称", name: "name", type: "input" }]}
  onSearch={(values) => query(values)}
  onClear={() => query({})}
/>
```

字段类型、远程选项及联动配置见 [[form-pro|FormPro]]。完整搜索表单和表格的数据流优先使用 [[filter-list|FilterList]]。
