import { defineStore } from 'pinia'
import { readPsd } from 'ag-psd'
import { normalizeLayer, filterHiddenNodes } from '../utils/normalizeLayer'

function findLayerById(layers, id) {
  for (const layer of layers) {
    if (layer.id === id) return layer
    if (layer.children) {
      const found = findLayerById(layer.children, id)
      if (found) return found
    }
  }
  return null
}

function toggleLayerHidden(layers, id) {
  for (const layer of layers) {
    if (layer.id === id) {
      layer.hidden = !layer.hidden
      return true
    }
    if (layer.children && toggleLayerHidden(layer.children, id)) {
      return true
    }
  }
  return false
}

function hashString(input) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return `fnv1a:${(hash >>> 0).toString(16)}`
}

function estimateBase64Size(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return 0
  const parts = dataUrl.split(',')
  if (parts.length < 2) return 0
  const base64 = parts[1]
  const padding = (base64.match(/=+$/) || [''])[0].length
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding)
}

function collectExportLayers(layers, context, parentId = null, flatIndex = []) {
  const result = []

  for (const layer of layers) {
    const exportLayer = {
      id: layer.id,
      name: layer.name,
      type: layer.type,
      visible: !layer.hidden,
      parentId,
      zIndex: flatIndex.length + 1,
      layout: {
        x: layer.x,
        y: layer.y,
        w: layer.width,
        h: layer.height
      },
      props: {}
    }

    if (layer.type === 'text') {
      const style = layer.style || {}
      const content = (layer.text && layer.text.text) || layer.name || ''
      exportLayer.props = {
        content,
        fontFamily: style.fontFamily || undefined,
        fontSize: style.fontSize || undefined,
        color: style.color || undefined
      }
    } else if (layer.type === 'shape') {
      const shapeProps = layer.shapeProps || {}
      exportLayer.props = {
        shapeType: layer.shapeType || 'rect',
        fill: shapeProps.fill || undefined,
        cornerRadius: shapeProps.cornerRadius ?? undefined,
        stroke: shapeProps.stroke || undefined
      }
    } else if (layer.type === 'image') {
      const dataUrl = layer.imagePreviewUrl || ''
      if (dataUrl) {
        let assetId = context.assetByDataUrl.get(dataUrl)
        if (!assetId) {
          assetId = `asset_${context.assetCounter++}`
          context.assetByDataUrl.set(dataUrl, assetId)
          context.assets[assetId] = {
            path: `assets/${assetId}.png`,
            mime: 'image/png',
            w: layer.width,
            h: layer.height,
            size: estimateBase64Size(dataUrl),
            hash: hashString(dataUrl),
            originLayers: [layer.id],
            exportedAs: 'png',
            scalable: false
          }
        } else {
          const meta = context.assets[assetId]
          if (meta && Array.isArray(meta.originLayers) && !meta.originLayers.includes(layer.id)) {
            meta.originLayers.push(layer.id)
          }
        }

        exportLayer.props = {
          assetId,
          scaleMode: 'contain'
        }
      }

      if (layer.degraded) {
        exportLayer.props = {
          ...exportLayer.props,
          degraded: true,
          degradeReason: layer.degradeReason || 'complex-path',
          originalType: layer.originalType || 'shape'
        }
      }
    }

    if (layer.children && layer.children.length) {
      exportLayer.children = layer.children.map(child => child.id)
      const children = collectExportLayers(layer.children, context, layer.id, flatIndex)
      result.push(exportLayer)
      result.push(...children)
    } else {
      result.push(exportLayer)
    }

    flatIndex.push(layer.id)
  }

  return result
}

function buildExportPayload(store) {
  const context = {
    assets: {},
    assetCounter: 1,
    assetByDataUrl: new Map()
  }
  const flatIndex = []
  const layerList = collectExportLayers(store.layers, context, null, flatIndex)

  return {
    version: '1.0',
    source: 'psd',
    meta: {
      sourceFilename: store.fileName || store.psd?.name || '',
      exportedAt: new Date().toISOString(),
      exporterVersion: 'biaotutai-1.0'
    },
    canvas: {
      width: store.psd?.width || 0,
      height: store.psd?.height || 0
    },
    assets: context.assets,
    flatIndex,
    layers: layerList
  }
}

