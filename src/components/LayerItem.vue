<template>
  <div class="layer-item-wrap">
    <div
      ref="itemRef"
      class="layer-item"
      :class="{
        'is-group': layer.type === 'group',
        'is-active': store.selectedLayerId === layer.id
      }"
      :style="{ paddingLeft: `${14 + depth * 14}px` }"
      @click="handleClick"
    >
      <!-- 类型图标 -->
      <svg v-if="layer.type === 'group'" class="layer-icon" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
      </svg>
      <svg v-else-if="layer.type === 'text'" class="layer-icon text-icon" viewBox="0 0 12 12" fill="none">
        <path d="M2 3h8M6 3v6" stroke="currentColor" stroke-width="1.2" />
      </svg>
      <svg v-else-if="layer.type === 'image'" class="layer-icon" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.2" />
        <circle cx="4" cy="4" r="1" fill="currentColor" />
        <path d="M1 8l3-3 2 2 2-2 3 3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
      </svg>
      <svg v-else class="layer-icon" viewBox="0 0 12 12" fill="none">
        <path d="M6 1.5l3.5 4h-7L6 1.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
        <rect x="2" y="7" width="8" height="3.5" rx="0.5" stroke="currentColor" stroke-width="1.2" />
      </svg>

      <span class="layer-name">{{ layer.name }}</span>
      <span class="layer-tag">{{ layer.type }}</span>
    </div>

    <!-- 递归渲染子图层 -->
    <template v-if="layer.type === 'group' && layer.children && layer.children.length">
      <LayerItem
        v-for="child in layer.children"
        :key="child.id"
        :layer="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useMainStore } from '../store'

const props = defineProps({
  layer: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

const store = useMainStore()
const itemRef = ref(null)

watch(() => store.selectedLayerId, (newId) => {
  if (newId === props.layer.id) {
    nextTick(() => {
      itemRef.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }
}, { immediate: true })

function handleClick() {
  store.selectLayer(props.layer.id)
}
</script>

<style scoped>
.layer-item-wrap {
  display: contents;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.layer-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.layer-item.is-active {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.layer-item.is-group > .layer-name {
  font-weight: 500;
}

.layer-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.text-icon {
  color: var(--color-accent);
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
  flex-shrink: 0;
}
</style>
