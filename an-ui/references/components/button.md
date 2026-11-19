# Button

## 作用

an-ui 提供的轻量按钮，统一 primary/default/dashed/text/link 类型、large/middle/small 尺寸和 loading/disabled 状态。点击回调在 disabled 或 loading 时不会触发。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `"primary" \| "default" \| "dashed" \| "text" \| "link"` | `"default"` | 按钮样式 |
| size | `"large" \| "middle" \| "small"` | `"middle"` | 按钮尺寸 |
| disabled | `boolean` | `false` | 禁用按钮 |
| loading | `boolean` | `false` | 显示加载状态并阻止点击 |
| children | `React.ReactNode` | — | 按钮内容 |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | 点击回调 |

组件实现基于原生 `<button>`，其余透传属性以源码实际导出的 `ButtonProps` 为准。

## 用法

```tsx
<Button type="primary" loading={saving} onClick={save}>保存</Button>
```
