---
name: page-development-workflow
description: 从零开发功能页面的标准化工作流。包含需求分析、技术调研、设计文档、实现计划、编码实现和测试验收的完整流程。适用于任何技术栈的页面开发场景。当需要开发新页面、实现设计稿、或按照规范创建功能模块时使用。
---

# 页面开发工作流

通用的功能页面开发标准化流程，适用于任何前端技术栈和项目类型。

## 快速开始

开发新页面时，按以下顺序执行：

```
1. 需求分析 → 2. 设计文档 → 3. 实现计划 → 4. 编码实现 → 5. 测试验收
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

### Phase 3: 制定实现计划

创建任务清单，按顺序执行：

1. ✅ 创建类型定义（TypeScript 接口/类型）
2. ✅ 创建常量配置（状态映射、选项列表等）
3. ✅ 创建 API 服务层（接口请求封装）
4. ✅ 创建数据管理模块（状态管理、业务逻辑）
5. ✅ 创建 UI 组件（列表项、卡片等）
6. ✅ 实现页面主入口（整合所有组件）
7. ✅ 路由配置验证
8. ✅ 测试与验收

### Phase 4: 编码实现

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

#### 4.4 创建数据管理模块（可选）

在以下情况创建独立的数据管理模块：
- 有复杂的业务逻辑需要封装
- 需要管理多个状态和副作用
- 需要在多个页面/组件共享数据

```typescript
// 数据管理模块示例

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

  return { data, loading, loadData, handleSearch, handleReset };
}
```

#### 4.5 创建 UI 组件

封装可复用的列表项或卡片组件：

```typescript
// UI 组件示例

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
      {/* 状态标识 */}
      <span className="status-badge" style={{ color: statusConfig.color }}>
        {statusConfig.label}
      </span>

      {/* 内容区域 */}
      <h3>{item.name}</h3>
      <p>{item.description}</p>

      {/* 操作按钮 */}
      <button className="action-btn">去处理</button>
    </div>
  );
};

export default ItemCard;
```

#### 4.6 实现页面主入口

整合所有组件，完成页面功能：

```typescript
// 页面主入口示例

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
      {/* 搜索筛选区 */}
      <SearchFilter
        config={filterConfig}
        placeholder="搜索..."
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 列表区 */}
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

### Phase 5: 测试验收

**测试清单：**
- [ ] 页面加载正常，无控制台报错
- [ ] UI 还原度符合设计稿
- [ ] 搜索功能正常
- [ ] 筛选功能正常
- [ ] 列表数据展示正确
- [ ] 状态映射正确
- [ ] 交互功能正常（点击、跳转等）
- [ ] 空状态展示正常
- [ ] 分页/加载更多正常
- [ ] 代码格式检查通过

**代码质量检查：**
- 运行格式化工具（Prettier/ESLint 等）
- 检查 TypeScript 类型错误
- 检查控制台警告和错误

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
