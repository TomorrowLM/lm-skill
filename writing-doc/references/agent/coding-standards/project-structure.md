# 项目结构规范

## 目录结构规范

**组件必须放在独立的文件夹内**，每个文件夹是一个完整的组件单元，包含主文件、样式、类型定义。

**规范模板：**

```text
src/
├── pages/
│   └── page-name/                # 页面目录
│       ├── index.tsx             # 页面入口
│       ├── types.ts              # 页面级类型定义
│       ├── consts.ts             # 页面级常量定义
│       ├── components/           # 页面私有组件
│       │   ├── ComponentName/
│       │   │   ├── index.tsx     # 主组件
│       │   │   └── types.ts      # 组件类型
│       │   └── SubComponent/
│       │       └── index.tsx
│       └── hooks/                # 页面私有 hooks
│           └── useXxx.ts
│
├── components/                   # 公共组件（多页面复用）
│   ├── Button/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── Modal/
│       ├── index.tsx
│       └── types.ts
│
├── stores/                       # 全局公共状态（Zustand），页面私有的放页面目录
│   └── useXxxStore.ts
│
├── hooks/                        # 全局公共 hooks，页面私有的放页面目录
│   └── useXxx.ts
│
├── services/                     # API 接口请求（按模块分文件夹）
│   └── XxxService/
│       ├── index.ts              # 接口请求方法
│       └── types.ts              # 接口类型定义
│
├── constants/                    # 公共常量（多模块复用，按业务领域拆分）
│   └── status.ts                 # 例：任务状态选项配置与颜色映射
│
├── types/                        # 仅全局通用类型
│   └── global.d.ts
│
└── mock/                         # Mock API
    └── xxx.js
```

**关键规定：**

1. **components 下每一层必须是文件夹**（名称为大驼峰），主组件文件必须命名为 `index.tsx`
2. **公共组件放 `src/components/`**，页面私有组件放 `src/pages/<page>/components/`
3. **`stores/` 和 `hooks/` 只放公共的**，页面私有的 Zustand Store 或 Hook 放对应页面目录下，stores 默认不使用在功能模块中
4. **`services/` 中每个 API 模块必须是独立文件夹**（如 `XxxService/index.ts` + `XxxService/types.ts`），不直接放 .ts 文件
5. **多个模块复用的公共常量必须放在 `src/constants/` 目录下**，页面私有常量放页面目录的 `consts.ts`；`src/constants/` 按业务领域拆分文件，命名使用小驼峰，例：`status.ts`、`frequency.ts`

## 文件命名规范

- 主组件文件：`index.tsx`
- 样式文件：见样式模块（tailwind.md / less.md / less-cssmodules.md）
- 类型定义：`types.ts`
- 常量定义：`consts.ts`
- 工具函数：`utils.ts`
- 测试文件：`index.test.tsx`