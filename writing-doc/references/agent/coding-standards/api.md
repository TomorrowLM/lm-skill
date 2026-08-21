# API 调用规范

1. **接口请求统一在 `src/services` 中管理**，按模块分文件夹
2. 使用 axios 进行 HTTP 请求（通过 `@/utils/request` 封装）
3. 错误处理统一封装
4. **API 类型定义放在同目录的 `types.ts` 中**
5. **接口请求失败提示统一由 `@/utils/request` 的 `onError` 处理，业务调用方不得重复调用 Toast；仅非请求错误可按业务需要单独提示**