export const useMainStore = defineStore('main', {
  state: () => ({
    psd: null,
    layers: [],
    isLoading: false,
    error: null,
    fileName: '',
    selectedLayerId: null,
    backgroundUrl: '',
    searchQuery: '',
    filterHiddenLayers: false,
    canvasRenderMode: 'composite'
  }),
  getters: {
    selectedLayer(state) {
      if (!state.selectedLayerId) return null
      const layer = findLayerById(state.layers, state.selectedLayerId)
      if (!layer) return null

      if (layer.type === 'image') {
        return {
          ...layer,
          imagePreviewUrl: layer.imagePreviewUrl || '',
          imagePreviewStatus: layer.imagePreviewStatus || 'missing'
        }
      }

      if (layer.type === 'text') {
        const style = layer.style && typeof layer.style === 'object' ? layer.style : {}
        return {
          ...layer,
          style: {
            ...style,
            fontFamily: style.fontFamily ?? '',
            fontSize: style.fontSize ?? '',
            color: style.color ?? ''
          }
        }
      }

      if (layer.type === 'shape') {
        return {
          ...layer,
          shapeType: layer.shapeType || 'rect',
          shapeProps: {
            fill: layer.shapeProps?.fill ?? '',
            cornerRadius: layer.shapeProps?.cornerRadius ?? 0,
            stroke: layer.shapeProps?.stroke ?? null
          }
        }
      }

      return layer
    },
    filteredLayers(state) {
      if (!state.filterHiddenLayers) return state.layers
      function filterNode(node) {
        if (node.children && node.children.length > 0) {
          const filteredChildren = node.children.map(filterNode).filter(Boolean)
          if (node.hidden && filteredChildren.length === 0) return null
          return { ...node, children: filteredChildren }
        }
        if (node.hidden) return null
        return node
      }
      return state.layers.map(filterNode).filter(Boolean)
    },
    searchResults(state) {
      if (!state.searchQuery) return []
      const keyword = state.searchQuery.toLowerCase()
      const results = []
      function traverse(layers) {
        for (const layer of layers) {
          if (layer.name.toLowerCase().includes(keyword)) {
            results.push(layer)
          }
          if (layer.children) traverse(layer.children)
        }
      }
      traverse(state.layers)
      return results
    }
  },
  actions: {
    setPsd(data) {
      this.psd = data
    },
    setLayers(list) {
      this.layers = list
    },
    selectLayer(id) {
      this.selectedLayerId = id
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },
    toggleLayerVisibility(id) {
      toggleLayerHidden(this.layers, id)
    },
    setCanvasRenderMode(mode) {
      this.canvasRenderMode = mode
    },
    toggleFilterHiddenLayers() {
      this.filterHiddenLayers = !this.filterHiddenLayers
    },
    async parsePsd(file, options = {}) {
      if (this.backgroundUrl) {
        URL.revokeObjectURL(this.backgroundUrl)
        this.backgroundUrl = ''
      }
      this.isLoading = true
      this.error = null
      this.fileName = file.name
      try {
        const buffer = await this.readFileAsBuffer(file)
        const isPsd = file.name.toLowerCase().endsWith('.psd')
        const psdData = readPsd(buffer, {
          skipThumbnail: true,
          skipCompositeImageData: !isPsd,
          throwForMissingFeatures: false,
          logMissingFeatures: false
        })

        let psdTree = psdData
        const skipHidden = options.skipHiddenLayers !== undefined ? options.skipHiddenLayers : true
        if (skipHidden) {
          psdTree = { ...psdData, children: (psdData.children || []).map(filterHiddenNodes).filter(Boolean) }
        }
        const normalizedLayers = normalizeLayer(psdTree)

        this.psd = {
          width: psdData.width,
          height: psdData.height,
          name: file.name
        }
        this.layers = normalizedLayers
        this.selectedLayerId = null

        if (isPsd && psdData.canvas) {
          const blob = await new Promise(resolve => psdData.canvas.toBlob(resolve, 'image/png'))
          this.backgroundUrl = URL.createObjectURL(blob)
        } else if (!isPsd) {
          this.backgroundUrl = URL.createObjectURL(file)
        } else {
          this.backgroundUrl = ''
        }
      } catch (err) {
        let errorMsg = err.message || '解析 PSD 失败'

        if (errorMsg.includes('Not Implemented') || errorMsg.includes('Not implemented')) {
          errorMsg = `不支持该 PSD 特性（${errorMsg}），请尝试其他文件或简化设计稿`
        } else if (errorMsg.includes('Unexpected end of')) {
          errorMsg = '文件格式损坏或不完整，请重新上传'
        } else if (errorMsg.includes('Invalid PSD')) {
          errorMsg = '不是有效的 PSD 文件'
        }

        this.error = errorMsg
        this.psd = null
        this.layers = []
        if (this.backgroundUrl) {
          URL.revokeObjectURL(this.backgroundUrl)
          this.backgroundUrl = ''
        }
      } finally {
        this.isLoading = false
      }
    },
    exportProjectJson() {
      return buildExportPayload(this)
    },
    readFileAsBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsArrayBuffer(file)
      })
    }
  }
})
