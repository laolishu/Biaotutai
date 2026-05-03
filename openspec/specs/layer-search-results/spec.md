## 新增需求

### 需求:实时过滤图层树
store 必须提供 `searchQuery` 状态（字符串）和 `searchResults` getter（扁平数组），`searchResults` 包含所有名称中包含 `searchQuery` 子串的图层节点（大小写不敏感，递归遍历所有层级）。

#### 场景:输入关键词返回匹配图层
- **当** `searchQuery` 为非空字符串
- **那么** `searchResults` 返回所有 `layer.name` 包含该字符串的节点，不论层级深度

#### 场景:空查询返回空数组
- **当** `searchQuery` 为空字符串
- **那么** `searchResults` 返回空数组

#### 场景:大小写不敏感匹配
- **当** `searchQuery` 为 `"button"` 且存在名称为 `"Button_Primary"` 的图层
- **那么** `searchResults` 包含该图层

### 需求:搜索结果扁平视图
当 `searchQuery` 非空时，图层面板必须切换为扁平搜索结果列表，显示 `store.searchResults` 中的所有图层条目，并在每个条目名称中高亮匹配关键词。

#### 场景:有结果时显示扁平列表
- **当** `store.searchQuery` 非空且 `store.searchResults.length > 0`
- **那么** 图层面板隐藏树视图，显示搜索结果列表，每条结果展示图层类型图标和高亮后的名称

#### 场景:无结果时显示空状态
- **当** `store.searchQuery` 非空且 `store.searchResults.length === 0`
- **那么** 图层面板显示"未找到匹配图层"的空状态提示

#### 场景:关键词高亮显示
- **当** 搜索结果中的图层名称包含关键词
- **那么** 名称中匹配的部分以 `<mark>` 标签高亮展示，其余部分正常显示

#### 场景:点击结果项选中图层
- **当** 用户点击搜索结果列表中的某个图层条目
- **那么** 调用 `store.selectLayer(layer.id)`，该图层变为选中状态，样式与图层树中的 `is-active` 一致
