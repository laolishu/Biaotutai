# 导出包规范：project.json + assets（精简）

目的：描述设计稿的视觉快照，供导入端（大屏设计器）复原画布与资源；导出格式只包含视觉信息，不承载运行时逻辑。

版本：1.0

目录结构（建议 ZIP）

- `project.json` — 主描述文件
- `assets/` — 外联资源（图片等）

核心原则（要点）

- 仅描述视觉：位置/尺寸/层级/可见性/文本内容与样式/资源引用。
- 不包含运行时：事件、数据绑定、业务计算、组件生命周期由导入端管理。
- 资源集中：大体积资源放 `assets/`，`project.json` 仅引用路径或 URL。

字段说明（详细，供对接使用）

说明：以下字段除特殊标注外均为可选，导入器应以 `version` 与 `meta` 为首要校验点；但对解析器实现，我们建议将标记为“必需”的字段视为必须支持以保证基本功能。

顶层字段

- `version` (string) — 必需。导出格式版本，采用语义化版本号（例如 `"1.0"`）。解析器应拒绝不兼容的主版本。
- `meta` (object) — 可选。元信息：
  - `sourceFilename` (string)：原始文件名（可用于日志和用户提示）。
  - `exportedAt` (string, ISO8601)：导出时间，便于排查与缓存。
  - `exporterVersion` (string)：导出器版本或构建号。
  - `notes` (string)：任意备注。
- `source` (string) — 必需。来源标识，建议使用小写枚举（`psd`、`figma`、`sketch` 等）。导入端可据此应用来源特有的兼容策略。
- `canvas` (object) — 必需。画布基础信息：
  - `width` (number, px) — 必需。
  - `height` (number, px) — 必需。
  - `dpi` (number) — 可选；若未提供默认为 72。
  - `background` (string) — 可选，画布背景色（如 `#ffffff`）。

资源表 `assets`

`assets` 是一个对象映射，键为 `assetId`（字符串）。为保证对接方解析、校验和缓存的可靠性，**导出器应始终使用详细的元数据对象（不再允许简单字符串映射）**，格式建议如下：

示例元数据对象（必须包含 `path` 或 URL，建议包含 `hash`）：

```json
"asset_1": {
  "path": "assets/asset_1.png",
  "mime": "image/png",
  "w": 400,
  "h": 200,
  "size": 34567,
  "hash": "sha1:abcd1234",
  "variants": { "2x": "assets/asset_1@2x.png" },
  "originLayers": ["layer_7","layer_9"],
  "exportedAs": "png",
  "scalable": false
}
```

字段说明：

- `path` (string) — 必需：ZIP 内的相对路径或外部 URL。
- `hash` (string) — 强烈建议：用于完整性校验，格式为 `algo:hex`。
- `mime`/`w`/`h`/`size` — 可选，便于导入端做负载优化与校验。
- `variants`/`originLayers`/`exportedAs`/`scalable` — 可选，说明资源的多分辨率或来源信息。

用途与校验建议：

- 导入端应先解析 `assets` 建立加载队列；对每个 asset 如存在 `hash` 应校验完整性并在失败时记录告警或回退策略。
- `path` 在 ZIP 中应为相对路径，解析器在本地解压后用相对路径解析；若为 URL，应支持远程加载并提供超时/重试策略。

`flatIndex`

- 类型：`array[string]`。按渲染顺序（从底到顶）的 layer id 列表。可选但强烈推荐用于恢复渲染栈与 zIndex。

`layers`（层数组）

每个 layer 为对象，建议实现必读字段与推荐字段：

- `id` (string) — 必需，全局唯一。
- `name` (string) — 可选，人类可读名称。
- `type` (string) — 必需，枚举：`group|image|text|shape|svg|component`。
- `visible` (bool) — 可选，默认 `true`。
- `locked` (bool) — 可选，导入端可用于编辑权限。
- `parentId` (string|null) — 可选，顶层为 `null`。
- `zIndex` (number) — 可选，若缺失可由 `flatIndex` 或数组顺序计算。
- `layout` (object) — 可选，像素坐标与尺寸：
  - `x` (number)，`y` (number)，`w` (number)，`h` (number)。
  - `anchor` (string) 可选（例如 `top-left` / `center`），若不提供导入端按左上角对齐。
- `transform` (object) — 可选，旋转/缩放信息：`rotate`(deg), `scaleX`, `scaleY`。
- `opacity` (number) — 可选，范围 0-1。
- `blendMode` (string) — 可选，若不提供使用默认混合模式 `normal`。
- `mask` / `clipping` — 可选，视导出能力决定格式；导入端应兼容无 mask 的情况。
- `props` (object) — 可选，按 `type` 细化（见下）。
- `children` (array[string]) — 可选，仅作为 tree convenience；导入端应以 `parentId` 为准生成树。
- `editableFields` (array[string]) — 可选，列出允许编辑的字段路径（格式建议使用 JSON Pointer，例如 `/props/content` 或 `props.content`）。
- `notes` (string) — 可选，额外说明。

