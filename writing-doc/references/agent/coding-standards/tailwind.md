# Tailwind CSS 样式规范

## 核心原则

**默认使用 Tailwind CSS 工具类**，直接在 JSX 中通过 className 使用

## 样式实现规则

1. **优先使用 Tailwind 工具类组合**完成样式，避免自定义 CSS
2. **禁止在 JSX 中使用内联 `style={{}}`**，样式必须通过 Tailwind 工具类或 `.less` 文件中的 className 实现
3. **Less 仅作为补充**，用于 Tailwind 无法覆盖的复杂自定义样式（如动画、特殊布局）
4. **Less 文件命名为 `index.less`** 并与组件文件同目录
5. 长 className 列表使用 `classnames` 库（已安装）动态组合，保持 JSX 可读性
6. **优先使用 Tailwind 内置类**，避免任意值写法（`[Npx]`）；仅当内置类无法精确表达时才使用任意值
7. **不生成 `p-2px`、`w-12px` 等带 px 后缀的自定义工具类命名**

**正确示例：**

```typescript
// ✅ 使用 Tailwind 工具类 + 内置尺寸类
<div className="flex items-center gap-2 p-4 bg-white rounded-xl">
  <img src={avatar} className="w-10 h-10 rounded-full" />
  <span className="text-base font-medium">{name}</span>
</div>
```

**错误示例：**

```typescript
// ❌ 错误：使用内联样式
<div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
  <img src={avatar} style={{ width: 40, height: 40, borderRadius: '50%' }} />
  <span style={{ fontSize: 16, fontWeight: 500 }}>{name}</span>
</div>

// ❌ 错误：有内置类可用却使用任意值
<div className="p-[12px] rounded-[12px] text-[14px] mb-[8px]">
// ✅ 应该这样写
<div className="p-3 rounded-xl text-sm mb-2">
```