## 上下文

项目当前有三个页面（Upload、Workbench、Viewer），各自的 `<style scoped>` 中存在大量重复的硬编码颜色值，唯一支持的主题是暗黑赛博朋克风格。目前没有任何 CSS 变量层、主题切换机制或持久化偏好。变更目标是在不破坏现有视觉风格的前提下，以最小改动引入主题系统，并新增一套仿 VS Code Light 的明亮主题。

## 目标 / 非目标

**目标：**
- 将所有颜色 token 提取到 `src/styles/themes.css` 中的 CSS 自定义属性
- 定义 `dark`（保持现有赛博朋克风格）和 `light`（仿 VS Code Light 风格）两套主题
- 通过 `data-theme` 属性在 `<html>` 上切换主题
- 提供 `useTheme` composable 封装切换逻辑并持久化到 `localStorage`
- 在 Workbench 的 Header 区域增加主题切换按钮
- 首次访问默认使用 `dark` 主题，或读取 `localStorage` 中的上次选择

**非目标：**
- 跟随系统 `prefers-color-scheme` 自动切换（可作为后续演进）
- 支持超过两套主题 / 自定义主题编辑
- 对 Element Plus 组件做深度主题覆盖（仅覆盖已用到的少量变量）
- 动画过渡效果（可后续加入）

## 决策

### 1. 使用 CSS 自定义属性 + `data-theme` 属性切换

**选择**：在 `:root[data-theme="dark"]` / `:root[data-theme="light"]` 下定义所有 token，各 `.vue` 文件 scoped style 中只引用 `var(--xxx)`。

**理由**：CSS 变量天然级联，无需 JS 运行时计算，切换只需改一个 HTML 属性，性能优异。对比方案（class-based 切换）功能等价但命名更语义化。

**Token 命名约定（双层）：**
```
--color-bg-base          # 最底层背景（页面/body）
--color-bg-panel         # 面板/侧边栏背景
--color-bg-canvas        # 画布/中央区域背景
--color-bg-hover         # 悬停状态背景
--color-bg-active        # 激活状态背景
--color-border           # 主边框色
--color-border-strong    # 强调边框色
--color-accent           # 主强调色（按钮/选中/高亮）
--color-accent-glow      # 强调色发光阴影（仅 dark 有效果，light 降低不透明度）
--color-text-primary     # 主要文字
--color-text-secondary   # 次要/说明文字
--color-text-muted       # 弱化文字/占位
--color-text-accent      # 强调色文字
```

**Dark 主题映射（保持现有赛博朋克风格）：**
```
--color-bg-base:       #0a0f1a
--color-bg-panel:      #0d1525
--color-bg-canvas:     #060b12
--color-bg-hover:      rgba(0,212,255,0.06)
--color-bg-active:     rgba(0,212,255,0.12)
--color-border:        rgba(0,212,255,0.08)
--color-border-strong: rgba(0,212,255,0.25)
--color-accent:        #00d4ff
--color-accent-glow:   rgba(0,212,255,0.4)
--color-text-primary:  #c8d8f0
--color-text-secondary:#6b8aad
--color-text-muted:    #3a5a7a
--color-text-accent:   #00d4ff
```

**Light 主题映射（仿 VS Code Light）：**
```
--color-bg-base:       #f3f3f3
--color-bg-panel:      #ffffff
--color-bg-canvas:     #ebebeb
--color-bg-hover:      rgba(0,120,212,0.06)
--color-bg-active:     rgba(0,120,212,0.12)
--color-border:        rgba(0,0,0,0.08)
--color-border-strong: rgba(0,0,0,0.18)
--color-accent:        #0078d4
--color-accent-glow:   rgba(0,120,212,0.25)
--color-text-primary:  #1f2328
--color-text-secondary:#57606a
--color-text-muted:    #8c959f
--color-text-accent:   #0078d4
```

### 2. `useTheme` composable 管理切换状态

```js
// src/composables/useTheme.js
import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'biaotutai-theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
```

`theme` 使用模块级单例 ref，确保全局状态一致。

### 3. 初始化在 `App.vue` 中执行

在 `App.vue` 的 `setup` 中调用 `useTheme()`，利用 `watchEffect` 的立即执行特性在挂载前同步设置 `data-theme`，避免主题闪烁。

### 4. 主题切换按钮仅置于 Workbench Header

Upload 和 Viewer 页面暂不提供切换入口，但主题状态全局生效（通过 CSS 变量）。Workbench Header 右侧区域增加一个图标按钮（太阳/月亮图标）。

## 风险 / 权衡

- **已有内联 style 的颜色**：如 Workbench 图层列表中的 `style="background:#1a2a4a"` 是静态演示数据，不是主题色，保持原样
- **Element Plus 覆盖范围有限**：仅通过 `--el-button-text-color` 等少量 CSS 变量覆盖已使用的组件，不做全量替换，避免引入不必要的复杂性
- **Light 主题的发光效果**：`box-shadow` 中的 `glow` 效果在 Light 模式下需要降低或使用阴影代替，避免视觉突兀
- **主题切换无过渡动画**：当前版本不添加 `transition: background-color` 全局过渡，避免动画性能问题，后续可按需加入
