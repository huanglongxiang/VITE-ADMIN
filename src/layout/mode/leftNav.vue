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
import { ref, onMounted } from 'vue'
import { useSystemStore } from '@/stores/modules/system'
import { getUserList } from '@/api/user'
import { storeToRefs } from 'pinia'
import NavItem from '@/layout/mode/navItem.vue'
import type { NavItemType } from '@/interface/layoutInterface'


const systemStore = useSystemStore()
const { getIsCollapse } = storeToRefs(systemStore)

const navData = ref<NavItemType[]>([])


// 处理菜单选择
const handleSelect = (index: string) => {
    systemStore.setActiveIndex(index)
}

// 改进的获取菜单数据方法
const loadMenuData = async () => {
    try {
        // 添加防抖和错误处理
        const res: any = await getUserList()
        if (res && res.message === 'SUCCESS') {
            navData.value = formatMenuData(res.data)
            systemStore.setMenuList(navData.value)
            if (!systemStore.activeIndex && navData.value[0]) {
                systemStore.addTagView(navData.value[0])
                systemStore.setActiveIndex('/home')
            }
        }
    } catch (error) {
        console.error('获取菜单数据失败:', error)
    }
}

// 获取并格式化菜单数据
onMounted(async () => {
    // 延迟执行，确保路由和store完全初始化
    await new Promise(resolve => setTimeout(resolve, 100))
    await loadMenuData()
})

// 格式化菜单数据
const formatMenuData = (data: any[]): any[] => {
    
    return data.map((item: any, index: number) => ({
        index: item.path,
        title: item.title || item.name || '未命名菜单',
        icon: item?.meta?.icon || 'location',
        children: item.children ? formatMenuData(item.children) : undefined
    }))
}
</script>
