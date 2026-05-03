# 标注工作台（Workbench）详细设计

## 1. 文档目的

本文件用于补充 PRD 中第八章“标注工作台”的实现级设计，明确页面结构、交互行为、状态模型与样式约束，作为 UI 实现与联调依据。

## 2. 设计范围

包含以下模块：

- 顶部 Header 区域
- 左侧 Activity Bar + Activity Panel（可收起、可拖拽宽度，默认展开）
- 中间 Canvas 视口与热点层
- 右侧 Activity Panel + Activity Bar（可收起、可拖拽宽度，**默认收起**）
- 底部状态栏

不包含以下内容：

- PSD 解析流程与数据接入
- 后端接口与分享鉴权
- 业务级搜索能力（仅保留 UI 占位）

## 3. 页面布局

### 3.1 总体布局

工作台采用横向五区布局：

- 左 1：左侧 Activity Bar（固定 44px）
- 左 2：左侧 Activity Panel（可调宽，160 到 400，默认展开 220px）
- 中：Canvas 区域（flex: 1，自动填充剩余空间）
- 右 1：右侧 Activity Panel（可调宽，180 到 420，**默认收起**）
- 右 2：右侧 Activity Bar（固定 44px，位于最右侧）

### 3.2 结构示意

```text
Header (48px)
└── Body (flex)
    ├── .activity-shell
    │   ├── .activity-bar (44px fixed)
    │   └── .activity-panel (160-400px, collapsible, default open)
    ├── .canvas-area (flex:1)
    └── .right-panel-shell
        ├── .right-panel (180-420px, collapsible, DEFAULT CLOSED)
        └── .right-activity-bar (44px fixed, far right)
```

布局比例示意（展开状态）：

```text
[AB 44px][Panel 160-400px][  Canvas flex:1  ][R-Panel 180-420px][RAB 44px]
```

## 4. 左侧 Activity 区详细设计

### 4.1 Activity Bar（图标列）

目标：提供类似 VS Code / IDEA 的功能入口，支持分页切换。

设计规则：

- 宽度固定 44px
- 纵向图标按钮，每个按钮代表一个分页
- 当前版本分页：
  - `layers`：图层列表
  - `search`：搜索占位
- 图标按钮状态：默认 / hover / active

交互规则：

- 点击“未激活图标”：切换到对应分页，并展开 Activity Panel
- 点击“已激活图标”：收起 Activity Panel（仅保留图标列）
- 收起后再次点击该图标：恢复展开并展示该分页

### 4.2 Activity Panel（内容区）

目标：承载图层面板与后续扩展分页。

设计规则：

- 展开宽度来自状态值 `panelWidth`
- 宽度范围限制：160 到 400
- 收起时宽度置为 0，边框隐藏
- 展开/收起需有平滑动画（约 200ms）

当前分页内容：

- `layers`：图层树（使用 `el-scrollbar`）
- `search`：搜索区域占位（静态说明）

### 4.3 拖拽调宽（Resize Handle）

目标：支持用户按需调整左侧面板宽度。

交互规则：

- 仅在面板展开状态显示拖拽把手
- 鼠标按下把手后进入 resizing 状态
- `mousemove` 驱动宽度变化：
  - `next = startWidth + (clientX - startX)`
  - 对 `next` 执行 clamp，限制在 160 到 400
- `mouseup` 停止拖拽并解除事件监听
- 拖拽中临时关闭宽度过渡，避免视觉延迟

## 5. 中间画布区设计

### 5.1 坐标规则

沿用 PRD 定义：

- 世界坐标即 PSD 原始坐标
- hotspot 使用绝对定位：

```css
position: absolute;
left: x;
top: y;
width: w;
height: h;
```

### 5.2 视图构成

- 顶部标尺（ruler）
- 中部可滚动视口（viewport）
- 内部舞台层（stage）
- hotspot 标注层
- 底部状态栏

## 6. 右侧 Activity 区详细设计

### 6.1 Right Activity Bar（图标列）

目标：提供右侧功能面板入口，图标列位于最右侧（紧贴窗口右边缘）。

设计规则：

- 宽度固定 44px，位于 `.right-panel-shell` 最右侧
- 当前分页：
  - `properties`：属性面板
  - `inspect`：检查面板（占位）
- 图标按钮状态：默认 / hover / active

交互规则（与左侧对称）：

