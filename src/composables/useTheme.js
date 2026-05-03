import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'biaotutai-theme'

// 模块级单例，确保全局状态一致
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

// 立即执行：同步 data-theme 属性与 localStorage
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
