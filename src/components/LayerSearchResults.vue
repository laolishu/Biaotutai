<template>
  <div class="lsr-wrap">
    <!-- 空状态 -->
    <div v-if="store.searchResults.length === 0" class="lsr-empty">
      未找到匹配图层
    </div>

    <!-- 结果列表 -->
    <div
      v-for="layer in store.searchResults"
      :key="layer.id"
      class="lsr-item"
      :class="{ 'is-active': store.selectedLayerId === layer.id }"
      @click="store.selectLayer(layer.id)"
      @dblclick="locateLayer(layer)"
    >
      <!-- 类型图标（与 LayerItem 一致） -->
      <svg v-if="layer.type === 'group'" class="lsr-icon" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
      </svg>
      <svg v-else-if="layer.type === 'text'" class="lsr-icon text-icon" viewBox="0 0 12 12" fill="none">
        <path d="M2 3h8M6 3v6" stroke="currentColor" stroke-width="1.2" />
      </svg>
      <svg v-else-if="layer.type === 'image'" class="lsr-icon" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
        <circle cx="4" cy="4" r="1" fill="currentColor" />
        <path d="M1 8l3-3 2 2 2-2 3 3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
      </svg>
      <svg v-else class="lsr-icon" viewBox="0 0 12 12" fill="none">
        <path d="M6 1.5l3.5 4h-7L6 1.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
        <rect x="2" y="7" width="8" height="3.5" rx="0.5" stroke="currentColor" stroke-width="1.2" />
      </svg>

      <!-- 高亮名称 -->
      <span class="lsr-name" v-html="highlightMatch(layer.name, store.searchQuery)"></span>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightMatch(name, query) {
  if (!query) return escapeHtml(name)
  const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedName = escapeHtml(name)
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return escapedName.replace(regex, '<mark>$1</mark>')
}

async function locateLayer(layer) {
  const targetLayerId = layer.id

  // 先清空当前选中，避免双击前的 click 已经选中过同一项，导致后续不触发滚动监听。
  store.selectLayer(null)
  store.setSearchQuery('')

  await nextTick()
  store.selectLayer(targetLayerId)
}
</script>

<style scoped>
.lsr-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.lsr-empty {
  padding: 24px 14px;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
}

.lsr-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.lsr-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.lsr-item.is-active {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.lsr-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.text-icon {
  color: var(--color-accent);
}

.lsr-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lsr-name :deep(mark) {
  background: transparent;
  color: var(--color-accent);
  font-weight: 600;
}
</style>
