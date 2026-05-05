## 上下文

当前工作台具备左侧图层树用于显示/隐藏图层，以及现有导出功能基于全部图层或当前选中层导出图像。用户期望有一个独立的“Export” 面板，让导出是显式可见且可编辑的列表，支持：

- 默认包含所有图层与子图层
- 隐藏左侧图层时，Export 列表会同步移除对应图层
- 在 Export 列表中用户可额外排除或包含图层（本地覆盖）

约束：右侧面板应与现有 Activity Panel 一致的样式与交互；尽量复用现有层级渲染组件 `LayerTree` 或 `CanvasLayer` 的显示逻辑；避免在切换时销毁图层画布导致性能问题。

## 目标 / 非目标

**目标：**
- 提供一个可编辑、可同步的导出图层列表视图
- 保证左侧隐藏/显示操作在 Export 列表中被即时反映
- 导出接口优先使用 `exportList`，并保持向后兼容

**非目标：**
- 不更改 PSD 解析或画布渲染引擎的核心逻辑
- 不实现复杂的导出后处理（色彩校正、格式转换）

## 决策

1. 存储模型
- 在 `store` 中新增 `exportList: Array<ExportItem>`，每个 `ExportItem` 为 `{ id, name, hidden, children?: ExportItem[] , overridden?: boolean }`。
- 提供 `syncExportListWithLayers()` 方法：在图层树更新（加载 PSD、切换图层隐藏/显示）时，按层级合并左侧 `layers` 到 `exportList`：
  - 若 `exportList` 中不存在对应层，则添加（默认 `hidden=false`）
  - 若 `exportList` 存在但被用户手动 override（`overridden=true`），保持用户选择
  - 若左侧图层被隐藏，确保 `exportList` 中该项被标记 `hidden=true`，但保持 `overridden` 标志以便回退

2. UI 组件
- 新增 `ExportList.vue`（放在 `src/components/`）:
  - 使用 `Tree` 结构显示 `exportList`
  - 每项显示复选框（勾选=包含）和图层名，支持展开/收起
  - 改变会触发 `store.toggleExportItem(id, include)`，设置 `overridden=true`

3. 数据流
- 事件触发点：
  - `store.toggleLayerHidden(layerId)`：修改左侧图层后调用 `syncExportListWithLayers()` 同步
  - PSD 加载完成后，初始化 `exportList` 为所有图层的映射
  - `ExportList` 的用户操作直接修改 `exportList` 并设置 `overridden`，不会直接更改左侧图层树

4. 导出流程
- `exportProjectJson()`：当调用导出时优先使用 `exportList` 中 `hidden=false` 的项生成导出内容；若 `exportList` 为空或未初始化，使用旧逻辑

## 风险 / 权衡

- 风险：同步逻辑可能会在深层嵌套的图层树造成性能波动 → 缓解：在大量图层时使用 debounce/微任务批量更新，并尽可能做局部更新而非全量重建
- 风险：用户误以为 Export 列表与左侧图层绑定双向 → 缓解：在 UI 中提供提示文案，说明 Export 列表为导出“快照”，并显示“同步状态”提示

## Open Questions
- Export 列表的持久化时机：在每次修改后立即持久化到 localStorage，还是在用户点击“保存导出配置”时持久化？
- 是否需要支持按标签/组导出预设？
