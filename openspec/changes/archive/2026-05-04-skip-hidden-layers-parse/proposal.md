## 为什么

当 PSD 文件包含大量被设计师标记为隐藏的图层时，左侧图层面板和搜索结果会被大量无关项淹没，增加查找和定位成本。更早在解析阶段就剔除这些隐藏图层，可以减少后续的数据规模和渲染开销，提升工作台响应速度和可用性。

## 变更内容

- 在 PSD 解析流程中（`parsePsd` / `readPsd` 后、`normalizeLayer` 前）提供一个可配置的预过滤步骤：移除 `hidden: true` 的图层节点与仅包含隐藏子项的分组
- 新增可选开关（非默认）以启用“解析时忽略隐藏图层”，可从 UI（导入对话或设置）或 CLI（批处理）控制
- 保留原始 PSD 数据（不破坏 psd buffer），此变更仅影响解析后的标准化输出用于前端渲染和列表展示

## 功能 (Capabilities)

### 新增功能

- `skip-hidden-layers-parse`: 解析阶段过滤隐藏图层，减少前端图层数据量

### 修改功能

- `parsePsd` 数据流：在标准化前插入 `filterHiddenNodes` 步骤

## 影响

- `src/store/index.js`：`parsePsd` 增加参数或读取配置以控制是否启用过滤
- `src/utils/normalizeLayer.js`：不强制改变，但需保证接口兼容过滤后的节点结构
- UI：导入或设置中新增开关（小改动）
