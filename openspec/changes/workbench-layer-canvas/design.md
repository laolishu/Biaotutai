## 上下文

标注工作台（Workbench.vue）已有三态模板（loading/error/normal）和 Pinia store 集成，但 normal 状态下使用的仍是 mock 数据：左侧图层面板硬编码了示例图层项，中间画布无背景图，热区未渲染，右侧属性面板无实际数据。

store（`src/store/index.js`）已有 `psd`（含 width/height/name）、`layers`（normalizeLayer 输出）、`isLoading`、`error` 字段，`parsePsd` action 已完整工作。ag-psd 已升级到最新版本，lenient 解析选项已配置。

约束：
- 不使用 canvas 元素，全部用 DOM + absolute 定位
- 不写死分辨率，坐标系统严格以 PSD 原始尺寸为准
- MVP 不做缩放（scale = 1），只做平移（pan）
- 图层坐标直接用 `layer.x, layer.y, layer.width, layer.height`

## 目标 / 非目标

**目标：**
- 从 store.layers 渲染真实图层树到左侧面板，支持递归展示（group/leaf）
- 画布 stage 尺寸等于 `store.psd.width × store.psd.height`
- 将上传的原始文件作为背景图渲染在 canvas-stage（ObjectURL 方案）
- 按 layer.x/y/width/height 在画布上渲染透明热区，hover 显示基础 tooltip
- 点击图层/热区后右侧属性面板实时展示选中图层属性
- store 新增 `selectedLayerId` + `selectLayer` 支持选中状态

**非目标：**
- 缩放（scale）功能留给 v1.1
- 多选、拖拽调整图层位置
- 图层可见性切换、锁定
- 导出 JSON（单独任务）
- Viewer.vue 连接（单独任务）

## 决策

### 背景图方案：ObjectURL vs base64

选择 **ObjectURL**（`URL.createObjectURL(file)`）：
- 直接在 Upload.vue 的 `parsePsd` 成功后，将 File 对象同时存入 store（`store.rawFile`），在 Workbench 消费为背景图 URL
- 不选 base64：大文件（>10MB）base64 会导致明显的内存膨胀和字符串序列化开销
- 不用 ag-psd 合成图：`skipCompositeImageData: true` 已跳过，重新开启会增加解析时间

### 图层树渲染：递归组件 vs 扁平列表

选择 **递归组件**（`LayerItem.vue`）：
- store.layers 是树形结构（group 含 children），递归组件天然匹配
- 不用扁平化处理：简化实现，MVP 层级不会太深

### 选中状态：store 全局 vs 本地 ref

选择 **store 全局**（`selectedLayerId` + `selectLayer`）：
- 图层面板、热区、属性面板三处均需共享同一选中状态
- 本地 ref 需要跨多组件事件传递，增加耦合

### Tooltip 实现：Element Plus ElTooltip vs 自实现

选择 **自实现简单 tooltip div**：
- El-Tooltip 在 absolute 定位画布中容易出现定位偏移
- MVP 只需展示 name/x/y/w/h，简单 div + CSS 即可满足

## 风险 / 权衡

- [ObjectURL 生命周期] store 存 rawFile 后，若用户多次上传，旧 ObjectURL 需手动 `URL.revokeObjectURL` 回收 → 在 `parsePsd` action 开始时先 revoke 旧 URL
- [大量图层性能] layers 超过数百条时递归渲染会卡顿 → MVP 不处理，v1.1 引入虚拟列表
- [热区层叠点击] 嵌套热区 z-index 冲突 → 使用 `pointer-events: none` 在子热区上，仅叶子节点响应点击
- [画布超出视口] PSD 宽高大于浏览器视口时需滚动 → canvas-container 已设 overflow: auto + el-scrollbar
