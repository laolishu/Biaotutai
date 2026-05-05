## 1. 变更脚手架

- [x] 1.1 在 `src/components/` 下新增 `ExportList.vue` 组件骨架
- [x] 1.2 在 `src/views/Workbench.vue` 的右侧 Activity Panel 中添加 `Export` 分页入口
- [x] 1.3 在 `src/store/index.js` 中新增 `exportList` 状态与初始化逻辑

## 2. 同步逻辑与 API

- [x] 2.1 实现 `syncExportListWithLayers()`，在图层隐藏/显示与 PSD 加载时调用
- [x] 2.2 实现 `toggleExportItem(id, include)` 来支持右侧手动排除/包含，并设置 `overridden=true`
- [x] 2.3 在 `toggleLayerHidden(layerId)` 中调用同步逻辑

## 3. 导出集成

- [x] 3.1 修改 `exportProjectJson()`，优先使用 `exportList` 的 `hidden=false` 项生成导出
- [ ] 3.2 添加单元/集成测试覆盖导出行为

## 4. UI/UX

- [ ] 4.1 导出列表支持层级显示与展开/收起
- [ ] 4.2 在 Export 列表顶部显示同步状态提示（例如：存在用户覆盖）
- [ ] 4.3 在导出操作之前提供预览/确认弹窗，显示将被导出的图层数量

## 5. 发布与回归测试

- [ ] 5.1 手动验证不同 PSD 下导出结果与 UI 一致
- [ ] 5.2 更新文档与用户指南
