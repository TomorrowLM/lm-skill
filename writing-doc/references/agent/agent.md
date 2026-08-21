# 前端 AGENTS 模块拼装指引

本文件描述如何根据项目技术栈，从 `references/agent/` 目录中选择模块文件拼接出完整的 `AGENTS.md`。

生成的 `AGENTS.md` 按三大章节组织：

```
# 一、AI 行为规则
# 二、项目编写规范
# 三、项目测试规范
```

---

## 目录结构

```text
references/agent/
├── agent.md                     # 本文件（拼装指引）
├── ai-behavior/                 # 一、AI 行为规则
│   └── ai-behavior.md
├── coding-standards/            # 二、项目编写规范
│   ├── base.md                  # 通用规范
│   ├── react.md                 # React 组件规范
│   ├── vue.md                   # Vue 组件规范
│   ├── typescript.md            # TypeScript 类型规范
│   ├── project-structure.md     # 项目目录结构
│   ├── components.md            # 项目公共组件说明
│   ├── tailwind.md              # Tailwind CSS 样式
│   ├── less.md                  # Less 样式（H5）
│   ├── less-cssmodules.md       # Less + CSS Modules 样式（PC）
│   ├── antd.md                  # Ant Design 组件库
│   ├── antd-mobile.md           # antd-mobile 组件库
│   ├── api.md                   # API 调用规范
│   ├── qiankun.md               # 微前端基座
│   ├── h5-pxtorem.md            # 移动端适配
│   ├── oxlint.md                # Oxlint 代码检查
│   └── image-preview.md         # 图片展示规范
└── testing-standards/           # 三、项目测试规范
    └── vitest.md                # 单测规则
```

---

## 技术栈识别

从 `package.json` 的 `dependencies` 和 `devDependencies` 字段判断：

| 检测项 | 检测条件 | 对应模块 |
|--------|----------|----------|
| 公共组件 | 所有项目 | `coding-standards/components.md` |
| 框架 | `react` 依赖存在 | `coding-standards/react.md` |
| 框架 | `vue` 依赖存在 | `coding-standards/vue.md` |
| 样式 | `tailwindcss` 依赖存在 | `coding-standards/tailwind.md` |
| 样式 | `less` 依赖存在，且无 `tailwindcss` | `coding-standards/less-cssmodules.md`（PC 项目）或 `coding-standards/less.md`（H5 项目） |
| UI 库 | `antd` 依赖存在 | `coding-standards/antd.md` |
| UI 库 | `antd-mobile` 依赖存在 | `coding-standards/antd-mobile.md` |
| 微前端 | `qiankun` 依赖存在 | `coding-standards/qiankun.md` |
| 移动端 | `postcss-pxtorem` 依赖存在 | `coding-standards/h5-pxtorem.md` |
| Lint | `oxlint` 依赖存在 | `coding-standards/oxlint.md` |
| 测试 | `vitest` 或 `jest` 依赖存在 | `testing-standards/vitest.md` |
| 图片预览 | `yqa-g-web-urban` 项目特有 | `coding-standards/image-preview.md` |

> 样式模块选择：PC 项目（有 `antd` 无 `antd-mobile`）用 `less-cssmodules.md`；H5 项目（有 `antd-mobile` 无 `antd`）用 `less.md`。

---

## Token 控制约束

1. 只读取当前上下文明确涉及的项目和模板模块，不全量扫描 workspace。
2. 生成 `AGENTS.md` 时只拼接命中的技术栈模块，未命中的模块不得读取或输出。
3. 默认生成精简版规则：保留必须/禁止/优先/触发条件，省略大段示例代码和重复解释。
4. 示例代码、完整目录树、组件清单明细仅在用户明确要求或当前变更需要时展开。
5. 同一规则在多个模块重复出现时，只保留最贴近归属的一处。

---

## 生成文档目录结构约束

生成的 `AGENTS.md` 必须固定为三大章节：

1. `# 一、AI 行为规则`
2. `# 二、项目编写规范`
3. `# 三、项目测试规范`

`# 二、项目编写规范` 下二级目录必须按以下顺序输出：

1. `## 编码约束`
2. `## 业务约定`
3. `## 项目结构规范`
4. `## TypeScript 类型定义规范`
5. `## 封装规则`
6. `## 项目公共组件`
7. `## 样式规范` 或 `## 样式与移动端适配规范`
8. `## 图片展示规范`（命中时）
9. `## Ant Design 规范` 或 `## antd-mobile 规范`（命中时）
10. `## API 调用规范`
11. `## 注释规范`
12. `## 工程约定`（项目存在长期工程约定时）

禁止生成以下旧目录：

- `# 二、代码规范`
- `# 三、项目规范`
- `## 代码格式化规范`
- 独立 `## React 组件开发规范`
- 非 Vue 项目中的独立 `## Vue 规范`

---

## 拼接顺序

每个 `AGENTS.md` 按三大章节顺序拼接模块内容：

```
# 一、AI 行为规则
1. ai-behavior/ai-behavior.md          ← 必选

# 二、项目编写规范
2. coding-standards/base.md            ← 必选
3. coding-standards/project-structure.md ← 必选
4. coding-standards/typescript.md      ← 必选
5. coding-standards/[框架].md          ← react.md 或 vue.md（命中时合并进封装规则）
6. coding-standards/components.md      ← 必选
7. coding-standards/[样式].md          ← tailwind.md / less.md / less-cssmodules.md（按检测结果选择）
8. coding-standards/image-preview.md   ← 命中时选择
9. coding-standards/[UI库].md          ← antd.md / antd-mobile.md（按检测结果选择）
10. coding-standards/api.md            ← 必选
11. 项目特有模块                        ← qiankun.md / h5-pxtorem.md / oxlint.md（按检测结果选择）

# 三、项目测试规范
11. testing-standards/vitest.md        ← 按检测结果选择
```

---

## 现有项目映射

| 项目 | 模块清单 |
|------|---------|
| yqa-g-web-urban | ai-behavior, base, react, project-structure, typescript, components, tailwind, image-preview, antd, api, vitest |
| yqa-g-h5-urban | ai-behavior, base, react, project-structure, typescript, components, tailwind, less, antd-mobile, api, vitest, h5-pxtorem |
| yqa-web-portal | ai-behavior, base, react, project-structure, typescript, less-cssmodules, antd, api, qiankun, oxlint, vitest |

---

## 使用方式

1. 读取目标项目的 `package.json`，按上表检测技术栈
2. 按拼接顺序读取对应模块文件
3. 将模块内容依次拼接，生成 `AGENTS.md`
4. 在文件头部追加项目名称和 GitNexus 片段（如有）

> 模块文件之间零交叉引用，`cat` 即可直接拼接。