`props` 按 layer `type` 的典型结构

- image
  - `assetId` (string) — 必需，引用 `assets` 中的键。
  - `scaleMode` (string) — 可选：`cover|contain|stretch|none`。
  - `srcRect` (object) — 可选，用于裁切：`{ x,y,w,h }`。
  - `degraded` (bool) — 可选，若为 `true` 表示该图层由复杂 shape 路径降级而来。
  - `degradeReason` (string) — 可选，降级原因，当前约定常用值：`complex-path`。
  - `originalType` (string) — 可选，降级前类型（例如 `shape`）。

- text
  - `content` (string) — 必需。
  - `fontFamily` (string) — 可选；导入端应实现回退策略。
  - `fontSize` (number) — 可选（px）。
  - `fontWeight`/`fontStyle` (string) — 可选。
  - `color` (string) — 可选，HEX 或 rgba。
  - `lineHeight`/`letterSpacing` (number) — 可选。
  - `textAlign` (string) — 可选：`left|center|right|justify`。
  - `multiline` (bool) — 可选。
  - `rasterizedAssetId` (string) — 可选，若存在则指向 `assets` 中的图片，可用于像素保真回退。

- shape
  - `shapeType` (string) — 推荐，结构化识别结果（如 `rect`、`card`）。
  - `fill` (string|object) — 可为纯色或渐变定义；若为渐变，建议字段 `type`/`stops` 描述。
  - `stroke` (object) — `{ color, width, dash }`。
  - `cornerRadius` (number|object) — 可选。

- svg
  - `assetId` (string) — 推荐，或直接内联 `svg` 字符串。

- component
  - `componentType` (string) — 可选：用于导入端将视觉图层映射到内部组件类型（仅提示，**不包含运行逻辑**）。
  - `props` (object) — 可选，自由结构，供导入端在映射到组件时使用；导出端不应在此处写入执行代码。

其它元信息

- `mergeInfo` (object) — 可选，若导出器对多个装饰层合并为单一 asset，应记录合并来源：
  - `mergedIntoAssetId` (string)
  - `sourceLayerIds` (array[string])
  - `method` (string)

关于 `binding`

如前所述，**不建议在 `project.json` 中写入 `binding`（运行时数据绑定）**。若导出器在特定场景确需携带绑定引用，必须满足：

- 仅作为引用/提示（例如 `bindingId`），不得包含执行逻辑或敏感信息；
- 导入端必须将其视为“会话/运行时级别”配置并在单独的运行时存储（如 `importSession` 或 `runtimeBindings`）；
- 推荐的实践是让导出器输出一个独立的 `runtimeBindings.json`（可选），由导入端在确认后合并到运行时配置，而非写入 `project.json`。

示例（详尽示例）

assets 对象示例：

```json
"assets": {
  "asset_bg": { "path": "assets/bg.png", "mime":"image/png", "w":1920, "h":1080, "size":123456, "hash":"sha1:abcd" }
}
```

layer（文字层）示例：

```json
{
  "id":"layer_3",
  "name":"数值",
  "type":"text",
  "visible":true,
  "parentId":"layer_2",
  "zIndex":3,
  "layout":{ "x":80, "y":150, "w":300, "h":60 },
  "props":{ "content":"2,341,890", "fontFamily":"DINPro", "fontSize":48, "color":"#00E5FF" }
}
```

对接实现建议（解析器接入要点）

1. 版本校验：优先检查 `version`，若主版本不匹配应拒绝或进入兼容模式并记录警告。
2. 读取并解析 `assets`，校验 `path` 与 `hash`，建立 `assetId` → 本地路径 映射表。
3. 构建 layer map（以 `id` 为 key），并用 `parentId` 构建树；若 `children` 字段存在应做一致性验证。
4. 若 `flatIndex` 存在，使用其恢复准确 z-order；否则按 `layers` 数组顺序或 `zIndex` 排序。
5. 文本层处理：先用 `fontFamily`/`fontSize` 尝试渲染，若缺字体则记录告警并回退到指定回退策略；若存在 `rasterizedAssetId` 且用户选择像素保真模式，则加载并渲染图片替代文本。
6. shape 兼容策略：若 `type=shape` 且存在 `props.shapeType`，按结构化图层导入；若 `type=image` 且 `props.degraded=true`，按图片导入并标记“来自复杂路径降级”。
7. 错误/告警策略：对缺失 asset/字体/必要字段应生成可机读的 warn/error 列表供上层 UI 展示并决定是否继续导入。

交付文档说明：本节旨在为对接方提供完整的解析契约（字段、类型、约束、实现建议与示例），导入端可据此实现可靠的解析器和校验层。

---

如需我可：
- 将此精简版加入 `openspec` 变更；或
- 生成一个示例导出脚本（Node.js）来产生 `project.json` + `assets/` ZIP。