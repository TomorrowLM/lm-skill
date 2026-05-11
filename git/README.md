# Git Skills 领域视图层

> **本目录为符号链接（symlink）聚合目录**，不包含实际文件。
> 所有技能的源文件位于 `../superpowers/skills/` 中。

## 结构

```
git/
├── chinese-commit-conventions/   → ../superpowers/skills/chinese-commit-conventions   (Commit Message 规范)
├── chinese-git-workflow/         → ../superpowers/skills/chinese-git-workflow         (国内平台适配 + 工作流模型)
├── finishing-a-development-branch/ → ../superpowers/skills/finishing-a-development-branch (分支收尾流程)
└── using-git-worktrees/          → ../superpowers/skills/using-git-worktrees          (Git Worktree 管理)
```

## 使用方式

| 平台 | 要求 |
|------|------|
| **Windows** | 开发者模式已启用（`mklink` 可用） |
| **macOS** | `git config core.symlinks=true`（默认启用） |
| **Linux** | 原生支持 |

## 仓库可移植性

使用**相对路径**链接，仓库可移动到任意位置，只要保持以下结构：

```
skills/
├── git/              ← 本目录（视图层）
├── superpowers/      ← 源文件所在
└── ...
```

## 重建命令

若符号链接丢失，在 `skills/git/` 目录下执行：

```bash
# macOS / Linux
ln -s ../superpowers/skills/chinese-commit-conventions chinese-commit-conventions
ln -s ../superpowers/skills/chinese-git-workflow chinese-git-workflow
ln -s ../superpowers/skills/finishing-a-development-branch finishing-a-development-branch
ln -s ../superpowers/skills/using-git-worktrees using-git-worktrees

# Windows (管理员/开发者模式)
mklink /D chinese-commit-conventions ..\superpowers\skills\chinese-commit-conventions
mklink /D chinese-git-workflow ..\superpowers\skills\chinese-git-workflow
mklink /D finishing-a-development-branch ..\superpowers\skills\finishing-a-development-branch
mklink /D using-git-worktrees ..\superpowers\skills\using-git-worktrees
```
