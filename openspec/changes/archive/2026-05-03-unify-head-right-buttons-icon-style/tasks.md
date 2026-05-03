## 1. Header 图标按钮模板改造

- [x] 1.1 在 `src/views/Workbench.vue` 的 `.hd-right` 区域将“缩放适配、最大化、导出”文本按钮替换为对应语义图标按钮
- [x] 1.2 为每个图标按钮补充 `title` 与 `aria-label`，确保无文本标签时可理解
- [x] 1.3 保留并校验现有点击行为映射，确保操作语义与改造前一致

## 2. 交互与视觉统一

- [x] 2.1 统一 Header 图标按钮尺寸、间距、对齐和点击热区（最小 28px）
- [x] 2.2 为中性按钮实现统一 hover/active 样式，并复用 `var(--color-*)` token
- [x] 2.3 为导出按钮实现强调态样式（强调色/强调边框）并与中性按钮形成层级差异

## 3. 主题 token 与亮色对比度优化

- [x] 3.1 在 `src/styles/themes.css` 中校准亮色主题下 `--color-border`、`--color-border-strong`、`--color-bg-hover` 等 token 对比度
- [x] 3.2 清理 Header 区域样式中的硬编码颜色值，统一改为 token 引用
- [x] 3.3 验证亮色模式下图标按钮边框与悬停反馈清晰可辨识

## 4. 联调与回归验证

- [x] 4.1 验证 dark/light 主题切换后 Header 图标按钮颜色与状态同步正确
- [x] 4.2 验证 Header 右侧按钮改造后不影响左右 Activity Bar 与画布区布局
- [x] 4.3 执行构建与基本交互回归，确认无新增报错与明显视觉回归
