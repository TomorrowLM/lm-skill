---
name: page-development-workflow
description: 从零开发功能页面的标准化工作流。包含需求分析、技术调研、设计文档、实现计划、编码实现和测试验收的完整流程。适用于任何技术栈的页面开发场景。当需要开发新页面、实现设计稿、或按照规范创建功能模块时使用。
---

# 页面开发工作流

通用的功能页面开发标准化流程，适用于任何前端技术栈和项目类型。

## 快速开始

开发新页面时，按以下顺序执行：

```
1. 需求分析 → 2. 设计文档 → 3. 实现计划 → 4. 编码实现（TDD 驱动） → 5. 测试验收
```

## 标准工作流

### Phase 1: 需求分析与技术调研

**收集信息：**
- 设计稿或原型图（Figma、Sketch、Axure 等）
- 产品需求文档（PRD）或功能说明
- 接口文档或 API 规范
- 项目技术栈和开发规范

**确认关键点：**
1. 页面路由路径和文件位置
2. UI 组件库选择（优先复用项目已有组件）
3. 交互逻辑和用户操作流程
4. 数据结构与接口字段映射
5. 状态枚举值与展示映射关系

**技术决策：**
- 是否需要封装独立模块/Hook？
- 使用哪些核心组件？
- API 服务如何组织？
- 状态管理方案选择

#### GitNexus 代码探索（已有索引的项目）

在需求分析阶段，用 GitNexus 快速了解现有代码结构，避免重复造轮子：

```
1. READ gitnexus://repo/{name}/context    → 检查索引是否最新
2. gitnexus_query({query: "<业务概念>"})  → 找到相关的现有模块和执行流
3. gitnexus_context({name: "<现有组件>"}) → 了解可复用的组件、Hook、服务
```

**用途：**
- 发现可复用的组件、Hook、工具函数
- 了解现有的状态管理模式和 API 服务组织方式
- 避免与现有模块产生命名冲突或职责重叠

> 如果索引不存在或过期 → 先跑 `npx gitnexus analyze`。

#### MCP 工具集成

在需求分析阶段，根据用户提供的资源类型，使用对应的 MCP 工具获取详细信息：

**1. Swagger/API 接口文档 → 使用 `lm-mcp-server`**

当用户提供 Swagger/Knife4j 接口文档地址时，使用以下工具获取接口详情：

- **`get_swagger_mcp`**：读取 Swagger/OpenAPI 文档，获取请求参数和响应结构
  - 参数：`source`（文档 URL）、`name`（模型名，不传返回所有）、`maxDepth`（解析深度）、`resolveRefs`（是否解析 $ref）
  - 用途：获取接口的请求参数类型、响应数据结构、字段说明

- **`create_api_mcp`**：批量创建 API 接口函数和 TypeScript 类型
  - 参数：`requests`（数组，每项含 `source`、`name`、`targetPath` 等）
  - 用途：根据 Swagger 文档自动生成 service 层代码

示例流程：
```
用户提供: https://api-test.17an.com/dsb/yqarw/api/doc.html#/城市管理/检查计划接口/xxx
↓
调用 CallMcpTool(server_name='lm-mcp-server', tool_name='get_swagger_mcp', arguments={ source: '<url>' })
↓
获取接口请求参数、响应结构、字段类型
↓
基于获取的数据创建 TypeScript 类型定义和 API 服务函数
```

**2. Figma 设计稿 → 使用 `Framelink Figma MCP Server`**

当用户提供 Figma 设计稿链接时，使用以下工具获取 UI 数据：

- **`get_figma_data`**：获取 Figma 文件的布局、内容、视觉样式和组件信息
  - 参数：`fileKey`（Figma 文件 key，从 URL 中提取）、`nodeId`（可选，指定节点 ID）
  - URL 格式：`figma.com/(file|design)/<fileKey>/...`
  - 用途：获取页面布局结构、组件层级、样式属性（颜色、字体、间距等）

- **`download_figma_images`**：下载 Figma 文件中的 SVG/PNG 图片资源
  - 参数：`fileKey`、`nodes`（节点数组）、`localPath`（保存路径）
  - 用途：下载图标、插画等图片资源到项目中

示例流程：
```
用户提供: https://www.figma.com/design/abc123/设计稿?node-id=123:456
↓
提取 fileKey='abc123', nodeId='123:456'
↓
调用 CallMcpTool(server_name='Framelink Figma MCP Server', tool_name='get_figma_data', arguments={ fileKey: 'abc123', nodeId: '123:456' })
↓
获取 UI 布局、样式、组件信息
↓
根据设计数据实现页面 UI
```

### Phase 2: 创建设计文档

创建技术方案文档，包含以下内容：

