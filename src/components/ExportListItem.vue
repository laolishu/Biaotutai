<template>
    <li class="export-li">
        <label class="export-item" :style="{ paddingLeft: (depth * 14) + 'px' }">
            <input type="checkbox" :checked="!item.hidden" @change="onToggle($event)" />
            <span class="name" :class="{ 'is-override': item.overridden }">{{ item.name }}</span>
            <span v-if="item.overridden" class="override-dot" title="已手动修改"></span>
        </label>
        <ul v-if="item.children && item.children.length" class="export-subtree">
            <ExportListItem v-for="child in item.children" :key="child.id" :item="child" :depth="depth + 1" />
        </ul>
    </li>
</template>

<script setup>
import { useMainStore } from '../store'

const props = defineProps({
    item: { type: Object, required: true },
    depth: { type: Number, default: 0 }
})

const store = useMainStore()

function onToggle(e) {
    store.toggleExportItem(props.item.id, e.target.checked)
}
</script>

<style scoped>
.export-li {
    list-style: none;
}

.export-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 14px;
    font-size: 12px;
    color: var(--color-text-secondary);
    cursor: default;
    user-select: none;
}

.export-item input[type='checkbox'] {
    accent-color: var(--color-accent);
    flex-shrink: 0;
}

.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.name.is-override {
    color: var(--color-accent);
}

.override-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-accent);
    flex-shrink: 0;
}

.export-subtree {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
