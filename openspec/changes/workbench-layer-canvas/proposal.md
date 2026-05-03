## 为什么

标注工作台当前使用 mock 数据，左侧图层面板和中间画布均未连接到真实解析数据。用户上传 PSD 后无法在工作台上看到实际图层结构和设计稿预览，工具的核心价值无法体现。

## 变更内容

- **左侧图层面板**：替换 mock 图层列表为真实的 `store.layers` 数据，支持递归展示图层树，点击图层高亮选中。
- **中间画布背景图**：将 PSD 解析出的合成图像（或上传的原始图片）作为背景渲染在 `canvas-stage` 中，尺寸严格对齐 PSD 原始宽高。
- **图层热区渲染**：基于 store.layers 的坐标数据（x/y/width/height）在画布上渲染透明热区（hotspot），鼠标悬浮显示图层名称与尺寸信息。
- **选中同步**：点击图层面板或热区时，右侧属性面板实时展示选中图层的基础属性（name、type、x、y、width、height）。

## 功能 (Capabilities)

### 新增功能

- `layer-panel`: 左侧图层树面板，从 store.layers 渲染真实图层，支持选中高亮与递归展示
- `canvas-background`: 中间画布将上传的图片/PSD 合成图作为背景图渲染，尺寸等于 PSD 原始尺寸
- `hotspot-render`: 基于图层坐标在画布上绝对定位渲染热区覆盖层，hover 显示 tooltip
- `properties-panel`: 右侧属性面板展示选中图层的几何与基础属性，支持一键复制数值

### 修改功能

（无已有规范文件，无需修改）

## 影响

- `src/views/Workbench.vue`：主要修改文件，替换 mock 数据渲染
- `src/store/index.js`：新增 `selectedLayerId` 状态与 `selectLayer` action
- `src/utils/normalizeLayer.js`：确认 id/x/y/width/height 字段输出正确
- `src/composables/useCanvasBackground.js`（新建）：处理背景图 URL 生成逻辑（FileReader → ObjectURL）
