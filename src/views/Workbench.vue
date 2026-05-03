<template>
  <div class="wb" :class="{ 'is-resizing': isResizing || isRightResizing }">

    <!-- ── Header ── -->
    <header class="wb-header">
      <div class="hd-left">
        <el-button class="hd-btn hd-back" text>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          返回
        </el-button>
        <div class="hd-divider"></div>
        <div class="hd-file">
          <span class="hd-dot"></span>
          <span class="hd-filename">dashboard_v3.psd</span>
          <span class="hd-size">3840 × 1080</span>
        </div>
      </div>
      <div class="hd-right">
        <button class="hd-action" type="button" title="缩放适配" aria-label="缩放适配">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 6V2.5H6M13.5 6V2.5H10M2.5 10V13.5H6M13.5 10V13.5H10" stroke="currentColor" stroke-width="1.4"
              stroke-linecap="round" stroke-linejoin="round" />
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
        <button class="hd-action hd-action-emphasis" type="button" title="导出 JSON" aria-label="导出 JSON">
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
            <span>{{ activePanel === 'layers' ? '图层' : '搜索' }}</span>
            <span v-if="activePanel === 'layers'" class="panel-count">24</span>
          </div>

          <el-scrollbar v-show="isPanelOpen && activePanel === 'layers'" class="layer-list">
            <div class="layer-item group active">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">背景组</span>
              <span class="layer-tag">group</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <path d="M2 2h8v8H2z" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">bg-gradient</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">grid-overlay</span>
            </div>
            <div class="layer-item group">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">Header</span>
              <span class="layer-tag">group</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon text-icon" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M6 3v6" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">title-text</span>
              <span class="layer-tag">text</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <path d="M2 2h8v8H2z" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">logo-img</span>
              <span class="layer-tag">img</span>
            </div>
            <div class="layer-item group">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">Chart-A</span>
              <span class="layer-tag">group</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <path d="M2 9V5l3-2 3 2 2-3v7" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">chart-bar</span>
            </div>
            <div class="layer-item" style="padding-left:24px">
              <svg class="layer-icon text-icon" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M6 3v6" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">label-x</span>
              <span class="layer-tag">text</span>
            </div>
            <div class="layer-item group">
              <svg class="layer-icon" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span class="layer-name">KPI卡片-1</span>
              <span class="layer-tag">group</span>
            </div>
          </el-scrollbar>

          <div v-show="isPanelOpen && activePanel === 'search'" class="search-pane">
            <div class="search-title">搜索（占位）</div>
            <div class="search-input">输入图层名进行过滤...</div>
            <div class="search-hint">当前版本仅展示 Activity Bar 分页切换效果。</div>
          </div>

          <div v-show="isPanelOpen" class="resize-handle" @mousedown="startResize"></div>
        </aside>
      </div>

      <!-- 中间画布 -->
      <section class="canvas-area">
        <div class="canvas-ruler-x">
          <span v-for="n in 10" :key="n" class="ruler-mark">{{ (n - 1) * 400 }}</span>
        </div>
        <div class="canvas-scroll">
          <div class="canvas-stage">
            <div class="mock-bg"></div>
            <div class="hotspot hs-active" style="left:80px;top:30px;width:320px;height:60px">
              <div class="hs-tooltip">
                <div class="hs-name">Header</div>
                <div class="hs-geo">320 × 60 · (80, 30)</div>
              </div>
            </div>
            <div class="hotspot" style="left:80px;top:120px;width:180px;height:130px"></div>
            <div class="hotspot" style="left:280px;top:120px;width:180px;height:130px"></div>
            <div class="hotspot" style="left:80px;top:280px;width:380px;height:80px"></div>
          </div>
        </div>
        <div class="canvas-status">
          <span>3840 × 1080 px</span>
          <span class="st-sep">·</span>
          <span>缩放 25%</span>
          <span class="st-sep">·</span>
          <span>已选中 Header</span>
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
            <div class="prop-section">
              <div class="prop-label">基础</div>
              <div class="prop-row"><span class="pk">名称</span><span class="pv">Header</span></div>
              <div class="prop-row"><span class="pk">类型</span><span class="pv pv-tag">group</span></div>
            </div>
            <div class="prop-section">
              <div class="prop-label">几何</div>
              <div class="prop-grid">
                <div class="prop-cell"><span class="pk">X</span><span class="pv">80</span></div>
                <div class="prop-cell"><span class="pk">Y</span><span class="pv">30</span></div>
                <div class="prop-cell"><span class="pk">W</span><span class="pv">320</span></div>
                <div class="prop-cell"><span class="pk">H</span><span class="pv">60</span></div>
              </div>
            </div>
            <div class="prop-section">
              <div class="prop-label">样式</div>
              <div class="prop-row"><span class="pk">填充</span><span class="pv"><span class="swatch"
                    style="background:#1a2a4a"></span>#1a2a4a</span></div>
              <div class="prop-row"><span class="pk">透明度</span><span class="pv">100%</span></div>
            </div>
            <el-button class="copy-btn" plain>复制 JSON</el-button>
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
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { ElButton, ElScrollbar } from 'element-plus'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

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
  width: 960px;
  height: 270px;
  flex-shrink: 0;
}

.mock-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0a1628 0%, #07111e 100%);
  border: 1px solid rgba(0, 212, 255, 0.1);
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.hotspot {
  position: absolute;
  border: 1px solid var(--color-border-strong);
  background: var(--color-bg-hover);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.hotspot:hover,
.hotspot.hs-active {
  border-color: var(--color-accent);
  background: var(--color-bg-active);
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

.prop-cell {
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
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
</style>
