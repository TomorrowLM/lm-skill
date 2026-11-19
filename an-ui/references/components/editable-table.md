# EditableTable

## 作用

在表格行内编辑数据，组合 Ant Design Table 与 FormPro。适用于明细行增删改、配置项维护等表格录入场景。

## Props

| 属性 | 类型 | 说明 |
|---|---|---|
| value | `any[]` | 当前行数据（受控值） |
| onChange | `(value: any[]) => void` | 数据变化回调 |
| columns | `EditableTableColumnType[]` | 列和编辑字段配置；`dataIndex` 同时作为表单字段名，需唯一 |
| tableProps | `TableProps<any>` | 透传给 Table 的属性 |
| formProps | `Omit<FormProProps, "fieldsConfig">` | 透传给 FormPro 的属性 |
| addText | `React.ReactNode` | 新增按钮文本 |
| maxLength | `number` | 最大行数 |
| fieldComponents / formExtra | 对应 FormPro 属性 | 自定义字段组件及额外参数 |
| editableKeys | `string[]` | 可编辑行的 key 列表 |

列配置同时支持 Table column 与 FormFieldConfig 属性。未设置 `type` 的列作为普通展示列。

### Ref

`form` 表单实例；`onAdd(position?, row?)` 新增行；`onDelete(key)` 删除行；`onCopy(key, position?, row?)` 复制行。`position` 为 `"top" | "bottom"`。

## 用法

```tsx
<EditableTable
  value={rows}
  onChange={setRows}
  columns={[
    { title: "名称", dataIndex: "name", type: "input" },
    { title: "数量", dataIndex: "count", type: "inputNumber" },
    { title: "说明", dataIndex: "note" },
  ]}
/>
```

编辑字段的 `type` 与 `templateOptions` 用法见 [[form-pro|FormPro]]。
