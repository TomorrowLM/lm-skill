# DrawerPro

## 作用

基于 Ant Design Drawer 增加默认底部取消/确定按钮，并支持 trigger 控制打开，适用于需要抽屉容器但不需要内置表单的场景。

## Props

继承 Ant Design `DrawerProps`（`footer` 除外），额外扩展：

| 属性 | 类型 | 说明 |
|---|---|---|
| cancelText | `string` | 取消按钮文本，默认“取消” |
| okText | `string` | 确定按钮文本，默认“确定” |
| footer | `ReactNode \| (originNode) => ReactNode \| null` | 自定义/包装底部；`null` 可隐藏 |
| trigger | `React.ReactElement` | 触发打开的元素 |
| onOk | `() => Promise<boolean> \| unknown` | 确定回调；返回 Promise 时支持按钮 loading |
| onOpenChange | `(open: boolean) => void` | 开关状态变化 |

其余抽屉属性直接透传。受控场景使用继承的 `open` 与 `onClose`。

## 用法

```tsx
<DrawerPro trigger={<Button>打开</Button>} title="详情" onOk={save}>
  抽屉内容
</DrawerPro>
```

需要抽屉表单时使用 [[drawer-form|DrawerForm]]。
