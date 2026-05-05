<template>
  <div class="wb" :class="{ 'is-resizing': isResizing || isRightResizing }">
    <!-- 加载状态 -->
    <div v-if="store.isLoading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在解析设计稿...</p>
        <el-button class="loading-back-btn" @click="goBack">返回上传</el-button>
      </div>
    </div>

    <!-- 数据异常状态 -->
    <div v-else-if="!store.psd || store.layers.length === 0" class="error-overlay">
      <div class="error-container">
        <h2>数据异常</h2>
        <p v-if="store.error">{{ store.error }}</p>
        <p v-else>未检测到设计稿数据，请重新上传</p>
        <el-button type="primary" @click="goBack">返回上传</el-button>
      </div>
    </div>

    <!-- 正常工作台 -->
    <template v-else>
      <!-- ── Header ── -->
      <header class="wb-header">
        <div class="hd-left">
          <el-button class="hd-btn hd-back" text @click="goBack">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            返回
          </el-button>
          <div class="hd-divider"></div>
          <div class="hd-file">
            <span class="hd-dot"></span>
            <span class="hd-filename">{{ store.psd.name }}</span>
            <span class="hd-size">{{ store.psd.width }} × {{ store.psd.height }}</span>
          </div>
        </div>
        <div class="hd-right">
          <button class="hd-action" type="button" title="缩放适配" aria-label="缩放适配">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2.5 6V2.5H6M13.5 6V2.5H10M2.5 10V13.5H6M13.5 10V13.5H10" stroke="currentColor"
                stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="hd-action" type="button" title="最大化" aria-label="最大化">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4" />
            </svg>
          </button>
          <button class="hd-action" type="button" :title="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
            :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'" @click="toggleTheme">
            <!-- 太阳图标（暗色时显示，提示可切换到亮色） -->
            <svg v-if="theme === 'dark'" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M11.5 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4"
                stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <!-- 月亮图标（亮色时显示，提示可切换到暗色） -->
            <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 10a5 5 0 01-7-7 6 6 0 107 7z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <button class="hd-action hd-action-emphasis" type="button" title="导出 JSON" aria-label="导出 JSON" @click="exportJson">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.5V10.5M8 10.5L5.5 8M8 10.5L10.5 8" stroke="currentColor" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 12.5H13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <!-- ── 主体三栏 ── -->
      <div class="wb-body">
        <!-- 左侧活动栏 -->
        <div class="activity-shell">
          <aside class="activity-bar">
            <button v-for="item in panels" :key="item.id" class="ab-btn" :class="{ active: activePanel === item.id }"
              :title="item.label" @click="handlePanelToggle(item.id)">
              <svg v-if="item.id === 'layers'" class="ab-icon" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" stroke="currentColor" stroke-width="1.2" />
                <rect x="9" y="2" width="5" height="5" stroke="currentColor" stroke-width="1.2" />
                <rect x="2" y="9" width="5" height="5" stroke="currentColor" stroke-width="1.2" />
                <rect x="9" y="9" width="5" height="5" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <svg v-else class="ab-icon" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.2" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
            </button>
          </aside>

          <aside class="activity-panel" :class="{ 'is-collapsed': !isPanelOpen, 'is-resizing': isResizing }"
            :style="panelStyle">
            <div v-show="isPanelOpen" class="panel-head">
              <span>图层</span>
              <span class="panel-count">{{ flatCount }}</span>
            </div>

            <!-- 搜索输入框 -->
            <LayerSearch v-show="isPanelOpen" />

            <!-- 过滤隐藏图层开关 -->
            <label v-show="isPanelOpen" class="filter-hidden-toggle">
              <input
                type="checkbox"
                :checked="store.filterHiddenLayers"
                @change="store.toggleFilterHiddenLayers()"
              />
              <span>过滤隐藏图层</span>
            </label>

            <el-scrollbar v-show="isPanelOpen && !store.searchQuery" class="layer-list">
              <template v-if="store.filteredLayers.length > 0">
                <LayerItem
                  v-for="layer in store.filteredLayers"
                  :key="layer.id"
                  :layer="layer"
                />
              </template>
              <div v-else class="layer-empty">暂无图层</div>
            </el-scrollbar>

            <LayerSearchResults v-show="isPanelOpen && store.searchQuery" />

            <div v-show="isPanelOpen" class="resize-handle" @mousedown="startResize"></div>
          </aside>
        </div>

        <!-- 中间画布 -->
        <section class="canvas-area">
          <div class="canvas-ruler-x">
            <span v-for="n in 10" :key="n" class="ruler-mark">{{ (n - 1) * 400 }}</span>
          </div>
          <div class="canvas-scroll">
            <div
              class="canvas-stage"
              :style="{ width: store.psd.width + 'px', height: store.psd.height + 'px' }"
            >
              <img
                v-show="store.canvasRenderMode === 'composite'"
                class="canvas-bg-img"
                :src="store.backgroundUrl"
              />
              <div v-show="store.canvasRenderMode === 'layered'" class="canvas-layer-wrap">
                <CanvasLayer :layers="store.layers" />
              </div>
              <HotspotLayer :layers="store.layers" />
            </div>
          </div>
          <div class="canvas-status">
            <span>{{ store.psd.width }} × {{ store.psd.height }} px</span>
            <span class="st-sep">·</span>
            <span>{{ store.selectedLayer ? `已选中 ${store.selectedLayer.name}` : '未选中' }}</span>
            <template v-if="store.layers.length > 0">
              <span class="st-sep">·</span>
              <label class="st-mode-label">渲染</label>
              <select
                class="st-mode-select"
                :value="store.canvasRenderMode"
                @change="store.setCanvasRenderMode($event.target.value)"
              >
                <option value="layered">逐层渲染</option>
                <option value="composite">合成图</option>
              </select>
            </template>
          </div>
        </section>

        <!-- 右侧活动栏（默认收起） -->
        <div class="right-panel-shell">
          <aside class="right-panel" :class="{ 'is-collapsed': !isRightPanelOpen, 'is-resizing': isRightResizing }"
            :style="rightPanelStyle">
            <div v-show="isRightPanelOpen" class="panel-head">
              <span>{{ rightActivePanel === 'properties' ? '属性' : '检查' }}</span>
            </div>

            <div v-show="isRightPanelOpen && rightActivePanel === 'properties'" class="right-panel-content">
              <!-- 无选中图层 -->
              <div v-if="!store.selectedLayer" class="prop-empty">
                请选择图层
              </div>

              <!-- 有选中图层 -->
              <template v-else>
                <div class="prop-section">
                  <div class="prop-label">基础</div>
                  <div class="prop-row">
                    <span class="pk">名称</span>
                    <span class="pv pv-copy" @click="copyValue('name', store.selectedLayer.name)">
                      {{ copiedKey === 'name' ? '已复制' : store.selectedLayer.name }}
                    </span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">类型</span>
                    <span class="pv pv-tag">{{ store.selectedLayer.type }}</span>
                  </div>
                </div>
                <div class="prop-section">
                  <div class="prop-label">几何</div>
                  <div class="prop-grid">
                    <div class="prop-cell" @click="copyValue('x', store.selectedLayer.x)">
                      <span class="pk">X</span>
                      <span class="pv">{{ copiedKey === 'x' ? '✓' : store.selectedLayer.x }}</span>
                    </div>
                    <div class="prop-cell" @click="copyValue('y', store.selectedLayer.y)">
                      <span class="pk">Y</span>
                      <span class="pv">{{ copiedKey === 'y' ? '✓' : store.selectedLayer.y }}</span>
                    </div>
                    <div class="prop-cell" @click="copyValue('w', store.selectedLayer.width)">
                      <span class="pk">W</span>
                      <span class="pv">{{ copiedKey === 'w' ? '✓' : store.selectedLayer.width }}</span>
                    </div>
                    <div class="prop-cell" @click="copyValue('h', store.selectedLayer.height)">
                      <span class="pk">H</span>
                      <span class="pv">{{ copiedKey === 'h' ? '✓' : store.selectedLayer.height }}</span>
                    </div>
                  </div>
                </div>

                <!-- 图片图层附加属性 -->
                <div
                  v-if="store.selectedLayer.type === 'image'"
                  class="prop-section"
                >
                  <div class="prop-label">图片缩略图</div>
                  <div class="thumb-meta-row">
                    <span class="pk">尺寸</span>
                    <span class="pv">{{ store.selectedLayer.width }} × {{ store.selectedLayer.height }}</span>
                  </div>

                  <button
                    v-if="selectedImagePreviewUrl && !thumbLoadFailed"
                    class="thumb-box"
                    type="button"
                    @click="openImagePreview"
                    title="点击查看大图"
                  >
                    <img
                      class="thumb-img"
                      :src="selectedImagePreviewUrl"
                      :alt="store.selectedLayer.name"
                      @error="onThumbLoadError"
                    />
                    <span class="thumb-tip">点击预览</span>
                  </button>

                  <div v-else class="thumb-placeholder">
                    <span class="thumb-ph-title">暂无可用预览</span>
                    <span class="thumb-ph-desc">该图层缺少预览资源或加载失败</span>
                  </div>
                </div>

                <!-- 文本图层附加属性 -->
                <div
                  v-if="store.selectedLayer.type === 'text'"
                  class="prop-section"
                >
                  <div class="prop-label">文本样式</div>
                  <div class="prop-row">
                    <span class="pk">字体</span>
                    <span class="pv pv-copy" @click="copyValue('font', selectedTextStyle.fontFamily)">
                      {{ copiedKey === 'font' ? '已复制' : selectedTextStyle.fontFamily }}
                    </span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">字号</span>
                    <span class="pv pv-copy" @click="copyValue('size', selectedTextStyle.fontSize)">
                      {{ copiedKey === 'size' ? '已复制' : selectedTextStyle.fontSize }}
                    </span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">颜色</span>
                    <span class="pv pv-copy" @click="copyValue('color', selectedTextStyle.color)">
                      <span v-if="selectedTextStyle.color !== '--'" class="swatch" :style="{ background: selectedTextStyle.color }"></span>
                      {{ copiedKey === 'color' ? '已复制' : selectedTextStyle.color }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="store.selectedLayer.type === 'shape'"
                  class="prop-section"
                >
                  <div class="prop-label">形状信息</div>
                  <div class="prop-row">
                    <span class="pk">shapeType</span>
                    <span class="pv pv-tag">{{ selectedShapeMeta.shapeType }}</span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">填充</span>
                    <span class="pv pv-copy" @click="copyValue('shape-fill', selectedShapeMeta.fill)">
                      <span v-if="selectedShapeMeta.fill !== '--'" class="swatch" :style="{ background: selectedShapeMeta.fill }"></span>
                      {{ copiedKey === 'shape-fill' ? '已复制' : selectedShapeMeta.fill }}
                    </span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">圆角</span>
                    <span class="pv pv-copy" @click="copyValue('shape-radius', selectedShapeMeta.cornerRadius)">
                      {{ copiedKey === 'shape-radius' ? '已复制' : selectedShapeMeta.cornerRadius }}
                    </span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">边框</span>
                    <span class="pv pv-copy" @click="copyValue('shape-stroke', selectedShapeMeta.stroke)">
                      {{ copiedKey === 'shape-stroke' ? '已复制' : selectedShapeMeta.stroke }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="store.selectedLayer.degraded"
                  class="prop-section"
                >
                  <div class="prop-label">降级状态</div>
                  <div class="prop-row">
                    <span class="pk">状态</span>
                    <span class="pv pv-tag">degraded</span>
                  </div>
                  <div class="prop-row">
                    <span class="pk">原因</span>
                    <span class="pv">{{ store.selectedLayer.degradeReason || 'complex-path' }}</span>
                  </div>
                </div>
              </template>
            </div>

            <div v-show="isRightPanelOpen && rightActivePanel === 'inspect'" class="inspect-pane">
              <div class="inspect-title">检查（占位）</div>
              <div class="inspect-card">用于显示选中节点的结构与引用信息。</div>
              <div class="inspect-hint">当前版本仅展示右侧活动栏切换与收起交互。</div>
            </div>

            <div v-show="isRightPanelOpen" class="right-resize-handle" @mousedown="startRightResize"></div>
          </aside>

          <aside class="right-activity-bar">
            <button v-for="item in rightPanels" :key="item.id" class="ab-btn"
              :class="{ active: rightActivePanel === item.id }" :title="item.label"
              @click="handleRightPanelToggle(item.id)">
              <svg v-if="item.id === 'properties'" class="ab-icon" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" stroke-width="1.2" />
                <path d="M5 6.5H11M5 9H11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
              <svg v-else class="ab-icon" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.2" />
                <path d="M8 7.2V11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                <circle cx="8" cy="4.9" r="0.8" fill="currentColor" />
              </svg>
            </button>
          </aside>
        </div>
      </div>
    </template>

    <div v-if="previewDialogVisible" class="img-preview-mask" @click="closeImagePreview">
      <div class="img-preview-dialog" @click.stop>
        <button class="img-preview-close" type="button" @click="closeImagePreview" aria-label="关闭预览">×</button>
        <img
          v-if="selectedImagePreviewUrl"
          class="img-preview-full"
          :src="selectedImagePreviewUrl"
          :alt="store.selectedLayer?.name || 'image preview'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElScrollbar, ElMessage } from 'element-plus'
import { useMainStore } from '../store'
import { zipSync, strToU8 } from 'fflate'
import { useTheme } from '../composables/useTheme'
import LayerItem from '../components/LayerItem.vue'
import CanvasLayer from '../components/CanvasLayer.vue'
import HotspotLayer from '../components/HotspotLayer.vue'
import LayerSearch from '../components/LayerSearch.vue'
import LayerSearchResults from '../components/LayerSearchResults.vue'

const router = useRouter()
const store = useMainStore()
const { theme, toggleTheme } = useTheme()

// 检查数据完整性
onMounted(() => {
  // 如果 psd 为空且不在加载中，说明数据丢失（如直接访问或刷新）
  if (!store.psd && !store.isLoading) {
    ElMessage.warning('数据已失效，请重新上传')
    router.push('/')
  }
})

// 返回上传页
function goBack() {
  router.push('/')
}

// 递归计算总图层数（含子节点）
function countLayers(layers) {
  let count = 0
  for (const layer of layers) {
    count++
    if (layer.children) count += countLayers(layer.children)
  }
  return count
}
const flatCount = computed(() => countLayers(store.filteredLayers))
const selectedImagePreviewUrl = computed(() => {
  const layer = store.selectedLayer
  if (!layer || layer.type !== 'image') return ''
  return layer.imagePreviewUrl || ''
})
const selectedTextStyle = computed(() => {
  const layer = store.selectedLayer
  if (!layer || layer.type !== 'text') {
    return {
      fontFamily: '--',
      fontSize: '--',
      color: '--'
    }
  }

  const style = layer.style && typeof layer.style === 'object' ? layer.style : {}
  return {
    fontFamily: toDisplayValue(style.fontFamily),
    fontSize: toDisplayValue(style.fontSize),
    color: toDisplayValue(normalizeColorValue(style.color))
  }
})

const selectedShapeMeta = computed(() => {
  const layer = store.selectedLayer
  if (!layer || layer.type !== 'shape') {
    return {
      shapeType: '--',
      fill: '--',
      cornerRadius: '--',
      stroke: '--'
    }
  }

  const shapeProps = layer.shapeProps || {}
  const strokeText = shapeProps.stroke
    ? `${shapeProps.stroke.color || '--'} / ${shapeProps.stroke.width ?? 0}px`
    : '--'

  return {
    shapeType: layer.shapeType || 'rect',
    fill: toDisplayValue(normalizeColorValue(shapeProps.fill)),
    cornerRadius: toDisplayValue(
      typeof shapeProps.cornerRadius === 'object'
        ? JSON.stringify(shapeProps.cornerRadius)
        : shapeProps.cornerRadius
    ),
    stroke: strokeText
  }
})

// 复制属性值到剪贴板
const copiedKey = ref(null)
const thumbLoadFailed = ref(false)
const previewDialogVisible = ref(false)

watch(() => store.selectedLayerId, () => {
  thumbLoadFailed.value = false
  previewDialogVisible.value = false
})

async function copyValue(key, value) {
  if (value === '--' || value === '' || value === null || value === undefined) {
    return
  }

  try {
    await navigator.clipboard.writeText(String(value))
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 1200)
  } catch {
    // 忽略复制失败
  }
}

function onThumbLoadError() {
  thumbLoadFailed.value = true
}

function openImagePreview() {
  if (!selectedImagePreviewUrl.value || thumbLoadFailed.value) {
    return
  }
  previewDialogVisible.value = true
}

function closeImagePreview() {
  previewDialogVisible.value = false
}

function exportJson() {
  try {
    const payload = store.exportProjectJson()
    const baseName = (store.fileName || 'project').replace(/\.[^.]+$/, '')

    // 收集 assets 图像文件并从 payload 中剥离 base64 data
    const zipFiles = {}
    for (const [assetId, meta] of Object.entries(payload.assets || {})) {
      const dataUrl = store.layers
        ? findAssetDataUrl(store.layers, assetId, payload)
        : null
      if (dataUrl && dataUrl.startsWith('data:')) {
        const base64 = dataUrl.split(',')[1]
        if (base64) {
          const binary = atob(base64)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
          zipFiles[meta.path] = bytes
        }
      }
    }

    // project.json 不含 base64，assets 保留元数据路径引用
    zipFiles['project.json'] = strToU8(JSON.stringify(payload, null, 2))

    const zipped = zipSync(zipFiles, { level: 6 })
    const blob = new Blob([zipped], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseName}.project.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('导出 ZIP 成功')
  } catch (error) {
    ElMessage.error(`导出失败: ${error?.message || '未知错误'}`)
  }
}

// 从图层树中按 assetId 反查 imagePreviewUrl
function findAssetDataUrl(layers, assetId, payload) {
  // payload.assets[assetId].originLayers 记录了来源图层 id
  const meta = payload.assets[assetId]
  if (!meta || !meta.originLayers || !meta.originLayers.length) return null
  const layerId = meta.originLayers[0]
  return findLayerPreviewUrl(layers, layerId)
}

function findLayerPreviewUrl(layers, id) {
  for (const layer of layers) {
    if (layer.id === id) return layer.imagePreviewUrl || null
    if (layer.children) {
      const found = findLayerPreviewUrl(layer.children, id)
      if (found) return found
    }
  }
  return null
}

function toDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  return String(value)
}

