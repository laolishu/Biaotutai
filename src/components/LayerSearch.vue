<template>
  <div class="layer-search">
    <div class="ls-wrap">
      <svg class="ls-icon" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.2" />
        <path d="M10 10L13.5 13.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>
      <input
        ref="inputRef"
        class="ls-input"
        type="text"
        placeholder="搜索图层..."
        :value="store.searchQuery"
        @input="handleInput"
        @keydown.esc="handleClear"
      />
      <button v-if="store.searchQuery" class="ls-clear" title="清空" @click="handleClear">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
const inputRef = ref(null)

function handleInput(e) {
  store.setSearchQuery(e.target.value)
}

function handleClear() {
  store.setSearchQuery('')
  inputRef.value?.focus()
}
</script>

<style scoped>
.layer-search {
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-border);
}

.ls-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-bg-canvas);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  padding: 5px 8px;
  transition: border-color 0.15s;
}

.ls-wrap:focus-within {
  border-color: var(--color-accent);
}

.ls-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.ls-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--color-text-primary);
  font-family: inherit;
}

.ls-input::placeholder {
  color: var(--color-text-muted);
}

.ls-clear {
  width: 14px;
  height: 14px;
  padding: 0;
  background: var(--color-bg-hover);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;
}

.ls-clear:hover {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.ls-clear svg {
  width: 8px;
  height: 8px;
}
</style>
