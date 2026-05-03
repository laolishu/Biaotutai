## 修改需求

### 需求:图层面板在搜索激活时切换视图
图层面板必须根据 `store.searchQuery` 的值决定显示哪种内容：空值时显示完整图层树，非空时显示搜索结果列表（`LayerSearchResults`）。

#### 场景:默认状态显示图层树
- **当** `store.searchQuery` 为空字符串
- **那么** 图层面板显示完整的递归图层树（LayerItem 列表），行为与现有实现一致

#### 场景:搜索激活时切换为结果列表
- **当** `store.searchQuery` 非空
- **那么** 图层面板隐藏树视图，改为显示 `LayerSearchResults` 组件

## 新增需求

## 移除需求