- 点击"未激活图标"：切换到对应分页，并展开右侧面板
- 点击"已激活图标"：收起右侧面板（仅保留图标列）
- 收起后再次点击该图标：恢复展开并展示该分页

### 6.2 Right Activity Panel（内容区）

目标：承载属性面板与检查面板。

设计规则：

- 展开宽度来自状态值 `rightPanelWidth`
- 宽度范围限制：180 到 420
- **默认状态：收起（`isRightPanelOpen = false`）**
- 收起时宽度置为 0，边框隐藏
- 展开/收起需有平滑动画（约 200ms）

当前分页内容：

- `properties`：属性面板，展示基础（name/type）、几何（x/y/w/h）、样式（填充/透明度）字段；含"复制 JSON"按钮
- `inspect`：检查区域占位（静态说明）

### 6.3 右侧拖拽调宽（Resize Handle）

目标：支持用户按需调整右侧面板宽度。

交互规则：

- 拖拽把手位于右侧面板**左侧边缘**（`.right-resize-handle`）
- 仅在面板展开状态显示
- `mousemove` 驱动宽度变化（方向与左侧相反）：
  - `next = startWidth - (clientX - startX)`
  - 对 `next` 执行 clamp，限制在 180 到 420
- `mouseup` 停止拖拽并解除事件监听
- 拖拽中临时关闭宽度过渡，避免视觉延迟

## 7. 视觉规范（当前实现）

- 主背景：`#0a0f1a`
- 面板背景：`#0d1525`
- 画布背景：`#060b12`
- 主题强调色：`#00d4ff`
- 边框色：`rgba(0, 212, 255, 0.08 到 0.4)`
- 字体：`JetBrains Mono`, `Fira Code`, monospace

## 8. 状态模型

### 8.1 左侧状态

| 状态 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `activePanel` | `'layers' \| 'search'` | `'layers'` | 当前激活的左侧分页 |
| `isPanelOpen` | `boolean` | `true` | 左侧面板展开状态 |
| `panelWidth` | `number` | `220` | 左侧面板当前宽度（px）|
| `isResizing` | `boolean` | `false` | 左侧面板是否处于拖拽调宽中 |

### 8.2 右侧状态

| 状态 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rightActivePanel` | `'properties' \| 'inspect'` | `'properties'` | 当前激活的右侧分页 |
| `isRightPanelOpen` | `boolean` | **`false`** | 右侧面板展开状态（默认收起）|
| `rightPanelWidth` | `number` | `260` | 右侧面板当前宽度（px）|
| `isRightResizing` | `boolean` | `false` | 右侧面板是否处于拖拽调宽中 |

### 8.3 关键行为

左侧：

- `handlePanelToggle(id)`：分页切换/收起展开
- `startResize(event)` / `doResize(event)` / `stopResize()`：左侧拖拽调宽生命周期

右侧：

- `handleRightPanelToggle(id)`：右侧分页切换/收起展开
- `startRightResize(event)` / `doRightResize(event)` / `stopRightResize()`：右侧拖拽调宽生命周期

共通：

- `onUnmounted`：统一清理左右两侧 `mousemove`/`mouseup` 事件监听，防止内存泄漏

## 9. 交互验收标准

### 左侧 Activity Bar

- 图标分页可切换，激活态正确
- 点击已激活图标可收起面板，画布自动扩展
- 再次点击可恢复展开并显示最近宽度
- 拖拽宽度最小不小于 160、最大不超过 400
- 拖拽释放后事件监听被正确清理

### 右侧 Activity Bar

- 页面初始加载时右侧面板处于**收起状态**（不可见）
- 右侧图标列始终显示于页面最右侧（44px 固定宽度）
- 点击右侧图标可展开对应分页面板
- 点击已激活图标可收起右侧面板
- 右侧拖拽宽度最小不小于 180、最大不超过 420
- 左右两侧事件监听在组件销毁时均被正确清理

## 10. 后续演进建议

- 将左右 Activity Bar / Activity Panel 抽离为统一的 `ActivityShell` 组件，通过 `placement: 'left' | 'right'` 配置
- 将 `panelWidth` / `rightPanelWidth` 持久化到 `localStorage`
- 搜索分页接入真实图层过滤
- 图层树与属性面板接入 Pinia，形成双向联动
- 支持键盘快捷键切换 Activity Bar 分页（参考 VS Code `Cmd+Shift+E` 等）
