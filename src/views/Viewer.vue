<template>
  <div class="viewer">
    <!-- 顶部只读标识栏 -->
    <header class="v-header">
      <div class="v-hd-left">
        <span class="v-brand-dot"></span>
        <span class="v-brand">标图台</span>
        <span class="v-sep">/</span>
        <span class="v-filename">dashboard_v3.psd</span>
        <span class="v-badge">只读</span>
      </div>
      <div class="v-hd-right">
        <span class="v-stat">24 个图层</span>
        <span class="v-stat">3840 × 1080</span>
        <button class="v-theme-btn" :title="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
          :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'" @click="toggleTheme">
          <svg v-if="theme === 'dark'" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.22 3.22l1.06 1.06M11.72 11.72l1.06 1.06M3.22 12.78l1.06-1.06M11.72 4.28l1.06-1.06"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" stroke="currentColor" stroke-width="1.5"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </header>

    <!-- 画布区域 -->
    <main class="v-main">
      <div class="v-canvas-wrap">
        <div class="v-stage">
          <!-- 模拟背景 -->
          <div class="v-mock-bg"></div>

          <!-- 各 hotspot -->
          <div v-for="item in hotspots" :key="item.id" class="v-hotspot" :class="{ 'v-active': activeId === item.id }"
            :style="{ left: item.x + 'px', top: item.y + 'px', width: item.w + 'px', height: item.h + 'px' }"
            @mouseenter="activeId = item.id" @mouseleave="activeId = null">
            <transition name="tip-fade">
              <div v-if="activeId === item.id" class="v-tip">
                <div class="v-tip-name">{{ item.name }}</div>
                <table class="v-tip-table">
                  <tr>
                    <td>类型</td>
                    <td>{{ item.type }}</td>
                  </tr>
                  <tr>
                    <td>坐标</td>
                    <td>{{ item.x * 4 }}, {{ item.y * 4 }}</td>
                  </tr>
                  <tr>
                    <td>尺寸</td>
                    <td>{{ item.w * 4 }} × {{ item.h * 4 }}</td>
                  </tr>
                </table>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- 右侧图层索引 -->
      <aside class="v-index">
        <div class="v-index-head">图层索引</div>
        <el-scrollbar class="v-index-scroll">
          <div v-for="item in hotspots" :key="'idx-' + item.id" class="v-index-item"
            :class="{ 'v-idx-active': activeId === item.id }" @mouseenter="activeId = item.id"
            @mouseleave="activeId = null">
            <span class="v-idx-dot"></span>
            <span class="v-idx-name">{{ item.name }}</span>
            <span class="v-idx-type">{{ item.type }}</span>
          </div>
        </el-scrollbar>
      </aside>
    </main>

    <!-- 底部信息栏 -->
    <footer class="v-footer">
      <span>仅供查看，不可编辑</span>
      <span class="v-ft-sep">·</span>
      <span>hover 图层查看标注</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElScrollbar } from 'element-plus'
import { useTheme } from '../composables/useTheme'
const activeId = ref(null)
const { theme, toggleTheme } = useTheme()
const hotspots = [
  { id: 1, name: 'Header', type: 'group', x: 20, y: 8, w: 920, h: 55 },
  { id: 2, name: 'logo', type: 'img', x: 30, y: 14, w: 120, h: 40 },
  { id: 3, name: 'nav-title', type: 'text', x: 170, y: 18, w: 200, h: 28 },
  { id: 4, name: 'KPI-Card-1', type: 'group', x: 20, y: 80, w: 180, h: 100 },
  { id: 5, name: 'KPI-Card-2', type: 'group', x: 215, y: 80, w: 180, h: 100 },
  { id: 6, name: 'KPI-Card-3', type: 'group', x: 410, y: 80, w: 180, h: 100 },
  { id: 7, name: 'Chart-A', type: 'group', x: 20, y: 200, w: 380, h: 60 },
]
</script>

<style scoped>
.viewer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-base);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--color-text-primary);
  overflow: hidden;
}

/* ── header ── */
.v-header {
  height: 44px;
  min-height: 44px;
  background: var(--color-bg-panel);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.v-hd-left,
.v-hd-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── viewer 主题切换按钮 ── */
.v-theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.v-theme-btn svg {
  width: 14px;
  height: 14px;
}

.v-theme-btn:hover {
  background: var(--color-bg-active);
  border-color: var(--color-border-strong);
  color: var(--color-accent);
}

.v-brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 6px var(--color-accent-glow);
}

.v-brand {
  font-size: 13px;
  color: var(--color-text-primary);
}

.v-sep {
  color: var(--color-border);
}

.v-filename {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.v-badge {
  font-size: 10px;
  padding: 2px 8px;
  background: rgba(255, 190, 0, 0.1);
  border: 1px solid rgba(255, 190, 0, 0.3);
  border-radius: 2px;
  color: #ffbe00;
  letter-spacing: 0.08em;
}

.v-stat {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* ── main ── */
.v-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.v-canvas-wrap {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 28px;
}

.v-stage {
  position: relative;
  width: 960px;
  height: 270px;
  flex-shrink: 0;
}

.v-mock-bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.025) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* ── hotspot ── */
.v-hotspot {
  position: absolute;
  border: 1px solid var(--color-border-strong);
  cursor: default;
  transition: border-color 0.15s, background 0.15s;
}

.v-hotspot.v-active {
  border-color: var(--color-accent);
  background: var(--color-bg-active);
  z-index: 10;
}

/* tooltip */
.v-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-strong);
  padding: 8px 12px;
  border-radius: 2px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  min-width: 160px;
}

.v-tip-name {
  font-size: 12px;
  color: var(--color-text-primary);
  margin-bottom: 6px;
  font-weight: 600;
}

.v-tip-table {
  border-collapse: collapse;
  width: 100%;
}

.v-tip-table td {
  font-size: 11px;
  padding: 1px 0;
}

.v-tip-table td:first-child {
  color: var(--color-text-muted);
  width: 40px;
}

.v-tip-table td:last-child {
  color: var(--color-text-primary);
  padding-left: 8px;
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.tip-fade-enter-from,
.tip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* ── 右侧索引 ── */
.v-index {
  width: 200px;
  min-width: 200px;
  border-left: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.v-index-scroll {
  flex: 1;
}

.v-index-scroll :deep(.el-scrollbar__view) {
  padding: 0;
}

.v-index-head {
  padding: 10px 14px;
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--color-border);
}

.v-index-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: default;
  transition: background 0.1s, color 0.1s;
}

.v-index-item.v-idx-active {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.v-idx-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-border-strong);
  flex-shrink: 0;
}

.v-idx-active .v-idx-dot {
  background: var(--color-accent);
  box-shadow: 0 0 4px var(--color-accent-glow);
}

.v-idx-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-idx-type {
  font-size: 9px;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 0 4px;
}

/* ── footer ── */
.v-footer {
  height: 28px;
  background: var(--color-bg-base);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.v-ft-sep {
  color: var(--color-border);
}
</style>
