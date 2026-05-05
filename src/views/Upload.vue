<template>
  <div class="upload-page">
    <!-- 网格背景 -->
    <div class="grid-bg" aria-hidden="true"></div>

    <!-- 顶部品牌 -->
    <header class="brand">
      <span class="brand-dot"></span>
      <span class="brand-name">标图台</span>
      <span class="brand-version">v1.4</span>
      <button class="theme-btn" :title="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
        :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'" @click="toggleTheme">
        <!-- 暗色时显示太阳（切换到亮色），亮色时显示月亮（切换到暗色） -->
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
    </header>

    <!-- 中心卡片 -->
    <main class="card-wrap">
      <div class="upload-card" :class="{ 'drag-over': isDragging }" @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false" @drop.prevent="handleFileDrop">
        <!-- 四角装饰 -->
        <span class="corner tl"></span>
        <span class="corner tr"></span>
        <span class="corner bl"></span>
        <span class="corner br"></span>

        <div class="card-inner">
          <!-- 图标 -->
          <div class="upload-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="48" height="36" rx="3" stroke="currentColor" stroke-width="2" />
              <path d="M32 44V28M32 28L24 36M32 28L40 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M20 16V12a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4" stroke="currentColor" stroke-width="2" />
            </svg>
          </div>

          <h1 class="card-title">拖拽或点击上传设计稿</h1>
          <p class="card-desc">支持 PSD / PNG / JPG · 自动解析图层结构</p>

          <label class="upload-btn" :class="{ disabled: isProcessing }">
            <input ref="inputRef" type="file" accept=".psd,.png,.jpg,.jpeg" hidden @change="handleFileSelect"
              :disabled="isProcessing" />
            {{ isProcessing ? '处理中...' : '选择文件' }}
          </label>

          <div class="format-tags">
            <span class="tag">.psd</span>
            <span class="tag">.png</span>
            <span class="tag">.jpg</span>
          </div>

          <label class="skip-hidden-label">
            <input type="checkbox" v-model="skipHiddenLayers" :disabled="isProcessing" />
            导入时忽略隐藏图层
          </label>
        </div>
      </div>

      <!-- 流程提示 -->
      <div class="flow-hint">
        <span class="step">上传设计稿</span>
        <span class="arrow">→</span>
        <span class="step">自动解析</span>
        <span class="arrow">→</span>
        <span class="step">标注查看</span>
        <span class="arrow">→</span>
        <span class="step active">导出 JSON</span>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store'
import { ElMessage } from 'element-plus'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const store = useMainStore()
const isDragging = ref(false)
const { theme, toggleTheme } = useTheme()

const inputRef = ref(null)
const isProcessing = computed(() => store.isLoading)
const skipHiddenLayers = ref(true)

// 处理文件选择
async function handleFileSelect(event) {
  const files = event.target?.files || []
  if (files.length > 0) {
    await handleFileUpload(files[0])
  }
  // 重置 input 以便重新选择相同文件
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

// 处理拖拽上传
async function handleFileDrop(event) {
  isDragging.value = false
  const files = event.dataTransfer?.files || []
  if (files.length > 0) {
    await handleFileUpload(files[0])
  }
}

// 统一的文件上传处理
async function handleFileUpload(file) {
  // 验证文件格式
  const validTypes = ['.psd', '.png', '.jpg', '.jpeg']
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!validTypes.includes(ext)) {
    ElMessage.error('仅支持 PSD / PNG / JPG 格式')
    return
  }

  // 验证文件大小（100MB 以内）
  if (file.size > 100 * 1024 * 1024) {
    ElMessage.error('文件大小不超过 100MB')
    return
  }

  try {
    // 调用 store 的 parsePsd 方法
    await store.parsePsd(file, { skipHiddenLayers: skipHiddenLayers.value })

    // 如果解析成功，跳转到工作台
    if (store.psd && store.layers.length > 0) {
      ElMessage.success('解析成功，正在进入工作台...')
      router.push('/workbench')
    } else if (store.error) {
      // 显示更详细的错误提示，持续时间更长
      ElMessage({
        message: store.error,
        type: 'error',
        duration: 5000,
        showClose: true
      })
    }
  } catch (err) {
    ElMessage({
      message: `上传失败: ${err.message}`,
      type: 'error',
      duration: 5000,
      showClose: true
    })
  }
}
</script>

<style scoped>
/* ── 全屏深色背景 ── */
.upload-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* ── 网格背景 ── */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-bg-hover) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-bg-hover) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.grid-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 60% at 50% 50%, transparent 40%, var(--color-bg-base) 100%);
}

/* ── 品牌头部 ── */
.brand {
  position: absolute;
  top: 28px;
  left: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── 主题切换按钮 ── */
.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 8px;
  padding: 0;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.theme-btn svg {
  width: 14px;
  height: 14px;
}

.theme-btn:hover {
  background: var(--color-bg-active);
  border-color: var(--color-border-strong);
  color: var(--color-accent);
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent-glow);
  animation: pulse 2s ease-in-out infinite;
}

.brand-name {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.brand-version {
  color: var(--color-text-muted);
  font-size: 11px;
  letter-spacing: 0.15em;
}

/* ── 卡片容器 ── */
.card-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  z-index: 1;
}

/* ── 上传卡片 ── */
.upload-card {
  position: relative;
  width: 480px;
  padding: 48px 40px;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-strong);
  border-radius: 4px;
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 40px var(--color-bg-hover),
    inset 0 0 60px var(--color-bg-hover);
  transition: border-color 0.25s, box-shadow 0.25s;
  cursor: pointer;
}

.upload-card:hover,
.upload-card.drag-over {
  border-color: var(--color-accent);
  box-shadow:
    0 0 60px var(--color-accent-glow),
    inset 0 0 60px var(--color-bg-active);
}

/* 四角装饰 */
.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: var(--color-accent);
  border-style: solid;
}

.corner.tl {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
}

.corner.tr {
  top: -1px;
  right: -1px;
  border-width: 2px 2px 0 0;
}

.corner.bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2px 2px;
}

.corner.br {
  bottom: -1px;
  right: -1px;
  border-width: 0 2px 2px 0;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

/* 图标 */
.upload-icon {
  width: 64px;
  height: 64px;
  color: var(--color-accent);
  opacity: 0.8;
  filter: drop-shadow(0 0 8px var(--color-accent-glow));
}

.upload-card:hover .upload-icon {
  opacity: 1;
  filter: drop-shadow(0 0 14px var(--color-accent-glow));
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  margin: 0;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  letter-spacing: 0.03em;
  margin: 0;
}

/* 上传按钮 */
.upload-btn {
  margin-top: 8px;
  padding: 9px 28px;
  border: 1px solid var(--color-border-strong);
  border-radius: 2px;
  color: var(--color-text-accent);
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
  background: var(--color-bg-hover);
  transition: background 0.2s, border-color 0.2s;
}

.upload-btn:hover {
  background: var(--color-bg-active);
  border-color: var(--color-accent);
}

.upload-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-btn.disabled:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-strong);
}

/* 格式标签 */
.format-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 3px 10px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}

.skip-hidden-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: pointer;
  user-select: none;
  margin-top: 4px;
}
.skip-hidden-label input[type='checkbox'] {
  accent-color: var(--color-accent, #4f8ef7);
  cursor: pointer;
}

/* ── 流程提示 ── */
.flow-hint {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step {
  font-size: 12px;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
}

.step.active {
  color: var(--color-text-accent);
}

.arrow {
  color: var(--color-border);
  font-size: 12px;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
