# Collection Output Format

本文件定义结构采集模式的产品视角 JSON 与 HTML 清单格式。采集范围和验证流程见同目录的 `collection.md`；原始采集 JSON 必须保留，不覆盖或改写。

## Product View JSON

```json
{
  "mcpVersion": "1.0.0",
  "generatedAt": "2026-09-12T00:00:00+08:00",
  "sourceFiles": ["01-page-mcp.json"],
  "normalizationRules": {
    "menuAsNavigation": true,
    "removeSameNamePageUnderMenu": true,
    "mergeSameNameRootMenus": true,
    "preserveRawSource": true
  },
  "productStructure": [
    {
      "id": "01-page-mcp.json:$.menu",
      "type": "menu",
      "name": "工作简报",
      "route": {
        "path": "/an/home",
        "fullUrl": "https://example.test/an/home"
      },
      "status": "partial",
      "description": "页面能力说明。",
      "source": {
        "sourceFile": "01-page-mcp.json",
        "rawPaths": ["$.menu"],
        "originalType": "menu",
        "evidenceRefs": []
      },
      "children": []
    }
  ],
  "unclosedItems": []
}
```

### Normalization Rules

- `menu` 表示产品导航；菜单下直接承载导航入口的 `page` 归一为 `menu`。
- 菜单与直接子 page 同名时，不重复展示 page；将其子节点提升到 menu 下。
- 多个采集文件产生同名、同类型根菜单时可以合并，但须保留每个节点的 `source` 信息。
- `tab`、`action`、`dialog`、`drawer` 按真实层级保留，不因展示方便删除。
- 原始 `root` 只有在截图、DOM、路由和菜单证据支持时才归为产品菜单。
- 每个节点保留 `id`、`type`、`name`、`route`、`status`、`description`、`source` 和 `children`。

## HTML Checklist

HTML 清单至少包含：

```text
页面权限结构清单                         [导出 JSON] [导出 Excel]
产品视角说明、节点总数

[搜索节点名称、路由或说明] [全部类型] [全部状态] [重置]

页面结构树  节点数                         [＋ 新增节点]
├── 工作简报 [01-工作简报]        menu  编辑  删除
├── 业务工作 [06-业务工作]         menu  编辑  删除
│   ├── 远程监管 [06-业务工作]      menu  编辑  删除
│   └── 消息管理 [07-消息管理]      menu  编辑  删除

右侧节点详情：节点名称、类型、路由 path、验证状态、父级节点、统一说明
```

### HTML Behavior

- 左右双列，左侧默认 55%，右侧 45%；内容区独立滚动。
- 标题、导出、搜索筛选和树标题固定；节点显示名称、来源简称、类型及编辑/删除入口。
- 搜索递归匹配深层节点并展开命中路径；同名节点显示来源简称，详情保留 `sourceFile` 与 `rawPaths`。
- 新增、编辑、删除后树与详情保持同步；编辑弹窗包含名称、类型、路由、验证状态、父级和说明。
- 删除二次确认并说明会连同子节点删除。
- JSON 导出当前编辑后的产品视角结构；Excel 至少包含层级路径、名称、类型、路由、验证状态和统一说明。
