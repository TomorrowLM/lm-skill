# 移动端适配规范

## postcss-pxtorem

项目使用 `postcss-pxtorem` 自动将 px 单位转换为 rem，实现移动端自适应。

## 适配规则

1. 设计稿以 375px 宽度为基准
2. 所有尺寸使用 px 编写，构建时自动转换为 rem
3. 触摸交互区域不小于 44px（44px 换算后约 44px 物理尺寸）
4. 字体大小使用 px，不做 rem 转换（通过 `selectorBlackList` 排除）
5. 边框宽度使用 px，不做 rem 转换
6. 横屏适配需额外处理 `orientation` 媒体查询

## 注意事项

- 第三方组件库（antd-mobile）的样式已内部处理，无需额外适配
- 使用 `vw` / `vh` 单位时注意安全区域（刘海屏）