```markdown
# 页面名称 - 设计方案

## 页面信息
- 路由路径：/page-path
- 文件位置：src/pages/page-name/

## UI 架构
```
页面容器
├── 搜索/筛选组件
│   ├── 搜索输入框
│   ├── 筛选条件 1
│   ├── 筛选条件 2
│   └── 操作按钮
├── 列表组件
│   └── 列表项组件
│       ├── 状态标识
│       ├── 主要内容
│       └── 操作按钮
└── 空状态组件
```

## 数据结构
- 接口路径：POST/GET /api/xxx
- 请求参数：{ filter1, filter2, page, pageSize }
- 响应字段：{ data: [], total }

## 状态映射
- 状态码 → 展示文本（颜色）

## 交互逻辑
1. 页面加载：初始化数据
2. 搜索/筛选：触发数据刷新
3. 列表操作：点击、加载更多等
4. 状态变更：用户操作后的反馈
```

## Phase 3: 制定实现计划

创建任务清单，按顺序执行。每个编码步骤都遵循 TDD 循环（红-绿-重构）：

1. ✅ 创建类型定义（TypeScript 接口/类型）
2. ✅ 创建常量配置（状态映射、选项列表等）
3. ✅ 创建 API 服务层（接口请求封装）
4. ✅ **TDD 循环** → 创建数据管理模块（状态管理、业务逻辑）
5. ✅ **TDD 循环** → 创建 UI 组件（列表项、卡片等）
6. ✅ **TDD 循环** → 实现页面主入口（整合所有组件）
7. ✅ 路由配置验证
8. ✅ 测试与验收

> **TDD 适用边界：** 纯类型定义、常量配置、API 服务声明属于"配置/声明式代码"，不需要 TDD。数据管理逻辑、组件交互行为、页面整合逻辑属于"行为代码"，必须 TDD 驱动。一次性原型和生成代码可例外（需询问你的人类伙伴）。

#### GitNexus 影响面评估（已有索引的项目）

编码前评估新模块对现有代码的影响：

```
gitnexus_impact({target: "<要修改或依赖的现有符号>", direction: "upstream"})
→ d=1（直接破坏）：必须同步更新
→ d=2（可能影响）：需要测试
→ d=3（传递效应）：需要关注
```

**什么时候跑：** 新页面需要修改现有模块（共享组件、服务层、状态管理）时，先评估爆炸半径再动手。

### Phase 4: 编码实现

#### TDD 纪律

从步骤 4.4 开始，所有行为代码遵循 **红-绿-重构** 循环：

```
每个功能点：
1. 红灯 — 写一个失败的测试描述期望行为
2. 验证红灯 — 运行测试，确认因功能缺失而失败（不是报错）
3. 绿灯 — 写最少的代码让测试通过
4. 验证绿灯 — 运行测试，确认全部通过
5. 重构 — 清理代码，保持绿灯
6. 进入下一个功能点
```

**铁律：没有失败的测试，就不写生产代码。先写了代码再补测试？删掉，从测试开始。**

#### 4.1 创建类型定义

根据接口文档定义数据结构：

```typescript
// 类型定义示例（TypeScript）

/** 列表查询参数 */
export interface ListParams {
  /** 搜索关键词 */
  keyword?: string;
  /** 筛选字段 */
  filterField?: number;
  /** 分页参数 */
  page?: number;
  pageSize?: number;
}

/** 列表项 */
export interface ListItem {
  id: string | number;
  name: string;
  status: number;
  // ... 其他字段
}

/** 列表响应 */
export interface ListResponse {
  data: ListItem[];
  total: number;
}
```

#### 4.2 创建常量配置

定义状态映射和选项配置：

```typescript
// 常量配置示例

/** 状态映射 */
export const STATUS_MAP = {
  1: { label: '进行中', color: 'blue' },
  2: { label: '已完成', color: 'green' },
  3: { label: '已取消', color: 'gray' },
};

/** 筛选选项配置 */
export const filterConfig = [
  {
    type: 'select',
    name: 'status',
    label: '状态筛选',
    options: [
      { label: '全部', value: '' },
      { label: '进行中', value: '1' },
      { label: '已完成', value: '2' },
    ],
  },
];
```

#### 4.3 创建 API 服务层

封装接口请求，统一管理 API：

```typescript
// API 服务示例

import { request } from '@/utils/http';
import type { ListParams, ListResponse } from './types';

export const ApiService = {
  /** 获取列表数据 */
  getList: (params: ListParams) => {
    return request.post<ListResponse>('/api/xxx/list', params);
  },
  
  /** 获取详情 */
  getDetail: (id: string) => {
    return request.get(`/api/xxx/detail/${id}`);
  },
};
```

