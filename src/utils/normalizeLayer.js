/**
 * 标准化 ag-psd 的图层数据为统一格式
 * ag-psd 输出格式: { left, top, right, bottom, width, height, name, children[], ... }
 * 标准化格式: { id, name, type, x, y, width, height, children[], ... }
 */

let layerIdCounter = 0

/**
 * 解析前预过滤：从 PSD 树中移除 hidden:true 的节点。
 * 若分组过滤后子节点为空且自身也是隐藏的则同样移除；若分组有可见子项则保留分组。
 * 返回浅拷贝的过滤后节点，不修改原始数据。
 */
export function filterHiddenNodes(node) {
  if (!node) return null

  if (node.children && Array.isArray(node.children)) {
    const filteredChildren = node.children
      .map(child => filterHiddenNodes(child))
      .filter(child => child !== null)

    if (node.hidden && filteredChildren.length === 0) return null

    return { ...node, children: filteredChildren }
  }

  if (node.hidden) return null

  return node
}

export function normalizeLayer(psdData) {
  layerIdCounter = 0
  if (!psdData) return []

  if (psdData.children && Array.isArray(psdData.children)) {
    return psdData.children.map(layer => normalizeNode(layer)).filter(Boolean)
  }

  return []
}

function normalizeNode(node) {
  if (!node) return null

  const id = `layer_${++layerIdCounter}`
  const width = node.width ?? ((node.right ?? 0) - (node.left ?? 0))
  const height = node.height ?? ((node.bottom ?? 0) - (node.top ?? 0))

  const baseType = inferLayerType(node)
  const shapeMeta = baseType === 'shape' ? normalizeShapeMeta(node, width, height) : null
  const shouldDegradeToImage = Boolean(shapeMeta?.isComplex)

  const outputType = shouldDegradeToImage ? 'image' : baseType
  const imagePreviewUrl = outputType !== 'group' ? buildImagePreviewUrl(node) : ''

  const normalized = {
    id,
    name: node.name || '未命名',
    type: outputType,
    hidden: node.hidden ?? false,
    x: node.left ?? 0,
    y: node.top ?? 0,
    width: Math.max(0, width),
    height: Math.max(0, height),
    ...(outputType !== 'group' && {
      imagePreviewUrl,
      imagePreviewStatus: imagePreviewUrl ? 'ready' : 'missing'
    }),
    ...(node.text && { text: node.text }),
    ...(outputType === 'text' ? { style: normalizeTextStyle(node.text) } : {}),
    ...(outputType !== 'text' && node.style ? { style: node.style } : {})
  }

  if (shapeMeta && !shouldDegradeToImage) {
    normalized.shapeType = shapeMeta.shapeType
    normalized.shapeProps = shapeMeta.props
  }

  if (shapeMeta && shouldDegradeToImage) {
    normalized.degraded = true
    normalized.degradeReason = 'complex-path'
    normalized.originalType = 'shape'
    normalized.shapeType = shapeMeta.shapeType
    normalized.shapeProps = shapeMeta.props
  }

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
  const style = (textData && textData.style)
    || (textData && textData.styleRuns && textData.styleRuns[0] && textData.styleRuns[0].style)
    || {}

  const fontFamily = (style.font && style.font.name) || ''
  const fontSize = style.fontSize || ''

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

function inferLayerType(node) {
  if (node.children && node.children.length > 0) {
    return 'group'
  }

  if (node.text) {
    return 'text'
  }

  if (isShapeNode(node)) {
    return 'shape'
  }

  if (node.canvas) {
    return 'image'
  }

  return 'shape'
}

function isShapeNode(node) {
  return Boolean(
    node.vectorMask
    || node.vectorFill
    || node.stroke
    || node.pathList
    || (node.origination && node.origination.length)
  )
}

function normalizeShapeMeta(node, width, height) {
  const props = {
    fill: normalizeShapeFill(node),
    cornerRadius: normalizeCornerRadius(node),
    stroke: normalizeShapeStroke(node)
  }

  const shapeType = inferShapeType(props, width, height)
  const isComplex = isComplexShapePath(node)

  return {
    shapeType,
    isComplex,
    props
  }
}

function inferShapeType(props, width, height) {
  // 线条：极薄图层（厚度 ≤ 3px）或宽高比极端（≥ 20:1 或 ≤ 1:20）
  const w = width ?? 0
  const h = height ?? 0
  if (w > 0 && h > 0) {
    const isThickLine = w <= 3 || h <= 3
    const isExtremeRatio = (w / h) >= 20 || (h / w) >= 20
    if (isThickLine || isExtremeRatio) {
      return 'line'
    }
  }

  const hasRadius = typeof props.cornerRadius === 'number'
    ? props.cornerRadius > 0
    : Boolean(props.cornerRadius && Object.values(props.cornerRadius).some(v => Number(v) > 0))
  if (hasRadius) {
    return 'card'
  }
  return 'rect'
}

function isComplexShapePath(node) {
  const pathCount = getPathCount(node)
  const hasBezierShape = Boolean(node.pathList && Array.isArray(node.pathList) && node.pathList.length > 1)
  return pathCount > 1 || hasBezierShape
}

function getPathCount(node) {
  const counts = []
  if (node.vectorMask && Array.isArray(node.vectorMask.paths)) {
    counts.push(node.vectorMask.paths.length)
  }
  if (Array.isArray(node.pathList)) {
    counts.push(node.pathList.length)
  }
  if (Array.isArray(node.origination)) {
    counts.push(node.origination.length)
  }
  return counts.length ? Math.max(...counts) : 0
}

function normalizeShapeFill(node) {
  if (node.vectorFill && node.vectorFill.type === 'color') {
    return normalizeColor(node.vectorFill.color)
  }

  if (node.fillColor) {
    return normalizeColor(node.fillColor)
  }

  if (node.style && node.style.fillColor) {
    return normalizeColor(node.style.fillColor)
  }

  return ''
}

function normalizeCornerRadius(node) {
  const fromVectorMask = node.vectorMask && node.vectorMask.radii
  if (Array.isArray(fromVectorMask) && fromVectorMask.length === 4) {
    return {
      tl: Number(fromVectorMask[0]) || 0,
      tr: Number(fromVectorMask[1]) || 0,
      br: Number(fromVectorMask[2]) || 0,
      bl: Number(fromVectorMask[3]) || 0
    }
  }

  const fromOrigination = node.origination && node.origination[0] && node.origination[0].keyOriginRRectRadii
  if (Array.isArray(fromOrigination) && fromOrigination.length === 4) {
    return {
      tl: Number(fromOrigination[0]) || 0,
      tr: Number(fromOrigination[1]) || 0,
      br: Number(fromOrigination[2]) || 0,
      bl: Number(fromOrigination[3]) || 0
    }
  }

  const radius = node.radius ?? (node.style && node.style.cornerRadius)
  return Number.isFinite(radius) ? Number(radius) : 0
}

function normalizeShapeStroke(node) {
  const stroke = node.stroke || {}
  const color = stroke.color || (node.style && node.style.strokeColor)
  const width = stroke.width ?? (node.style && node.style.strokeWidth)

  if (!color && (width === undefined || width === null)) {
    return null
  }

  return {
    color: normalizeColor(color),
    width: Number(width) || 0
  }
}

function normalizeColor(color) {
  if (!color) return ''
  if (typeof color === 'string') return color

  if (typeof color === 'object' && color !== null) {
    const r = color.r ?? color.red
    const g = color.g ?? color.green
    const b = color.b ?? color.blue
    const a = color.a ?? color.alpha
    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
      if (typeof a === 'number' && a < 255) {
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${(a / 255).toFixed(2)})`
      }
      const toHex = n => Math.round(n).toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }
  }

  return ''
}
