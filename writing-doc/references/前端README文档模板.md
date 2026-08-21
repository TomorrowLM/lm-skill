# {项目名称}

<p align="center">
  <img src="https://img.shields.io/badge/{框架}-{版本}-{颜色}?style=flat-square&logo={logo}" />
  <img src="https://img.shields.io/badge/TypeScript-{版本}-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-{版本}-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/pnpm-{版本}-F69220?style=flat-square&logo=pnpm" />
</p>

<p align="center">
  <b>{项目一句话定位}</b><br />
  {说明项目面向的用户、端类型、核心业务范围和交付价值}
</p>

---

## 📌 项目概述

`{packageName}` 是 {业务线 / 产品线} 的 {PC / H5 / 小程序 / 管理端 / 基座应用}，主要服务 {核心业务场景}。项目采用 {框架}、{语言}、{构建工具}、{UI 组件库} 和 {样式方案} 构建，支持 {Mock 开发 / 环境化构建 / 自动路由 / 微前端 / 移动端适配 / 文件上传 / 权限控制} 等能力。

适用角色：

- **{角色1}**：{该角色使用系统完成的核心事项}。
- **{角色2}**：{该角色使用系统完成的核心事项}。
- **研发人员**：维护页面、公共组件、接口服务、状态管理和业务流程。

## 🛠 技术栈与运行环境

| 类别     | 技术                                | 版本       |
| -------- | ----------------------------------- | ---------- |
| 框架     | {React / Vue / Taro}                | {版本}     |
| 语言     | TypeScript                          | {版本}     |
| 构建     | {Vite / Webpack / Umi}              | {版本}     |
| UI       | {UI 组件库}                         | {版本}     |
| 路由     | {路由库 / 路由模式}                 | {版本}     |
| 状态管理 | {Zustand / Pinia 等}                | {版本}     |
| 请求     | {请求库 / 请求封装}                 | {版本}     |
| 样式     | {Less / CSS Modules / Tailwind CSS} | {版本}     |
| 工具     | {常用工具库}                        | 按依赖锁定 |

环境要求：

- Node.js：`{Node 版本要求}`
- pnpm：`{pnpm 版本要求}`

## 🚀 快速启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 本地预览构建产物
pnpm preview
```

开发环境配置位于 `{环境配置文件路径}`，默认 {是否启用 Mock / 是否走代理 / 默认端口}。

## 📜 脚本命令

| 命令                           | 说明                       |
| ------------------------------ | -------------------------- |
| `pnpm dev`                     | 启动开发服务器             |
| `pnpm preview`                 | 预览本地构建产物           |
| `pnpm build:test`              | 测试环境构建               |
| `pnpm build:pre`               | 预发布环境构建             |
| `pnpm build:prod`              | 生产环境构建               |
| `pnpm lint`                    | 使用 ESLint 检查并修复源码 |
| `pnpm test:unit`               | 执行单元测试               |
| `pnpm test:watch`              | 以 watch 模式执行单元测试  |
| `pnpm exec tsc --noEmit`       | 执行 TypeScript 类型检查   |
| `pnpm exec prettier --check .` | 使用 Prettier 检查代码格式 |

> 按项目实际 `package.json` 保留可用命令，删除不存在的脚本。

## 📁 项目结构

```text
src/
├── assets/                     # 静态资源与全局样式
├── components/                 # 公共业务组件
├── constants/                  # 公共常量
├── enums/                      # 业务枚举
├── hooks/                      # 公共 Hooks 与业务流程 Hooks
├── layouts/                    # 页面框架或布局组件
├── pages/                      # 页面与路由入口
├── services/                   # API 服务与接口类型
├── stores/                     # 全局状态管理
├── types/                      # 全局类型
└── utils/                      # 通用工具函数
```

> 根据项目实际目录删减或补充，不展示不存在的目录。

## 🧭 路由与部署路径

### 🔀 路由配置

| 配置项    | 说明                                            |
| --------- | ----------------------------------------------- |
| 路由模式  | `{BrowserRouter / HashRouter / history / hash}` |
| 路由 base | `{环境变量或配置项}`，默认 `{默认值}`           |
| 路由来源  | `{路由配置文件 / 约定式路由 / 自动生成文件}`    |
| 挂载入口  | `{应用入口文件}`                                |

### 📍 页面路由

| 路径      | 页面       | 说明       |
| --------- | ---------- | ---------- |
| `/{path}` | {页面名称} | {页面说明} |
| `/{path}` | {页面名称} | {页面说明} |

### 📦 打包路径

构建产物输出到 `{输出目录}`。如项目按版本目录组织静态资源，请说明目录格式：

```text
{输出目录}/
├── {版本目录}/
│   ├── js/
│   ├── css/
│   ├── img/
│   └── fonts/
└── static/vendors/
```

资源访问 base 由 `{环境变量或构建配置}` 控制，默认值为 `{默认 base}`。如需调整部署路径，请修改对应环境配置文件。

## ⚙️ 环境配置

环境变量统一放在 `{环境配置目录}`，由 `{构建工具 / 配置文件}` 加载。

| 文件              | 说明               |
| ----------------- | ------------------ |
| `{env 文件}`      | 公共与开发环境配置 |
| `{env.test 文件}` | 测试环境覆盖配置   |
| `{env.pre 文件}`  | 预发布环境覆盖配置 |
| `{env.prod 文件}` | 生产环境覆盖配置   |

常用变量：

| 变量             | 说明                  | 默认值     |
| ---------------- | --------------------- | ---------- |
| `{ENV_NAME}`     | 当前业务环境标识      | `{默认值}` |
| `{ENABLE_MOCK}`  | 是否启用 Mock         | `{默认值}` |
| `{PORT}`         | 开发服务器端口        | `{默认值}` |
| `{BASE_PATH}`    | 路由 base 与资源 base | `{默认值}` |
| `{PROXY_PREFIX}` | 本地代理前缀          | `{默认值}` |
| `{API_BASE_URL}` | API 地址              | `{默认值}` |
| `{APP_URL}`      | 应用访问地址          | `{默认值}` |
| `{LOGIN_URL}`    | 登录地址              | `{默认值}` |

## 🧩 核心公共组件

| 组件       | 说明       | 典型场景   |
| ---------- | ---------- | ---------- |
| `{组件名}` | {组件能力} | {使用场景} |
| `{组件名}` | {组件能力} | {使用场景} |

### 📊 组件使用矩阵

| 页面       | {组件A} | {组件B} | {组件C} |
| ---------- | :-----: | :-----: | :-----: |
| {页面名称} |   ✅    |    -    |   ✅    |
| {页面名称} |    -    |   ✅    |   ✅    |

## ✅ 质量检查

提交或交付前按改动范围执行以下检查：

```bash
# ESLint 检查并自动修复源码
pnpm lint

