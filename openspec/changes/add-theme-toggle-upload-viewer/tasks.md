## 1. Upload 页面主题切换入口

- [x] 1.1 在 `src/views/Upload.vue` 接入 `useTheme`，读取当前 `theme` 并绑定 `toggleTheme`
- [x] 1.2 在 Upload 顶部区域新增主题切换按钮，补齐 `title` 与 `aria-label`
- [x] 1.3 为 Upload 主题切换按钮补充样式，确保亮暗主题下边框与悬停态可辨识

## 2. Viewer 页面主题切换入口

- [x] 2.1 在 `src/views/Viewer.vue` 接入 `useTheme`，读取当前 `theme` 并绑定 `toggleTheme`
- [x] 2.2 在 Viewer 顶部区域新增主题切换按钮，补齐 `title` 与 `aria-label`
- [x] 2.3 为 Viewer 主题切换按钮补充样式，确保与 Upload/Workbench 的交互视觉一致

## 3. 一致性与验证

- [x] 3.1 验证 Upload 与 Viewer 均可在 `dark/light` 之间切换且立即生效
- [x] 3.2 验证跨页面导航后主题状态保持一致，刷新后可从 localStorage 恢复
- [x] 3.3 运行构建或检查命令，确认本次改动未引入编译错误
