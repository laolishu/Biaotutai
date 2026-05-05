## 1. store 导出逻辑

- [x] 1.1 在 `src/store/index.js` 中实现 `hashString(input)` 工具函数（FNV-1a，返回 `fnv1a:<hex>`）
- [x] 1.2 实现 `estimateBase64Size(dataUrl)` 工具函数，估算 base64 data URL 对应的字节数
- [x] 1.3 实现 `collectExportLayers(layers, context, parentId, flatIndex)` 函数，DFS 遍历图层树，按规范输出 `id/name/type/visible/parentId/zIndex/layout/props/children`
- [x] 1.4 `collectExportLayers` 中处理 `type=image` 图层：去重写入 `context.assets` 元数据对象（含 `path/mime/w/h/size/hash/originLayers/exportedAs/scalable`）
- [x] 1.5 `collectExportLayers` 中处理 `type=text` 图层：输出 `props.content/fontFamily/fontSize/color`
- [x] 1.6 `collectExportLayers` 中处理 `type=shape` 图层：输出 `props.shapeType/fill/cornerRadius/stroke`
- [x] 1.7 `collectExportLayers` 中处理降级图层（`type=image` 且 `layer.degraded=true`）：在 `props` 中追加 `degraded/degradeReason/originalType`
- [x] 1.8 实现 `buildExportPayload(store)` 函数，组装顶层字段 `version/meta/source/canvas/assets/flatIndex/layers`
- [x] 1.9 在 store actions 中暴露 `exportProjectJson()` 方法，调用 `buildExportPayload(this)` 并返回结果

## 2. 工作台 UI

- [x] 2.1 在 `src/views/Workbench.vue` 中新增"导出 JSON"按钮，绑定 `exportJson()` 事件处理函数
- [x] 2.2 实现 `exportJson()`：调用 `store.exportProjectJson()`，序列化为 JSON 字符串，触发浏览器下载 `<filename>.project.json`
- [x] 2.3 右侧属性面板 `type=shape` 时展示 `shapeType`、填充色、圆角、边框信息
- [x] 2.4 右侧属性面板 `type=image` 且 `degraded=true` 时展示降级提示（来源类型 + 降级原因）

## 3. 图层列表标签（可选增强）

- [x] 3.1 在 `src/components/LayerItem.vue` 中，`type=shape` 时在图层名后显示 `shapeType` 小标签（`rect`/`card`/`line`）
- [x] 3.2 `degraded=true` 的图层显示降级标识标签（与普通 `image` 图层视觉区分）

## 4. 构建验证

- [x] 4.1 运行 `npm run build` 确认无编译错误
- [ ] 4.2 手动验证：上传含 shape / text / image 图层的 PSD，点击"导出 JSON"，检查输出的 `project.json` 字段是否符合规范
