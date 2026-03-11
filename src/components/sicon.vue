<template>
    <!-- Element Plus 图标 -->
    <el-icon v-if="!src && !svgName" :size="size" :color="color">
        <component :is="iconComponent" />
    </el-icon>
    
    <!-- 本地 SVG 文件 -->
    <svg 
        v-else-if="svgName" 
        :style="{ width: `${computedSize}px`, height: `${computedSize}px` }"
        :fill="color"
        class="inline-block align-middle svg-icon"
    >
        <use :href="`#icon-${svgName}`" />
    </svg>
    
    <!-- 外部图片 URL -->
    <img 
        v-else 
        :src="src" 
        :style="{ width: `${computedSize}px`, height: `${computedSize}px` }"
        :alt="alt"
        class="inline-block align-middle img-icon"
    />
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import { computed } from 'vue'

defineOptions({
    name: "sIcon"
})

const props = defineProps({
    // Element Plus 图标名称
    icon: {
        type: String,
        default: ''
    },
    // 外部图片 URL
    src: {
        type: String,
        default: ''
    },
    // 本地 SVG 图标名称（新增）
    svgName: {
        type: String,
        default: ''
    },
    // 图标大小
    size: {
        type: [Number, String],
        default: 16
    },
    // 图标颜色
    color: {
        type: String,
        default: 'inherit'
    },
    // 图片替代文本
    alt: {
        type: String,
        default: 'icon'
    }
})

// 统一处理尺寸（支持字符串转数字）
const computedSize = computed(() => {
    return typeof props.size === 'string' ? Number(props.size) : props.size
})

// 动态获取 Element Plus 图标组件
const iconComponent = computed(() => {
    if (!props.icon) return null
    
    const componentName = props.icon.charAt(0).toUpperCase() + props.icon.slice(1)
    const component = (Icons as any)[componentName]
    
    if (!component) {
        console.warn(`Icon "${props.icon}" not found in Element Plus Icons`)
        return null
    }
    
    return component
})
</script>

<style scoped lang="scss">
.svg-icon {
    vertical-align: middle;
}

.img-icon {
    object-fit: contain;
}
</style>