**原则：API 服务统一组织，按业务模块分类管理。**

#### 4.4 创建数据管理模块（TDD 驱动）

在以下情况创建独立的数据管理模块：
- 有复杂的业务逻辑需要封装
- 需要管理多个状态和副作用
- 需要在多个页面/组件共享数据

**红灯 — 先写失败测试：**
```typescript
// useListData.test.ts
test('loads list data on initialization', async () => {
  const { result } = renderHook(() => useListData());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toHaveLength(2);
});

test('resets to page 1 when searching', () => {
  const { result } = renderHook(() => useListData());
  act(() => result.current.handleSearch({ keyword: 'test' }));
  expect(result.current.params.page).toBe(1);
});
```

**验证红灯** → 确认测试因功能缺失而失败。

**绿灯 — 最少代码：**
```typescript
// useListData.ts
import { useState, useCallback } from 'react';
import { ApiService } from '@/services/api';
import type { ListParams, ListItem } from './types';

export function useListData() {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<ListParams>({ page: 1, pageSize: 10 });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiService.getList(params);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const handleSearch = (newParams: ListParams) => {
    setParams({ ...newParams, page: 1 });
  };

  const handleReset = () => {
    setParams({ page: 1, pageSize: 10 });
  };

  return { data, loading, loadData, handleSearch, handleReset, params };
}
```

**验证绿灯** → 确认所有测试通过。**重构（如需要）**

#### 4.5 创建 UI 组件（TDD 驱动）

封装可复用的列表项或卡片组件：

**红灯 — 先写失败测试：**
```typescript
// ItemCard.test.tsx
test('displays status label from STATUS_MAP', () => {
  render(<ItemCard item={{ id: '1', name: '测试项', status: 1 }} />);
  expect(screen.getByText('进行中')).toBeInTheDocument();
});

test('calls onClick with item when clicked', () => {
  const handleClick = jest.fn();
  const item = { id: '1', name: '测试项', status: 1 };
  render(<ItemCard item={item} onClick={handleClick} />);
  fireEvent.click(screen.getByRole('button', { name: '去处理' }));
  expect(handleClick).toHaveBeenCalledWith(item);
});
```

**验证红灯** → **绿灯 — 最少代码：**
```typescript
// ItemCard.tsx
import React from 'react';
import { STATUS_MAP } from '../constants';
import type { ListItem } from '@/services/api/types';

interface ItemCardProps {
  item: ListItem;
  onClick?: (item: ListItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const statusConfig = STATUS_MAP[item.status] || STATUS_MAP[0];

  const handleClick = () => {
    onClick?.(item);
  };

  return (
    <div className="card" onClick={handleClick}>
      <span className="status-badge" style={{ color: statusConfig.color }}>
        {statusConfig.label}
      </span>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <button className="action-btn">去处理</button>
    </div>
  );
};

export default ItemCard;
```

**验证绿灯** → **重构（如需要）**

#### 4.6 实现页面主入口（TDD 驱动）

整合所有组件，完成页面功能：

**红灯 — 先写失败测试：**
```typescript
// PageName.test.tsx
test('renders search filter and list on load', async () => {
  render(<PageName />);
  expect(screen.getByPlaceholderText('搜索...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('list')).toBeInTheDocument());
});

test('shows empty state when no data', async () => {
  jest.spyOn(ApiService, 'getList').mockResolvedValue({ data: [], total: 0 });
  render(<PageName />);
  await waitFor(() => expect(screen.getByText('暂无数据')).toBeInTheDocument());
});
```

**验证红灯** → **绿灯 — 最少代码：**
```typescript
// PageName.tsx
import React, { useEffect } from 'react';
import SearchFilter from '@/components/SearchFilter';
import ListComponent from '@/components/ListComponent';
import { ApiService } from '@/services/api';
import ItemCard from './components/ItemCard';
import { filterConfig } from './constants';
import { useListData } from './hooks/useListData';

const PageName: React.FC = () => {
  const { data, loading, loadData, handleSearch, handleReset } = useListData();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page-container">
      <SearchFilter
        config={filterConfig}
        placeholder="搜索..."
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <ListComponent
        data={data}
        loading={loading}
        renderItem={(item) => <ItemCard key={item.id} item={item} />}
        onLoadMore={loadData}
        emptyText="暂无数据"
      />
    </div>
  );
};

export default PageName;
```

**验证绿灯** → **重构（如需要）**

### Phase 5: 测试验收

#### 自动化测试门控

**先跑测试，用证据说话：**

