## 上下文

标图台左侧图层面板当前展示 PSD 所有图层，包括设计师标注为隐藏的图层。对于图层较多的 PSD（常见数十至上百图层），隐藏图层会大量占据列表空间，干扰开发者定位有效图层。ag-psd 解析时会透传 `hidden` 字段（布尔值）到图层节点，目前 `normalizeLayer` 未提取该字段。

## 目标 / 非目标

**目标：**
- 在图层面板顶部提供一个勾选开关"过滤隐藏图层"
- 开关开启时，从图层树中隐藏所有 `hidden: true` 的图层（包括递归隐藏的分组）
- 开关状态存储于 Pinia store（当前 session，不持久化到 localStorage）
- normalizeLayer 提取并透传 `hidden` 字段

**非目标：**
- 不修改画布 hotspot 渲染逻辑（hotspot 已按图层可见性独立渲染）
- 不持久化开关状态到 localStorage
- 不支持单独切换某图层的隐藏状态（只读过滤）

## 决策

### 1. 过滤逻辑放在 store getter（`filteredLayers`）而非组件内

**理由**：图层数据已经在 store 中，getter 可复用且与视图解耦。组件只需绑定 `store.filteredLayers` 替代 `store.layers`。

**替代方案**：在 `Workbench.vue` 的 `computed` 中过滤 — 会导致逻辑分散，且搜索结果也需重复过滤。

### 2. `hidden` 字段在 `normalizeLayer` 时提取

ag-psd 直接在 layer 节点上暴露 `hidden: boolean`，直接读取即可。无需解析额外子系统。

### 3. 递归过滤：分组仅在所有子图层均被过滤掉时才隐藏

如果一个 group 有子图层可见，则 group 本身应保留（否则可见子图层会丢失）。过滤函数递归处理 children，仅当过滤后 children 为空时才移除该 group（若 group 自身也是隐藏的）。

### 4. 开关 UI 放在图层面板搜索框下方

与现有 `LayerSearch` 组件同区域，保持面板头部控件集中。使用 `<input type="checkbox">` + label 样式（或内联简单实现），不引入新依赖。

## 风险 / 权衡

- [ag-psd `hidden` 字段可靠性] → ag-psd v30 已正确透传 Photoshop 图层可见性，风险低
- [递归过滤性能] → 图层树一般不超过数百节点，过滤计算开销可忽略，无需缓存优化
- [过滤后选中图层消失] → 若当前选中图层被过滤，属性面板应显示 null 状态（已有 `selectedLayer` 为 null 的降级处理）
