# 代码格式化规范（Prettier + ESLint 强制执行）

以下规则由 `.prettierrc` 和 `.eslintrc.cjs` 自动强制执行，提交前必须通过格式化检查：

1. **字符串使用单引号**：`singleQuote: true`，所有 JS/TS 字符串字面量使用单引号
2. **每行最大宽度 80 字符**：`printWidth: 80`，超出时自动换行
3. **缩进 2 个空格**：`tabWidth: 2`，禁止使用 Tab 缩进
4. **语句末尾必须加分号**：`semi: true`
5. **尾逗号使用 es5 风格**：`trailingComma: "es5"`，对象和数组多行时最后一项加逗号
6. **行尾符号自动检测**：`endOfLine: "auto"`，不强制统一换行符
7. **import 自动排序**：`prettier-plugin-organize-imports` 插件自动整理 import 语句顺序
8. **package.json 自动排序**：`prettier-plugin-packagejson` 插件自动整理依赖顺序
9. **禁止在 JSX 中使用内联 `style={{}}`**：样式必须通过 Tailwind 工具类或 `.less` 文件中的 className 实现
10. **`@typescript-eslint/no-explicit-any` 为 `warn`**：尽量避免 `any`，必要时可临时使用但不忽略警告