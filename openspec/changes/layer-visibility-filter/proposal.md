## 为什么

左侧图层面板会展示 PSD 中所有图层（包括隐藏图层），导致面板条目过多、干扰开发者关注可见内容。需要一个开关让用户快速过滤掉隐藏图层，提升标注效率。

## 变更内容

- 在左侧图层面板顶部增加一个"过滤隐藏图层"勾选开关
- 勾选时，图层树中隐藏的图层（及其子图层均不可见的分组）不显示在列表中
- 开关状态持久化于当前会话（store 中保存），默认关闭（显示所有图层）
- `normalizeLayer` 需提取 ag-psd 的 `hidden` 字段并透传到标准化图层数据中

## 功能 (Capabilities)

### 新增功能

- `layer-visibility-filter`: 图层面板的隐藏图层过滤开关，包含开关 UI、store 状态、过滤逻辑

### 修改功能

- 无

## 影响

- `src/utils/normalizeLayer.js`：提取 `hidden` 字段
- `src/store/index.js`：新增 `filterHiddenLayers` 状态及 `filteredLayers` getter
- `src/views/Workbench.vue`：图层面板顶部添加开关 UI
- `src/components/LayerItem.vue`：可能需感知 hidden 状态（低优先级）
