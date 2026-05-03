## 上下文

`LayerSearchResults.vue` 当前只处理单击（`click`）事件：选中图层。搜索框由 `LayerSearch.vue` 独立管理，清空依赖用户手动点击 × 或按 Esc。`LayerItem.vue` 已实现 `watch(selectedLayerId → scrollIntoView)`，即选中图层后图层树会自动滚动定位。

变更范围极小，只需在 `LayerSearchResults` 的列表项上增加 `dblclick` 处理，复用已有的 `store.selectLayer` + `store.setSearchQuery('')` 两个 action 即可。

## 目标 / 非目标

**目标：**
- 双击搜索结果项：选中图层 + 清空搜索 + 图层树自动定位（借助已有逻辑）

**非目标：**
- 不改变单击行为（仍仅选中图层）
- 不为搜索框或图层树添加新动画
- 不修改 store 数据结构

## 决策

### 使用 `dblclick` 而非单击后延迟

**理由**：双击语义上表示"深入操作"，与单击"选中"形成层次区分，符合常规 UI 惯例（如文件管理器）。延迟单击会引入体验延迟，不可取。

### 在 `LayerSearchResults.vue` 中直接处理，不新增 store action

复用 `store.selectLayer(id)` + `store.setSearchQuery('')` 的组合即可完成全部逻辑，无需封装新 action，保持 store 简洁。

## 风险 / 权衡

- [单击已触发选中，双击会触发两次 selectLayer] → 无副作用，重复调用 selectLayer 同一 id 不会引起问题
- [清空搜索后图层树切换有视觉跳动] → 属于正常交互，`scrollIntoView` 的 `behavior: 'smooth'` 已缓解
