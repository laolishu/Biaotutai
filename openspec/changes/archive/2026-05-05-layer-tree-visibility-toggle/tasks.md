## 1. store action

- [x] 1.1 在 `src/store/index.js` 中实现 `toggleLayerVisibility(id)` action：递归遍历 `this.layers` 找到匹配 `id` 的节点，翻转其 `hidden` 字段

## 2. LayerItem 眼睛图标

- [x] 2.1 在 `src/components/LayerItem.vue` 的 `.layer-item` 行末添加眼睛按钮（睁眼/闭眼两套内联 SVG），根据 `layer.hidden` 切换显示
- [x] 2.2 眼睛按钮绑定 `@click.stop="toggleVisibility"`，调用 `store.toggleLayerVisibility(layer.id)`
- [x] 2.3 眼睛按钮默认隐藏，hover `.layer-item` 时显示；当 `layer.hidden === true` 时始终显示（闭眼图标）
- [x] 2.4 隐藏态图层行添加 `is-hidden` class：`opacity: 0.4` + 图层名 `text-decoration: line-through`

## 3. HotspotLayer 画布同步

- [x] 3.1 检查 `src/components/HotspotLayer.vue`，确认是否已根据 `layer.hidden` 控制渲染；若未处理，在渲染条件中补充 `v-if="!layer.hidden"` 或等价判断

## 4. 构建验证

- [x] 4.1 运行 `npm run build` 确认无编译错误
- [ ] 4.2 手动验证：在图层树中点击眼睛图标，确认图层行样式变化且画布对应图层隐藏/显示
