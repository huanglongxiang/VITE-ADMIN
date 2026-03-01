<template>
    <el-icon>
        <component :is="iconComponent" />
    </el-icon>
</template>
<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
const props = defineProps({
  icon: {
    type: String,
    required: true
  }
})

// 动态获取图标组件
const iconComponent = computed(() => {
  // 将首字母大写以匹配组件名
  const componentName = props.icon.charAt(0).toUpperCase() + props.icon.slice(1)
  return (Icons as any)[componentName]
})
</script>