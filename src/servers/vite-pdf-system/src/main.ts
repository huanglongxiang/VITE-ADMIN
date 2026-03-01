import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 1. 移除重复的 mount 函数定义
// 2. 修复 qiankun 生命周期的逻辑
// 3. 修正 app 实例的管理方式

let app: any = null

// 非 qiankun 环境下直接挂载
if (!(window as any).__POWERED_BY_QIANKUN__) {
  app = createApp(App)
  app.mount('#app')
}

// qiankun 生命周期
export const bootstrap = async () => {
  console.log('vite-pdf-system bootstrapped')
  // 在 bootstrap 中创建 app 实例（qiankun 会先调用 bootstrap）
  app = createApp(App)
}

export const mount = async () => {
  console.log('vite-pdf-system mounted')
  // 在 mount 中执行挂载（qiankun 会调用 mount）
  app.mount('#app')
}

export const unmount = async () => {
  console.log('vite-pdf-system unmounted')
  app.unmount()
}