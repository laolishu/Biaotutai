# 工作台 UI 统一风格指南（业务中立）

## 1. 概述

### 1.1 文档目的

本指南定义创作类工作台产品的统一前端风格与操作模式，用于在不同业务域下保持一致的使用体验、交互反馈与视觉层级。

### 1.2 适用范围

适用于采用"条目树/资源树 + 主视图 + 属性面板"结构的桌面端 Web 工作台。

适用对象：
- 前端开发
- 交互设计
- 视觉设计
- 评审与验收

### 1.3 叙述顺序（必须遵循）

本指南采用固定阅读路径：先上到下，再左到右。

1. 顶部 Header
2. 下方 Body
3. Body 内按左到右：左侧入口栏 -> 左侧内容栏 -> 中间主视图 -> 右侧内容栏 -> 右侧入口栏

## 2. 总体布局

### 2.1 五区 + 顶部结构

工作台采用"顶部一层 + 下方五区"结构：

- Header：全局操作与上下文信息
- Left Activity Bar：功能入口图标列（固定宽）
- Left Activity Panel：当前功能内容区（可收起、可调宽）
- Main View：主视图区（弹性占满）
- Right Activity Panel：辅助内容区（可收起、可调宽）
- Right Activity Bar：辅助入口图标列（固定宽）

结构示意：

```text
Header
└── Body (flex)
    ├── Left Activity Bar (fixed)
    ├── Left Activity Panel (resizable, collapsible)
    ├── Main View (flex: 1)
    ├── Right Activity Panel (resizable, collapsible)
    └── Right Activity Bar (fixed)
```

### 2.2 尺寸与伸缩规则

推荐基础约束：

- Header 高度：48px
- Activity Bar 宽度：44px（左右一致）
- 左侧 Panel 宽度范围：160~400px，默认展开
- 右侧 Panel 宽度范围：180~420px，默认可收起
- Main View：`flex: 1`，占据剩余空间

要求：
- 固定区不得随窗口变化发生比例拉伸。
- Main View 必须承担所有剩余空间变化。

## 3. 顶部区域（从上到下的第 1 层）

### 3.1 Header 操作分层

Header 右侧操作应按视觉优先级分层：

- 中性操作：辅助动作（适配、切换、视图控制）
- 主操作：完成性动作（导出、发布、保存）

### 3.2 Header 图标按钮规范

- 以图标为主展示方式，尺寸统一（推荐 28x28）
- 点击热区必须不少于可触达最小尺寸
- 边框、背景、悬停、激活反馈必须可感知
- 同组按钮间距保持一致

### 3.3 Header 可访问性要求

每个图标按钮必须包含：

- `title`
- `aria-label`

要求：
- 语义文本必须可独立表达动作含义。
- 不得仅依赖图标形状表达功能。

## 4. 下方主体（从上到下的第 2 层，内部从左到右）

### 4.1 左侧第 1 列：Left Activity Bar

左右两侧 Activity Bar 必须遵循同一三态切换协议：

1. 点击未激活入口：激活该入口并展开对应 Panel。
2. 点击已激活入口：收起对应 Panel，仅保留 Bar。
3. Panel 已收起时再次点击该入口：恢复展开并显示该入口内容。

要求：
- 左右两侧切换逻辑必须一致。
- 差异仅允许出现在承载内容，不允许出现在交互协议本身。

### 4.2 左侧第 2 列：Left Activity Panel

每侧 Panel 至少具备以下状态字段：

- `activePane`: 当前激活分页
- `isOpen`: 是否展开
- `width`: 当前宽度
- `isResizing`: 是否处于拖拽调宽中

动画规则：
- 展开/收起需要平滑过渡（推荐约 200ms）
- 拖拽过程中应临时关闭宽度过渡，避免滞后感

### 4.3 中间第 3 列：Main View

主视图区必须区分：

- Viewport：可见窗口区域（滚动容器）
- World：内容真实坐标空间（承载业务对象）

推荐最小结构：

```text
Main View
└── Viewport
    └── Stage/World
        ├── Background Layer
        ├── Content Layer
        └── Overlay Layer
```

