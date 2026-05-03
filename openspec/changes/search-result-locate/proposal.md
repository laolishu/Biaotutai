## 为什么

当前搜索功能只能看到匹配结果的扁平列表，单击后选中图层但搜索框仍保持原状、图层树也不跳转到对应位置，用户需要手动清空搜索并滚动定位，操作繁琐。双击搜索结果应一步完成"定位 + 清除搜索"，提升工作效率。

## 变更内容

- 在搜索结果列表（`LayerSearchResults`）中，为每一项增加**双击**交互
- 双击某搜索结果时：
  1. 选中该图层（与单击行为一致）
  2. 清空搜索框内容（`store.setSearchQuery('')`），回退到图层树视图
  3. 图层树自动滚动到并高亮该图层（依赖已有的 `LayerItem` `scrollIntoView` 逻辑）

## 功能 (Capabilities)

### 新增功能

- `search-result-locate`: 搜索结果双击定位到图层树并清空搜索框

### 修改功能

- 无

## 影响

- `src/components/LayerSearchResults.vue`：为列表项添加 `dblclick` 事件处理
- `src/store/index.js`：无需修改（`selectLayer` + `setSearchQuery` 已存在）
- `src/components/LayerItem.vue`：无需修改（`scrollIntoView` 已实现）
