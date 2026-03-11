<template>
    <!-- 标签页视图容器 -->
    <el-header class="p-t-4px p-b-4px p-l-10px p-r-10px h-auto flex">
        <!-- 滚动条容器：隐藏滚动条但保留滚动功能 -->
        <el-scrollbar class="hidden-scrollbar flex-1">
            <!-- 标签页列表容器 -->
            <div class="tagView flex">
                <!-- 过渡动画组：为标签页添加进入/离开动画 -->
                <transition-group name="list">
                    <!-- 遍历渲染每个标签页 -->
                    <el-tag 
                        :closable="getTagViews.length > 1" 
                        class="cursor-pointer m-r-5px"      
                        :effect="route.meta.title === item.title ? 'dark' : 'plain'"  
                        :key="item.index"                   
                        @click="handleToView(item)"        
                        @close="handleClose(item)"         
                        @contextmenu.prevent="handleMenuOpen(item, $event)"  
                        v-for="item in getTagViews"
                    >
                        {{ item.title }}  <!-- 标签显示文本 -->
                    </el-tag>
                    
                    <!-- 全部关闭按钮：当有多个标签时显示 -->
                    <el-tag 
                        type="info" 
                        @click="handleCloseAll" 
                        v-if="getTagViews.length > 1"  
                        class="cursor-pointer m-r-5px"
                    >
                        <div class="flex justify-center items-center">
                            <!-- 关闭图标 -->
                            <sIcon :icon="'CircleClose'" class="m-r-3px"></sIcon>
                            关闭全部
                        </div>
                    </el-tag>
                </transition-group>
            </div>
        </el-scrollbar>
        
        <!-- 右键上下文菜单 -->
        <ul 
            v-show="isShowTagMenu" 
            ref="contextMenuRef" 
            class="
                shadow-[0px_0px_12px_rgba(0,0,0,0.12)]  
                ease-in-out                            
                duration-0.3s                           
                px-0 py-5px                             
                absolute                                
                z-10 m-0                               
                bg-[#fff]                              
                list-none                              
                rounded                                
                afterClass                            
            "
            :style="{ 
                top: `${positionsTagMenu.y}px`, 
                left: `${positionsTagMenu.x}px`, 
                opacity: positionsTagMenu.opacityVal 
            }"
        >
            <!-- 菜单项列表 -->
            <li 
                v-for="item in source" 
                class="m-0 px-16px py-7px cursor-pointer hover:bg-blue-100 hover:text-blue-500"
            >
                {{ item.value }}
            </li>
        </ul>
    </el-header>
</template>

<script lang="ts" setup>
// 导入系统状态管理 store
import { useTagViewStore } from '@/stores/modules/tagView'
import { useSystemStore } from '@/stores/modules/system'


// 导入 Pinia 的 storeToRefs 工具，用于提取响应式引用
import { storeToRefs } from 'pinia'

// 导入 Vue Router 的路由和导航钩子
import { useRoute, useRouter } from 'vue-router'

// 导入导航项类型定义
import type { NavItemType } from '@/layout/interface/layoutInterface'

// 导入本地存储工具函数
import storage from '@/utils/storage'

/**
 * 获取当前路由实例
 * 用于访问当前路由信息
 */
const route = useRoute()

/**
 * 获取路由导航实例
 * 用于执行路由跳转等操作
 */
const router = useRouter()

/**
 * 获取系统 store 实例
 * 管理标签页、菜单等全局状态
 */
const tagViewStore = useTagViewStore()
const systemStore = useSystemStore()

/**
 * 从 store 中提取标签页列表的响应式引用
 * getTagViews: 当前打开的所有标签页数组
 */
const { getTagViews } = storeToRefs(tagViewStore)

/**
 * 控制右键菜单是否显示
 */
const isShowTagMenu = ref(false)

/**
 * 处理标签页点击事件
 * 点击标签页时跳转到对应页面并设置活动索引
 * @param item - 被点击的导航项对象
 */
const handleToView = (item: NavItemType) => {
    // 路由跳转到指定路径
    router.push(item.index)
    
    // 更新 store 中的活动索引
    systemStore.setActiveIndex(item.index)
}

/**
 * 处理关闭单个标签页事件
 * 关闭后自动跳转到相邻的标签页（优先左侧，没有则右侧）
 * @param item - 要关闭的导航项对象
 */
