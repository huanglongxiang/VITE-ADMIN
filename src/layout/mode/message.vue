<template>
    <!-- 消息通知列表容器 -->
    <div class="w-100% max-h-350px card overflow-y-auto">
        <!-- 遍历渲染消息卡片（示例使用 v-for 循环 5 次） -->
        <el-card 
            class="w-98% m-b-10px"  
            v-for="value in 5" 
            :key="value"
        >
            <!-- 卡片头部：显示标题和时间 -->
            <template #header tag="div">
                <!-- 消息标题 -->
                <h4 class="m-0">标题{{ value }}</h4>
                <span class="color-#909399">时间</span>
            </template>
            
            <!-- 卡片内容：消息正文 -->
            <div>内容{{ value }}</div>
        </el-card>
    </div>
    
    <!-- 底部操作区：查看全部消息链接 -->
    <div class="w-100% h-40px line-height-40px border-t-[#ccc] border-1px border-t-dashed">
        <!-- 文本链接按钮 -->
        <el-button 
            text 
            link 
            class="w-98%" 
            @click="toMessagePage"
        >
            查看全部消息
        </el-button>
    </div>
</template>

<script setup lang="ts">
// 导入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus'

/**
 * 跳转到消息中心页面
 * 点击"查看全部消息"时触发
 * 当前仅做演示，显示成功提示
 */
const toMessagePage = () => {
    // 显示成功消息提示
    ElMessage.success('查看全部消息')
}
</script>

<style lang="scss" scoped>
/**
 * 卡片样式调整
 * 使用 deep 选择器修改 Element Plus Card 组件的内部样式
 */
.card {
    :deep(.el-card__header) {
        padding: 5px 20px;  // 上下 5px，左右 20px
    }
    :deep(.el-card__body) {
        padding: 10px 20px;  // 上下 10px，左右 20px
    }
}
</style>