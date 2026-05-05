## 新增需求

## 修改需求

### 需求:图层面板在搜索激活时切换视图
图层面板必须根据 `store.searchQuery` 的值决定显示哪种内容：空值时显示完整图层树，非空时显示搜索结果列表（`LayerSearchResults`）。
当图层来自 shape 细化流程时，图层面板必须支持展示结构化 shape 语义（如 `shapeType`）及降级状态（如 `degraded` / `degradeReason`）。

#### 场景:默认状态显示图层树
- **当** `store.searchQuery` 为空字符串
- **那么** 图层面板显示完整的递归图层树（LayerItem 列表），行为与现有实现一致

#### 场景:搜索激活时切换为结果列表
- **当** `store.searchQuery` 非空
- **那么** 图层面板隐藏树视图，改为显示 `LayerSearchResults` 组件

#### 场景:shape细化信息可见
- **当** 图层包含 `props.shapeType` 或降级标记字段
- **那么** 图层面板必须显示该语义信息，帮助用户识别其为结构组件或降级图片

## 移除需求
