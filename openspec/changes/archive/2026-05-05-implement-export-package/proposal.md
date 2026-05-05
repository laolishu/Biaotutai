## 为什么

当前标图台已能解析 PSD 并在工作台展示图层，但缺少完整的导出能力——无法将解析结果以标准化格式（`project.json` + `assets/`）导出供大屏设计器消费。需要按已有规范文档（`docs/feature-export-package/spec-export-json.md`）实现完整的导出包功能，使下游导入端可靠地复原画布与资源。

## 变更内容

- 实现 `exportProjectJson()` 方法，按规范生成顶层字段：`version`、`meta`、`source`、`canvas`、`assets`、`flatIndex`、`layers`。
- `assets` 字段使用详细元数据对象（`path`/`mime`/`w`/`h`/`size`/`hash`/`originLayers`/`exportedAs`/`scalable`），不允许简单字符串映射。
- `layers` 按规范输出各类型的 `props`：
  - `image`：`assetId`/`scaleMode`，降级图层补充 `degraded`/`degradeReason`/`originalType`。
  - `text`：`content`/`fontFamily`/`fontSize`/`color`。
  - `shape`：`shapeType`/`fill`/`cornerRadius`/`stroke`。
- 工作台页新增"导出 JSON"按钮，触发 `project.json` 文件下载。
- 工作台页右侧属性面板补充 shape 字段展示（shapeType、填充、圆角、边框）与降级状态展示。

## 功能 (Capabilities)

### 新增功能

- `export-package`: 将解析后的图层树导出为 `project.json` + `assets/` 格式，符合 spec-export-json v1.0 规范。

### 修改功能

（无已有规范文件需修改）

## 影响

- `src/store/index.js`：新增 `exportProjectJson()` action，包含 `buildExportPayload`/`collectExportLayers` 逻辑。
- `src/views/Workbench.vue`：新增导出按钮与属性面板 shape/降级字段展示。
- `src/components/LayerItem.vue`（可选）：新增 shapeType/degraded 标签。
- `docs/feature-export-package/spec-export-json.md`：规范文档已存在，作为本变更的输入依据。
