## 新增需求

### 需求:图层可见性字段透传
normalizeLayer 必须从 ag-psd 节点中提取 `hidden` 字段，并将其作为 `hidden: boolean` 包含在标准化图层数据中。若原始节点无 `hidden` 字段，则默认为 `false`。

#### 场景:ag-psd 节点有 hidden 字段
- **当** ag-psd 解析的图层节点包含 `hidden: true`
- **那么** 标准化后的图层对象包含 `hidden: true`

#### 场景:ag-psd 节点无 hidden 字段
- **当** ag-psd 解析的图层节点不含 `hidden` 字段
- **那么** 标准化后的图层对象包含 `hidden: false`

### 需求:过滤隐藏图层开关状态
store 必须维护一个 `filterHiddenLayers` 布尔状态，默认值为 `false`（不过滤）。store 必须提供 `toggleFilterHiddenLayers` action 用于切换该状态。

#### 场景:默认状态
- **当** 用户首次进入工作台
- **那么** `filterHiddenLayers` 为 `false`，图层面板显示所有图层

#### 场景:开启过滤
- **当** 用户勾选"过滤隐藏图层"开关
- **那么** `filterHiddenLayers` 变为 `true`

#### 场景:关闭过滤
- **当** 用户取消勾选"过滤隐藏图层"开关
- **那么** `filterHiddenLayers` 变为 `false`

### 需求:filteredLayers getter
store 必须提供 `filteredLayers` getter。当 `filterHiddenLayers` 为 `false` 时，返回完整的 `layers` 数组。当 `filterHiddenLayers` 为 `true` 时，递归过滤掉所有 `hidden: true` 的图层节点；若一个 group 节点的所有子图层均被过滤，且该 group 自身也是隐藏的，则该 group 也被过滤。

#### 场景:未开启过滤时返回全量数据
- **当** `filterHiddenLayers` 为 `false`
- **那么** `filteredLayers` 返回与 `layers` 相同的完整图层树

#### 场景:过滤后隐藏图层不出现
- **当** `filterHiddenLayers` 为 `true` 且存在 `hidden: true` 的图层
- **那么** `filteredLayers` 中不包含任何 `hidden: true` 的叶子图层

#### 场景:可见子图层所在分组保留
- **当** `filterHiddenLayers` 为 `true`，一个 group 本身 hidden 但其中有子图层 hidden 为 false
- **那么** 该 group 在 `filteredLayers` 中保留，并仅展示可见子图层

#### 场景:分组所有子图层均隐藏且分组自身隐藏
- **当** `filterHiddenLayers` 为 `true`，一个 group 自身 hidden 且过滤后无可见子图层
- **那么** 该 group 从 `filteredLayers` 中移除

### 需求:图层面板显示过滤开关
Workbench.vue 图层面板必须在搜索框下方显示"过滤隐藏图层"勾选开关。开关绑定 `store.filterHiddenLayers` 状态，点击时调用 `store.toggleFilterHiddenLayers()`。图层树必须使用 `store.filteredLayers` 而非 `store.layers` 渲染。

#### 场景:开关可见
- **当** 用户打开工作台图层面板
- **那么** 搜索框下方显示"过滤隐藏图层"勾选开关，默认未勾选

#### 场景:勾选后图层树更新
- **当** 用户勾选"过滤隐藏图层"
- **那么** 图层面板立即隐藏所有 `hidden: true` 的图层，显示剩余可见图层

#### 场景:取消勾选后图层树恢复
- **当** 用户取消勾选"过滤隐藏图层"
- **那么** 图层面板恢复显示所有图层（包含之前隐藏的图层）

## 修改需求

## 移除需求
