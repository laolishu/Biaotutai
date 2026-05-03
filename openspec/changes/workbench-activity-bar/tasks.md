## 1. 数据结构与响应式状态

- [x] 1.1 在 `<script setup>` 中定义 `activePanel`（ref，默认 `'layers'`）、`isPanelOpen`（ref，默认 `true`）、`panelWidth`（ref，默认 `220`）
- [x] 1.2 定义 `panels` 数组常量，包含各分页的 id、图标 SVG、tooltip 名称（初版：layers、search）

## 2. Activity Bar 结构与样式

- [x] 2.1 在模板中新增 `.activity-bar` 容器（44px 固定宽，纵向 flex），替换原 `.panel-layers` 位置
- [x] 2.2 用 `v-for` 渲染图标按钮，绑定 `activePanel === item.id` 的激活 class
- [x] 2.3 编写 `.activity-bar`、`.ab-btn`、`.ab-btn.active` scoped CSS，保持深色科技风格（`#0d1525` 背景、`#00d4ff` 激活色）

## 3. Activity Panel 结构与样式

- [x] 3.1 新增 `.activity-panel` 容器，`:style="{ width: isPanelOpen ? panelWidth + 'px' : '0' }"`，添加 `overflow: hidden` 和 `transition: width 0.2s ease`
- [x] 3.2 在面板内用 `v-if / v-show` 根据 `activePanel` 切换各分页内容（图层列表复用原有 `el-scrollbar` + 图层列表 DOM；搜索分页为占位文字）
- [x] 3.3 编写 `.activity-panel` scoped CSS（border-right、background 与原面板一致）

## 4. 点击图标切换 / 收起逻辑

- [x] 4.1 实现 `handlePanelToggle(id)` 函数：若 `activePanel !== id` 则切换并确保 `isPanelOpen = true`；若相同则取反 `isPanelOpen`
- [x] 4.2 图标按钮绑定 `@click="handlePanelToggle(item.id)"`
- [x] 4.3 验证：点击未激活图标 → 面板展开切换内容；点击已激活图标 → 面板收起，画布扩展

## 5. 拖拽调整宽度

- [x] 5.1 在 `.activity-panel` 右侧添加 `.resize-handle` 元素（4px 宽透明把手，hover 时显示 `#00d4ff` 细线）
- [x] 5.2 实现 `startResize(e)` 函数：记录 `startX` 和 `startWidth`，在 `document` 上监听 `mousemove` → `doResize` 和 `mouseup` → `stopResize`
- [x] 5.3 `doResize(e)` 中计算新宽度 `= startWidth + (e.clientX - startX)`，clamp 到 `[160, 400]`，拖拽期间临时移除 panel 的 transition
- [x] 5.4 `stopResize()` 中移除 document 事件监听，恢复 transition，将最终宽度写入 `panelWidth`
- [x] 5.5 在 `onUnmounted` 中清理残留的 document 事件监听，防止内存泄漏

## 6. 收尾与验证

- [x] 6.1 删除旧的 `.panel-layers` 相关 scoped CSS（`.panel`、`.panel-layers`、`.panel-count`、`.layer-list` 等，若已被新结构替代）
- [x] 6.2 确认整体三栏布局（activity-bar + activity-panel + canvas + props-panel）在 `wb-body` flex 容器中正确排列
- [x] 6.3 手动测试：图标切换、收起/展开动画、拖拽 resize 边界值（160px / 400px）
