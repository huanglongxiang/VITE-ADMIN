<template>
    <el-tooltip effect="dark" content="搜索" placement="bottom">
        <s-icon :size="18" svg-name="search" class="m-r-20px cursor-pointer"></s-icon>
    </el-tooltip>
    <el-popover placement="bottom" :popper-style="{paddingBottom: '0px'}" trigger="click" :width="300">
        <template #reference>
            <el-badge :value="12" class="cursor-pointer m-r-20px w-20px h-20px">
                <s-icon :size="18" icon="Bell" class="m-r-20px"></s-icon>
            </el-badge>
        </template>
        <MessageContent></MessageContent>
    </el-popover> 
    <div class="w-1px h-18px bg-#CCCCCC m-r-20px"></div>
    <el-tooltip effect="dark" content="全屏" placement="bottom">
        <s-icon :size="18" icon="FullScreen" class="m-r-20px cursor-pointer" @click="full"></s-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="布局设置" placement="bottom">
        <s-icon :size="18" icon="Setting" class="m-r-20px cursor-pointer" @click="setting"></s-icon>
    </el-tooltip>
     <el-tooltip effect="dark" content="主题" placement="bottom">
        <s-icon :size="18" svg-name="theme" class="m-r-20px cursor-pointer"></s-icon>
    </el-tooltip>
    <el-tooltip effect="dark" content="锁屏" placement="bottom">
        <s-icon :size="18" icon="Lock" class="m-r-20px cursor-pointer"></s-icon>
    </el-tooltip>
    <!-- 设置选项抽屉 -->
    <el-drawer v-model="drawer" :with-header="false" size="20%" append-to="#app">
        <Drawer />
    </el-drawer>
</template>
<script setup lang="ts">
import screenfull from 'screenfull';
import MessageContent from './message.vue';
import Drawer from './drawer.vue';

const drawer = ref(false)

const isFullscreen = ref(false);

// 全屏
const full = () => {
    if (screenfull.isEnabled) {
        // 添加进入全屏前的动画
        if (!isFullscreen.value) {
            screenfull.request();
            isFullscreen.value = true;
        } else {
            screenfull.exit();
            isFullscreen.value = false;
        }
    }
}

// 设置
const setting = () => {
    drawer.value = true;
}

</script>