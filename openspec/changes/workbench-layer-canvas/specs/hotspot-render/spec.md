## 新增需求

### 需求:热区按图层坐标绝对定位
每个图层（非 group 类型）必须在 canvas-stage 上渲染一个透明热区 div，位置和尺寸严格按照 `layer.x, layer.y, layer.width, layer.height` 设置，禁止任何缩放换算。

#### 场景:热区位置与图层坐标一致
- **当** store.layers 包含坐标为 (x=100, y=200, width=300, height=50) 的图层
- **那么** 对应热区 style 为 `left: 100px; top: 200px; width: 300px; height: 50px; position: absolute`

#### 场景:group 类型图层不渲染独立热区
- **当** 图层 type 为 `group`
- **那么** 该图层本身不渲染热区，仅其 children 递归渲染热区

### 需求:热区 hover 展示 tooltip
鼠标悬浮热区时，必须显示包含图层名称和尺寸信息的 tooltip。

#### 场景:hover 显示 tooltip
- **当** 鼠标进入某个热区
- **那么** 在热区附近显示 tooltip，内容包含图层 name、x、y、width、height

#### 场景:hover 离开隐藏 tooltip
- **当** 鼠标离开热区
- **那么** tooltip 隐藏

### 需求:热区支持点击选中
点击热区必须选中对应图层，与图层面板点击行为一致。

#### 场景:点击热区同步选中状态
- **当** 用户点击某个热区
- **那么** 调用 `store.selectLayer(layer.id)`，该图层在图层面板中高亮，属性面板同步更新

## 修改需求

## 移除需求
