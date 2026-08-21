# Oxlint 规则

项目使用 Oxlint 替代 ESLint 进行代码检查。

## 执行命令

```bash
# 检查
pnpm run lint

# 检查并自动修复
pnpm run lint:fix
```

## 提交钩子

- `pre-commit` 执行 `pnpm exec lint-staged`
- lint-staged 对暂存文件执行 `oxlint --fix`（仅 js/ts）与 prettier 格式化
- pre-commit 不执行 typecheck 或 build

## 验证

根据改动范围执行对应检查：

```bash
pnpm run lint
pnpm run format:check
pnpm run test
pnpm exec tsc --noEmit
```

涉及构建配置、路由、微前端注册、前置流程时补充构建或手动验证结果。仅文档改动可以不执行构建，但需要在回复中说明。