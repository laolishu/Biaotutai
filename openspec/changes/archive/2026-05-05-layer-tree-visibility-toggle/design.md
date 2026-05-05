## 上下文

`LayerItem.vue` 当前只有类型图标、名称、标签，无可见性控制。`store.layers` 的每个图层节点已有 `hidden` 字段（来自 ag-psd 解析），但目前仅用于"过滤隐藏图层"的只读 getter，没有可写的 toggle action。

## 目标 / 非目标

**目标：**
- 在 `LayerItem` 每行右侧新增眼睛/闭眼 SVG 按钮，hover 整行时显示，图层隐藏时始终显示。
- 点击按钮调用 `store.toggleLayerVisibility(id)`，切换 `hidden`，不触发图层选中。
- 隐藏态图层行样式：半透明（`opacity: 0.4`）+ 图层名删除线，眼睛图标换为"闭眼"形态。
- HotspotLayer 若未读取 `layer.hidden` 则补充判断，确保画布同步隐藏。

**非目标：**
- 不持久化可见性状态（刷新后恢复 PSD 原始值）。
- 不支持批量切换（一次只切换单个图层）。

## 决策

**D1：状态存储在 store.layers 树上，直接 mutate**  
ag-psd 解析后的 `hidden` 字段已挂载在每个图层节点上，`toggleLayerVisibility` 只需递归找到节点并翻转 `hidden`。替代方案（额外维护 visibilityMap）会引入双重状态，无必要。

**D2：眼睛图标用内联 SVG，不引入图标库**  
项目已有内联 SVG 风格，保持一致；两套 SVG（睁眼/闭眼）共 4-6 行路径，代价很小。

**D3：点击事件 stopPropagation**  
眼睛按钮点击时需调用 `event.stopPropagation()` 阻止冒泡到 `.layer-item` 的 `@click`（选中逻辑），确保可见性切换不会同时改变选中状态。

## 风险 / 权衡

- [group 子图层] 切换 group 的 `hidden` 不会级联隐藏子图层——这是可接受的简单模型，子图层独立控制。若未来需要级联，可在 `toggleLayerVisibility` 中递归处理。
- [HotspotLayer 兼容] 若 HotspotLayer 未读 `hidden` 则画布不会同步，需检查并补充，风险极低。
