# Ant Design 规范

## 核心原则

- 通用 UI 优先使用 Ant Design 和 Ant Design Icons
- 不引入第二套 UI 组件库
- 覆盖 Ant Design 样式时使用明确的业务 class 约束范围

## 组件使用规范

- 表单使用 Ant Design Form 组件，配合 `Form.Item` 校验
- 表格使用 Ant Design Table 组件，统一分页、筛选、排序行为
- 弹窗使用 Ant Design Modal，确认操作使用 `Modal.confirm`
- 消息提示使用 `message` / `notification` API
- 图标使用 `@ant-design/icons` 按需导入

## 样式覆盖规范

- 覆盖 Ant Design 样式时，使用业务 class 包裹，避免全局污染
- 不直接修改 Ant Design 组件内部 class
- 使用 `ConfigProvider` 统一主题配置（如 `prefixCls`、`token`）