function normalizeColorValue(color) {
  if (!color) return ''
  if (typeof color === 'string') return color
  if (Array.isArray(color) && color.length >= 3) {
    const [r, g, b, a] = color
    return a === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
  }
  if (typeof color === 'object' && color !== null) {
    const { r, g, b, a } = color
    if (r !== undefined && g !== undefined && b !== undefined) {
      return a === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    }
  }
  return color
}

const MIN_PANEL_WIDTH = 160
const MAX_PANEL_WIDTH = 400
const RIGHT_MIN_PANEL_WIDTH = 180
const RIGHT_MAX_PANEL_WIDTH = 420

const activePanel = ref('layers')
const isPanelOpen = ref(true)
const panelWidth = ref(220)
const isResizing = ref(false)

const rightActivePanel = ref('properties')
const isRightPanelOpen = ref(false)
const rightPanelWidth = ref(260)
const isRightResizing = ref(false)

const panels = [
  { id: 'layers', label: '图层' },
  { id: 'search', label: '搜索' }
]

const rightPanels = [
  { id: 'properties', label: '属性' },
  { id: 'inspect', label: '检查' }
]

const panelStyle = computed(() => ({
  width: isPanelOpen.value ? `${panelWidth.value}px` : '0px',
  transition: isResizing.value ? 'none' : 'width 0.2s ease'
}))

