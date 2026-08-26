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

## 跨平台兼容

### 小程序 WebView 环境识别

当 H5 页面可能嵌入小程序（微信/支付宝等）WebView 时，需在编码前识别并处理以下差异：

1. **判断是否在小程序环境**：通过 `navigator.userAgent` 或 `wx.miniProgram.getEnv()` 判断
2. **导航栏处理**：小程序 WebView 通常自带导航栏，H5 页面需避免重复渲染顶部导航
3. **分享与跳转**：小程序 WebView 内 `window.open` 不可用，需通过 `wx.miniProgram.navigateTo` 等 JSSDK 方法实现页面跳转
4. **Cookie/Session**：小程序 WebView 对第三方 Cookie 支持有限，必要时改用 token 参数传递

### iOS 与 Android 样式兼容

移动端开发需关注以下平台差异，设计阶段就纳入考量而非实现时临时修补：

1. **安全区域（Safe Area）**：iOS 底部有 Home Indicator，使用 `env(safe-area-inset-bottom)` 处理；Android 无此概念
2. **滚动行为**：iOS 有弹性滚动（`-webkit-overflow-scrolling: touch`），Android 滚动条样式不同
3. **字体渲染**：iOS 默认使用苹方/SF，Android 使用思源/Roboto；`font-family` 需同时覆盖两个平台
4. **`position: fixed`**：iOS 键盘弹出时 fixed 元素可能错位，需用 `visualViewport` API 或 `scrollIntoView` 替代
5. **输入框聚焦**：iOS Safari 会自动缩放页面，需 `<meta name="viewport" content="... user-scalable=no">` 配合 `font-size: 16px` 防止
6. **`:active` 伪类**：iOS 默认不触发，需在 `body` 上加 `ontouchstart` 事件或使用 `-webkit-tap-highlight-color`
7. **1px 边框**：高 DPI 屏幕下 1px 可能显示为 2px，需使用 `transform: scaleY(0.5)` 或伪元素方案
8. **日期选择**：iOS 和 Android 原生日期控件样式不同，统一体验需使用第三方日期选择器替代原生 `<input type="date">`