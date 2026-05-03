import { defineStore } from 'pinia'
import { readPsd } from 'ag-psd'
import { normalizeLayer } from '../utils/normalizeLayer'

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
    filterHiddenLayers: false
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
    toggleFilterHiddenLayers() {
      this.filterHiddenLayers = !this.filterHiddenLayers
    },
    async parsePsd(file) {
      // 释放旧的 ObjectURL 避免内存泄漏
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
          skipCompositeImageData: !isPsd, // PSD 文件需要合成图作为背景
          throwForMissingFeatures: false,
          logMissingFeatures: false
        })
        
        // 标准化图层
        const normalizedLayers = normalizeLayer(psdData)
        
        this.psd = {
          width: psdData.width,
          height: psdData.height,
          name: file.name
        }
        this.layers = normalizedLayers
        this.selectedLayerId = null

        // 生成背景图 URL
        // PSD 文件：使用 ag-psd 解析出的合成图 canvas，浏览器无法直接渲染 .psd
        // 图片文件（PNG/JPG）：直接使用 ObjectURL
        if (isPsd && psdData.canvas) {
          const blob = await new Promise(resolve => psdData.canvas.toBlob(resolve, 'image/png'))
          this.backgroundUrl = URL.createObjectURL(blob)
        } else if (!isPsd) {
          this.backgroundUrl = URL.createObjectURL(file)
        } else {
          this.backgroundUrl = ''
        }
      } catch (err) {
        // 更友好的错误提示
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
    readFileAsBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(new Error('文件读取失败'))
        reader.readAsArrayBuffer(file)
      })
    }
  }
})
