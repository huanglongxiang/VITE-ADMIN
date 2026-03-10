<template>
    <!-- 面包屑导航组件 -->
    <!-- separator-icon: 分隔符图标，使用 ArrowRight -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <!-- 过渡动画组：为面包屑项添加进入/离开动画 -->
        <transition-group name="breadcrumb">
            <!-- 遍历渲染每个面包屑项 -->
            <el-breadcrumb-item 
                v-for="(item, index) in breadcrumbList" 
                :key="`breadcrumb-${index}`"
            >
                <!-- 非最后一项：渲染为可点击链接 -->
                <!-- index < breadcrumbList.length - 1 判断是否为最后一项 -->
                <a @click="handleBreadcrumbClick(index)" v-if="index < breadcrumbList.length - 1"> 
                    {{ item }}
                </a>
                
                <!-- 最后一项：渲染为普通文本，不可点击 -->
                <span v-else> 
                    {{ item }}
                </span>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
// 导入 Element Plus 图标：右箭头作为面包屑分隔符
import { ArrowRight } from '@element-plus/icons-vue'

// 导入 Vue Router 钩子函数
import { useRoute, useRouter } from 'vue-router'

// 导入工具函数：用于处理路由路径转换
import { toOneChildrenPage } from "@/utils/tools"

// 获取当前路由实例
const route = useRoute()

// 获取路由导航实例
const router = useRouter()

/**
 * 面包屑文本列表计算属性
 * 从路由元信息中提取 titles 数组作为面包屑显示文本
 * 使用 computed 自动响应路由变化
 * @returns 面包屑文本数组
 */
const breadcrumbList = computed<string[]>(() => {
    // 检查 route.meta.titles 是否存在且为数组
    if (route.meta?.titles && Array.isArray(route.meta.titles)) {
        // 返回浅拷贝数组，避免直接引用导致的响应式问题
        return [...route.meta.titles] as string[]
    }
    // 无有效数据时返回空数组
    return []
})

/**
 * 面包屑 URL 列表计算属性
 * 从路由元信息中提取 indexes 数组作为各级面包屑对应的跳转路径
 * @returns 面包屑路径数组
 */
const urlList = computed<string[]>(() => {
    // 同时验证 titles 和 indexes 是否存在且为数组
    if (route.meta?.titles && Array.isArray(route.meta.titles) && 
        route.meta.indexes && Array.isArray(route.meta.indexes)) {
        // 返回浅拷贝数组，避免直接引用导致的响应式问题
        return [...route.meta.indexes] as string[]
    }
    // 无有效数据时返回空数组
    return []
})

/**
 * 处理面包屑点击事件
 * 点击面包屑项时跳转到对应的页面路径
 * @param index - 被点击的面包屑项索引
 */
const handleBreadcrumbClick = (index: number) => {
    // 获取对应索引的 URL 路径
    const url = urlList.value[index]
    
    // 如果 URL 存在则进行跳转
    if (url) {
        // 调用工具函数处理路径（支持多级子页面转换）
        toOneChildrenPage(url, (path: string | null) => {
            // 回调函数：如果得到有效路径则执行路由跳转
            if (path) {
                router.push(path)
            }
        })
    }
}
</script>