## 上下文

工作台（Workbench）目前使用 `CanvasLayer.vue` 逐层渲染各叶子图层，以支持图层可见性切换反映到画布上。PSD 解析时同时生成了整张合成背景图（`store.backgroundUrl`），但现已不在画布中渲染。

用户希望能在底部状态栏切换两种渲染模式：
- **合成图（composite）**：整张 PSD `canvas.toBlob` 生成的图片，质量高、与设计稿完全一致
- **逐层渲染（layered）**：逐层叠加各叶子图层的 `imagePreviewUrl`，可响应图层可见性切换

两张"画布"在文件加载时已同时具备数据，无需重新生成，仅需在渲染层做显隐切换。

## 目标 / 非目标

**目标：**
- Store 中维护 `canvasRenderMode` 状态，支持 `'composite' | 'layered'` 两种值
- 底部状态栏添加模式下拉选择（`<select>` 或等效 UI 元素）
- Workbench 画布区同时挂载两种画布，通过 `v-show` 切换，避免重建 DOM
- 默认模式为 `'layered'`（保持现有行为）

**非目标：**
- 不改变 CanvasLayer.vue 的渲染逻辑
- 不改变 PSD 解析流程（backgroundUrl 已在 parsePsd 中生成）
- 不做模式持久化（刷新后恢复默认）
- 不做过渡动画（直接显隐切换）

## 决策

### D1：双画布 v-show 而非 v-if

使用 `v-show` 控制两个画布容器的显隐，而非 `v-if`。

原因：
- `v-if` 切换会销毁/重建 CanvasLayer 的整个 DOM 子树，造成短暂白屏
- `v-show` 仅切换 CSS `display`，切换即时无闪烁
- 两种画布的数据（`backgroundUrl`、`layers`）在加载时均已就绪，无需按需生成

### D2：状态放在 Pinia store 而非组件本地

`canvasRenderMode` 放入全局 store，而非 Workbench 组件的 `ref`。

原因：
- 后续其他组件（如 HotspotLayer、属性面板）可能需要感知当前渲染模式
- 与现有 `store.backgroundUrl`、`store.layers` 保持一致的状态管理风格

### D3：UI 使用原生 `<select>` 样式化

底部状态栏已有类似 VS Code 样式的小型信息条，使用原生 `<select>` 加 CSS 样式化，与现有状态栏元素（缩放比例等）风格一致，不引入额外 UI 组件库依赖。

替代方案：按钮组（toggle button group）—— 占用空间较大，不适合状态栏紧凑布局，排除。

## 风险 / 权衡

- **合成图缺失风险**：若 `store.backgroundUrl` 为空（极端情况如 PSD canvas 生成失败），合成图模式将显示空白。缓解：切换到 composite 时若 `backgroundUrl` 为空，自动降级显示 layered 模式或提示。
- **内存占用**：两种画布同时挂载意味着合成图 `<img>` 和全部叶子图层 `<img>` 同时存在于 DOM 中。对于超大 PSD（数百图层），可能增加内存压力。当前阶段可接受，后续可优化为懒挂载。
- **逐层渲染视觉差异**：合成图包含 PSD 混合模式（blend mode）效果，逐层渲染可能因各图层 `imagePreviewUrl` 已展平混合效果而出现视觉差异。属于已知限制，无需修复。
