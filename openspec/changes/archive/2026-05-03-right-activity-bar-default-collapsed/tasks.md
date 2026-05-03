## 1. 右侧状态模型与配置

- [x] 1.1 在 `src/views/Workbench.vue` 新增右侧状态：`rightActivePanel`、`isRightPanelOpen`、`rightPanelWidth`、`isRightResizing`
- [x] 1.2 定义右侧分页配置数组（`properties`、`inspect`），包含 id、label、图标信息

## 2. 右侧布局改造

- [x] 2.1 将现有固定右侧属性面板拆分为 `right-panel-shell`
- [x] 2.2 在 shell 内按顺序放置：右侧内容面板（左）+ 右侧图标列（右）
- [x] 2.3 设置右侧图标列固定宽度并锚定在最右侧

## 3. 默认隐藏与切换交互

- [x] 3.1 实现右侧内容面板默认隐藏（初始 `isRightPanelOpen = false`）
- [x] 3.2 实现 `handleRightPanelToggle(id)`：点击未激活图标展开并切换；点击已激活图标收起
- [x] 3.3 在模板中为右侧图标按钮绑定激活态 class 与点击事件
- [x] 3.4 确保右侧展开后恢复最近一次宽度

## 4. 右侧分页内容

- [x] 4.1 将原属性区内容迁移到右侧 `properties` 分页容器
- [x] 4.2 新增 `inspect` 分页占位内容（静态文本）
- [x] 4.3 保持 `el-button` 样式与原页面视觉风格一致

## 5. 右侧拖拽调宽

- [x] 5.1 在右侧内容面板左边界增加 `right-resize-handle`
- [x] 5.2 实现 `startRightResize`、`doRightResize`、`stopRightResize` 事件链
- [x] 5.3 在拖拽计算中对宽度执行边界限制（180 到 420）
- [x] 5.4 拖拽期间关闭宽度过渡，结束后恢复并清理 document 监听
- [x] 5.5 在 `onUnmounted` 中确保右侧拖拽监听清理

## 6. 样式与验收

- [x] 6.1 补充右侧图标列、右侧面板、右侧拖拽把手的 scoped CSS
- [x] 6.2 验证右侧默认仅图标列可见，点击图标可展开/收起
- [x] 6.3 验证右侧拖拽边界值（180、420）
- [x] 6.4 执行构建检查，确保无新增编译错误
