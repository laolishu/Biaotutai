## 为什么

在画布上点击热区（HotspotLayer）选中某个图层后，左侧图层面板不会自动滚动定位到对应的图层条目，用户必须手动在图层树中寻找，当 PSD 图层数量较多时尤为费力。实现"画布选中 → 图层面板自动定位"可以显著提升标注效率，是工作台双向联动的关键体验。

## 变更内容

- **新增画布选中后图层面板自动滚动定位**：当用户在画布上点击热区选中某个图层时，左侧图层面板自动滚动使对应图层条目进入可视区域，并以高亮样式突出显示
- **新增图层条目定位接口**：`LayerItem` 组件在被选中时，使用 `scrollIntoView` 将自身滚动入视口
- **保持现有选中逻辑不变**：`store.selectLayer(id)` 机制不变，仅在选中动作后追加滚动定位副作用

## 功能 (Capabilities)

### 新增功能

- `canvas-to-layer-scroll`: 画布点击热区后，左侧图层面板自动滚动将选中的 LayerItem 滚入可视区域

### 修改功能

- `layer-panel`: 图层面板需要在选中状态变化时响应滚动（行为层面变更）

## 影响

- `src/components/LayerItem.vue`：监听 `store.selectedLayerId` 变化，当自身 `layer.id` 与之匹配时，调用 `el.scrollIntoView({ block: 'nearest' })`
- `src/components/HotspotLayer.vue`：无需修改，已通过 `store.selectLayer(id)` 触发选中
- `src/store/index.js`：无需修改
