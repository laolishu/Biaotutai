## 上下文

画布（`HotspotLayer.vue`）中的热区点击已通过 `store.selectLayer(id)` 更新 `store.selectedLayerId`，`LayerItem.vue` 通过 `:class="{ 'is-active': store.selectedLayerId === layer.id }"` 渲染选中状态。但选中后左侧图层面板不会自动滚动，当图层数量多时用户无法直观感知被选中图层在树中的位置。

图层列表通过 `<el-scrollbar>` 渲染，其内部 `__vue__` 实例提供 `scrollTo` 方法，但直接调用 DOM 原生 `scrollIntoView` 更简单可靠。

## 目标 / 非目标

**目标：**
- 画布点击热区后，左侧图层面板的对应 `LayerItem` 元素自动滚动进入可视区域
- 滚动行为平滑、不打断用户体验（使用 `block: 'nearest'` 避免不必要的滚动）
- 搜索结果列表（`LayerSearchResults`）中点击图层条目同样触发滚动定位（本身已在可视区，无需额外处理）

**非目标：**
- 右侧属性面板与图层面板的联动（已有）
- 图层树展开/折叠动画
- 反向同步：在图层面板点击已自动高亮，无需额外滚动到画布热区

## 决策

### 滚动触发位置：`LayerItem` 内部 `watch` vs `Workbench.vue` 顶层协调

选择 **`LayerItem.vue` 内部 `watch`**：
- 每个 LayerItem 知道自己的 `layer.id`，只需 watch `store.selectedLayerId === layer.id` 这一条件
- 不需要 `Workbench.vue` 持有对所有子项的 ref，避免复杂 ref 管理
- 不选顶层协调：需要通过 `ref` 或 `querySelector` 定位目标 DOM，更脆弱

### 滚动 API：`scrollIntoView` vs `el-scrollbar.scrollTo`

选择 **`scrollIntoView({ block: 'nearest', behavior: 'smooth' })`**：
- 原生 API，无需关心 el-scrollbar 的内部实现
- `block: 'nearest'` 语义准确：已在可视区时不滚动，否则最小距离滚入
- 不选 `el-scrollbar.scrollTo`：需要计算偏移量，维护成本高

### watch 触发时机

使用 `watch(() => store.selectedLayerId, ...)` + `nextTick`：当选中 ID 变为自身 ID 时，在下一帧 DOM 更新后执行 `scrollIntoView`，避免在 DOM 更新前调用。

## 风险 / 权衡

- [深层嵌套图层的滚动容器识别] `el-scrollbar` 内部有多层 div，`scrollIntoView` 会自动找最近可滚动祖先 → 无需手动指定容器，原生行为已正确
- [搜索模式下的重复滚动] 搜索结果列表中点击时 `LayerItem` 不可见（树视图被隐藏），watch 不应触发 → 搜索模式下图层树 `v-show="!store.searchQuery"` 隐藏，`scrollIntoView` 在隐藏元素上调用无副作用