# Prettier 格式检查
pnpm exec prettier --check .

# 单元测试
pnpm test:unit

# TypeScript 类型检查
pnpm exec tsc --noEmit
```

质量工具说明：

- **ESLint**：配置文件为 `{ESLint 配置文件}`，用于检查 TypeScript、框架代码、Hooks 和项目编码规范。
- **Prettier**：配置文件为 `{Prettier 配置文件}`，用于统一 Markdown、TypeScript、样式和配置文件格式。
- **Vitest / Jest**：用于执行单元测试。
- **TypeScript**：通过 `tsconfig.json` 和 `typescript` 校验类型安全。

### 📦 质量依赖

ESLint 相关依赖：

- `eslint`
- `{TypeScript ESLint 相关依赖}`
- `{框架 ESLint 插件}`
- `{Prettier 与 ESLint 集成依赖}`

Prettier 相关依赖：

- `prettier`
- `{prettier 插件 1}`
- `{prettier 插件 2}`

### 🧹 ESLint 规则

ESLint 规则由 `{ESLint 配置文件}` 维护，常见规则集：

- `eslint:recommended`
- `{框架推荐规则}`
- `{Hooks 推荐规则}`
- `{TypeScript 推荐规则}`
- `{Prettier 推荐规则}`

项目规则补充：

- `{规则名}`：`{配置值}`，{规则说明}。
- `{规则名}`：`{配置值}`，{规则说明}。

### 🎨 Prettier 规则

Prettier 规则由 `{Prettier 配置文件}` 维护，常见格式化策略：

- `singleQuote: true`：JavaScript 字符串使用单引号。
- `jsxSingleQuote: true`：JSX 属性使用单引号。
- `printWidth: 80`：单行最大宽度为 80。
- `tabWidth: 2`：缩进宽度为 2 个空格。
- `useTabs: false`：不使用 Tab 缩进。
- `semi: true`：语句末尾保留分号。
- `trailingComma: 'es5'`：多行对象/数组使用 ES5 尾逗号。
- `endOfLine: 'auto'`：保持行尾符自动适配。
- `plugins`：按项目实际插件说明 Tailwind 类名、import、package.json 或其他格式化能力。

仅文档改动可只执行 Prettier 检查；涉及代码、路由、构建配置、接口逻辑或部署配置时，需补充对应 lint、测试、类型检查或构建验证。

## 🚢 交付构建

| 目标环境 | 命令              | 配置文件     | 输出目录   |
| -------- | ----------------- | ------------ | ---------- |
| 测试     | `pnpm build:test` | `{配置文件}` | `{outDir}` |
| 预发布   | `pnpm build:pre`  | `{配置文件}` | `{outDir}` |
| 生产     | `pnpm build:prod` | `{配置文件}` | `{outDir}` |

交付前建议确认：

1. 环境变量是否指向目标环境。
2. 路由 base 与部署路径是否一致。
3. 构建产物是否生成在预期输出目录。
4. 静态资源路径、版本目录或 CDN 路径是否符合部署要求。
5. 目标环境登录、接口、上传、地图、权限等关键链路是否可用。

## 🔗 相关项目

- **{相关项目名称}** — {项目关系或用途}
- **{相关项目名称}** — {项目关系或用途}

## 📄 License

{License 类型}
