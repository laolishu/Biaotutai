## 为什么

当前右侧属性栏在选中 image 类型图层时仅展示基础几何文本信息，缺少视觉化的缩略图信息，用户无法快速确认当前图层是否为目标图片。为 image 类型新增缩略图属性并支持点击查看，可显著提升核对效率并减少误选。

## 变更内容

- 在右侧属性栏中，选中 image 类型图层时新增缩略图属性块
- 缩略图属性块展示图片预览、尺寸信息与占位状态
- 用户点击缩略图后可查看放大预览（轻量预览交互）
- 非 image 类型图层保持现有属性展示不变

## 功能 (Capabilities)

### 新增功能
- `image-thumbnail-property`: 为 image 图层提供可视化缩略图属性与点击预览能力

### 修改功能
- `right-activity-bar`: 属性面板在 image 类型场景下增加缩略图属性区块与交互行为

## 影响

- src/views/Workbench.vue：右侧属性区按图层类型渲染 image 缩略图属性
- src/store/index.js：为 image 图层提供可用于预览的字段映射（若现有结构缺失）
- src/utils/normalizeLayer.js：必要时补充 image 图层预览相关字段的标准化
- 可能新增轻量预览子组件（如 ImageThumbnailPreview）以隔离 UI 与交互逻辑
