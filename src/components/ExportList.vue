<template>
    <div class="export-list">
        <div class="export-head">导出列表</div>
        <el-scrollbar class="export-scroll">
            <ul class="export-tree">
                <ExportListItem v-for="item in store.exportList" :key="item.id" :item="item" :depth="0" />
            </ul>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { useMainStore } from '../store'
import ExportListItem from './ExportListItem.vue'

const store = useMainStore()
</script>

<style scoped>
.export-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px 0 0;
}

.export-head {
    flex-shrink: 0;
    padding: 0 12px 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-muted);
}

.export-scroll {
    flex: 1;
    min-height: 0;
}

:deep(.el-scrollbar__wrap) {
    height: 100%;
}

.export-tree {
    list-style: none;
    padding: 0 0 12px;
    margin: 0;
}
</style>
