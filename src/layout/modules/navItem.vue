<template>
    <!-- 遍历导航数据，递归渲染菜单 -->
    <template v-for="item in navData">
        <!-- 一级菜单组：有子菜单时渲染为子菜单容器 -->
        <el-sub-menu  v-if="item.children && item.children.length > 0" :index="item.index">
            <!-- 子菜单标题：显示图标和标题文本 -->
            <template #title>
                <sIcon :icon="item.icon || 'location'"></sIcon>
                <span>{{ item.title }}</span>
            </template>
            
            <!-- 递归渲染子菜单项：将子菜单数据传递给 NavItem 组件 -->
            <NavItem :navData="item.children"></NavItem>
        </el-sub-menu>
        
        <!-- 一级菜单项：无子菜单时渲染为普通菜单项 -->
        <el-menu-item v-else :index="item.index" @click="handleLink(item)">
           
                <!-- 菜单项图标：默认使用 'location' 图标 -->
                <sIcon :icon="item.icon || 'location'"></sIcon>
                <!-- 菜单项标题 -->
                <span>{{ item.title }}</span>
        </el-menu-item>
    </template>
</template>

<script lang="ts" setup>
import NavItem from '@/layout/modules/navItem.vue'  // 导入自身组件实现递归
import type { NavItemType } from '@/layout/interface/layoutInterface'  // 导入导航项类型定义
import { useTagViewStore } from '@/stores/modules/tagView'

// 获取系统 store 实例
const tagViewStore = useTagViewStore()

/**
 * Props 定义
 */
const props = defineProps({
    /**
     * 导航菜单数据数组
     * 包含菜单项的图标、标题、索引、子菜单等信息
     */
    navData: {
        type: Array as PropType<NavItemType[]>,
        required: true  // 必填属性
    }
})

/**
 * 处理菜单项点击事件
 * 点击菜单时将对应的导航项添加到标签视图
 * @param item - 被点击的导航项对象
 */
const handleLink = (item: NavItemType) => {
    tagViewStore.addTagView(item)
}
</script>
