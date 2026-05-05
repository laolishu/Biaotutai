## 上下文

标图台已完成 PSD 解析与图层规范化（`normalizeLayer.js`），工作台可查看图层树与属性面板。现在需要将内存中的图层数据按 `spec-export-json v1.0` 序列化为 `project.json`，并在工作台提供一键下载入口。

现有基础：
- `store.layers`：规范化后的图层树（含 `type`/`layout`/`text`/`shapeProps`/`imagePreviewUrl` 等字段）。
- `normalizeLayer.js`：`normalizeShapeMeta()` 已输出 `shapeType`/`props`，复杂路径图层已降级为 `type=image` 并携带 `degraded`/`degradeReason`/`originalType`。

## 目标 / 非目标

**目标：**
- 在 `store/index.js` 中实现 `exportProjectJson()` action，纯内存序列化，无网络请求。
- `assets` 使用详细元数据对象；`image` 图层的 `imagePreviewUrl`（base64/blob URL）通过哈希去重后写入 `assets`。
- `layers` 扁平数组，按规范输出每种 `type` 的 `props`。
- 工作台"导出 JSON"按钮触发浏览器下载 `<filename>.project.json`。

**非目标：**
- 不生成 ZIP 压缩包（assets 路径仅为占位，base64 数据由调用方决定如何持久化）。
- 不实现运行时 `binding` 字段。
- 不修改 PSD 解析逻辑。

## 决策

**D1：assets 哈希方案**  
使用 FNV-1a（纯 JS，无依赖）对 `imagePreviewUrl` 做内容哈希，生成 `fnv1a:<hex>` 格式。理由：无需引入 crypto 依赖，浏览器环境兼容，哈希碰撞率对本场景可接受。替代方案（`crypto.subtle SHA-256`）需要异步流程，增加序列化复杂度。

**D2：flatIndex 构建**  
在 `collectExportLayers()` 中按 DFS 遍历顺序（先序）维护一个 `flatIndex` 数组，遍历完成后附加到 payload。对应规范的"从底到顶"渲染顺序。

**D3：image base64 不写入 project.json**  
`imagePreviewUrl` 是 base64 data URL，体积大，不适合嵌入 JSON。`assets[id].path` 记录占位路径 `assets/<id>.png`，`size` 由 base64 估算，供导入端参考。实际图像数据由未来 ZIP 导出功能处理。

**D4：降级图层（shape → image）**  
`type=image` 且 `layer.degraded=true` 的图层，在 `props` 中额外附加 `degraded`/`degradeReason`/`originalType` 三个字段，方便导入端识别来源。

## 风险 / 权衡

- [base64 体积] 导出的 JSON 体积可能很大（图层多时）→ 后续可增加 ZIP 导出，本期仅提供 JSON 下载，属于可接受权衡。
- [FNV-1a 碰撞] 极低概率两个不同图像产生相同哈希，导致资源合并 → 对于 UI 标注场景影响极小，可接受。
- [imagePreviewUrl 为 blob URL] 若图层预览为 `blob:` 协议 URL 而非 base64，`size` 估算为 0 → 建议 store 在解析时统一转为 base64，或在导出时做 fallback 处理。
