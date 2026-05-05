## 为什么

当前导出功能使用工作台图层树或整图信息生成导出包，但没有一个专门的“导出列表”视图让用户直观管理哪些图层会被包含在导出中。用户在隐藏左侧图层（例如临时屏蔽）时，导出逻辑不能直观反映这些意图。新增一个右侧“导出”分页可以提供导出预览并作为导出依据。

## 变更内容

- 在工作台右侧新增一个 `Export` 分页（右侧 Activity Panel 中的一个选项），默认展示所有图层的列表
- 当左侧图层被隐藏时，Export 列表同步移除该图层及其子图层；当左侧图层重新显示时，Export 列表恢复该图层及其子图层
- Export 列表允许用户在右侧进一步临时排除/包含（override），最终导出以该列表为准
- Store 新增 `exportList` 状态与同步逻辑，并扩展导出接口以优先使用 `exportList`

## 功能 (Capabilities)

### 新增功能
- `export-list-panel`: 右侧新增导出分页，用于管理导出层级清单（默认包含所有图层，响应左侧隐藏/显示变化）

### 修改功能
- `export-project`: 修改导出逻辑以使用 `exportList`（若存在）作为导出依据；若 `exportList` 为空则退回到现有行为

## 影响

- `src/views/Workbench.vue`: 右侧 Activity Panel 新增 `Export` 分页入口，并加载 `ExportList.vue` 组件
- `src/components/ExportList.vue`（新增）: 渲染导出条目列表、支持手动排除/包含操作、显示层级结构
- `src/store/index.js`: 新增 `exportList` 状态、`syncExportListWithLayers()` 辅助方法、并更新 `exportProjectJson()` 调用逻辑
- 导出测试/集成：需要手动验证导出结果与 `exportList` 的一致性
