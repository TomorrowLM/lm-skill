# FileListView

## 作用

以图片或文件列表样式展示文件，支持下载按钮及自定义下载处理。文件数据可携带额外业务属性。

## Props

| 属性 | 类型 | 说明 |
|---|---|---|
| files | `File[]` | 文件数组；每项至少包含 `url`，可选 `name`、`size`（字节）及任意扩展字段 |
| type | `"image" | "file"` | 展示样式 |
| showDownload | `boolean` | 是否显示下载按钮 |
| onDownload | `(file: File) => void` | 下载处理回调 |
| className / style | `string` / `React.CSSProperties` | 根节点样式 |

## 用法

```tsx
<FileListView
  files={[{ name: "合同.pdf", url: fileUrl, size: 1024 }]}
  type="file"
  showDownload
  onDownload={(file) => download(file.url)}
/>
```
