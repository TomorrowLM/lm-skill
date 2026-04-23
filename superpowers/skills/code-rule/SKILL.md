---
name: code-rule
description: >-
  Use when establishing frontend coding standards for a team, reviewing code
  compliance, updating standards after framework/tech-stack upgrades, onboarding
  new members to conventions, or refactoring legacy codebases. Covers Vue/HTML/
  CSS/JavaScript conventions, project structure, and maintainability optimization.
---

# Frontend Code Standards

## Overview

Define, review, enforce, and optimize frontend coding standards across 5 phases.
Core goal: enforceable rules across naming, structure, Vue/HTML/CSS/JS conventions,
comments, high cohesion/low coupling, infrastructure unification, and performance.

## When to Use

- Team needs standards from scratch
- Code review for standards compliance (combine with chinese-code-review)
- Framework/tech-stack upgrade requires standards update
- Onboarding new team members to conventions
- Legacy codebase refactoring to meet standards

**Do NOT use for:** backend languages (Java/Go/Python), infrastructure config (Docker/CI/CD), project management.

## Reference Files (load on demand)

- `references/coding-standards.md` — full 7-chapter spec: General, Vue, HTML, CSS, JS, Comments, Project Structure
- `references/optimization-dimensions.md` — maintainability guide: cohesion/coupling, toolchain unification, component library, performance

## Execution Flow

### Phase 1: Diagnose
- Identify framework (Vue/React/other)
- Check existing standards docs
- Check ESLint/Prettier config coverage
- Sample-audit code for actual compliance
- Record findings by severity

### Phase 2: Define
- Naming: camelCase variables, hyphen-case classes, kebab-case files, pinyin-acronym for business terms
- Directory: components/ utils/ api/ styles/
- Vue: file order, component naming, Props typing, lifecycle hooks
- CSS: no ID/!important (common excepted), z-index ≤150, hex colors, no max-height
- JS: is-prefix booleans, forEach/map, minimize 3rd-party libs
- Comments: file header, JSDoc, TODO markers
- Infrastructure: unified framework/UI lib/build tool, component library, docs
- Git conventions (see chinese-commit-conventions)

### Phase 3: Configure (Automation)
- ESLint — standard rulesets + custom rules
- Prettier — 2-space indent, quotes, semicolons
- StyleLint — CSS/SCSS/LESS checks
- Husky + lint-staged — pre-commit formatting/linting
- commitlint — commit message format
- .editorconfig + VS Code workspace settings

### Phase 4: Enforce & Review
- pre-commit: lint-staged blocks non-compliant code
- Code Review: per-section checklist
- CI: lint + typecheck + test must pass before merge
- Tag issues: **[MUST FIX]** naming/security/logic, **[SHOULD FIX]** readability/perf, **[FYI]** style/alternatives

### Phase 5: Optimize
- Audit cohesion/coupling periodically
- Evaluate framework/UI lib/build tool upgrade needs
- Analyze perf metrics (HTTP requests, CDN, lazy loading, code splitting)
- Build and refine shared component library
- Keep documentation current

## Quick Checklists

### General
- [ ] UTF-8
- [ ] camelCase variables
- [ ] hyphen-case classes
- [ ] pinyin-acronym for business terms
- [ ] Comments explain "why" not "what"
- [ ] 2-space indent
- [ ] Formatted before commit
- [ ] Empty data: `--`

### Vue
- [ ] `<template>` → `<script>` → `<style>` order
- [ ] kebab-case filenames
- [ ] PascalCase component names
- [ ] Props: typed + commented
- [ ] Test ID: `module-feature-type`
- [ ] Hooks: props → data → computed → watch → created → mounted → methods

### CSS
- [ ] No ID/!important (common excepted)
- [ ] No inline styles
- [ ] z-index ≤150 (modals excepted)
- [ ] No 999~9999 range
- [ ] Omit unit for 0
- [ ] Hex colors (rgba for transparency)
- [ ] No `max-height`
- [ ] No redundant inherited styles

### JS
- [ ] `is` prefix for booleans
- [ ] Variables at function top
- [ ] Multiple `if` over if-else if
- [ ] Prefer forEach/map
- [ ] Minimize 3rd-party libs
- [ ] Single-responsibility methods

### Comments
- [ ] File header: author, date, module, description, version
- [ ] Single-line: `// ` (space after)
- [ ] TODO for incomplete features
- [ ] JSDoc: method, param types, return type

### Cohesion & Coupling
- [ ] Single-responsibility components
- [ ] Props/Events communication
- [ ] No circular dependencies

### Infrastructure
- [ ] Unified framework / UI lib / build tool
- [ ] Shared component library
- [ ] Technical documentation

## Skill Combinations

| Skill | Scenario |
|-------|----------|
| chinese-code-review | Add standards check during review with Chinese feedback |
| chinese-documentation | Write standards docs in Chinese doc conventions |
| chinese-commit-conventions | Git commit requirements |
| writing-plans | Plan large-scale standards refactoring |
| subagent-driven-development | Parallelize standards checking |
| verification-before-completion | Verify compliance after refactoring |

## Red Lines

> Violating the letter of these rules violates their spirit.

- **Don't** document standards without enforcement tooling
- **Don't** apply ALL rules at once to legacy codebases. Phase: hard rules first, soft rules later
- **Don't** focus only on formatting while ignoring architecture
- **Don't** ignore component encapsulation and code reuse
- **Don't** leave standards unchanged after framework/tech-stack upgrades
