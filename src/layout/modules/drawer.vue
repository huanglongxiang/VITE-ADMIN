<template>
    <!-- 布局设置区域：提供三种布局模式选择 -->
    <el-divider content-position="left">布局设置</el-divider>
    
    <!-- 布局选项容器：使用 flex 布局横向排列 -->
    <div class="flex justify-between">
        <!-- 左侧模式：侧边栏在左侧，顶部有 header -->
        <el-tooltip content="左侧模式" placement="bottom">
            <div class="w-90px h-90px layoutSelect">
                <el-container class="w-100% h-100%">
                    <!-- 左侧边栏：蓝色表示选中状态 -->
                    <el-aside class="w-25px bg-[rgb(121,187,255)]"></el-aside>
                    <el-container>
                        <!-- 顶部 header：灰色 -->
                        <el-header class="w-100% h-20px bg-[#ccc]"></el-header>
                        <!-- 主内容区：浅灰色 -->
                        <el-main class="bg-[#ececec]"></el-main>
                    </el-container>
                </el-container>
            </div>
        </el-tooltip>
        
        <!-- 混合模式：顶部有 header，左侧有侧边栏 -->
        <el-tooltip content="混合模式" placement="bottom">
            <div class="w-90px h-90px layoutSelect">
                <el-container class="w-100% h-100%">
                    <!-- 顶部 header：灰色 -->
                    <el-header class="w-100% h-20px bg-[#ccc]"></el-header>
                    <el-container>
                        <!-- 左侧边栏：蓝色表示选中状态 -->
                        <el-aside class="w-25px bg-[rgb(121,187,255)]"></el-aside>
                        <!-- 主内容区：浅灰色 -->
                        <el-main class="bg-[#ececec]"></el-main>
                    </el-container>
                </el-container>
            </div>
        </el-tooltip>
        
        <!-- 顶部模式：只有顶部 header，无侧边栏 -->
        <el-tooltip content="顶部模式" placement="bottom">
             <div class="w-90px h-90px layoutSelect">
                <el-container class="w-100% h-100%">
                    <!-- 顶部 header：蓝色表示选中状态 -->
                    <el-header class="h-20px bg-[rgb(121,187,255)]"></el-header>
                    <!-- 主内容区：浅灰色 -->
                    <el-main class="bg-[#ececec]"></el-main>
                </el-container>
            </div>
        </el-tooltip>
    </div>

    <!-- 配置设置区域：提供更多开关选项 -->
    <el-divider content-position="left">配置设置</el-divider>
    
    <!-- 配置表单 -->
    <el-form
        class="drawerFrom"
        label-position="right"
        label-width="auto"
        :model="formLabelAlign"
    >
        <!-- 标签栏显示开关 -->
        <el-form-item label="显示标签栏" label-position="right">
           <el-switch v-model="formLabelAlign.isLabelTag"></el-switch>
        </el-form-item>
        
        <!-- Logo 显示开关 -->
        <el-form-item label="显示 logo" label-position="right">
           <el-switch v-model="formLabelAlign.islogo"></el-switch>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

/**
 * 表单数据响应式对象
 * 存储布局配置的各项开关状态
 */
const formLabelAlign = reactive({
  /** 是否显示标签栏（tags view） */
  isLabelTag: false,
  
  /** 是否显示 Logo */
  islogo: false,
})
</script>

<style scoped lang="scss">
/**
 * 布局选择项样式
 * 鼠标悬停时显示蓝色边框高亮效果
 */
.layoutSelect {
    cursor: pointer;              // 鼠标指针变为手型
    box-sizing: border-box;       // 边框在内测
    border-radius: 5px;           // 圆角 5px
    overflow: hidden;             // 超出部分隐藏
    border: 2px solid transparent; // 默认透明边框占位
    
    // 悬停效果：显示蓝色边框
    &:hover {
        border: 2px solid rgb(121, 187, 255);
    }
}

/**
 * 表单样式调整
 * 使用 deep 选择器修改 Element Plus 内部结构
 */
.drawerFrom {
    :deep(.el-form-item__content) {
        // 将表单项内容对齐方式改为从右到左
        // 使开关按钮显示在标签右侧（靠右对齐）
        flex-direction: row-reverse;
    }
}
</style>