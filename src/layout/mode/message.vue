<template>
    <div class="w-100% max-h-350px card overflow-y-auto">
        <el-card class="w-98% m-b-10px"  v-for="value in 5" :key="value">
            <template #header tag="div">
                <h4 class="m-0">标题{{ value }}</h4>
                <span class="color-#909399">时间</span>
            </template>
            <div>内容{{ value }}</div>
        </el-card>
    </div>
    <div class="w-100% h-40px line-height-40px border-t-[#ccc] border-1px border-t-dashed">
        <el-button text link class="w-98% " @click="toMessagePage">
            查看全部消息
        </el-button>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';

 
const toMessagePage = () => {
    ElMessage.success('查看全部消息');
}
</script>
<style lang="scss" scoped>

.card {

    :deep(.el-card__header) {
        padding: 5px 20px;
    }
    :deep(.el-card__body){
        padding: 10px 20px;
    }
}
</style>
