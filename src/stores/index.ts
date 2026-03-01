// src/stores/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()

// 全局注册持久化插件（所有 Store 默认持久化）
pinia.use(piniaPluginPersistedstate)

// 导出 Pinia 实例，供 main.js 使用
export default pinia

// 导出所有模块 Store，实现按需导入
export * from './modules/system'