要求：
- 定位型元素应位于统一坐标系。
- 交互浮层应与内容层分离，避免定位冲突。

### 4.4 右侧第 4 列：Right Activity Panel

右侧 Panel 规范与左侧保持一致，但需要强调：

- 默认状态可收起
- 承载辅助信息或属性配置
- 展开/收起动画、状态字段、可调整宽度规则与左侧一致

### 4.5 右侧第 5 列：Right Activity Bar

右侧入口栏与左侧入口栏遵循同一交互协议，仅承担入口承载角色。

要求：
- 固定宽度
- 图标交互反馈一致
- 语义命名与左侧入口体系平行

## 5. 调宽交互（针对左右 Panel）

### 5.1 通用规则

- 仅在 Panel 展开时显示拖拽把手
- `mousedown` 进入调宽状态
- `mousemove` 计算宽度并执行 `clamp(min, max)`
- `mouseup` 退出调宽状态并解绑监听

### 5.2 左右方向差异

- 左侧 Panel：宽度随指针向右移动增大
- 右侧 Panel：宽度随指针向左移动增大

要求：
- 右侧 Resize Handle 位于右侧 Panel 的左边缘。
- 必须明确限制最小/最大宽度，禁止无限扩展。

## 6. 视觉 Token 策略

### 6.1 原则

视觉规范必须使用 CSS 自定义属性 token 名称表达语义，禁止在框架规范中写死色值。

### 6.2 推荐 token 语义

- `--color-bg-base`：应用基础背景
- `--color-bg-panel`：侧边 Panel 背景
- `--color-bg-canvas`：主视图背景
- `--color-bg-hover`：悬停背景
- `--color-bg-active`：激活背景
- `--color-border`：常规边框
- `--color-border-strong`：强调边框
- `--color-text-primary`：主文本
- `--color-text-secondary`：次文本
- `--color-accent`：强调色
- `--color-accent-weak`：弱强调背景

要求：
- 亮/暗主题均必须保证边框与悬停态可辨识。
- 主题切换时仅切换 token 值，不改动组件结构与交互。

## 7. 多产品业务映射（按上到下、左到右）

| 框架区域 | 产品 A：标图台 | 产品 B：大屏设计器 |
| --- | --- | --- |
| Header 右侧操作 | 适配、最大化、主题切换、导出 | 适配、预览、主题切换、发布 |
| Left Activity Bar | 入口切换（图层、搜索） | 入口切换（组件、资源） |
| Left Activity Panel | 图层树、搜索结果 | 组件树、资源库 |
| Main View | 标注主视图 | 画布主视图 |
| Right Activity Panel | 属性详情、检查 | 属性配置、样式配置 |
| Right Activity Bar | 属性/检查入口 | 属性/样式入口 |

说明：
- 两个产品业务内容不同，但框架交互与视觉层级保持一致。
- 业务差异应体现在内容与命令，不体现在基础布局协议。

## 8. 接入约定

### 8.1 禁止修改（必须一致）

- 五区布局结构
- Activity Bar 三态切换协议
- Panel 调宽交互模型（含 clamp）
- Header 图标按钮可访问性语义要求
- token 驱动的视觉策略

### 8.2 允许定制（可业务化）

- 各 Panel 的分页数量与内容
- 主视图承载对象与业务工具集
- 主操作动作名称（例如导出/发布）
- token 具体取值（品牌化）

### 8.3 建议扩展路径

1. 先复用框架级布局与状态机。
2. 再替换区域内容与业务命令。
3. 最后完成品牌主题 token 配置与验收。

## 9. 验收清单

- 是否按"先 Header、后 Body；Body 内从左到右"组织实现
- 布局是否满足五区结构与固定/弹性规则
- 左右 Activity Bar 是否遵循同一三态协议
- Panel 拖拽是否有边界且方向正确
- Header 图标按钮是否具备 `title` 与 `aria-label`
- 视觉是否通过 token 管理且亮/暗态可辨识
- 映射表是否可支撑至少两个产品接入
