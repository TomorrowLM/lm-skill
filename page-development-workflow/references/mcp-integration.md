# MCP 工具集成

Phase 1 需求分析阶段使用的所有 MCP 工具，统一见 `mcp-exe` 技能：

- **Swagger/API 接口文档** → `mcp-exe` 案例 1（`lm-mcp-server.get_swagger_mcp`）
- **Figma 设计稿** → `mcp-exe` 案例 3（`Framelink MCP for Figma`）
- **Chrome 浏览器操作** → `mcp-exe` 案例 5（`chrome-mcp-server`）

## 图片资源落盘规则

执行图片下载（Figma 截图/资源导出、Chrome 截图、流程图导出等）时，必须保存到当前功能文件夹的 `assets/` 子目录下：

| 资源类型 | 保存目录 | 场景 |
|----------|----------|------|
| Figma 设计截图/标注图 | `assets/figma/` | Phase 1 调研、Phase 3 子任务规格引用 |
| Figma 图标/图片资源 | `assets/figma/` | `download_figma_images` 导出 |
| Chrome 页面截图 | `assets/screenshots/` | 视觉验收、UI 对比 |
| 流程图/思维导图 | `assets/diagrams/` | 技术方案配图 |
