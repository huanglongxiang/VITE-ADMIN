/**
 * 系统状态管理 Store
 * 负责：侧边栏折叠状态、菜单列表管理、动态路由生成
 * 依赖：pinia（状态管理）、vue-router（路由）、自定义工具函数
 */
import { defineStore } from 'pinia'
import router from '@/router'
import type { NavItemType } from '@/interface/layoutInterface' // 菜单类型定义
import { traverseRouter } from '@/utils/tools' // 路由扁平化工具函数
import { localStg } from '@/utils/storage'

/**
 * 校验视图组件是否存在，并返回对应的导入函数
 * 核心逻辑：通过 Vite 静态扫描 @/views 下所有 .vue 文件，匹配路径后返回导入函数
 * @param path 菜单配置的 index 路径（如：/dashboard/overview 或 dashboard/overview）
 * @returns 组件导入函数 | null（不存在时返回null）
 */
const isViewPage = ((path: string) => {
  // 1. Vite 静态扫描：构建时遍历 @/views 下所有 .vue 文件（包括子目录）
  //    返回格式：{ "@/views/dashboard/overview.vue": () => import("xxx") }
  const allView = import.meta.glob('@/views/**/*.vue')
  
  // 2. 获取所有扫描到的组件路径数组
  const keys = Object.keys(allView) as string[]
  
  // 3. 遍历路径，匹配传入的 path（模糊匹配，兼容不同格式的路径）
  for (let i = 0; i < keys.length; i++) {
    // 类型安全：确保当前遍历的路径不为 undefined
    const _path = keys[i] as string
    // 匹配规则：扫描到的组件路径包含传入的 path（兼容 /xxx 和 xxx 格式）
    if (_path && _path.includes(path)) {
      return allView[_path] // 匹配成功，返回组件的懒加载导入函数
    }
  }
  
  // 4. 无匹配路径，返回 null（组件不存在）
  return null
})

/**
 * 系统 Store 定义（pinia）
 * 命名空间：system
 */
export const useSystemStore = defineStore('system', {
  // 状态定义：响应式数据
  state: () => ({
    // 侧边栏是否折叠
    isCollapse: false,
    // 菜单列表（类型为自定义的 NavItemType 数组）
    menuList: [] as NavItemType[],
    tagViews: [] as NavItemType[],
    activeIndex: '',
  }),

  // 计算属性：基于 state 派生的只读数据
  getters: {
    // 获取侧边栏折叠状态
    getIsCollapse: (state) => state.isCollapse,
    // 获取菜单列表
    getMenuList: (state) => state.menuList,
    // 获取标签页列表
    getTagViews: (state) => state.tagViews,
  },

  // 方法：修改状态的逻辑（支持异步）
  actions: {
    logOut() {
      // 登出逻辑
      this.menuList = []
      this.tagViews = []
      this.activeIndex = ''
      this.isCollapse = false
    },
    setActiveIndex(index: string) {
      this.activeIndex = index
    },
    addTagView(tagView: NavItemType) {
      if (!this.tagViews.find(v => v.index === tagView.index)) {
        this.tagViews.push(tagView)
      }
    },
    removeTagView(tagView: NavItemType) {
      this.tagViews = this.tagViews.filter((item: NavItemType) => item.index !== tagView.index)
    },
    removeTagViewsAll() {
      this.tagViews = []
    },
    /**
     * 设置侧边栏折叠状态
     * @param collapse 折叠状态（true-折叠，false-展开）
     */
    setCollapse(collapse: boolean) {
      this.isCollapse = collapse
    },

    /**
     * 设置菜单列表，并触发动态路由更新
     * @param menuList 后端/前端配置的菜单列表数据
     */
    setMenuList(menuList: NavItemType[]) {
      this.menuList = menuList // 更新菜单列表状态
      this.updateRouter(menuList) // 同步更新动态路由
    },


    /**
     * 核心方法：根据菜单列表生成动态路由
     * @param menuItems 扁平化前的菜单列表
     */
    updateRouter(menuItems?: NavItemType[]) {
      try {
        // 1. 扁平化菜单列表（处理嵌套菜单，转为一维数组）
        let flatRoutes:NavItemType[] = []
        if(menuItems){
          flatRoutes = traverseRouter(menuItems)
        } else {
          flatRoutes = traverseRouter(this.menuList)
        }

        
        let routes:any[] = []
        // 2. 遍历扁平化后的菜单，逐个生成路由
        flatRoutes.forEach(async (item: NavItemType) => {
          try {
            // 边界校验：菜单缺少 index 路径配置（路由核心参数）
            if (!item.index) {
              throw new Error(`菜单【${item.title}】缺少index路径配置`);
            }

            // 3. 校验并获取组件导入函数（不存在则返回null）
            let component = isViewPage(item.index)

            // 4. 定义路由配置（符合 vue-router 规范）
            const routeConfig = {
              path: item.index, // 路由路径（使用菜单的 index 字段）
              name: `Route_${item.title.replace(/\s+/g, '_')}`, // 路由名称（替换空格为下划线，避免冲突）
              meta: { // 路由元信息（用于面包屑、侧边栏渲染等）
                title: item.title, // 菜单标题
                icon: item.icon,   // 菜单图标
                titles: item.titles, // 用于面包屑渲染
                indexes: item.indexes // 用于面包屑渲染
              },
              // 组件：存在则用匹配的组件，否则用 404 兜底组件
              component: component ? component : () => import('@/views/404.vue'),
            };
            routes.push(routeConfig)
            // 5. 动态添加路由（挂载到 Layout 父路由下）
            //    注意：Layout 需提前在路由表中定义为父路由
            router.addRoute('Layout', routeConfig);
          } catch (error) {
            // 错误隔离：单个菜单路由生成失败，不影响其他菜单
            const errMsg = error instanceof Error ? error.message : '未知错误';
            console.error(`❌ 菜单【${item.title}】路由添加失败：`, errMsg);
            // 可选：取消注释可终止所有路由添加（根据业务需求选择）
            // throw error;
          }
        });
        localStg.set('routes', routes)  // 缓存路由
      } catch (error) {
        // 全局错误捕获：路由更新整体失败
        console.error('💥 路由更新整体失败:', error);
      }
    },
  },

  // 持久化配置：将 state 数据持久化到本地存储（如 localStorage）
  persist: true,
})