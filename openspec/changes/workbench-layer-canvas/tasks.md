## 1. Store 扩展

- [x] 1.1 在 `src/store/index.js` 的 state 中新增 `selectedLayerId: null` 和 `backgroundUrl: ''` 字段
- [x] 1.2 在 store 中添加 `selectLayer(id)` action：设置 `selectedLayerId = id`
- [x] 1.3 在 `parsePsd` action 成功后，调用 `URL.revokeObjectURL(this.backgroundUrl)` 释放旧 URL，再通过 `URL.createObjectURL(file)` 生成新 URL 并存入 `this.backgroundUrl`
- [x] 1.4 在 `parsePsd` action 的 catch 块中同样 revoke 旧 URL 并清空 `backgroundUrl`
- [x] 1.5 添加 `selectedLayer` getter：从 `layers` 扁平查找 `selectedLayerId` 对应的图层节点（需递归查找 children）

## 2. 图层树递归组件

- [x] 2.1 创建 `src/components/LayerItem.vue`：接收 `layer` prop，展示图层名称与类型图标（group/text/image/shape 各用不同 Unicode 符号或 CSS 类区分）
- [x] 2.2 在 `LayerItem.vue` 中：当 `layer.type === 'group'` 且有 children 时，递归渲染子 `<LayerItem>` 列表（默认展开）
- [x] 2.3 在 `LayerItem.vue` 中：点击图层项调用 `store.selectLayer(layer.id)`，当 `store.selectedLayerId === layer.id` 时添加高亮样式

## 3. 左侧图层面板

- [x] 3.1 在 `Workbench.vue` 左侧面板区域，替换 mock 列表为 `v-for="layer in store.layers"` + `<LayerItem :layer="layer" />`
- [x] 3.2 当 `store.layers.length === 0` 时展示"暂无图层"空状态提示

## 4. 画布背景图与尺寸

- [x] 4.1 在 `Workbench.vue` 中，给 `canvas-stage` 绑定动态 style：`:style="{ width: store.psd.width + 'px', height: store.psd.height + 'px' }"`
- [x] 4.2 在 `canvas-stage` 内添加背景图 `<img>`：`:src="store.backgroundUrl"`，样式为 `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; object-fit: fill`
- [x] 4.3 当 `store.backgroundUrl` 为空时，`canvas-stage` 显示深色占位背景（已有 CSS 样式，确认即可）
- [x] 4.4 确认 `canvas-container` 的 CSS 包含 `overflow: auto` 支持滚动查看超出视口的画布

## 5. 热区渲染

- [x] 5.1 创建 `src/components/HotspotLayer.vue`：接收 `layers` prop（数组），将所有非 group 图层按 `layer.x/y/width/height` 绝对定位渲染透明热区 div
- [x] 5.2 在 `HotspotLayer.vue` 中：group 类型图层不渲染自身热区，递归渲染其 children
- [x] 5.3 在 `HotspotLayer.vue` 中：热区 `@mouseenter` 显示自实现 tooltip（固定在热区右上角），展示 `name / x, y / w × h`；`@mouseleave` 隐藏
- [x] 5.4 在 `HotspotLayer.vue` 中：热区 `@click` 调用 `store.selectLayer(layer.id)`；选中状态热区添加高亮边框样式
- [x] 5.5 在 `Workbench.vue` 的 `canvas-stage` 内，在背景图之上渲染 `<HotspotLayer :layers="store.layers" />`

## 6. 右侧属性面板

- [x] 6.1 在 `Workbench.vue` 右侧面板区域，当 `store.selectedLayerId` 为 null 时展示"请选择图层"提示
- [x] 6.2 当 `store.selectedLayer` 存在时，渲染属性列表：name、type、x、y、width、height（使用 `store.selectedLayer` getter）
- [x] 6.3 每个属性值添加点击复制功能：调用 `navigator.clipboard.writeText(value)`，点击后短暂展示"已复制"视觉反馈（切换 class 或修改按钮文字 300ms 后还原）
- [x] 6.4 当 `store.selectedLayer.type === 'text'` 且 style 包含字体信息时，额外渲染 fontFamily、fontSize、color 属性行
