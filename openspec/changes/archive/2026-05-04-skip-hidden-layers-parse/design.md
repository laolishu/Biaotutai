## 上下文

当前 `parsePsd` 在 `readPsd` 后直接将 PSD 树传给 `normalizeLayer`，再写入 `store.layers`。ag-psd 会在节点上保留 `hidden` 字段，表明该图层在 Photoshop 中为隐藏状态。对大量隐藏图层的 PSD，后端解析和前端处理会增加不必要开销。

## 目标 / 非目标

**目标：**
- 在标准化前可选地从 PSD 树中过滤 `hidden: true` 的节点和只包含隐藏子项的分组，降低前端数据体积与 UI 干扰

**非目标：**
- 不在磁盘或原始 PSD buffer 上做破坏性修改；原始 `psdData` 保留
- 不改变图层唯一 ID 的生成策略

## 决策

### 1) 过滤位置
在 `src/store/index.js::parsePsd` 中，`readPsd` 后、`normalizeLayer` 前做过滤。理由：局部改动最小，影响面可控。

### 2) 过滤策略
实现 `filterHiddenNodes(node)` 函数：
- 若节点有 `children`：递归过滤子节点，若过滤后 `children` 为空且节点自身 `hidden===true`，则移除此节点；否则保留且替换为过滤后的 children
- 若叶子节点且 `hidden===true`：移除

### 3) 开关与 API
- 添加 `options.skipHiddenLayers` 参数到 `parsePsd(file, options = {})`，默认 `false`
- 同时在导入 UI 提供复选框"导入时忽略隐藏图层"，以便临时启用

### 4) 回退与兼容
- `normalizeLayer` 不修改；当过滤开启时 `normalizeLayer` 接收更小的树并正常工作
- 记录解析前后的图层数用于 telemetry（可选）

## 风险 / 权衡

- [误删正在使用的隐藏图层] → 通过默认关闭、UI 明显提示和可选开关缓解
- [分组边界语义] → 过滤策略保留含可见子项的分组，避免丢失可见子图层

## Migration Plan

1. 实现 `filterHiddenNodes` 并在 `parsePsd` 中加入 `options.skipHiddenLayers` 分支
2. 在导入界面添加复选框（默认 false）并传参给 `parsePsd`
3. 测试若干含隐藏图层的 PSD 文件，验证图层树、搜索和定位行为一致

## Open Questions

- 是否需要把过滤作为用户偏好持久化（localStorage）？当前建议只在会话级别控制。