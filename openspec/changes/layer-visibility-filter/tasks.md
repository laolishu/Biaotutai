## 1. normalizeLayer 数据提取

- [x] 1.1 在 `src/utils/normalizeLayer.js` 的 `normalizeNode` 中，将 ag-psd 节点的 `hidden` 字段加入标准化对象：`hidden: node.hidden ?? false`

## 2. store 状态与逻辑

- [x] 2.1 在 `src/store/index.js` 的 `state` 中添加 `filterHiddenLayers: false`
- [x] 2.2 在 store 中添加 `toggleFilterHiddenLayers` action，用于切换 `filterHiddenLayers` 布尔值
- [x] 2.3 在 store 中添加 `filteredLayers` getter：`filterHiddenLayers` 为 false 时返回 `state.layers`；为 true 时递归过滤掉 `hidden: true` 且无可见后代的节点

## 3. 图层面板 UI

- [x] 3.1 在 `src/views/Workbench.vue` 图层面板搜索框下方添加"过滤隐藏图层"勾选开关，绑定 `store.filterHiddenLayers`，点击调用 `store.toggleFilterHiddenLayers()`
- [x] 3.2 将图层面板中渲染图层树的数据源从 `store.layers` 改为 `store.filteredLayers`

## 4. 验证

- [x] 4.1 运行 `npm run build` 确认无构建错误
