# Less 样式规范（H5 项目）

## 核心原则

H5 项目使用 Tailwind CSS 作为主要样式方案，Less 仅作为补充。

## 样式实现规则

1. **优先使用 Tailwind 工具类组合**完成样式，避免自定义 CSS
2. **禁止在 JSX 中使用内联 `style={{}}`**，样式必须通过 Tailwind 工具类或 CSS Modules 中的 className 实现
3. **Less 仅作为补充**，用于 Tailwind 无法覆盖的复杂自定义样式（如动画、特殊布局）
4. **Less 文件命名为 `index.module.less`**，必须通过 CSS Modules 引入
5. 业务样式必须写在 CSS Modules 中，避免散落全局 class 造成样式污染
6. 禁止直接 import 普通 `.less` 文件
7. 遵循 BEM 命名规范（仅在使用 Less 文件时）
8. 长 className 列表使用 `classnames` 库（已安装）动态组合，保持 JSX 可读性

## Less 样式规则

1. 减少 ID 选择器，避免 !important（公共样式除外）
2. 避免覆盖样式，尽量不使用行内样式
3. 多浏览器兼容时，标准属性写在底部
4. z-index ≤ 150（公共样式和提示框除外），禁止使用 999~9999
5. "0"值省略单位，例：`padding: 0 20px`
6. 每个声明以分号结束
7. 保持盒模型一致，不随意修改
8. 不改变元素默认行为
9. 不重复声明可继承样式，使用属性缩写
10. 能用英文时不用数字，例：`nth-child(odd)`
11. 颜色使用十六进制（透明效果用 rgba）
12. CSS 注释格式：`/* color: #ffffff; */`
13. **禁止**使用 `max-height`
14. **禁止**在 HTML 中使用 style