<template>
    <el-icon v-if="!src" :size="size" :color="color">
        <component :is="iconComponent" />
    </el-icon>
    <img 
        v-else 
        :src="src" 
        :style="{ width: `${size}px`, height: `${size}px` }"
        :alt="alt"
    />
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import { computed } from 'vue'

defineOptions({
    name: "sIcon"
})

const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    src: {
        type: String,
        default: ''
    },
    size: {
        type: [Number, String],
        default: 16
    },
    color: {
        type: String,
        default: 'inherit'
    },
    alt: {
        type: String,
        default: 'icon'
    }
})

// 动态获取图标组件
const iconComponent = computed(() => {
    if (!props.icon) return null
    
    // 将首字母大写以匹配组件名
    const componentName = props.icon.charAt(0).toUpperCase() + props.icon.slice(1)
    const component = (Icons as any)[componentName]
    
    if (!component) {
        console.warn(`Icon "${props.icon}" not found in Element Plus Icons`)
        return null
    }
    
    return component
})
</script>