const rightPanelStyle = computed(() => ({
  width: isRightPanelOpen.value ? `${rightPanelWidth.value}px` : '0px',
  transition: isRightResizing.value ? 'none' : 'width 0.2s ease'
}))

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function handlePanelToggle(id) {
  if (activePanel.value !== id) {
    activePanel.value = id
    isPanelOpen.value = true
    return
  }

  isPanelOpen.value = !isPanelOpen.value
}

function handleRightPanelToggle(id) {
  if (rightActivePanel.value !== id) {
    rightActivePanel.value = id
    isRightPanelOpen.value = true
    return
  }

  isRightPanelOpen.value = !isRightPanelOpen.value
}

let startX = 0
let startWidth = panelWidth.value
let rightStartX = 0
let rightStartWidth = rightPanelWidth.value

function doResize(event) {
  const next = clamp(startWidth + (event.clientX - startX), MIN_PANEL_WIDTH, MAX_PANEL_WIDTH)
  panelWidth.value = next
}

function stopResize() {
  if (!isResizing.value) {
    return
  }

  isResizing.value = false
  document.removeEventListener('mousemove', doResize)
  document.removeEventListener('mouseup', stopResize)
}

function startResize(event) {
  if (!isPanelOpen.value) {
    return
  }

  isResizing.value = true
  startX = event.clientX
  startWidth = panelWidth.value
  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
}

