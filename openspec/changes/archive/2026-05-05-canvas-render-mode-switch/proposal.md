## 为什么

目前画布采用逐层渲染（CanvasLayer）方式以支持图层可见性切换，但部分场景下用户希望查看原始合成背景图（PSD 导出的整张图片）进行对比或验证。当前没有办法在两种渲染方式之间切换。

## 变更内容

- 在底部状态栏新增"模式"下拉选择，提供两个选项：**合成图**（整张 PSD 合成背景图）和**逐层渲染**（CanvasLayer 分层图）
- 两种画布在文件加载时同时生成并挂载，通过 `v-show` 控制显隐，不重新生成
- Store 新增 `canvasRenderMode` 状态（`'composite' | 'layered'`）及对应 action
- 默认模式为**逐层渲染**（保持现有行为）

## 功能 (Capabilities)

### 新增功能

- `canvas-render-mode`: 画布渲染模式切换，支持合成图与逐层渲染之间的切换，包含状态管理和 UI 入口

### 修改功能

- `canvas-layer-visibility`: 逐层渲染与图层可见性联动行为不变，但现在只在"逐层渲染"模式下可见画布效果；合成图模式下隐藏 CanvasLayer

## 影响

- `src/store/index.js`：新增 `canvasRenderMode` 状态和 `setCanvasRenderMode(mode)` action
- `src/views/Workbench.vue`：画布区域同时挂载 backgroundUrl `<img>` 和 `<CanvasLayer>`，用 `v-show` 按模式控制；底部状态栏增加模式下拉
- `src/components/CanvasLayer.vue`：无需修改
