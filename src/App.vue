<template>
  <router-view />
</template>

<script setup>
import { useTheme } from './composables/useTheme'
// 在应用顶层初始化，确保 data-theme 在所有子组件渲染前已设置
useTheme()
</script>