function doRightResize(event) {
  const next = clamp(rightStartWidth + (rightStartX - event.clientX), RIGHT_MIN_PANEL_WIDTH, RIGHT_MAX_PANEL_WIDTH)
  rightPanelWidth.value = next
}

function stopRightResize() {
  if (!isRightResizing.value) {
    return
  }

  isRightResizing.value = false
  document.removeEventListener('mousemove', doRightResize)
  document.removeEventListener('mouseup', stopRightResize)
}

function startRightResize(event) {
  if (!isRightPanelOpen.value) {
    return
  }

  isRightResizing.value = true
  rightStartX = event.clientX
  rightStartWidth = rightPanelWidth.value
  document.addEventListener('mousemove', doRightResize)
  document.addEventListener('mouseup', stopRightResize)
}

onUnmounted(() => {
  stopResize()
  stopRightResize()
})
</script>

<style scoped>
.wb {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-base);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--color-text-primary);
  overflow: hidden;
}

.wb.is-resizing {
  user-select: none;
  cursor: col-resize;
}

.wb-header {
  height: 48px;
  min-height: 48px;
  background: var(--color-bg-panel);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}

.hd-left,
.hd-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hd-btn.el-button {
  --el-button-text-color: var(--color-text-muted);
}

.hd-action {
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--color-border);
  background: var(--color-bg-hover);
  color: var(--color-text-secondary);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.hd-action:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.hd-action:active {
  border-color: var(--color-accent);
  background: var(--color-bg-active);
}

