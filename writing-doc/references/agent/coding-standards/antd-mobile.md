# antd-mobile 规范

## 核心原则

- 通用 UI 优先使用 antd-mobile 组件
- 不引入第二套 UI 组件库
- 移动端交互遵循 antd-mobile 设计规范

## 组件使用规范

- 表单使用 antd-mobile Form 组件，配合 `Form.Item` 校验
- 列表使用 antd-mobile List 组件
- 弹窗使用 antd-mobile Dialog / Popup
- 消息提示使用 `Toast` API
- 图标使用 `antd-mobile-icons` 按需导入

## 移动端适配

- 所有组件按 antd-mobile 移动端规范使用
- 触摸交互区域不小于 44px
- 参考 `h5-pxtorem.md` 进行 rem 适配