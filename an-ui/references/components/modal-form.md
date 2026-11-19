# ModalForm

## 作用

在 Modal 中承载 FormPro，适用于新增、编辑等字段较少的录入流程。`trigger` 可代替外部 open 状态管理。

## Props

| 属性 | 类型 | 说明 |
|---|---|---|
| fieldsConfig | `FormProProps["fieldsConfig"]` | 必填，表单字段配置 |
| trigger | `React.ReactElement` | 触发打开的元素 |
| modalProps | `ModalProps` | 透传给 Ant Design Modal 的属性 |
| formProps | `Omit<FormProProps, "fieldsConfig">` | 透传给 FormPro 的属性 |
| title | `ModalProps["title"] \| (values) => ReactNode` | 标题，可按当前值切换新增/编辑标题 |
| width / open / footer | 对应 Modal 属性 | 宽度、受控开关和底部区域 |
| fieldComponents | 对应 FormPro 属性 | 自定义字段组件 |
| layout / labelCol / wrapperCol / cols | 对应 FormPro 属性 | 表单布局 |
| initialValues | 对应 FormPro 属性 | 初始表单值 |
| onOk | `(values, editValues?) => Promise<any> \| unknown` | 提交回调 |
| onOpenChange | `(open: boolean) => void` | 开关变化 |
| onCancel | `() => void` | 取消回调 |

### Ref

`open(values?)` 打开并填充值；参数也可为异步取值函数。`close()` 关闭，`setOpen(open)` 设置状态，`form` 为表单实例。

## 用法

```tsx
<ModalForm
  trigger={<Button type="primary">新增</Button>}
  title="新增用户"
  fieldsConfig={[{ label: "姓名", name: "name", type: "input", required: true }]}
  onOk={async (values) => createUser(values)}
/>
```

表单字段语法见 [[form-pro|FormPro]]。编辑流程可通过 ref 的 `open(existingValues)` 填入记录。