const handleClose = (item: NavItemType) => {
    // 查找要关闭的标签页在数组中的索引
    let _index = getTagViews.value.findIndex(v => v.index === item.index)
    
    let nextTagView = null
    
    // 确定下一个要跳转的标签页
    if (_index - 1 < 0) {
        // 如果是第一个标签，选择后面的标签
        nextTagView = getTagViews.value[_index + 1]
    } else {
        // 否则选择前面的标签
        nextTagView = getTagViews.value[_index - 1]
    }
    
    // 从 store 中移除该标签页
    tagViewStore.removeTagView(item)
    
    // 如果关闭的是当前激活的标签页，则跳转到下一个标签页
    if (systemStore.activeIndex === item.index) {
        handleToView(nextTagView as NavItemType)
    }
}

/**
 * 处理关闭所有标签页事件
 * 关闭后保留第一个菜单项作为首页
 */
const handleCloseAll = () => {
    // 移除所有标签页
    tagViewStore.removeTagViewsAll()
    
    // 从本地存储获取路由缓存
    const routes = storage.localStg.get("routes", [])
    
    if (routes && routes.length > 0) {
        // 获取菜单列表的第一个菜单项
        const firstRoute = systemStore.menuList[0]
        
        if (firstRoute) {
            // 跳转到首页
            router.push('/home')
            
            // 添加第一个菜单项到标签页
            tagViewStore.addTagView(firstRoute)
            
            // 设置活动索引
            systemStore.setActiveIndex(firstRoute.index)
        }
    }
}

/**
 * 右键菜单位置和透明度配置
 * x: 水平位置
 * y: 垂直位置
 * opacityVal: 透明度值（用于渐变显示效果）
 */
const positionsTagMenu = ref({
    x: 0,
    y: 0,
    opacityVal: 0
})

/**
 * 右键菜单 DOM 引用
 */
const contextMenuRef = ref<HTMLElement | null>(null)

/**
 * 处理右键菜单打开事件
 * 计算菜单位置并居中显示在标签页下方
 * @param item - 右键点击的导航项
 * @param e - 鼠标事件对象
 */
const handleMenuOpen = (item: NavItemType, e: MouseEvent) => {
    // 先关闭当前显示的菜单
    handleCloseMenu()
    
    // 延迟显示菜单
    setTimeout(() => {
        // 显示菜单
        isShowTagMenu.value = true
        
        // 获取触发事件的 DOM 元素
        const target = e.target as HTMLElement
        
        setTimeout(() => {
            // 获取标签页元素的边界矩形
            let tagRect = target.closest(".el-tag")?.getBoundingClientRect()
            
            if (tagRect) {
                let { x, y } = tagRect
                
                // 设置菜单的初始位置（标签页下方）
                positionsTagMenu.value.x = x
                positionsTagMenu.value.y = y + 27
                
                // 如果菜单 DOM 存在，进行居中计算
                if (contextMenuRef.value) {
                    // 获取菜单自身的边界矩形
                    let contextMenuRect = contextMenuRef.value.getBoundingClientRect()
                    
                    // 根据标签页和菜单宽度差值进行水平居中
                    if (tagRect.width > contextMenuRect.width) {
                        // 标签页更宽，菜单向右偏移
                        positionsTagMenu.value.x = positionsTagMenu.value.x + (tagRect.width - contextMenuRect.width) / 2
                    } else if (tagRect.width < contextMenuRect.width) {
                        // 菜单更宽，菜单向左偏移
                        positionsTagMenu.value.x = positionsTagMenu.value.x - (contextMenuRect.width - tagRect.width) / 2
                    }
                    
                    // 延迟增加透明度，实现渐变显示效果
                    setTimeout(() => {
                        positionsTagMenu.value.opacityVal = 1
                    }, 200)
                }
            }
        })
    })
}

/**
 * 关闭右键菜单
 * 隐藏菜单并将透明度设为 0
 */
const handleCloseMenu = () => {
    // 隐藏菜单
    isShowTagMenu.value = false
    
    // 设置透明度为 0
    positionsTagMenu.value.opacityVal = 0
}

/**
 * 右键菜单选项数据源
 */
const source = ref([
    {
        value: '刷新',     // 刷新当前标签页
    },
    {
        value: '关闭',     // 关闭当前标签页
    },
    {
        value: '关闭其他',  // 关闭除当前外的所有标签页
    }
])

// 监听全局点击事件，点击任意位置时关闭右键菜单
document.addEventListener('click', handleCloseMenu)
</script>

<style scoped lang="scss">
/**
 * 右键菜单箭头样式
 * 使用 CSS 伪元素在菜单顶部创建三角形箭头
 */
.afterClass::after {
    content: '';                         
    border: 5px solid #fff;              
    width: 0;                            
    height: 0;                           
    line-height: 0;                       
    display: inline-block;                
    position: absolute;                   
    top: -10px;                           
    left: 50%;                           
    transform: translateX(-50%);          
    border-top-color: transparent;        
    border-left-color: transparent;       
    border-right-color: transparent;      
}
</style>