```bash
# 1. 运行页面相关的所有测试
npm test src/pages/page-name/ -- --coverage

# 2. 运行 TypeScript 类型检查
npx tsc --noEmit

# 3. 运行代码格式检查
npx eslint src/pages/page-name/ --fix

# 4. 检查变更影响范围（已有 GitNexus 索引的项目）
# gitnexus_detect_changes({scope: "staged"})
# → 确认变更范围与预期一致，没有意外影响其他流程
```

#### 验收清单

**自动化验证（必须有输出证据）：**
- [ ] 所有单元测试通过（0 failures）
- [ ] 每个行为测试先看到失败再看到通过（TDD 纪律）
- [ ] 覆盖了边界情况（空数据、错误状态、加载状态）
- [ ] TypeScript 类型检查通过（0 errors）
- [ ] ESLint 检查通过（0 errors, 0 warnings）
- [ ] 构建通过（exit 0）

**UI 手动验证：**
- [ ] UI 还原度符合设计稿
- [ ] 搜索/筛选功能正常
- [ ] 交互功能正常（点击、跳转等）
- [ ] 分页/加载更多正常

**红线信号（出现就停下来重做）：**
- 先写了代码再补测试
- 测试立即通过（说明没测到新行为）
- 使用"应该没问题"、"大概可以"而非测试输出
- 没跑验证就说"搞定了"

## 技能集成

### 关联技能

- `superpowers:test-driven-development` — TDD 红-绿-重构纪律的完整方法论；本技能在 Phase 4 步骤 4.4-4.6 直接调用
- `superpowers:verification-before-completion` — 提交前验证门控；本技能在 Phase 5 内联执行
- `writing-doc` — 设计文档规范；本技能在 Phase 2 调用

### GitNexus 技能集成

当项目已有 GitNexus 索引时，以下技能在各阶段提供增强能力：

| 阶段 | GitNexus 技能 | 用途 |
|------|-------------|------|
| Phase 1 需求分析 | `gitnexus-exploring` | 探索现有代码结构，发现可复用组件 |
| Phase 3 实现计划 | `gitnexus-impact-analysis` | 评估新模块对现有代码的影响范围 |
| Phase 4 编码实现 | `gitnexus-refactoring` | 需要修改现有模块时的安全重构 |
| Phase 5 测试验收 | `gitnexus-cli` | 检查索引状态、验证变更范围 |

> GitNexus 工具参数和示例见 `fix-bug` 技能的 `references/gitnexus-toolkit.md`。

## 通用规范要点

### 目录结构

```
src/
├── services/              # API 服务层（按业务模块组织）
│   └── module-name/
│       ├── index.ts       # 接口请求方法
│       └── types.ts       # 接口类型定义
└── pages/
    └── page-name/
        ├── index.tsx              # 页面入口
        ├── types.ts               # 页面类型定义
        ├── constants.ts           # 页面常量配置
        ├── hooks/                 # 页面私有逻辑
        │   └── useXxxData.ts
        └── components/            # 页面私有组件
            └── ItemCard/
                ├── index.tsx
                └── types.ts
```

### 设计原则

- **职责分离**：UI 组件、业务逻辑、API 服务分离
- **类型安全**：所有数据流转使用明确的类型定义
- **组件复用**：抽取通用组件，避免重复代码
- **统一规范**：遵循项目代码风格和命名约定
- **样式类名规范**：优先使用 Tailwind 内置类（如 `p-3`、`rounded-xl`、`text-sm`），避免任意值写法（如 `p-[12px]`）；仅当内置类无法精确表达时才使用任意值

### 代码组织

- API 服务统一管理，按业务模块分类
- 类型定义集中维护，避免散落
- 常量配置独立文件，方便维护
- 组件封装适度，避免过度设计

## 常见问题

### Q: 什么时候需要封装独立模块？
A: 当存在复杂业务逻辑、多状态管理、或多处复用时才封装。简单场景可直接在页面内处理。

### Q: API 服务如何组织？
A: 按业务模块分类管理，统一放在 services 目录下，便于维护和复用。

### Q: 组件封装的粒度如何把握？
A: 以"单一职责"为原则，每个组件只负责一个明确的功能。避免过度拆分导致维护困难。

### Q: 如何处理复杂的状态管理？
A: 优先使用项目推荐的状态管理方案（如 Redux、Zustand、MobX 等），保持状态流转清晰。

## 适用场景

- 从零开发任何类型的前端页面
- 实现 UI 设计稿（Figma、Sketch、XD 等）
- 按照团队规范创建功能模块
- 重构现有页面结构

## 技术栈无关

本工作流程是通用的，适用于：
- React / Vue / Angular 等框架
- Web / 移动端 / 桌面端应用
- TypeScript / JavaScript 项目
- 任何组件库和样式方案
