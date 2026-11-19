# DrawerForm

## 作用

在抽屉中录入或编辑数据，组合 FormPro 与 DrawerPro，适合需要较大编辑空间、同时保留当前页面上下文的流程。

## Props

| 属性 | 类型 | 说明 |
|---|---|---|
| fieldsConfig | `FormProProps["fieldsConfig"]` | 必填，表单字段配置 |
| trigger | `React.ReactElement` | 触发打开的元素，可省去自行维护 open |
| drawerProps | `DrawerProProps` | 透传抽屉属性 |
| formProps | `Omit<FormProProps, "fieldsConfig">` | 透传表单属性 |
| title / width / open / footer | 对应 DrawerPro 属性 | 标题、宽度、受控状态和底部区域 |
| layout / labelCol / wrapperCol / cols | 对应 FormPro 属性 | 表单布局 |
| initialValues | 对应 FormPro 属性 | 初始表单值 |
| onOk | `(values, editValues?) => Promise<any> \| unknown` | 提交处理；异步回调可用于提交状态控制 |
| onOpenChange | `(open: boolean) => void` | 抽屉开关变化 |
| onClose | `() => void` | 关闭回调 |

### Ref

`open(values?)` 打开并填充值；也可传异步取值函数。`close()` 关闭，`setOpen(open)` 设置状态，`form` 为表单实例。

## 用法

```tsx
<DrawerForm
  trigger={<Button type="primary">新增</Button>}
  title="新增记录"
  fieldsConfig={fields}
  onOk={async (values) => save(values)}
/>
```

字段配置和字段联动语法见 [[form-pro|FormPro]]，抽屉按钮与触发器行为见 [[drawer-pro|DrawerPro]]。
