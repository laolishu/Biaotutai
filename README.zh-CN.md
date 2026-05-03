# 标图台（Biaotutai）

面向前端开发者与数据大屏开发者的设计稿标注与解析平台。

标图台将 PSD/图片转换为结构化标注数据，帮助团队实现像素级还原与 AI 辅助代码生成。

English version: [README.md](README.md)

## 概述

标图台聚焦一条高效流程：

上传设计稿 -> 自动解析结构 -> 查看标注 -> 导出 JSON

项目基于动态坐标系统设计，不写死 1920x1080 或 3840x1080，可适配任意 PSD 尺寸。

## 核心能力

- 像素级标注数据，替代人工量尺寸
- 基于 ag-psd 的 PSD 图层自动解析
- 提供前端实现所需的几何与样式信息
- 导出结构化 JSON，作为 AI 代码生成输入
- 提供只读 Viewer 页面用于分享标注

## 产品结构

- Upload：上传 PSD/图片并进入标注流程
- Workbench：图层树 + 画布 + 属性面板
- Viewer：只读分享页，用于查看标注

## 技术架构

### 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端框架 | Vue 3 + Composition API |
| UI 组件 | Element Plus |
| 样式 | Tailwind CSS |
| 状态管理 | Pinia |
| PSD 解析 | ag-psd |
| 渲染引擎 | DOM + absolute + transform |
| 后端（可选） | Cloudflare Workers |

### 分层模型

- UI 组件层
- Viewport 视口容器层
- World 标注渲染层

### 坐标系统原则

- 不使用 canvas 作为主渲染方案
- 不写死目标分辨率
- World 尺寸始终等于 PSD 宽高
- 标注坐标直接使用 PSD 图层原始值

## 快速开始

### 环境要求

- Node.js 20+
- npm 10+

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认地址：http://localhost:3000

### 生产构建

```bash
npm run build
```

### 预览构建产物

```bash
npm run preview
```

## 仓库结构

```text
biaotutai/
|- docs/
|  |- design.md
|- src/
|  |- views/
|  |  |- Upload.vue
|  |  |- Workbench.vue
|  |  |- Viewer.vue
|  |- router/
|  |- store/
|  |- styles/
|- openspec/
|- package.json
|- README.md
|- README.zh-CN.md
```

## 产品路线图

- MVP：上传、标注查看、导出 JSON
- v1.1：缩放与分享
- v1.2：AI 组件识别
- v2.0：自动生成代码

## 相关文档

- 产品设计文档：[docs/design.md](docs/design.md)
- 工作台样式指南：[docs/workbench-style-guide.md](docs/workbench-style-guide.md)

## 贡献

欢迎提交 Issue 和 Pull Request。

如果要变更产品级行为，请先在 openspec/changes 下创建或更新对应 OpenSpec 变更。

## 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE)。