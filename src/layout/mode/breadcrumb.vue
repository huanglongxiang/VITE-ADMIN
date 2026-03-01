<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item 
                v-for="(item, index) in breadcrumbList" 
                :key="`breadcrumb-${index}`"
            >
                <a @click="handleBreadcrumbClick(index)" v-if="index < breadcrumbList.length - 1"> {{ item }}</a>
                <span v-else> {{ item }}</span>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { toOneChildrenPage } from "@/utils/tools";
const route = useRoute()
const router = useRouter()

// 优化：使用 shallowRef 减少不必要的响应式追踪
const breadcrumbList = computed<string[]>(() => {
    if (route.meta?.titles && Array.isArray(route.meta.titles)) {
        return [...route.meta.titles] as string[] // 浅拷贝避免引用问题
    }
    return []
})
const urlList = computed<string[]>(() => {
    if (route.meta?.titles && Array.isArray(route.meta.titles) && 
        route.meta.indexes && Array.isArray(route.meta.indexes)) {
        return [...route.meta.indexes] as string[] // 浅拷贝避免引用问题
    }
    return []
})

// 新增：安全的面包屑点击处理函数
const handleBreadcrumbClick = (index: number) => {
    const url = urlList.value[index]
    if (url) {
        toOneChildrenPage(url, (path: string|null)=> {
            if (path) {
                router.push(path)
            }
            
        })
    }
}


</script>
