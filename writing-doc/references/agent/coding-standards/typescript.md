# TypeScript 类型定义规范

## 核心原则

**所有 TypeScript 类型定义必须放在对应类型文件中**：`interface`、`type` 放在 `types.ts`；业务枚举放在对应领域的 `enums.ts` 或 `src/enums/`。

## 类型文件放置规则

1. **组件类型**：放在组件目录的 `types.ts` 中（如 `components/Button/types.ts`）
2. **页面类型**：放在页面目录的 `types.ts` 中（如 `pages/user-list/types.ts`）
3. **API 类型**：放在 services 模块的 `types.ts` 中（如 `services/UserService/types.ts`）
4. **全局类型**：放在 `src/types/` 目录下（如 `types/global.d.ts`），仅限全局通用类型
5. **业务枚举**：跨模块枚举放在 `src/enums/`，页面私有枚举放在页面目录的 `enums.ts`

## 类型定义要求

1. **禁止在业务代码中直接定义类型**，所有类型声明必须提取到对应模块的 `types.ts` 文件中
2. **避免使用 `any` 类型**，优先使用 `unknown` 或明确的类型定义
3. **类型定义和枚举必须添加中文注释**说明用途、取值语义和业务边界
4. **使用 `Record<string, unknown>` 替代 `[key: string]: any`** 实现可扩展类型
5. **组件 Props 类型必须定义在同目录的 `types.ts` 中**
6. **API 请求参数和响应类型必须定义在 services 模块的 `types.ts` 中**
7. **函数和重要变量必须添加中文注释**，说明业务语义、数据来源或特殊处理原因
8. **项目已配置路径别名时，优先使用别名导入**，避免使用可被别名替代的跨目录相对路径

**正确示例：**

```typescript
// components/UserCard/types.ts

/**
 * 用户卡片组件 Props
 */
export interface UserCardProps {
  /** 用户信息 */
  user: UserInfo;
  /** 点击回调 */
  onClick?: (userId: string) => void;
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}
```

**错误示例：**

```typescript
// ❌ 错误：在组件文件中直接定义类型
const UserCard: React.FC<{ user: any; onClick?: Function }> = (props) => {
  // ...
};

// ❌ 错误：使用 any 类型
const processData = (data: any) => { ... };
```