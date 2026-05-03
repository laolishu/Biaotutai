## 为什么

目前项目中所有颜色值（背景色、强调色、边框色等）硬编码在各 `.vue` 文件的 `<style scoped>` 块中，三个页面（Upload、Workbench、Viewer）存在大量重复值，且只支持单一的暗黑赛博朋克配色方案。随着产品走向正式发布，需要支持明亮/暗黑两套主题，并提升配色的可维护性，因此需要将配色方案从各组件中抽离，统一为 CSS 自定义属性（CSS Variables），并提供亮色与暗色两套主题定义。

## 变更内容

- **新增** `src/styles/themes.css`：定义 `:root[data-theme="dark"]` 和 `:root[data-theme="light"]` 两套 CSS 变量，覆盖所有背景色、面板色、画布色、强调色、边框色、文字色
- **新增** `src/composables/useTheme.ts`（或 `.js`）：封装主题切换逻辑，提供 `theme` 响应式状态和 `toggleTheme()` 方法，负责读写 `localStorage` 并更新 `data-theme` 属性
- **修改** `src/styles/index.css`：引入 `themes.css`，设置默认主题
- **修改** `src/views/Upload.vue`、`Workbench.vue`、`Viewer.vue`：将硬编码颜色值替换为对应 CSS 变量
- **修改** `src/App.vue` 或布局层：在顶层挂载主题 composable，在 Header 区域提供主题切换按钮（仅 Workbench 页面展示）

明亮主题参考 VS Code Light 风格（白底、浅灰面板、蓝色强调色）；暗黑主题保留现有赛博朋克风格（深蓝底色、青色强调色），作为默认主题。

## 功能 (Capabilities)

### 新增功能
- `theme-tokens`：定义全局 CSS 变量 token，提供暗色与亮色两套主题变量集，支持通过 `data-theme` 属性切换
- `theme-switcher`：主题切换 composable，封装切换逻辑、持久化到 localStorage、初始化加载偏好

### 修改功能
- `workbench-activity-bar`：Workbench 页面头部新增主题切换入口按钮（属于 UI 需求变化，非纯实现细节）

## 影响

- `src/styles/index.css`：引入主题变量文件
- `src/styles/themes.css`：新增文件
- `src/composables/useTheme.js`：新增文件
- `src/views/Upload.vue`、`src/views/Workbench.vue`、`src/views/Viewer.vue`：scoped style 中的硬编码颜色值全部替换为 CSS 变量
- `src/App.vue`：初始化主题
