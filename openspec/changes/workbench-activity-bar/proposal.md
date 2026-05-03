## 为什么

当前工作台左侧面板是固定展示的单一图层列表，随着功能扩展（搜索、历史、设置等）无法扩展更多工具入口，且面板无法收起，占据固定宽度影响画布空间。参考 VS Code / IDEA 的 Activity Bar 模式，可以使左侧工具入口更具可扩展性，同时提升画布可用面积。

## 变更内容

- 将左侧面板改造为 Activity Bar + Panel 两层结构：
  - **Activity Bar**（最左侧窄条，约 44px）：纵向排列图标按钮，每个图标对应一个功能面板
  - **Activity Panel**（图标列右侧可调宽区域）：显示当前激活图标对应的内容面板
- 支持的面板分页（初版）：图层列表、搜索（预留占位）
- 点击已激活图标可收起 Activity Panel，再次点击恢复展开
- Activity Panel 右边框支持拖拽调整宽度（范围 160px ~ 400px）
- 收起状态下仅显示 Activity Bar 图标列，画布区域自动扩展

## 功能 (Capabilities)

### 新增功能

- `workbench-activity-bar`: Activity Bar 图标列组件——纵向图标导航，点击切换面板，支持激活/收起状态
- `workbench-activity-panel`: Activity Panel 容器——承载各分页内容，支持拖拽调整宽度、收起展开动画

### 修改功能

- 无现有规范文件，`Workbench.vue` 的左侧面板为本次变更的唯一修改点

## 影响

- `src/views/Workbench.vue`：重构左侧区域，将原 `.panel-layers` 替换为 Activity Bar + Activity Panel 结构
- 新增 scoped CSS：Activity Bar 样式、拖拽 resize 交互样式、收起/展开过渡动画
- 新增 `<script setup>` 响应式逻辑：`activePanel`（当前激活面板）、`panelWidth`（面板宽度）、`isPanelOpen`（展开状态）
- 不影响路由、Store、其他页面
