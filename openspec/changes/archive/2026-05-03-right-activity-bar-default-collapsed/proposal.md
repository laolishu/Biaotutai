## 为什么

当前工作台左侧已支持 Activity Bar + 可收起面板，但右侧属性区域仍是固定面板，导致左右交互模式不一致、画布空间利用不均衡。将右侧也改为 Activity Bar 机制，并默认收起，仅显示图标列，可提升首屏画布可视面积并保持交互一致性。

## 变更内容

- 将右侧属性面板改造为“右侧 Activity Panel + 最右图标列”的结构
- 图标列固定在最右侧，默认仅显示图标列，内容面板默认隐藏
- 点击图标展开对应分页；点击已激活图标再次收起内容面板
- 右侧内容面板的左边框支持拖拽调整宽度（范围 180px 到 420px）
- 初版分页包含：属性（Properties）与检查（Inspect，占位）

## 功能 (Capabilities)

### 新增功能
- `right-activity-bar`: 右侧图标列导航能力，支持分页切换和二次点击收起
- `right-activity-panel`: 右侧内容面板能力，支持默认收起、展开动画与拖拽调宽

### 修改功能
- 无现有规范文件，改动范围集中在 Workbench 页面右侧结构与交互

## 影响

- src/views/Workbench.vue：重构右侧区域布局与交互
- 新增响应式状态：`rightActivePanel`、`isRightPanelOpen`、`rightPanelWidth`、`isRightResizing`
- 新增样式：右侧图标列、右侧可收起面板、拖拽把手
- 不影响路由、Pinia、Upload/Viewer 页面