.hd-action-emphasis {
  border-color: var(--color-border-strong);
  color: var(--color-accent);
}

.hd-action-emphasis:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.hd-action svg {
  flex-shrink: 0;
}

.hd-divider {
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 4px;
}

.hd-file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hd-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 6px var(--color-accent-glow);
}

.hd-filename {
  font-size: 13px;
  color: var(--color-text-primary);
}

.hd-size {
  font-size: 11px;
  color: var(--color-text-muted);
}

.wb-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.activity-shell {
  display: flex;
  height: 100%;
  flex-shrink: 0;
}

.activity-bar {
  width: 44px;
  min-width: 44px;
  background: var(--color-bg-panel);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
}

.ab-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.ab-btn:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text-secondary);
}

.ab-btn.active {
  border-color: var(--color-accent);
  background: var(--color-bg-active);
  color: var(--color-text-accent);
  box-shadow: inset 0 0 10px var(--color-bg-active);
}

.ab-icon {
  width: 14px;
  height: 14px;
}

.activity-panel {
  position: relative;
  min-width: 0;
  background: var(--color-bg-panel);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.activity-panel.is-collapsed {
  border-right-color: transparent;
}

.activity-panel.is-resizing {
  transition: none !important;
}

.panel-head {
  padding: 10px 14px;
  font-size: 11px;
  color: var(--color-text-accent);
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0.7;
}

.panel-count {
  background: var(--color-bg-active);
  color: var(--color-text-secondary);
  border-radius: 8px;
  padding: 0 6px;
  font-size: 10px;
}

.filter-hidden-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 11px;
  user-select: none;
  flex-shrink: 0;
}

