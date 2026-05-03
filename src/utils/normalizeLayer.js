/**
 * 标准化 ag-psd 的图层数据为统一格式
 * ag-psd 输出格式: { left, top, right, bottom, width, height, name, children[], ... }
 * 标准化格式: { id, name, type, x, y, width, height, children[], ... }
 */

let layerIdCounter = 0

export function normalizeLayer(psdData) {
  layerIdCounter = 0
  if (!psdData) return []
  
  // 如果是根节点（PSD 文件），其 children 才是真正的图层
  if (psdData.children && Array.isArray(psdData.children)) {
    return psdData.children.map(layer => normalizeNode(layer))
  }
  
  return []
}

/**
 * 递归标准化单个节点
 */
function normalizeNode(node) {
  if (!node) return null
  
  const id = `layer_${++layerIdCounter}`
  
  // 计算宽高
  const width = node.width ?? ((node.right ?? 0) - (node.left ?? 0))
  const height = node.height ?? ((node.bottom ?? 0) - (node.top ?? 0))
  
  // 推断类型
  const type = inferLayerType(node)
  const imagePreviewUrl = type === 'image' ? buildImagePreviewUrl(node) : ''
  
  const normalized = {
    id,
    name: node.name || '未命名',
    type,
    hidden: node.hidden ?? false,
    x: node.left ?? 0,
    y: node.top ?? 0,
    width: Math.max(0, width),
    height: Math.max(0, height),
    ...(type === 'image' && {
      imagePreviewUrl,
      imagePreviewStatus: imagePreviewUrl ? 'ready' : 'missing'
    }),
    // 文本相关属性（如果是文本层）
    ...(node.text && { text: node.text }),
    // 样式相关
    ...(type === 'text' ? { style: normalizeTextStyle(node.text) } : {}),
    ...(type !== 'text' && node.style ? { style: node.style } : {})
  }
  
  // 递归处理子图层
  if (node.children && Array.isArray(node.children)) {
    normalized.children = node.children
      .map(child => normalizeNode(child))
      .filter(child => child !== null)
  }
  
  return normalized
}

function buildImagePreviewUrl(node) {
  if (!node || !node.canvas || typeof node.canvas.toDataURL !== 'function') {
    return ''
  }

  try {
    return node.canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

function normalizeTextStyle(textData) {
  // ag-psd 文本样式存储在 node.text.style 或第一个 styleRun 中
  const style = (textData && textData.style)
    || (textData && textData.styleRuns && textData.styleRuns[0] && textData.styleRuns[0].style)
    || {}

  // font.name 是字体名称
  const fontFamily = (style.font && style.font.name) || ''

  // fontSize 直接使用
  const fontSize = style.fontSize || ''

  // fillColor 是 Color 对象 { r, g, b, a? }，转换为 CSS hex/rgba
  let color = ''
  const fc = style.fillColor
  if (fc && typeof fc.r === 'number') {
    const toHex = n => Math.round(n).toString(16).padStart(2, '0')
    if (typeof fc.a === 'number' && fc.a < 255) {
      color = `rgba(${Math.round(fc.r)}, ${Math.round(fc.g)}, ${Math.round(fc.b)}, ${(fc.a / 255).toFixed(2)})`
    } else {
      color = `#${toHex(fc.r)}${toHex(fc.g)}${toHex(fc.b)}`
    }
  }

  return { fontFamily, fontSize, color }
}

/**
 * 根据 ag-psd 的层属性推断类型
 */
function inferLayerType(node) {
  // ag-psd 中 group 通常有 children 且自身无像素内容
  if (node.children && node.children.length > 0) {
    return 'group'
  }
  
  // 文本层
  if (node.text) {
    return 'text'
  }
  
  // 图片/光栅图层
  if (node.canvas) {
    return 'image'
  }
  
  // 默认为形状
  return 'shape'
}
