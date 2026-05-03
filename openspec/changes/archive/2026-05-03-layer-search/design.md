## 上下文

图层面板当前使用 `LayerItem.vue` 递归渲染 `store.layers` 树形结构，`Workbench.vue` 已有一个"搜索"面板占位（`activePanel === 'search'`），但功能未实现，只是展示说明文字。

store 已有 `layers`（树形数组）、`selectedLayerId`、`selectLayer(id)` 等基础状态。图层搜索需要在 store 层做递归过滤，在 UI 层切换两种视图模式（树视图 vs 扁平搜索结果）。

## 目标 / 非目标

**目标：**
- 在图层面板头部嵌入搜索输入框（始终可见，不依赖活动面板切换）
- 输入关键词后实时（无延迟）过滤图层名称，大小写不敏感
- 搜索有结果时切换为扁平结果列表，高亮匹配关键词片段
- 搜索无结果时展示空状态提示
- 支持 Esc 清空搜索，点击 × 按钮清空搜索
- 点击搜索结果中的图层同步选中状态（与图层树行为一致）

**非目标：**
- 正则表达式或高级过滤（仅支持字符串子串匹配）
- 搜索历史记录
- 按类型/属性过滤
- 搜索结果排序

## 决策

### 搜索状态存储位置：store vs 组件本地 ref

选择 **store**（新增 `searchQuery` 状态）：
- `searchResults` getter 需要访问 `layers`，放在 store 更自然
- 将来若需要在其他地方访问搜索状态（如状态栏显示匹配数），无需跨组件传递
- 不选本地 ref：computed 里递归过滤 layers 需要跨组件共享

### 搜索输入框位置：面板头部 vs 独立活动栏图标

选择 **嵌入图层面板头部**（`panel-head` 内）：
- 搜索是图层面板的子功能，不需要独占一个活动栏入口
- 现有"搜索"活动栏按钮（`activePanel === 'search'`）可重新用于切换到"图层搜索已激活"状态（或直接移除此按钮）
- 输入框常驻，减少点击操作

### 高亮实现：v-html vs 组件切片渲染

选择 **v-html + `dangerouslySetInnerHTML` 等价方案**，用 `String.replace` 插入 `<mark>` 标签：
- 图层名称来自 PSD 解析，不包含用户输入，无 XSS 风险
- 实现简单，不需要额外的 DOM 切片组件

### 搜索结果组件：独立 `LayerSearchResults.vue` vs 扩展 `LayerItem.vue`

选择 **独立 `LayerSearchResults.vue`**：
- 搜索结果为扁平列表（无树缩进），与 LayerItem 的递归展示逻辑不同
- 独立组件职责清晰，不污染 LayerItem

## 风险 / 权衡

- [大量图层时 computed 性能] 每次 keystroke 触发全树递归过滤 → 层级通常 ≤ 5 层、节点 ≤ 500，无需 debounce，实测影响极小；若未来需要可加 100ms debounce
- [v-html 安全] 图层名来自 PSD 文件，非用户直接输入，但仍需在高亮函数中对搜索词做 HTML 转义 → 在 `highlightMatch` 中对 `query` 转义特殊字符
