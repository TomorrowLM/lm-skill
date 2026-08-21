# Vue 规范

1. 文件结构顺序：`<template>` → `<script>` → `<style lang="scss">`
2. 文件名使用短横线命名，例：`user-profile.vue`
3. 组件名使用 PascalCase，例：`UserProfile`
4. Props 定义必须使用驼峰命名、指定类型、添加注释
5. 自动化测试 ID 格式：`模块名-功能描述-类型`
6. 生命周期钩子顺序：name → props → data → computed → watch → created → mounted → methods