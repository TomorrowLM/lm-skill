# FormPro

## 作用

基于 Ant Design Form，以 `fieldsConfig` 配置生成表单。适合标准表单、联动字段、远程选项、分组和动态重复字段。

## Props

继承 Ant Design `FormProps`，扩展：

| 属性 | 类型 | 说明 |
|---|---|---|
| fieldsConfig | `FormFieldConfig[]` | 必填，字段配置 |
| cols | `ColProps` | 默认字段栅格列数 |
| gutter | `RowProps["gutter"]` | 字段间距 |
| fieldComponents | `Record<string, React.FC>` | 自定义字段类型组件映射 |
| formExtra | `any` | 传给字段配置函数的额外参数 |
| readOnly | `boolean` | 全局只读模式 |

## FormFieldConfig

继承 Ant Design `FormItemProps`（不含 `required`、`children`、`label`），扩展 `type`、`cols`、`gutter`、`fieldComponents` 和 `templateOptions`。`label`、`hide`、`readOnly`、`disabled`、`required` 可为静态值或函数。函数参数为 `(values, formExtra, index)`，其中 `values` 是表单值，`index` 用于 repeat 项。

| `type` | 用途 / 说明 |
|---|---|
| `input`、`search`、`textarea` | 文本输入 |
| `select`、`cascader`、`treeSelect` | 选项选择；支持 `templateOptions.request` 远程加载 |
| `radio`、`checkbox` | 单选/多选；支持远程选项 |
| `switch`、`inputNumber`、`date`、`time`、`color` | 对应 Ant Design 控件 |
| `upload` | 文件上传，具体配置以 UploadProps 为准 |
| `autoComplete` | 自动补全 |
| `custom` | 自定义内容，`templateOptions.children` 提供节点 |
| `group` | 分组容器，可设 `title`、`children`、`childrenCols` |
| `repeat` | 动态重复字段；支持 `children`、`childrenCols`、`title`、`minLength`、`maxLength`、`addButtonProps` |

`templateOptions` 的类型由字段控件决定，并可传函数 `(values, formExtra, index) => props`。有远程选项能力的类型会把 request 用于加载 options。复杂示例可参考源码 demos：基础字段、联动、远程选项、自定义字段、group、repeat、OSS 上传。

## 用法

```tsx
<FormPro
  layout="vertical"
  fieldsConfig={[
    { label: "名称", name: "name", type: "input", required: true },
    {
      label: "分类", name: "category", type: "select",
      templateOptions: { options },
    },
    {
      label: "备注", name: "note", type: "textarea",
      hide: (values) => values.category === "simple",
    },
  ]}
  onFinish={save}
/>
```

联动函数读取当前表单值，动态选项使用相应控件的 `templateOptions.request`。弹窗/抽屉中使用表单请分别查看 [[modal-form|ModalForm]] 和 [[drawer-form|DrawerForm]]。
