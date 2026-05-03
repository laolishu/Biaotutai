# 📘 标图台（biaotutai）PRD v1.4（坐标系统完善版）

---

# 一、产品概述

## 1.1 产品定位
标图台（biaotutai）是一款面向前端开发者 / 数据大屏开发者的**设计稿标注与解析工具**，用于：

> 将 PSD / 图片 转换为结构化标注数据，并辅助前端实现还原与代码生成。

---

## 1.2 核心价值

- 像素级标注（替代人工量尺寸）
- 自动解析设计稿结构
- 提供开发所需的几何与样式信息
- 作为 AI 代码生成的输入层

---

## 1.3 MVP目标

```text
上传设计稿 → 自动解析 → 标注查看 → 导出JSON

---

# 二、产品结构

```text
1. 上传页（Upload）
2. 标注工作台（Workbench）
3. 分享页（Viewer）
```

---

# 三、核心技术架构

---

## 3.1 技术栈

| 模块     | 技术                         |
| ------ | -------------------------- |
| 前端框架   | Vue3 + Composition API     |
| UI组件   | Element Plus（外围 UI）        |
| 样式     | TailwindCSS                |
| 状态管理   | Pinia                      |
| PSD解析  | ag-psd                     |
| 渲染引擎   | DOM + absolute + transform |
| 后端（可选） | Cloudflare Workers         |

---

## 3.2 UI分层模型（关键）

```text
UI组件层（Element）
+ 画布容器层（Viewport）
+ 标注渲染层（World）
```

---

## 3.3 核心技术原则

### ❗不使用 canvas

### ❗不写死分辨率（1920/3840）

---

# 四、坐标系统设计（核心模块）

---

## 4.1 坐标系统定义

> 标图台采用**动态坐标系统（World Coordinate）**

```text
CanvasWidth  = PSD.width
CanvasHeight = PSD.height
```

---

## 4.2 示例

| PSD尺寸     | 坐标系统 |
| --------- | ---- |
| 1920×1080 | 单屏   |
| 3840×1080 | 双屏   |
| 任意尺寸      | 自适应  |

---

## 4.3 数据来源

```js
const psd = readPsd(buffer)

canvasWidth  = psd.width
canvasHeight = psd.height
```

---

## 4.4 坐标规则（关键）

所有标注使用 PSD 原始坐标：

```js
x = layer.left
y = layer.top
width = layer.width
height = layer.height
```

---

👉 ❗不做缩放换算
👉 ❗不做比例适配

---

# 五、视口（Viewport）与世界坐标（World）

---

## 5.1 概念拆分

```text
World（世界）
= PSD原始尺寸（真实坐标）

Viewport（视口）
= 浏览器显示区域
```

---

## 5.2 DOM结构

```html
<div class="canvas-container">   <!-- viewport -->
  <div class="canvas-stage">     <!-- world -->
    <img />
    <div class="hotspot"></div>
  </div>
</div>
```

---

## 5.3 职责划分

| 层级        | 职责 |
| --------- | -- |
| container | 滚动 |
| stage     | 平移 |
| hotspot   | 标注 |

---

# 六、画布交互设计

---

## 6.1 平移（Pan）

```js
transform: translate(x, y)
```

---

## 6.2 滚动（Scroll）

* container 控制
* 支持横向 / 纵向滚动

---

## 6.3 缩放（Scale）【v1.1】

---

### 目的

适配大尺寸（如3840）

---

### 计算方式

```js
scale = min(
  viewportWidth / canvasWidth,
  viewportHeight / canvasHeight
)
```

---

### 应用

```css
transform: scale(scale) translate(x, y);
transform-origin: top left;
```

---

## ⚠️ 关键原则

| 项目 | 是否受scale影响 |
| -- | ---------- |
| 显示 | ✅          |
| 坐标 | ❌          |

---

---

# 七、页面设计

---

# 7.1 上传页（Upload）

---

## 功能

* 上传 PSD / 图片
* 进入工作台

---

## 结构

```text
居中上传卡片
 ├── 标题
 ├── 上传区域
 └── 格式说明
```

---

## 状态

* 默认
* hover
* 拖入
* 上传中
* 失败

---

## 风格

* 深色科技风
* 发光边框
* 网格背景

---

# 八、标注工作台（Workbench）

补充详细设计文档：

- [标注工作台详细设计](ui-design/workbench-detailed-design.md)

---

## 8.1 页面结构

```text
Header
 ├── 返回
 ├── 文件名
 └── 操作按钮

三栏布局：
[图层] [画布] [属性]
```

---

# 8.2 UI组件策略

---

## 使用 Element Plus

| 模块     | 用途     |
| ------ | ------ |
| Header | 按钮     |
| 左侧     | 列表     |
| 右侧     | 表单     |
| 弹窗     | Dialog |

---

## 自定义模块

| 模块      | 原因    |
| ------- | ----- |
| Canvas  | 坐标系统  |
| Hotspot | 精准定位  |
| Tooltip | 自定义定位 |

---

# 8.3 左侧图层面板

---

## 功能

* 展示图层树
* 选中同步

---

## UI

* el-scrollbar
* 列表

---

## 交互

* hover 高亮
* click 选中

---

# 8.4 中间画布（核心）

---

## 固定规则

```text
尺寸 = PSD尺寸
```

---

## hotspot渲染

```css
position: absolute;
left: x;
top: y;
width: w;
height: h;
```

---

## Tooltip

* 名称
* 尺寸
* 坐标
* 样式

👉 自实现（避免定位错误）

---

## 最大化

* 隐藏左右栏
* 全屏展示

---

# 8.5 右侧属性面板

---

## 功能

显示选中图层属性

---

## 数据

| 分类 | 字段              |
| -- | --------------- |
| 基础 | name/type       |
| 几何 | x/y/w/h         |
| 文本 | font/size/color |

---

## 交互

* 支持复制
* 实时更新

---

# 九、分享页（Viewer）

---

## 功能

* 查看标注
* hover提示

---

## 特点

* 只读
* 无编辑

---

# 十、PSD解析方案

---

## 工具

```js
import { readPsd } from 'ag-psd'
```

---

## 输出结构

```js
{
  id,
  name,
  type,
  x,
  y,
  width,
  height,
  style
}
```

---

## 数据流

```text
PSD → 解析 → 标准化 → store → 渲染
```

---

# 十一、性能设计

---

## 问题

* 大量图层

---

## 方案

* throttle mousemove
* 虚拟列表（后期）

---

# 十二、产品路线

---

## MVP

* 上传
* 标注查看
* 导出JSON

---

## v1.1

* 缩放
* 分享

---

## v1.2

* AI识别组件

---

## v2.0

* 自动生成代码

---

# 十三、关键结论

---

```text
标图台 = 动态坐标系统 + DOM标注引擎 + UI组件辅助
```

---

# 🚀 开发优先级

1. 坐标系统（动态PSD）
2. Canvas（平移+标注）
3. PSD解析
4. UI面板
5. 分享功能

---

```
```
