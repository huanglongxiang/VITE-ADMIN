<template>
    <el-header class="p-0 h-50px bg-[#fff] flex justify-between">
        <div class="icon flex items-center m-l-10px cursor-pointer">
            <!-- 面包屑 -->
            <Breadcrumb class="m-l-10px"></Breadcrumb>
        </div>
        <div class="flex items-center">
            <TopTools></TopTools>
            <UserInfo></UserInfo>
        </div>
    </el-header>
    <el-divider class="m-0"></el-divider>
    <!-- 标签栏 -->
    <TagView></TagView>
</template>
<script setup lang="ts">
import TopTools from './topTools.vue'
import UserInfo from './userInfo.vue'
import Breadcrumb from './breadcrumb.vue'
import TagView from './tagView.vue'

</script>
<style scoped>
.hidden-scrollbar :deep(.el-scrollbar__bar) {
  display: none !important;
}

.hidden-scrollbar :deep(.el-scrollbar__wrap) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hidden-scrollbar :deep(.el-scrollbar__wrap::-webkit-scrollbar) {
  display: none;
}
</style>