## 为什么

当前 Workbench Header 右侧按钮（缩放适配、最大化、导出等）在视觉语言上与左右 Activity Bar 的图标化交互不一致，导致界面信息密度偏低、识别效率不稳定。将其统一为图标按钮可以提升一致性、减少头部占用宽度，并强化主操作的可发现性。

## 变更内容

- 将 Workbench Header 右侧文本按钮统一改为图标按钮，保留原有交互语义与点击行为。
- 为图标按钮补充可访问性语义（`title` / `aria-label`），保证无文字标签时仍可理解。
- 统一按钮尺寸、对齐、hover/active 视觉反馈，并与主题 token（dark/light）保持一致。
- 对“导出”类主操作使用更明确的强调样式（图标+强调色），其余保持中性风格。
- 不改变现有功能流程、路由和业务逻辑；仅调整 Header 操作区呈现与样式。

## 功能 (Capabilities)

### 新增功能
- `workbench-header-icon-actions`: 规范 Workbench Header 右侧操作按钮的图标化展示、状态反馈与可访问性要求。

### 修改功能
- `theme-tokens`: 补充按钮边框/hover 对比度在亮色主题下的使用约束，确保图标按钮在浅色背景中可辨识。

## 影响

- 前端视图：`src/views/Workbench.vue`（Header 模板与样式）
- 主题样式：`src/styles/themes.css`（可能补充或调整按钮相关 token 使用映射）
- 交互一致性：与 Activity Bar 图标按钮风格对齐
- 无新增运行时依赖，无 API 变更
