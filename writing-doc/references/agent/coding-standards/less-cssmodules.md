# Less + CSS Modules 样式规范（PC 项目）

## 核心原则

**不使用 Tailwind CSS**，使用 Less + CSS Modules 作为样式方案。

## 样式实现规则

1. **禁止在 JSX 中使用内联 `style={{}}`**，样式必须通过 CSS Modules 中的 className 实现
2. **Less 必须使用 CSS Modules**：文件命名为 `index.module.less`，通过 `import styles from './index.module.less'` 引入，使用 `styles.xxx` 访问类名，禁止直接 import 普通 `.less` 文件
3. 业务样式必须写在 CSS Modules 中，避免散落全局 class 造成样式污染
4. 组件、页面、layout 目录内的局部样式文件统一命名为 `index.module.less`；全局样式放在 `src/styles/`
5. 长 className 列表使用 `classnames` 库（已安装）动态组合，保持 JSX 可读性

**正确示例：**

```typescript
// ✅ 使用 CSS Modules（index.module.less）
import styles from './index.module.less';
<div className={styles.container}>
  <span className={styles.title}>{name}</span>
</div>
```

**错误示例：**

```typescript
// ❌ 错误：直接 import 普通 .less 文件（未使用 CSS Modules）
import './index.less';
<div className="container">...</div>

// ❌ 错误：使用内联样式
<div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
  <span>{name}</span>
</div>
```

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