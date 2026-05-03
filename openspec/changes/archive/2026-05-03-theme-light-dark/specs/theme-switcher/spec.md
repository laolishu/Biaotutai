## 新增需求

### 需求:必须提供主题切换 composable
系统必须提供 `src/composables/useTheme.js`，导出响应式 `theme` 状态和 `toggleTheme()` 方法，负责读写 `localStorage` 并同步更新 `<html>` 的 `data-theme` 属性。

#### 场景: 首次访问无持久化数据
- **当** 用户首次访问，`localStorage` 中不存在主题偏好
- **那么** 默认主题必须为 `dark`，`data-theme` 属性必须设置为 `"dark"`

#### 场景: 持久化偏好恢复
- **当** 用户刷新或重新访问页面，且 `localStorage` 中存有 `biaotutai-theme` 键
- **那么** 必须读取该值并设置为当前主题，无需用户再次手动切换

#### 场景: 切换主题
- **当** 调用 `toggleTheme()`
- **那么** `theme.value` 必须在 `'dark'` 和 `'light'` 之间切换，`data-theme` 属性和 `localStorage` 必须同步更新

### 需求:主题必须在应用顶层初始化
`App.vue` 必须在 `setup` 中调用 `useTheme()`，以确保 `data-theme` 属性在任何子组件渲染前完成设置，禁止将初始化放置在子页面组件中。

#### 场景: 应用挂载时主题已生效
- **当** Vue 应用完成挂载
- **那么** `<html>` 上的 `data-theme` 属性必须已设置为正确的主题值

## 修改需求

## 移除需求