.filter-hidden-toggle input[type="checkbox"] {
  width: 13px;
  height: 13px;
  accent-color: var(--color-accent, #4f8ef7);
  cursor: pointer;
}

.layer-list {
  flex: 1;
  overflow: hidden;
}

.layer-list :deep(.el-scrollbar__view) {
  padding: 4px 0;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.layer-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.layer-item.active {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.layer-item.group>.layer-name {
  font-weight: 500;
}

.layer-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.layer-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-tag {
  font-size: 9px;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 0 4px;
}

.search-pane {
  flex: 1;
  padding: 14px;
}

.search-title {
  font-size: 12px;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.search-input {
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 8px 10px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.search-hint {
  margin-top: 10px;
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -2px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background: transparent;
  transition: background 0.15s;
}

.resize-handle:hover::after {
  background: var(--color-accent);
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-canvas);
  overflow: hidden;
  position: relative;
}

.canvas-ruler-x {
  height: 20px;
  background: var(--color-bg-base);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: flex-end;
  padding: 0 8px;
  gap: 0;
  overflow: hidden;
}

.ruler-mark {
  flex: 1;
  font-size: 9px;
  color: var(--color-text-muted);
  border-left: 1px solid var(--color-border);
  padding-left: 3px;
  padding-bottom: 2px;
}

.canvas-scroll {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
}

.canvas-stage {
  position: relative;
  flex-shrink: 0;
  background: linear-gradient(135deg, #0a1628 0%, #07111e 100%);
  border: 1px solid rgba(0, 212, 255, 0.1);
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
}

.canvas-layer-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hotspot {
  position: absolute;
  border: 1px solid var(--color-border-strong);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  z-index: 2;
}

.hotspot:hover,
.hotspot.hs-active {
  border-color: var(--color-accent);
  background: rgba(0, 212, 255, 0.05);
}

.hs-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-strong);
  padding: 6px 10px;
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.hs-name {
  font-size: 12px;
  color: var(--color-text-primary);
}

.hs-geo {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.layer-empty {
  padding: 20px 14px;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
}

.canvas-status {
  height: 28px;
  background: var(--color-bg-base);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.st-sep {
  color: var(--color-border);
}

.st-mode-label {
  color: var(--color-text-muted);
  font-size: 11px;
}

.st-mode-select {
  background: var(--color-bg-base);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 3px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-family: inherit;
  padding: 1px 4px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%2300d4ff' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
}

.st-mode-select:hover {
  border-color: rgba(0, 212, 255, 0.5);
  color: #00d4ff;
}

.st-mode-select option {
  background: #0a0f1a;
  color: #b0c4d8;
}

.right-panel-shell {
  display: flex;
  height: 100%;
  flex-shrink: 0;
}

.right-panel {
  position: relative;
  min-width: 0;
  background: var(--color-bg-panel);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-panel.is-collapsed {
  border-left-color: transparent;
}

.right-panel-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.right-panel.is-resizing {
  transition: none !important;
}

.right-activity-bar {
  width: 44px;
  min-width: 44px;
  background: var(--color-bg-panel);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
}

.right-resize-handle {
  position: absolute;
  top: 0;
  left: -2px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.right-resize-handle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background: transparent;
  transition: background 0.15s;
}

.right-resize-handle:hover::after {
  background: var(--color-accent);
}

.inspect-pane {
  flex: 1;
  padding: 14px;
}

.inspect-title {
  font-size: 12px;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.inspect-card {
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 8px 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.inspect-hint {
  margin-top: 10px;
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.prop-section {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.prop-label {
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.prop-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
}

.pk {
  color: var(--color-text-muted);
}

.pv {
  color: var(--color-text-primary);
}

.pv-tag {
  background: var(--color-bg-active);
  border: 1px solid var(--color-border-strong);
  border-radius: 2px;
  padding: 0 6px;
  font-size: 10px;
  color: var(--color-text-accent);
}

.prop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid var(--color-border-strong);
  vertical-align: middle;
  margin-right: 4px;
}

.copy-btn {
  margin: 14px;
  width: calc(100% - 28px);
  --el-button-bg-color: var(--color-bg-active);
  --el-button-border-color: var(--color-border-strong);
  --el-button-text-color: var(--color-accent);
  --el-button-hover-bg-color: var(--color-bg-hover);
  --el-button-hover-border-color: var(--color-accent);
  --el-button-hover-text-color: var(--color-accent);
  font-family: inherit;
  letter-spacing: 0.05em;
  border-radius: 2px;
}

.prop-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.pv-copy {
  cursor: pointer;
  transition: color 0.15s;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pv-copy:hover {
  color: var(--color-accent);
}

.prop-cell {
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.prop-cell:hover {
  border-color: var(--color-border-strong);
}

.thumb-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.thumb-box {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  background: var(--color-bg-canvas);
  padding: 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
}

.thumb-box:hover {
  border-color: var(--color-border-strong);
}

.thumb-img {
  width: 100%;
  max-height: 120px;
  object-fit: contain;
  display: block;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.02);
}

.thumb-tip {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.thumb-placeholder {
  border: 1px dashed var(--color-border-strong);
  border-radius: 2px;
  padding: 14px 10px;
  text-align: center;
  background: var(--color-bg-canvas);
}

.thumb-ph-title {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.thumb-ph-desc {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.img-preview-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.img-preview-dialog {
  width: min(860px, 100%);
  max-height: 100%;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-strong);
  border-radius: 4px;
  position: relative;
  padding: 16px;
}

.img-preview-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
  border-radius: 2px;
  cursor: pointer;
}

.img-preview-full {
  width: 100%;
  max-height: calc(100vh - 120px);
  object-fit: contain;
  display: block;
}

/* Loading & Error Overlays */
.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-base);
  z-index: 100;
}

.loading-container,
.error-container {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid var(--color-bg-hover);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0 0 24px 0;
}

.loading-back-btn {
  margin-top: 16px;
  --el-button-bg-color: var(--color-bg-active);
  --el-button-border-color: var(--color-border-strong);
  --el-button-text-color: var(--color-accent);
  --el-button-hover-bg-color: var(--color-bg-hover);
  --el-button-hover-border-color: var(--color-accent);
  --el-button-hover-text-color: var(--color-accent);
}

.error-container h2 {
  font-size: 16px;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.error-container p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 20px 0;
  max-width: 400px;
}

.error-container :deep(.el-button) {
  --el-button-bg-color: var(--color-accent);
  --el-button-border-color: var(--color-accent);
  --el-button-text-color: var(--color-bg-base);
  --el-button-hover-bg-color: rgb(102, 204, 255);
  --el-button-hover-border-color: rgb(102, 204, 255);
}
</style>
