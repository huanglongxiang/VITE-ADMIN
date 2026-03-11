import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue'; // 引入主应用布局
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {toOneChildrenPage} from '@/utils/tools'
import storage from '@/utils/storage'
import type { RouteConfig } from '@/layout/interface/layoutInterface';




const routes = [
  {
    path: '/',
    component: Layout, // 主应用首页
    name: 'Layout',
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta:{
          index: '/home',
          title: '首页',
          titles:['首页']
        },
        component: () => import('@/views/Home.vue'), // 首页作为默认子路由
      },
      {
        path: '/pdf',
        name: 'PdfSystem',
        component: () => import('@/views/PdfSystem.vue'), // 子应用页面占位组件
      },
    ],
    
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});




NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 面包屑多层处理
  let _routesArr: string[] = []
  // 修复类型错误：明确指定返回类型为 RouteConfig[] 数组
  const routesData = storage.localStg.get<RouteConfig[]>("routes", [])
  
  // 添加类型检查确保是数组后再进行 map 操作
  if (Array.isArray(routesData) && routesData.length > 0) {
    _routesArr = routesData.map((v: RouteConfig) => {
      return v.path
    })
  }
  if(!_routesArr.includes(to.path)) {
    toOneChildrenPage(to.path, (_path:string | null) => {
      if (_path) {
        next(_path)
      } else {
        next()
      }
      NProgress.done() 
    })
  }
  next()
  NProgress.done() 
})

// 全局后置守卫
router.afterEach(() => {
  NProgress.done()
})

export default router;