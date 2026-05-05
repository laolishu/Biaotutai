## 1. Store 状态管理

- [x] 1.1 在 `src/store/index.js` 的 state 中添加 `canvasRenderMode: 'composite'`（默认合成图）
- [x] 1.2 在 store 中添加 `setCanvasRenderMode(mode)` action，直接赋值 `this.canvasRenderMode = mode`

## 2. Workbench 画布区双画布挂载

- [x] 2.1 恢复合成图画布：在画布 stage 中添加 `<img>` 绑定 `store.backgroundUrl`，使用 `v-show="store.canvasRenderMode === 'composite'"` 控制显隐，样式与原 canvas-bg-img 一致
- [x] 2.2 将 `<CanvasLayer>` 的 `v-if` 改为 `v-show="store.canvasRenderMode === 'layered'"`，确保两种画布同时挂载于 DOM

## 3. 底部状态栏模式切换 UI

- [x] 3.1 在底部状态栏添加模式下拉控件（`<select>` 或等效元素），选项为"逐层渲染"和"合成图"，绑定 `store.canvasRenderMode`，change 事件调用 `store.setCanvasRenderMode()`
- [x] 3.2 当 `store.layers` 为空时，隐藏或禁用模式下拉控件（用 `v-if` 或 `:disabled`）
- [x] 3.3 为模式下拉添加与状态栏风格一致的 CSS 样式（小字号、深色背景、主题边框色）

## 4. 验证

- [x] 4.1 运行 `npm run build` 确认无编译错误
- [ ] 4.2 手动验证：加载 PSD 后默认显示逐层渲染，切换到"合成图"后显示整张背景图，图层可见性切换在逐层渲染模式下正常工作
