<template>
    <el-menu :class="getIsCollapse ? '' : 'max-h-[calc(100vh-50px)] overflow-auto'"
        class="border-r-none el-menu-vertical transition-width duration-300 ease-in-out" 
        :collapse="getIsCollapse" :default-active="systemStore.activeIndex" :router="true"
        @select="handleSelect">
        <!-- 动态生成菜单项 -->
        <nav-item :navData="navData"></nav-item>
    </el-menu>
</template>

<script lang="ts" setup>
// 导入 Vue 3 响应式 API：ref 用于创建响应式引用，onMounted 用于组件挂载后的生命周期钩子
import { ref, onMounted } from 'vue'

// 导入系统状态管理 store，用于管理全局的菜单、标签页等状态
import { useSystemStore } from '@/stores/modules/system'

// 导入用户相关的 API 接口，用于获取用户菜单数据
import { getUserList } from '@/api/modules/user'

// 导入 Pinia 的 storeToRefs 工具，用于从 store 中提取响应式的 refs
import { storeToRefs } from 'pinia'

// 导入导航菜单项子组件，用于递归渲染多级菜单
import NavItem from '@/layout/modules/navItem.vue'

// 导入导航项类型定义，确保数据结构符合规范
import type { NavItemType } from '@/layout/interface/layoutInterface'
import type { ResultData } from '@/api/interface/indexInterface'
import { ResultCode } from '@/enum/httpEnum'
import { useTagViewStore } from '@/stores/modules/tagView'

/**
 * 获取系统 store 实例
 * 用于访问和修改全局状态（菜单折叠、活动索引、标签页等）
 */
const systemStore = useSystemStore()
const tagViewStore = useTagViewStore()

/**
 * 从 store 中提取 getIsCollapse 的响应式引用
 * getIsCollapse: 控制菜单是否折叠的状态
 * 使用 storeToRefs 保持响应式同步
 */
const { getIsCollapse } = storeToRefs(systemStore)

/**
 * 导航菜单数据响应式数组
 * 存储格式化后的菜单项数据，用于渲染侧边栏菜单
 */
const navData = ref<NavItemType[]>([])

/**
 * 处理菜单项选择事件
 * 当用户点击菜单项时触发，更新 store 中的活动索引
 * @param index - 被选中的菜单项索引（通常是路由路径）
 */
const handleSelect = (index: string) => {
    systemStore.setActiveIndex(index)
}

/**
 * 加载菜单数据的方法
 * 异步获取用户菜单数据并格式化存储到本地和 store 中
 * 包含错误处理和初始化逻辑
 */
const loadMenuData = async () => {
    try {
        // 调用 API 获取用户菜单数据
        const res:ResultData = await getUserList()
        // 检查响应是否成功
        if (res && res.code == ResultCode.SUCCESS.toString()) {
            // 格式化菜单数据并赋值给本地响应式变量
            navData.value = formatMenuData(res.data.data)
            
            // 将格式化后的菜单数据同步到 store 中
            systemStore.setMenuList(navData.value)
            
            // 如果没有活动索引且存在菜单数据，则初始化第一个菜单项
            if (!systemStore.activeIndex && navData.value[0]) {
                // 添加第一个菜单项到标签页视图
                tagViewStore.addTagView(navData.value[0])
                
                // 设置活动索引为 '/home'
                systemStore.setActiveIndex('/home')
            }
        }
    } catch (error) {
        // 捕获并记录错误信息
        console.error('获取菜单数据失败:', error)
    }
}

/**
 * 组件挂载后的生命周期钩子
 * 在组件挂载后延迟执行菜单数据加载
 * 延迟 100ms 确保路由和 store 完全初始化后再获取数据
 */
onMounted(async () => {
    // 延迟执行，确保路由和 store 完全初始化
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 调用加载菜单数据方法
    await loadMenuData()
})

/**
 * 格式化菜单数据的递归函数
 * 将后端返回的原始菜单数据转换为组件所需的格式
 * @param data - 原始菜单数据数组
 * @returns 格式化后的菜单项数组
 */
const formatMenuData = (data: any[]): any[] => {
    return data.map((item: any, index: number) => ({
        // 菜单项的唯一标识，使用路径作为索引
        index: item.path,
        
        // 菜单项标题：优先使用 title，其次使用 name，最后使用默认值
        title: item.title || item.name || '未命名菜单',
        
        // 菜单图标：从 meta 中获取 icon，默认为 'location'
        icon: item?.meta?.icon || 'location',
        
        // 递归处理子菜单：如果有 children 则递归格式化，否则设为 undefined
        children: item.children ? formatMenuData(item.children) : undefined
    }))
}
</script>