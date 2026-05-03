## 1. 创建主题 token 文件

- [ ] 1.1 新建 `src/styles/themes.css`，定义 `:root[data-theme="dark"]` 下的全套 `--color-*` 变量（背景、面板、画布、悬停、激活、边框、强调、文字共 13 个 token）
- [ ] 1.2 在 `src/styles/themes.css` 中新增 `:root[data-theme="light"]` 选择器，定义仿 VS Code Light 风格的 13 个 token 映射
- [ ] 1.3 在 `src/styles/index.css` 中 `@import` 引入 `themes.css`，并在 `:root` 或 `html` 上设置 `data-theme="dark"` 作为静态默认值（由 JS 覆盖）

## 2. 创建 useTheme composable

- [ ] 2.1 新建 `src/composables/useTheme.js`，创建模块级单例 `theme` ref，初始值从 `localStorage.getItem('biaotutai-theme')` 读取，无值时默认为 `'dark'`
- [ ] 2.2 在 `useTheme.js` 中添加 `watchEffect`，每次 `theme.value` 变化时同步写入 `document.documentElement.dataset.theme` 和 `localStorage`
- [ ] 2.3 导出 `useTheme()` 函数，返回 `{ theme, toggleTheme }`，`toggleTheme` 实现 `dark ↔ light` 切换

## 3. 在 App.vue 初始化主题

- [ ] 3.1 在 `src/App.vue` 的 `<script setup>` 中引入并调用 `useTheme()`，确保应用挂载前 `data-theme` 已设置

## 4. 替换 Workbench.vue 中的硬编码颜色

- [ ] 4.1 将 `.wb`、`.wb-header`、`.wb-body` 等顶层容器的 `background` 替换为 `var(--color-bg-base)`
- [ ] 4.2 将 `.activity-bar`、`.activity-panel`、`.right-panel`、`.right-activity-bar` 的背景和边框色替换为对应 `var(--color-bg-panel)`、`var(--color-border)`
- [ ] 4.3 将 `.ab-btn` 悬停/激活状态的颜色替换为 `var(--color-bg-hover)`、`var(--color-bg-active)`、`var(--color-accent)`
- [ ] 4.4 将 `.canvas-area`、`.canvas-scroll`、`.canvas-stage` 背景色替换为 `var(--color-bg-canvas)`
- [ ] 4.5 将所有文字颜色（主文字、次要文字、强调文字）替换为 `var(--color-text-primary)`、`var(--color-text-secondary)`、`var(--color-text-accent)`
- [ ] 4.6 将 `box-shadow` 中的 `#00d4ff` 发光效果替换为 `var(--color-accent-glow)`
- [ ] 4.7 将 Element Plus 覆盖变量（`--el-button-text-color` 等）中的硬编码色值替换为 `var(--color-accent)`

## 5. 替换 Upload.vue 中的硬编码颜色

- [ ] 5.1 将页面背景色替换为 `var(--color-bg-base)`
- [ ] 5.2 将边框色、文字色、强调色替换为对应 CSS 变量
- [ ] 5.3 将 `box-shadow` 发光效果替换为 `var(--color-accent-glow)`

## 6. 替换 Viewer.vue 中的硬编码颜色

- [ ] 6.1 将页面背景色替换为 `var(--color-bg-base)`
- [ ] 6.2 将面板背景色替换为 `var(--color-bg-panel)`
- [ ] 6.3 将边框色、文字色、强调色替换为对应 CSS 变量
- [ ] 6.4 将 `box-shadow` 发光效果替换为 `var(--color-accent-glow)`

## 7. 在 Workbench Header 添加主题切换按钮

- [x] 7.1 在 `Workbench.vue` 的 `<script setup>` 中引入 `useTheme`，解构 `{ theme, toggleTheme }`
- [x] 7.2 在 `.hd-right` 区域新增一个主题切换 `el-button`，使用内联 SVG 图标：`theme === 'dark'` 时显示太阳图标，`theme === 'light'` 时显示月亮图标
- [x] 7.3 确认按钮点击后 `toggleTheme()` 正确触发，页面颜色随主题立即切换，按钮图标同步更新
