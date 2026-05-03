## 新增需求

### 需求:画布尺寸等于 PSD 原始尺寸
`canvas-stage` 元素的宽高必须精确等于 `store.psd.width × store.psd.height`，禁止硬编码任何固定尺寸。

#### 场景:PSD 解析成功后画布正确尺寸
- **当** store.psd 含有 width 和 height 值
- **那么** canvas-stage 的 style.width 为 `${store.psd.width}px`，style.height 为 `${store.psd.height}px`

### 需求:画布渲染原始文件背景图
画布必须将用户上传的原始文件（PSD/PNG/JPG）作为背景图渲染，覆盖整个 canvas-stage 区域。

#### 场景:背景图充满画布
- **当** store.backgroundUrl 存在（非空字符串）
- **那么** canvas-stage 内渲染一个 `<img>` 元素，src 为 store.backgroundUrl，宽高均为 100%，`pointer-events: none`

#### 场景:无背景图时画布显示占位色
- **当** store.backgroundUrl 为空
- **那么** canvas-stage 显示深色占位背景色，不报错

### 需求:画布容器支持滚动
当 PSD 尺寸超出浏览器视口时，canvas-container 必须支持横向和纵向滚动。

#### 场景:内容超出时出现滚动条
- **当** canvas-stage 宽度或高度大于 canvas-container 的可视区域
- **那么** canvas-container 出现对应方向的滚动条，用户可滚动查看全部画布内容

## 修改需求

## 移除需求
