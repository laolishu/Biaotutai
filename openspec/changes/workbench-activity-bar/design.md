## 上下文

工作台页面（`src/views/Workbench.vue`）目前左侧是一个固定宽度 220px 的单一图层面板，使用自定义 scoped CSS 实现。本次变更仅涉及该文件的左侧区域，不引入新的文件或第三方依赖，在现有 Vue 3 Composition API + scoped CSS 技术栈内完成。

## 目标 / 非目标

**目标：**
- 将左侧面板拆分为 Activity Bar（44px 固定宽度图标列）+ Activity Panel（可变宽度内容区）
- 点击图标切换对应面板内容；再次点击已激活图标时收起 Activity Panel
- Activity Panel 右边框支持鼠标拖拽调整宽度（160px ~ 400px）
- 收起/展开有过渡动画，收起时画布区域自动占满剩余空间
- 保持现有深色科技风格与 Element Plus `el-scrollbar` 用法不变

**非目标：**
- 不引入外部 resize 库，用原生 mousedown/mousemove/mouseup 实现
- 不持久化面板宽度到 localStorage（本期不做）
- 不实现搜索分页的实际功能，仅留占位视图
- 不改动画布区域、属性面板、Header 任何逻辑

## 决策

**决策 1：全部在 Workbench.vue 内实现，不拆分子组件**
- 理由：当前项目为静态 UI 阶段，组件拆分会增加上下文切换成本，功能局限于单文件可控范围内。待功能稳定后再提取为 `ActivityBar.vue`。

**决策 2：拖拽 resize 用原生事件而非 CSS `resize` 属性**
- 理由：CSS `resize` 无法精确控制最小/最大值及视觉把手样式；原生 mousedown→mousemove→mouseup 在 document 上监听，可避免鼠标移出边框时丢失事件。

**决策 3：收起动画用 CSS `width` transition，不用 Vue `<Transition>`**
- 理由：Activity Panel 宽度由 JS 变量驱动，直接对 `width` 加 `transition: width 0.2s ease` 即可；避免引入 v-if 导致组件状态重置。

## 风险 / 权衡

- [拖拽性能] 频繁更新 `panelWidth` ref 触发重渲染 → 缓解：`mousedown` 时用 CSS 变量直接操作 style，`mouseup` 再写入 ref（或节流 mousemove）
- [过渡闪烁] 拖拽时 `transition` 会造成滞后感 → 缓解：拖拽开始时临时移除 transition class，拖拽结束后恢复
