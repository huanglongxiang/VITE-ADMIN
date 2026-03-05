import { createApp } from 'vue'

import App from './App.vue'
import router from './router'; // 引入路由
import pinia from './stores/index'
import { useSystemStore } from './stores/modules/system' // 导入系统store


import 'element-plus/dist/index.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import '@/style.css'
import "@/utils/qiankunMain";

import './mock/index.ts'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia); // 注册 Pinia

// 2. 获取系统store实例
const systemStore = useSystemStore()

// 国际化应用语言
app.use(ElementPlus, {
  locale: zhCn,
})

// 3. 在路由初始化前预加载动态路由
systemStore.updateRouter()

app.use(router); // 使用路由
app.mount('#app')
