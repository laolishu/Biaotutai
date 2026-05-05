## 为什么

图层树目前只支持点击选中，无法直接在面板中控制图层的显示/隐藏。设计师在标注时常需要快速切换某个图层的可见性以对比效果，需要一个直观的眼睛图标来完成这一操作。

## 变更内容

- 在 `LayerItem` 的每行右侧新增眼睛图标按钮（hover 时显示，图层隐藏时常驻显示）。
- 点击眼睛图标切换该图层的 `hidden` 状态（不影响选中逻辑）。
- store 新增 `toggleLayerVisibility(id)` action，在图层树中递归找到对应图层并翻转 `hidden`。
- 隐藏状态的图层在图层树中以半透明或删除线样式呈现，图标切换为"闭眼"状态。

## 功能 (Capabilities)

### 新增功能

- `layer-visibility-toggle`：图层树中每行图层可通过眼睛图标切换显示/隐藏状态，状态变化实时反映在画布（HotspotLayer）与图层树样式上。

### 修改功能

（无已有规范文件需修改）

## 影响

- `src/components/LayerItem.vue`：新增眼睛图标按钮与相关样式、隐藏态样式。
- `src/store/index.js`：新增 `toggleLayerVisibility(id)` action，需递归更新图层树中的 `hidden` 字段。
- `src/components/HotspotLayer.vue`（可选）：若已读取 `layer.hidden` 控制可见性则无需修改；否则补充 `v-if="!layer.hidden"` 判断。
