<template>
  <template v-for="layer in layers" :key="layer.id">
    <!-- group 类型：不渲染自身热区，递归渲染子图层 -->
    <template v-if="layer.type === 'group' && !layer.hidden">
      <HotspotLayer
        v-if="layer.children && layer.children.length"
        :layers="layer.children"
      />
    </template>

    <!-- 非 group 类型：渲染热区 -->
    <div
      v-else-if="!layer.hidden"
      class="hotspot"
      :class="{ 'hs-active': store.selectedLayerId === layer.id }"
      :style="{
        left: layer.x + 'px',
        top: layer.y + 'px',
        width: layer.width + 'px',
        height: layer.height + 'px'
      }"
      @mouseenter="showTip(layer)"
      @mouseleave="hideTip"
      @click.stop="handleClick(layer)"
    >
      <!-- 自实现 tooltip -->
      <div v-if="hoveredId === layer.id" class="hs-tooltip">
        <div class="hs-name">{{ layer.name }}</div>
        <div class="hs-geo">{{ layer.width }} × {{ layer.height }} · ({{ layer.x }}, {{ layer.y }})</div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'

defineProps({
  layers: {
    type: Array,
    required: true
  }
})

const store = useMainStore()
const hoveredId = ref(null)

function showTip(layer) {
  hoveredId.value = layer.id
}

function hideTip() {
  hoveredId.value = null
}

function handleClick(layer) {
  store.selectLayer(layer.id)
}
</script>

<style scoped>
.hotspot {
  position: absolute;
  border: 1px solid var(--color-border-strong);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}

.hotspot:hover,
.hotspot.hs-active {
  border-color: var(--color-accent);
  background: rgba(0, 212, 255, 0.05);
}

.hotspot.hs-active {
  border-width: 2px;
  box-shadow: inset 0 0 0 1px var(--color-accent);
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
  z-index: 100;
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
</style>
