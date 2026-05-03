## 为什么

当前右侧属性栏对文本图层的字体、字号、颜色展示缺乏明确规范定义，导致不同实现阶段可能出现字段缺失、显示不一致或空值处理不统一。补齐文本样式属性展示规范，可以保证文本图层信息可读、可核对，提升标注效率与交付一致性。

## 变更内容

- 为 text 类型图层明确规定右侧属性栏必须显示字体、字号、颜色三类样式属性
- 定义文本样式属性的缺失值与异常值处理策略（如缺失时显示占位）
- 保持非 text 类型图层不显示该文本样式区块

## 功能 (Capabilities)

### 新增功能
- `text-style-properties`: 右侧属性栏文本图层样式信息展示能力（字体、字号、颜色）

### 修改功能
- `right-activity-bar`: 属性分页在 text 类型图层下的展示行为补充与约束

## 影响

- src/views/Workbench.vue：属性面板增加 text 样式区块的稳定渲染与降级处理
- src/utils/normalizeLayer.js：确保 text 图层样式字段标准化（fontFamily/fontSize/color）
- src/store/index.js：selectedLayer 在 text 类型场景提供稳定可消费的样式字段
